# Rebuild record: step 11a, export MVP (Build game downloads the saved project as a playable static web build)

Original brief: [`docs/maker/steps/step-11a-export-mvp.md`](../maker/steps/step-11a-export-mvp.md) on the merge (r2, blob `caa95206`, sha256 `d44951f205c6294133a99f73526d9d184c4274722a8d120060f19b6ac4e7b39e`, 142 lines). Test floor L11; Where 11a sits L15; Delivery L21; Goal L29; Read first L37; Rules L44; Build table L53; Named tests L70; Smoke L77; Must NOT L81; Done when L89; Measured L94; Baseline republish L103; Carries L106; EA rulings L122. Count command L68; hard per-file caps L56–65; hard gate 400 at L66 (caps sum 415; trial 391). This is **11a**, roadmap step 11's first slice (EA ruling 2026-11-26: the 400 gate holds; the UX sheet moves to 11a2; the APK is 11b, CEO ruling 2026-11-24 18:03 London). It teaches **Build game** on the project screen: save (a failed save stops it, as Test does), Test's own gate (a refusal shows Test's sheet), then a download of `<projectId>-game.zip` holding the play tree as built, the saved documents verbatim as one module `project/files.js` (DSK E5(b)), the pictures under `project/assets/` and a `build.json` in the play build's own shape (DSK E6 Q3). The exported page boots that project through `openProject` and `arriveIn` when its board carries `data-game`; with no `data-game` the demo boots exactly as before. A build error shows its plain reason in the project banner (interim until 11a2's sheets). It is not the ready or error sheet or Share (11a2), the APK (11b), budgets (11c) or the Render bundle (step 36). Rulings from the CoS chat are labelled **EA ruling**.

Sources: PR #107 and branch `step/step-11a-export-mvp-r2-chatA` (r2 code head `8e3a697b`, r2 tip `bc94576c`; r1 was a reviewed kit, never built). `handback/step-11a-export-mvp/r2/HANDBACK.md` at `bc94576c` and on the merge (HB, blob `94ba7038`, 123 lines, sha256 `60b4267cdea5ff22fb61af3a3cdee4ee0b741ee7f7dae9a92e1dba3498d92f5b`). CoS verify report: `/workspace/share/step-11a-r2-verify/report.md` (V1, 10 lines, sha256 `0519669dcba6522fbf238adf6e4b040a19399e5506101f3c781823a435fbc958`): every check PASS except one cap-fit join in `zip.ts`, sent to QA. `docs/qa/step-11a-handback-review.md` on main `1b34e541` (QA1, blob `0006a819`, 28 lines, sha256 `1e8561e7bbad76a72f3e785ad662353c770c554ed54b98ef173647afc1cd3a74`): **OK TO MERGE (option a)**, the join accepted once, not a precedent. QA postmerge on `7d73c74b`: PASS (tree 522d02cc, pins 5/5, green 1165/0, smoke 0 failed; 1 warning: main moved by the QA review doc). Line cites use HB, V1 and QA1. Product line cites are at merge `7d73c74b` (tree `522d02cc`) unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `7460ed7ac17748f6a22a9ebda13946ee276d2565`, 2026-11-26 10:23 (UK time), tree `8c19cc93`, the 11a guide r2. Floor **1165** tests (guide L11: 10d's 1160 + N=5). The guide was trialled on `90c9cb9f` (roadmap r15c); everything after it to this base is docs-only. Later main gained docs only: `514847b5` (the 11a paste), `ea929d9a` (roadmap r15d) and `1e5ae398` (the 11a2 r2 guide review). The product count against the base and against `1e5ae398` is the same 390; the official shortstat against the base also lists those three docs (13 files, +423/−7) |
| Main at merge | `1e5ae398cdac4a38f50b1f17348ecb786d370a0c`, 2026-11-26 10:47 (UK time), tree `04fc57e1`, docs-only on the base. This is the merge's first parent. Official 11a product against it is **390** (10 Build-table files, +385/−5) |
| r2 commits | on `step/step-11a-export-mvp-r2-chatA`: `8e3a697b97d073a0c1e8ad4fa308659c608d3e9f` feat(maker): step 11a Build game export (r2 code head, tree `4e4d5b43a092a69e242b523f0086a551f8dd3c14`, 2026-11-26 13:19 UK time), `bc94576c6e4f9de7cd4ecc304a79841e1a96c609` docs(handback): step 11a export mvp r2 (tree `1d52b5b4c74f98d090a39e4ccb71064c47230ff8`, 2026-11-26 13:20 UK time). The branch is linear, two commits on the base `7460ed7a`, no merges, no rebase. Author and committer on both `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Tip vs code head is the hand-back only: `HANDBACK.md`. No zip, log or smoke shot committed |
| r2 verdict | Product green **1165/0**. Official product **390** (10 files, +385/−5), every cap kept, five files on cap. tools tsc only the 3 base errors (`home.ts` now L91). All 22 smokes PASS first try (HB, QA1), including s11a 8818/8819 r1: 6 ok at 390 and 360. Export audit PASS 135/149/149. Must-not list clean. CoS verify (V1): PASS except the `zip.ts` join to fit its 66 cap, sent to QA. Predicted merge tree onto main `1e5ae398`: `522d02cc` (V1, QA1). QA **OK TO MERGE** (option a; the join accepted once, as disclosed, not a precedent). No rework |
| Merge | PR #107, merge commit `7d73c74b77f6d87d70d6ded32c9ba02dd7f7e922`, 2026-11-26 13:50 (UK time). Tree `522d02cca2cfc0c5d1a392545897df0356ae7b8c` (the tree CoS and QA predicted; `merge-pr.sh --expect-tree`). First parent `1e5ae398cdac4a38f50b1f17348ecb786d370a0c`, second parent `bc94576c6e4f9de7cd4ecc304a79841e1a96c609`. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. Subject: `Merge PR #107: Step 11a: export MVP (ChatA r2)`. Green on the merge **1165 pass / 0 fail** (`merge-pr.sh` `npm test`) |
| After the merge | main is `1b34e5418efe65b8a1ffb09c29cd58b175ef1819`, 2026-11-26 13:51 (UK time), tree `8c7efab7`, which adds only `docs/qa/step-11a-handback-review.md` (28 insertions, sha256 `1e8561e7`, blob `0006a819`). Green on `1b34e541` in a clean worktree: **1165 pass / 0 fail**. QA postmerge on `7d73c74b`: PASS (tree 522d02cc, pins 5/5, green 1165/0, smoke 0 failed; 1 warning: main moved by the QA review doc) |
| Tests | 1160 + N=5 (named tests 1–5 in `tests/tools/export-11a.test.ts`) = **1165 pass / 0 fail**. Floor after this merge is **1165** (HB, V1, QA1) |

## (b) Files

From `git diff --name-status 1e5ae398..7d73c74b -- . ':!handback/**' ':!node_modules'`. Line counts are `git diff --numstat` insertions and deletions against the merge's first parent (the same as against the base `7460ed7a` for these files). The new s11a smoke is counted in the 400 (guide L13, L65). The QA review landed after the merge and is not in the 400.

| File | Status | ins / del | Cap | Counted? |
|---|---|---|---|---|
| `tools/export/zip.ts` | A | 66 / 0 | 66 (L56) | yes. **66** on cap (sha256 `cd4c08fc09a0dcdc5729652ee0681fe329121d8bf6cf67ec3496f9c37f6d07e8`) |
| `tools/export/game.ts` | A | 27 / 0 | 36 (L57) | yes. **27** (sha256 `cdaee57e62447617fc80c94e9fd0c1b5d0378b3729f5589ced9bca7724b76198`) |
| `tools/play-stage/game.ts` | A | 2 / 0 | 4 (L58) | yes. **2** (sha256 `46d8679b90f43194be9439a64a80ac56c1976de49fb7cba2a8c701aa428aab11`) |
| `tools/play-stage/page.ts` | M | 27 / 2 | 31 (L59) | yes. **29** (sha256 `f497c467fb1a0223e49221788a7c2c8d3dbdef4c8f324949310864ce4b8d5e98`) |
| `tools/maker/export.ts` | A | 47 / 0 | 47 (L60) | yes. **47** on cap (sha256 `c0f48ea49611bb35182674fe54f22b5861955c118ac1a23bedb4768cfe65eb7a`) |
| `tools/maker/home.ts` | M | 22 / 3 | 34 (L61) | yes. **25** (sha256 `f107925b748ccadbac3a40aff1f12632f000d51cc86963a7bd06b5a237be4006`) |
| `tools/maker/build-sheet.ts` | A | 5 / 0 | 8 (L62) | yes. **5** (sha256 `291db5a472d3e10ff486212f6814dcff9f56f00d059eef8105677d790d9943cc`) |
| `tools/maker/app.css` | M | 1 / 0 | 1 (L63) | yes. **1** on cap (sha256 `f13f958a4918d458edebb25c866cc12ff209752d53144bc0bb9f5e439590d663`) |
| `tests/tools/export-11a.test.ts` | A | 130 / 0 | 130 (L64) | yes. **130** on cap (sha256 `4ef7cd7d95f595a1bd0ed193c3834db4d147ca6ceebfa9b0b9afc764a5c392a5`) |
| `handoff/steps/tests/s11a-export-mvp/smoke.mjs` | A | 58 / 0 | 58 (L65) | yes. **58** on cap (sha256 `4f5c47ca1e9c2a090a065f476d4f9af956ab842c7ddbc8e9c95388789cd7927f`) |

No diff under `src/`, `tools/apk/`, `tools/baseline/`, `tools/effect-designer/`, `data/`, fixtures, `tools/maker/catalogue.json`, the format docs, `behaviour-library/`, `tools/painter-proto/` or `ui-shell/`. `tools/play-stage/` imports `src/project` and its own files only (never `tools/maker`, `tools/export` or `src/editor`). No new `JSON.parse` in `tools/` (the maker's one parser `parseProject` reads `build.json`). The only smoke in the diff is the new s11a; no other test was edited. Official count at the code head, the tip or the merge against first parent `1e5ae398` is **10 files changed, 385 insertions(+), 5 deletions(-)** = 390 ≤ 400. Five files sit on cap (`zip.ts`, `maker/export.ts`, `app.css`, the test, the smoke). Caps sum 415 is not a second gate. The trial on `90c9cb9f` was 10 files, 391 counted (387+ 4−). No file is near 500. No new dependency; lockfile blob `85b42f99` unchanged. No gh-pages. No new rAF, timer or loop.

## (c) Key code and git commands

Step 11a is the export core of roadmap step 11 (guide L15–19, Rules 1–7). It is "not a second build system": the zip is the play tree the maker was built with (`play-stage/<stamp>/`, fetched file by file through its own `build.json`), plus data. The play stage keeps the one-parser law: documents ship as a JS module, never as loose JSON to parse.

**Zip (Rule 1).** `tools/export/zip.ts`: `crc32` (polynomial `0xedb88320`), `zipStore(entries)` (stored, method 0, UTF-8 flag `0x800`; local, central and end headers are a signature plus `[offset, bits, value]` field lists through one `header()`), `unzipStore(zip)` (finds the end record, walks the central directory, throws `zip: method` on a non-stored entry and `zip: crc` on a bad CRC). No dependency; Node and browser. `concat` advances its offset with the one-expression `at += (out.set(p, at), p.length)` (HB: two statements would be 67 lines; QA1: accepted once, not a precedent).

**Game zip (Rule 2).** `tools/export/game.ts`: `KEEP_OUT = ["notes/", "sprite-recipes/"]`; `shipped(path)` = `.json`, no path segment `.deleted`, not under `KEEP_OUT`. `filesModule(text)` writes `export default { "<path>": <saved text>, … };` sorted, with only the path `JSON.stringify`'d and each document's text verbatim (no `safe()`, no U+2028/9 escape; DSK E5(b), E7). `markPage` adds `data-game="project/files.js"` to `<canvas id="board">` (throws `Can't build: index.html` when absent). `gameZip(play, text, assets)` takes the play files except `build.json`, `index.html` through `markPage`, `project/files.js`, `project/assets/<name>` (no `.deleted` segment), sorted, then a `build.json` with keys `commit, node, entry, files` only (sha256 per file). `commit` and `node` are read from the play `build.json` with the same pretty-print patterns `ours()` checks (QA1 carry 4).

**Play boot (Rule 3).** `tools/play-stage/game.ts` holds `PROJECT = "project/"` and `FILES = "project/files.js"` (`FILES` is exported but unused; QA1 carry 1). `page.ts`: when the board has `data-game`, `runGame` imports that module (resolved against `document.baseURI`), runs `openProject(files)`, reads pictures from `./project/<file>`, and travels links through `arriveIn` (replacing `#hud` and `#board`); an import or open failure shows its message, with no demo fallback. No `data-game`: `openBundled()` exactly as before, no extra request.

**Build game (Rule 4).** `tools/maker/export.ts`: `buildGame(store, id, get)` = `readTree` → `parseProject` → `readProject` + `assetRows` → `testGate` → `openProject` → `emptyBoard`, each refusal `{ ok: false, lines }` with Test's lines; then `assets/` by `list` + `readBlob` (skipping `.deleted`; a null `readBlob` throws `Can't build: assets/<name>`); the play `build.json` through `parseProject` and `isTree` (commit and node strings, `files` an object of strings; else `Can't build: build.json`); each listed file through `get`; then `gameZip`. `playBase(url)` maps the first `/maker/<stamp>/` to `/play-stage/<stamp>/` and throws `Can't build: /maker/` without it. No refusal on `migrated` rows (DSK E7).

**Button and download (Rule 5).** `tools/maker/build-sheet.ts`: `BuildView = "idle" | "busy"`; `buildButton` is `<button class="btn ghost stage-row" data-act="build">Build game</button>`, busy the same `disabled aria-busy="true"` with `<span class="spin"></span>Building…`. `home.ts`: the button first in the project screen's `tail:` (after the stages), the `build` act, `buildNow` (`if (state.dirty) await saveCurrent();` then `if (state.dirty) return;`, busy and paint, `buildGame` with a `fetch` against `playBase(import.meta.url)`, a refusal sets `state.problems`, else `download` of `<projectId>-game.zip` through an object URL; a throw sets `state.banner` to the plain reason; then idle and paint), and `download`. `app.css`: one `.spin` rule with its `@keyframes` on one line. New `home.ts` and `page.ts` code keeps those files' dense style (QA1: guide wording gap, EA to clarify).

**Named tests** are 1–5 in `tests/tools/export-11a.test.ts` (130/130). Their titles match the guide L71–75 exactly. **Smoke** `handoff/steps/tests/s11a-export-mvp/smoke.mjs`, ports 8818 (dev maker) and 8819 (the unzipped game), r1, keeps the s10c layout: 1 Build game downloads `<projectId>-game.zip` and `unzipStore` finds `index.html`, `build.json` and `project/files.js` with the shipped keys; 2 the game on 8819 plays this project (`__docs.manifest` id), no request off 8819, no `#back-maker`; 3 a win (foes removed through the dev hook, End turn, `outcome` win, Victory). 6 ok.

```
# Full product diff against the merge's first parent (the accepted product measure):
#
#   git diff 1e5ae398 7d73c74b -- \
#     tools/export/zip.ts \
#     tools/export/game.ts \
#     tools/play-stage/game.ts \
#     tools/play-stage/page.ts \
#     tools/maker/export.ts \
#     tools/maker/home.ts \
#     tools/maker/build-sheet.ts \
#     tools/maker/app.css \
#     tests/tools/export-11a.test.ts \
#     handoff/steps/tests/s11a-export-mvp/smoke.mjs
#
# The hand-back (not in the 400):
#   git show 7d73c74b:handback/step-11a-export-mvp/r2/HANDBACK.md
#
# Product gate. Official command at the r2 code head or r2 tip against
# the base 7460ed7a, or at the merge against first parent 1e5ae398:
#
#   git diff --shortstat <base>..HEAD -- . ':!handback/**' ':!node_modules'
#   10 files changed, 385 insertions(+), 5 deletions(-)
#
# At 8e3a697b against 7460ed7a: 10 files, 385 insertions, 5 deletions = 390.
# At 7d73c74b against 7460ed7a the same command also lists the three
# docs-only main commits (13 files, 423 insertions, 7 deletions); add
# ':!docs/**' to get 390 again.
#
# Trial on 90c9cb9f was 10 files, 391 counted lines.
#
# Named tests (npm test 1165/0, floor 1160 + N=5):
#   ✔ 11a zip: …
#   ✔ 11a gameZip: …
#   ✔ 11a buildGame: …
#   ✔ 11a play boot: …
#   ✔ 11a build button: …
#
# tools tsc: only effect-designer page.ts L101 and maker home.ts L91 (×2).
#
# Smokes: the builder used chrome-headless-shell (HB § Smoke), all 22 solo, first run:
#   S0 (8797) 14, s3 (8798) 18, s4a (8799) 16, s4b (8800) 16, s4c (8801) 16,
#   s5a (8802) 16, s5b (8803) 16, s5c (8804) 16, s6a (8805) 18, s6b (8806) 16,
#   s6c (8807) 18, s6d (8808) 14, s7 (8809) 20, s8 (8810 r1) 16, s9 (8811 r1) 12,
#   s8c (8812 r1) 8, s9b (8813 r1) 14, s9c (8814 r1) 6, s10b (8815 r1) 8,
#   s10c (8816 r1) 8, s10d (8817 r1) 8, s11a (8818 r1) 6 (3 @390, 3 @360).
# QA reran all 22 solo (QA1); CoS reran s11a solo with /usr/bin/google-chrome: 6 ok, SMOKE PASS.
#
# Mutations (HB; each restored): M1 data-game boot skipped → s11a FAIL;
#   M2 shipped keeps everything → tests 2, 4; M3 markPage as is → test 2, s11a;
#   M4 Test's gate dropped → test 3; M5 build act renamed → test 5, s11a;
#   M6 wrong CRC polynomial → test 1; M7 .deleted only under effects/ → test 2;
#   M8 safe() back → test 4; M9 non-JSON shipped → test 2;
#   M10 save-stop removed → test 3; M11 emptyBoard refusal dropped → test 3;
#   M12 null readBlob skipped → test 3; M13 /maker/ check dropped → test 3;
#   M14 build.json shape check dropped → test 3; M15 a writer imported into
#   the play page → test file and P2 one-parser test; M18 .deleted/ picture
#   zipped → test 2; M19 banner line dropped → test 3. (M16, M17, M20–M23 are 11a2.)
# QA's own plants (QA1): save-stop removed, .deleted/ asset kept, .deleted
#   only under effects/, emptyBoard refusal dropped: each caught.
#
# Export audit: s8-audit.mjs 135 / 149 / 149, AUDIT PASS (V1, QA1). One more
# file per play tree than 10d: tools/play-stage/game.js.
```

## (d) What went wrong, in order, and the fix

r2 was accepted first time. There was no product rework and no second product commit.

**The `zip.ts` cap join.** `concat`'s offset update is `at += (out.set(p, at), p.length)`. HB says it was written that way because two statements would make `zip.ts` 67 lines, one over its 66 cap. The guide (L68) says don't join to fit a cap and over a cap is stop and report. CoS flagged it (V1) and did not open the PR. QA accepted it once because it was disclosed, it meets the letter of one statement per line, and the two-statement form also passes; **not a precedent**: a later handback that packs or joins to fit a cap gets NOT OK (QA1).

**HB's first green run** died at root `tsc` on `as BufferSource` in `tools/export/game.ts` (the root tsconfig lacks that DOM name); the digest now hashes `data.slice()` and the completed re-run is the one recorded (HB).

**Export audit path.** ChatA could not see `/workspace/share/s8/s8-audit.mjs` and ran an equivalent `/tmp/s11a-audit.mjs`; CoS and QA ran the real script (PASS, 135/149/149). The 11a2 go-line now tells the builder to run the same check itself and lets CoS and QA run s8-audit (QA1 carry 5).

HANDBACK's PR line was anticipatory (`PR: opened by Chief of Staff from the branch`); CoS opened PR #107 after QA's OK. Not a must-fix.

## (e) Do it right first time

- The work is only in the 10 Build-table files. Nothing in `src/` at all, `tools/apk`, `tools/baseline`, `tools/effect-designer`, data, fixtures, `tools/maker/catalogue.json`, the format docs, behaviour-library, painter-proto or ui-shell. `tools/play-stage` never imports `tools/maker`, `tools/export` or `src/editor`. No other test or smoke edited.
- Ship documents verbatim as `project/files.js` (only the path stringified); nothing under any `.deleted` segment, `notes/`, `sprite-recipes/` or non-JSON. `build.json` keys `commit, node, entry, files` only. No `JSON.parse` in `tools/play-stage`, none in `tools/maker` outside `project-files.ts`; read the play `build.json` through `parseProject` plus a shape check. No writer code in the play tree. No refusal on `migrated` rows.
- Build saves first and stops if the save fails (`if (state.dirty) return;`), uses Test's gate and sheet unchanged, and shows a throw's plain reason in the banner (interim). No sheet, Share, new status component, "unzip" or "index.html" in user text, network URL or dependency.
- Don't wrap, split or join lines to dodge or fit a cap (guide L68). If the honest form is one line over a cap, stop and report; do not pack it (QA1: the 11a join was accepted once only).
- Paste the ok lines from one solo run of every smoke, record the mutations, label the code head and the tip, list every helper and uncommitted script in § Helpers. Restore tracked `handback/` files after each smoke; do not commit shots or zips.

## (f) Rebuild check

```
# Product equality vs the merge (current main adds only the QA review):
#   git diff 7d73c74b HEAD -- \
#     tools/export/zip.ts \
#     tools/export/game.ts \
#     tools/play-stage/game.ts \
#     tools/play-stage/page.ts \
#     tools/maker/export.ts \
#     tools/maker/home.ts \
#     tools/maker/build-sheet.ts \
#     tools/maker/app.css \
#     tests/tools/export-11a.test.ts \
#     handoff/steps/tests/s11a-export-mvp/smoke.mjs
#   (empty)
#
# Product gate at the merge against first parent 1e5ae398:
#   git diff --shortstat 1e5ae398..7d73c74b -- . ':!handback/**' ':!node_modules'
#   10 files changed, 385 insertions(+), 5 deletions(-)
#
# Green: npm ci && npm run green → 1165 pass / 0 fail (merge and 1b34e541).
# tools tsc: only the 3 base errors (page.ts L101; home.ts L91 ×2).
# Smokes: all 22 solo at the guide counts (S0 14, s3 18, s4a 16, s4b 16, s4c 16,
# s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s9 12,
# s8c 8, s9b 14, s9c 6, s10b 8, s10c 8, s10d 8, s11a 6). Mutations as above.
# Export audit: s8-audit.mjs 135 / 149 / 149, AUDIT PASS.
```

## QA non-blockers carried forward

- `tools/play-stage/game.ts` `FILES` is exported but unused; `markPage` and `gameZip` hardcode `"project/files.js"`. Fold into the next kit that touches `tools/export/game.ts` (QA1 carry 1).
- Dead defaults, unreachable (Law 12): `files.get(name) ?? new Uint8Array()` (`game.ts` L22, L24), `play["build.json"] ?? ""` (L11) and `text[path] ?? ""` in `filesModule` (QA1 carry 2).
- `download` revokes the object URL right after `click()`; fine in desktop Chromium (s11a). The CEO phone check should include one real download in Chrome on Android (QA1 carry 3).
- `gameZip` reads `commit` and `node` by regex on the pretty-print shape after `isTree`; a narrow second read, not a validator. Note for step 36 (QA1 carry 4).
- Builders can't see `/workspace/share`; the 11a2 go-line has the builder run the same audit itself (QA1 carry 5).
- The save-fail stop is pinned only by a source regex on `home.ts` (QA1 carry 6; guide EA ruling 7).
- Dense multi-statement lines in new `home.ts`/`page.ts` functions: within the guide's "file's style" wording; EA to say in later guides whether new functions in dense files follow the one-statement rule (QA1).
- **Still open, not 11a scope** (guide L106–121): 11a2 (the ready and error sheets, Share), 11b (debug APK), 11c (budgets, phone-like Test), the WebView 98+ floor, D9 upgrade-on-save, DSK E1–E4 follow-ups, UX game name and icon, §7.2 closure pruning (step 36). No baseline republish in 11a; any republish needs the CEO's own typed OK in QA's chat, naming the commit; CoS verifies it there; the builder never publishes.
- **Closed here:** roadmap L86's gap for the web build (Build game exports the saved project); DSK E5(a), E5(b), E7; QA r1 must-fix (a failed save stops Build) and r1 carries (`emptyBoard`, null `readBlob`, `playBase` `/maker/` check, `build.json` shape).

## Blob check

Each file must have exactly this git blob id at `7d73c74b`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tools/export/zip.ts` | `224ede6f95f2bf590a00d75841c12cde0848a875` | 66 |
| `tools/export/game.ts` | `1d4323d70998beeb6574a81a6f3cf735daa38c10` | 27 |
| `tools/play-stage/game.ts` | `e7efb61c863de807ce4cb0d0eeaf8d7fd1b28b12` | 2 |
| `tools/play-stage/page.ts` | `2d229299296017938960e7fce540de13635ad037` | 119 |
| `tools/maker/export.ts` | `0a92377e2e530afd40c035c2883a576286681a88` | 47 |
| `tools/maker/home.ts` | `0e583b510836e003710bbc3ebd03b3a9b7a92ff7` | 198 |
| `tools/maker/build-sheet.ts` | `454de9f38cba69b4bf24a0f9383701b2e84c8fa4` | 5 |
| `tools/maker/app.css` | `a88dd5c459735a0f2a87e5b3817ae11275362dfb` | 57 |
| `tests/tools/export-11a.test.ts` | `0e32e5c54246164a49b073fa9e5e98a5e754fc9e` | 130 |
| `handoff/steps/tests/s11a-export-mvp/smoke.mjs` | `36df8173b48aa3e0adf92263b000ac6e4913a5ae` | 58 |

## Appendix: full code as merged (step 11a, PR #107)

New files are `git show 7d73c74b:<path>` in full. Edited files are `git diff 1e5ae398 7d73c74b -- <path>` (the same against the base `7460ed7a`).

### `tools/play-stage/page.ts` (edited)

```diff
diff --git a/tools/play-stage/page.ts b/tools/play-stage/page.ts
index 821cf37..2d22929 100644
--- a/tools/play-stage/page.ts
+++ b/tools/play-stage/page.ts
@@ -10,7 +10,8 @@ import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./ca
 import { createHud, XP_H } from "./hud.ts";
 import { litPlan, picturesOf, sourceOf } from "./looks.ts";
 import { createMatch, DEFAULT_SPELL_REACH } from "./match.ts";
-import { openBundled } from "./project.ts";
+import { arriveIn, openBundled, openProject } from "./project.ts";
+import { PROJECT } from "./game.ts";
 import { createTouch } from "./touch.ts";
 import { DEV } from "./dev.ts"; // dev-only
 
@@ -91,4 +92,28 @@ if (back !== undefined) { const btn = document.createElement("button"); btn.id =
 driver.start();
 }
 const bootCanvas = document.querySelector("#board");
-if (bootCanvas instanceof HTMLCanvasElement) { const opened = openBundled(); if (opened.docs === null) document.body.textContent = opened.error; else startMatch(opened.docs); }
+if (bootCanvas instanceof HTMLCanvasElement) {
+  const spec = bootCanvas.getAttribute("data-game");
+  if (spec === null) { const opened = openBundled(); if (opened.docs === null) document.body.textContent = opened.error; else startMatch(opened.docs); }
+  else void runGame(spec);
+}
+async function runGame(spec: string): Promise<void> {
+  try {
+    const mod = await import(new URL(spec, document.baseURI).href) as { default: Parameters<typeof openProject>[0] };
+    const files = mod.default;
+    const opened = openProject(files);
+    if (opened.docs === null) { document.body.textContent = opened.error; return; }
+    const art = (file: string): Promise<Blob | null> => fetch(new URL(`${PROJECT}${file}`, document.baseURI)).then((res) => res.ok ? res.blob() : null);
+    const travel = (link: LinkEvent, party: SessionParty): void => {
+      const got = arriveIn(files, link.from, link.to, party);
+      if (got.docs === null) { document.body.textContent = got.error; return; }
+      document.querySelector("#hud")?.remove();
+      document.querySelector("#board")?.remove();
+      const canvas = document.createElement("canvas");
+      canvas.id = "board";
+      document.body.append(canvas);
+      startMatch({ ...got.docs, art }, undefined, undefined, travel);
+    };
+    startMatch({ ...opened.docs, art }, undefined, undefined, travel);
+  } catch (e) { document.body.textContent = e instanceof Error ? e.message : "Can't open this project"; }
+}
```

### `tools/maker/home.ts` (edited)

```diff
diff --git a/tools/maker/home.ts b/tools/maker/home.ts
index bf6779c..0e583b5 100644
--- a/tools/maker/home.ts
+++ b/tools/maker/home.ts
@@ -3,6 +3,8 @@ import { checkName, duplicate, LIVE, prefix, projectId, renameTo, restorePlan, r
 import { asWrites, planSave } from "../../src/editor/project/save.ts";
 import { parseProject } from "./project-files.ts";
 import { projectScreen } from "./project.ts";
+import { buildButton, type BuildView } from "./build-sheet.ts";
+import { buildGame, playBase } from "./export.ts";
 import { bindRooms, roomClick, roomLine, roomSheet, roomTail } from "./rooms.ts";
 import { bindUnits, openUnit, rememberUnit, unitClick, unitEditing, unitLine, unitPage, unitSheet, unitTail } from "./units.ts";
 import { addFind, rememberAbility } from "./add-ability.ts";
@@ -24,7 +26,7 @@ const amp = String.fromCharCode(38);
 const esc = (t: string): string => t.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
 type State = { screen: "load" | "home" | "pick" | "name" | "rename" | "menu" | "project" | "stage" | "trash" | "fatal" | "missing"; rows: readonly Row[]; trash: readonly Row[]; banner: string | null; toast: string | null; undo: "room" | "unit" | "rule" | "level" | "effect" | null; tpl: "demo" | "empty"; name: string; menu: string | null; current: string | null; stageId: string | null; files: DocText; rev: number; dirty: boolean; readOnly: boolean; problems: readonly string[] };
 const state: State = { screen: "load", rows: [], trash: [], banner: null, toast: null, undo: null, tpl: "demo", name: "My game", menu: null, current: null, stageId: null, files: {}, rev: 0, dirty: false, readOnly: false, problems: [] };
-let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve(), resume: SessionSave | null = null;
+let store: MakerStore | null = null, templates: Record<"demo" | "empty", DocText> | null = null, timer = 0, toastId = "", gate: Promise<void> = Promise.resolve(), resume: SessionSave | null = null, building: BuildView = "idle";
 const app = (): HTMLElement => { const node = document.querySelector("#app"); if (!(node instanceof HTMLElement)) throw new Error("maker: #app"); return node; };
 const nowIso = (): string => new Date().toISOString(), bytes = (): Uint8Array => crypto.getRandomValues(new Uint8Array(16)), say = (m: string): void => { state.banner = m; paint(); };
 const fail = (e: unknown): void => say(e instanceof Error ? e.message : "Couldn't save project.json. Your phone may be full. Your last save is safe.");
@@ -42,7 +44,7 @@ function paint(): void {
   if (state.screen === "missing") { root.innerHTML = `<header class="topbar"><h1>Can't open</h1></header><div class="body"><p class="banner bad" role="alert">${esc(state.banner ?? "Can't open this project")}</p><button type="button" class="btn" data-act="back">Back to maker</button></div>`; return; }
   if (state.screen === "load") { root.innerHTML = `<header class="topbar"><h1>My games</h1></header><div class="body">${banner}<p>Loading your games…</p></div>`; return; }
   if (state.screen === "stage" && state.current !== null && state.stageId !== null) { const edit = unitEditing() ? `<div class="scrim"><div class="sheet">${unitPage(state.files, state.readOnly, state.banner)}</div></div>` : ""; root.innerHTML = stageScreen(state.stageId, { files: state.files, rev: state.rev, readOnly: state.readOnly, banner: state.banner, dirty: state.dirty }) + artSheet(state.files, state.stageId, state.readOnly) + edit + toast; return; }
-  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: `${levelsSection(state.files, state.readOnly)}${effectsSection(state.files, state.readOnly)}` }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly)) + (unitEditing() ? "" : toast); return; }
+  if (state.screen === "project" && state.current !== null) { const row = state.rows.find((item) => item.id === state.current), rows = stageRows(state.files); const host = { files: state.files, readOnly: state.readOnly, banner: state.banner }; const cont = resume === null ? "" : `<button type="button" class="btn" data-act="continue">Continue</button>`; root.innerHTML = (unitEditing() ? unitPage(host.files, host.readOnly, host.banner) : projectScreen({ name: row?.name ?? "Project", stages: rows.length, rows, dirty: state.dirty, readOnly: state.readOnly, banner: state.banner, problems: state.problems, tail: `${buildButton(building)}${roomTail(state.files, state.readOnly)}${cont}`, units: unitTail(state.files, state.readOnly), levels: `${levelsSection(state.files, state.readOnly)}${effectsSection(state.files, state.readOnly)}` }) + roomSheet(state.files) + unitSheet() + levelsSheet(state.files, state.readOnly) + effectsSheet(state.files, state.readOnly)) + (unitEditing() ? "" : toast); return; }
   const list = (state.screen === "trash" ? state.trash : state.rows).map((row) => state.screen === "trash" ? `<article class="card"><div class="grow"><div class="name">${esc(row.name)}</div><p class="sub">${esc(row.error ?? "In trash")}</p></div><button type="button" class="btn ghost" data-act="restore:${row.id}">Restore</button></article>` : rowHtml(row)).join("");
   const empty = state.screen === "home" && state.rows.length === 0 ? `<p class="hint">Your games live on this device.</p>` : "", link = state.screen === "home" && state.trash.length > 0 ? `<button type="button" class="btn ghost" data-act="trash">Trash</button>` : "";
   const bar = state.screen === "trash" ? `<header class="topbar"><button type="button" class="btn ghost" data-act="back">Back</button><h1>Trash</h1></header>` : `<header class="topbar"><h1>My games</h1></header>`;
@@ -157,7 +159,24 @@ async function run(act: string): Promise<void> {
   if (act === "dismiss") { state.banner = null; paint(); return; } if (act === "new") { state.screen = "pick"; state.tpl = "demo"; state.banner = null; paint(); return; } if (act.startsWith("tpl:")) { state.tpl = act.endsWith("empty") ? "empty" : "demo"; paint(); return; }
   if (act === "toname") { state.screen = "name"; state.name = "My game"; state.banner = null; paint(); return; } if (act === "create") return create(); if (act === "back") { state.screen = "home"; state.banner = null; state.problems = []; await refresh(); paint(); return; } if (act === "trash") { state.screen = "trash"; paint(); return; }
   if (act.startsWith("open:")) return openId(act.slice(5)); if (act.startsWith("menu:")) { state.menu = act.slice(5); state.screen = "menu"; paint(); return; } if (act === "askrename") { state.name = state.rows.find((item) => item.id === state.menu)?.name ?? ""; state.screen = "rename"; state.banner = null; paint(); return; }
-  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "continue" && resume !== null) return beginTest(undefined, resume); if (act === "fix") { state.problems = []; paint(); }
+  if (act === "dore") return rename(); if (act === "duplicate") return copy(); if (act === "delete") return remove(); if (act.startsWith("restore:")) return restore(act.slice(8)); if (act === "undo") return restore(toastId); if (act === "save") return saveCurrent(); if (act === "test") return beginTest(); if (act === "build") return buildNow(); if (act === "continue" && resume !== null) return beginTest(undefined, resume); if (act === "fix") { state.problems = []; paint(); }
+}
+function download(name: string, bytes: Uint8Array): void {
+  const file = new File([bytes as BlobPart], name), url = URL.createObjectURL(file), a = document.createElement("a");
+  a.href = url; a.download = file.name; a.click(); URL.revokeObjectURL(url);
+}
+async function buildNow(): Promise<void> {
+  if (store === null || state.current === null) return;
+  if (state.dirty) await saveCurrent();
+  if (state.dirty) return;
+  const id = state.current;
+  building = "busy"; state.problems = []; paint();
+  try {
+    const got = await buildGame(store, id, async (path) => { const res = await fetch(new URL(path, playBase(import.meta.url))); if (!res.ok) throw new Error(`Can't build: ${path}`); return res.text(); });
+    if (!got.ok) { state.problems = got.lines; building = "idle"; paint(); return; }
+    download(`${id}-game.zip`, got.bytes);
+  } catch (e) { state.banner = e instanceof Error ? e.message : "Can't build"; }
+  building = "idle"; paint();
 }
 async function boot(): Promise<void> {
   paint();
```

### `tools/maker/app.css` (edited)

```diff
diff --git a/tools/maker/app.css b/tools/maker/app.css
index df3460b..a88dd5c 100644
--- a/tools/maker/app.css
+++ b/tools/maker/app.css
@@ -54,3 +54,4 @@ input.knob { box-sizing: border-box; display: block; width: 100%; height: 48px;
 .reach-grid span { width: 36px; height: 16px; min-height: 16px; overflow: hidden; border-radius: 3px; background: var(--surface-2); color: var(--ink); font-size: 8px; line-height: 16px; text-align: center; }
 .reach-grid span.on { background: var(--accent-soft); color: var(--ink); }
 button.card.ability-add { flex-direction: column; align-items: flex-start; }
+.spin { width: 18px; height: 18px; margin-right: 8px; border: 2px solid var(--line); border-top-color: var(--ink); border-radius: 999px; display: inline-block; vertical-align: middle; animation: spin 0.8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }
```

### `tools/export/zip.ts` (new)

```ts
const u16 = (b: Uint8Array, o: number): number => (b[o] ?? 0) | ((b[o + 1] ?? 0) << 8);
const u32 = (b: Uint8Array, o: number): number => (u16(b, o) | (u16(b, o + 2) << 16)) >>> 0;
const put = (out: Uint8Array, off: number, bits: number, value: number): void => { for (let i = 0; i < bits / 8; i += 1) out[off + i] = (value >>> (8 * i)) & 0xff; };
function concat(parts: readonly Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) at += (out.set(p, at), p.length);
  return out;
}
export function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    c ^= data[i] ?? 0;
    for (let k = 0; k < 8; k += 1) c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return (c ^ 0xffffffff) >>> 0;
}
const localFields = (crc: number, size: number, nameLen: number): readonly (readonly [number, number, number])[] => [[4, 16, 20], [6, 16, 0x800], [8, 16, 0], [10, 16, 0], [12, 16, 0], [14, 32, crc], [18, 32, size], [22, 32, size], [26, 16, nameLen], [28, 16, 0]];
const centralFields = (crc: number, size: number, nameLen: number, offset: number): readonly (readonly [number, number, number])[] => [[4, 16, 20], [6, 16, 20], [8, 16, 0x800], [10, 16, 0], [12, 16, 0], [14, 16, 0], [16, 32, crc], [20, 32, size], [24, 32, size], [28, 16, nameLen], [30, 16, 0], [32, 16, 0], [34, 16, 0], [36, 16, 0], [38, 32, 0], [42, 32, offset]];
const endFields = (count: number, size: number, offset: number): readonly (readonly [number, number, number])[] => [[4, 16, 0], [6, 16, 0], [8, 16, count], [10, 16, count], [12, 32, size], [16, 32, offset], [20, 16, 0]];
function header(sig: number, fields: readonly (readonly [number, number, number])[], extra: Uint8Array): Uint8Array {
  const out = new Uint8Array(fields.reduce((n, [off, bits]) => Math.max(n, off + bits / 8), 4) + extra.length);
  put(out, 0, 32, sig);
  for (const [off, bits, value] of fields) put(out, off, bits, value);
  out.set(extra, out.length - extra.length);
  return out;
}
export function zipStore(entries: readonly { readonly name: string; readonly data: Uint8Array }[]): Uint8Array {
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const entry of entries) {
    const name = new TextEncoder().encode(entry.name);
    const local = header(0x04034b50, localFields(crc32(entry.data), entry.data.length, name.length), name);
    locals.push(local, entry.data);
    centrals.push(header(0x02014b50, centralFields(crc32(entry.data), entry.data.length, name.length, offset), name));
    offset += local.length + entry.data.length;
  }
  const cd = concat(centrals);
  return concat([...locals, cd, header(0x06054b50, endFields(entries.length, cd.length, offset), new Uint8Array())]);
}
export function unzipStore(zip: Uint8Array): { name: string; data: Uint8Array }[] {
  let eocd = -1;
  for (let i = zip.length - 22; i >= 0 && eocd < 0; i -= 1) if (u32(zip, i) === 0x06054b50) eocd = i;
  if (eocd < 0) throw new Error("zip: eocd");
  const count = u16(zip, eocd + 10);
  let at = u32(zip, eocd + 16);
  const out: { name: string; data: Uint8Array }[] = [];
  for (let n = 0; n < count; n += 1) {
    if (u32(zip, at) !== 0x02014b50) throw new Error("zip: central");
    if (u16(zip, at + 10) !== 0) throw new Error("zip: method");
    const crc = u32(zip, at + 16);
    const size = u32(zip, at + 24);
    const nameLen = u16(zip, at + 28);
    const extra = u16(zip, at + 30);
    const comment = u16(zip, at + 32);
    const local = u32(zip, at + 42);
    const name = new TextDecoder().decode(zip.slice(at + 46, at + 46 + nameLen));
    const start = local + 30 + u16(zip, local + 26) + u16(zip, local + 28);
    const data = zip.slice(start, start + size);
    if (crc32(data) !== crc) throw new Error("zip: crc");
    out.push({ name, data });
    at += 46 + nameLen + extra + comment;
  }
  return out;
}
```

### `tools/export/game.ts` (new)

```ts
import { zipStore } from "./zip.ts";
export const KEEP_OUT = ["notes/", "sprite-recipes/"];
export const shipped = (path: string): boolean => path.endsWith(".json") && !path.split("/").includes(".deleted") && !KEEP_OUT.some((pre) => path.startsWith(pre));
export const filesModule = (text: Readonly<Record<string, string>>): string => `export default {\n${Object.keys(text).filter(shipped).sort().map((path) => `${JSON.stringify(path)}: ${text[path] ?? ""}`).join(",\n")}\n};\n`;
export function markPage(html: string): string {
  if (!html.includes(`<canvas id="board">`)) throw new Error("Can't build: index.html");
  return html.replace(`<canvas id="board">`, `<canvas id="board" data-game="project/files.js">`);
}
const sha256 = async (data: Uint8Array): Promise<string> => [...new Uint8Array(await crypto.subtle.digest("SHA-256", data.slice()))].map((b) => b.toString(16).padStart(2, "0")).join("");
export async function gameZip(play: Readonly<Record<string, string>>, text: Readonly<Record<string, string>>, assets: Readonly<Record<string, Uint8Array>>): Promise<Uint8Array> {
  const raw = play["build.json"] ?? "";
  const commit = /\n {2}"commit": "([0-9a-f]{40})",\n/.exec(raw)?.[1];
  const node = /\n {2}"node": "([^"\\]*)",\n/.exec(raw)?.[1];
  if (commit === undefined || node === undefined) throw new Error("Can't build: build.json");
  const enc = new TextEncoder();
  const files = new Map<string, Uint8Array>();
  for (const [name, body] of Object.entries(play)) if (name !== "build.json") files.set(name, enc.encode(name === "index.html" ? markPage(body) : body));
  files.set("project/files.js", enc.encode(filesModule(text)));
  for (const [name, bytes] of Object.entries(assets)) if (!name.split("/").includes(".deleted")) files.set(`project/assets/${name}`, bytes);
  const names = [...files.keys()].sort();
  const sums: Record<string, string> = {};
  for (const name of names) sums[name] = await sha256(files.get(name) ?? new Uint8Array());
  const build = `${JSON.stringify({ commit, node, entry: "index.html", files: sums }, null, 2)}\n`;
  const entries = names.map((name) => ({ name, data: files.get(name) ?? new Uint8Array() }));
  entries.push({ name: "build.json", data: enc.encode(build) });
  return zipStore(entries);
}
```

### `tools/play-stage/game.ts` (new)

```ts
export const PROJECT = "project/";
export const FILES = "project/files.js";
```

### `tools/maker/export.ts` (new)

```ts
import { prefix } from "../../src/editor/project/home.ts";
import { emptyBoard, playLine, testGate } from "../../src/editor/project/test-gate.ts";
import { readProject } from "../../src/project/load/index.ts";
import { gameZip } from "../export/game.ts";
import { openProject } from "../play-stage/project.ts";
import { assetRows } from "./asset-check.ts";
import { parseProject } from "./project-files.ts";
import { readTree, type MakerStore } from "./store.ts";
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
export function isTree(doc: unknown): doc is { readonly commit: string; readonly node: string; readonly files: Readonly<Record<string, string>> } {
  if (!isObj(doc) || typeof doc["commit"] !== "string" || typeof doc["node"] !== "string" || !isObj(doc["files"])) return false;
  return Object.values(doc["files"]).every((item) => typeof item === "string");
}
export function playBase(url: string): string {
  const at = url.indexOf("/maker/");
  if (at < 0) throw new Error("Can't build: /maker/");
  const rest = url.slice(at + "/maker/".length);
  const slash = rest.indexOf("/");
  if (slash < 0) throw new Error("Can't build: /maker/");
  return `${url.slice(0, at)}/play-stage/${rest.slice(0, slash)}/`;
}
export async function buildGame(store: MakerStore, id: string, get: (path: string) => Promise<string>): Promise<{ readonly ok: true; readonly bytes: Uint8Array } | { readonly ok: false; readonly lines: readonly string[] }> {
  const text = await readTree(store, prefix(id));
  const parsed = parseProject(text);
  if (!parsed.ok) return { ok: false, lines: [parsed.message] };
  const load = readProject(parsed.files);
  const rows = await assetRows(store, prefix(id), parsed.files);
  const gate = testGate([...load.report, ...rows], load.readOnly);
  if (!gate.allowed) return { ok: false, lines: gate.lines };
  const opened = openProject(parsed.files);
  if (opened.docs === null) return { ok: false, lines: [playLine(opened.error)] };
  if (emptyBoard(opened.docs)) return { ok: false, lines: ["Place a unit on this stage to test it."] };
  const assets: Record<string, Uint8Array> = {};
  for (const name of await store.list(`${prefix(id)}assets/`)) {
    if (name === ".deleted") continue;
    const blob = await store.readBlob(`${prefix(id)}assets/${name}`);
    if (blob === null) throw new Error(`Can't build: assets/${name}`);
    assets[name] = new Uint8Array(await blob.arrayBuffer());
  }
  const raw = await get("build.json");
  const tree = parseProject({ "build.json": raw });
  if (!tree.ok || !isTree(tree.files["build.json"])) throw new Error("Can't build: build.json");
  const doc = tree.files["build.json"];
  const play: Record<string, string> = { "build.json": raw };
  for (const name of Object.keys(doc.files)) play[name] = await get(name);
  return { ok: true, bytes: await gameZip(play, text, assets) };
}
```

### `tools/maker/build-sheet.ts` (new)

```ts
export type BuildView = "idle" | "busy";
export function buildButton(view: BuildView): string {
  if (view === "busy") return `<button type="button" class="btn ghost stage-row" data-act="build" disabled aria-busy="true"><span class="spin"></span>Building…</button>`;
  return `<button type="button" class="btn ghost stage-row" data-act="build">Build game</button>`;
}
```

### `tests/tools/export-11a.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32 as zlibCrc } from "node:zlib";
import { test } from "node:test";
import { prefix } from "../../src/editor/project/home.ts";
import { debugGlobals, networkUrls, playOnly } from "../../tools/apk/build.ts";
import { gameZip, shipped } from "../../tools/export/game.ts";
import { crc32, unzipStore, zipStore } from "../../tools/export/zip.ts";
import { buildButton } from "../../tools/maker/build-sheet.ts";
import { buildGame, playBase } from "../../tools/maker/export.ts";
import { parseProject } from "../../tools/maker/project-files.ts";
import { memoryStore, type MakerStore } from "../../tools/maker/store.ts";
import { build, ours } from "../../tools/play-stage/build.ts";
import { openProject } from "../../tools/play-stage/project.ts";
const PID = "project_01JDAP00000000000000000001";
const MAP = "maps/map_01JDAM00000000000000000001.json";
const STAGE = "stages/stage_01JDAS00000000000000000001.json";
const playDir = mkdtempSync(join(tmpdir(), "s11a-play-"));
build(playDir, "a".repeat(40));
const walk = (root: string): Record<string, string> => Object.fromEntries(readdirSync(root, { recursive: true, withFileTypes: true }).flatMap((ent) => (ent.isFile() ? [[join(ent.parentPath, ent.name).slice((root.endsWith("/") ? root : `${root}/`).length).replaceAll("\\", "/"), readFileSync(join(ent.parentPath, ent.name), "utf8")] as [string, string]] : [])));
const demo = (): Record<string, string> => walk(fileURLToPath(new URL("../../fixtures/demo.tileproj/", import.meta.url)));
const play = walk(playDir);
const get = async (name: string): Promise<string> => play[name] ?? "";
const textOf = (data: Uint8Array): string => new TextDecoder().decode(data);
const put = async (store: MakerStore, text: Record<string, string>): Promise<void> => { for (const [path, body] of Object.entries(text)) await store.write(`${prefix(PID)}${path}`, body); };
const banned = (text: string): boolean => ["@te/project-write", "createWritable", "getFileHandle", "showSaveFilePicker", "writeFile"].some((word) => text.includes(word));
const clean = (entries: readonly { name: string; data: Uint8Array }[]): boolean => entries.every((entry) => !entry.name.split("/").includes("migrations") && !entry.name.includes("project-write") && !banned(textOf(entry.data)));
const apkOk = (entries: readonly { name: string; data: Uint8Array }[]): boolean => {
  const dir = mkdtempSync(join(tmpdir(), "s11a-www-"));
  for (const entry of entries) writeFileSync((mkdirSync(dirname(join(dir, entry.name)), { recursive: true }), join(dir, entry.name)), entry.data);
  return networkUrls(dir).length === 0 && playOnly(dir).length === 0 && debugGlobals(dir).length === 0 && ours(textOf(entries.find((entry) => entry.name === "build.json")?.data ?? new Uint8Array()));
};
test("11a zip: zipStore writes a stored zip that unzipStore reads back byte for byte, with Node's zlib CRC-32", () => {
  const hello = new TextEncoder().encode("hello");
  const bin = new Uint8Array([1, 2, 3, 255]);
  assert.equal(crc32(hello) === (zlibCrc(hello) >>> 0) && crc32(bin) === (zlibCrc(bin) >>> 0), true);
  const back = unzipStore(zipStore([{ name: "a.txt", data: hello }, { name: "dir/b.bin", data: bin }]));
  assert.deepEqual(back, [{ name: "a.txt", data: hello }, { name: "dir/b.bin", data: bin }]);
  const flipped = new Uint8Array(zipStore([{ name: "a.txt", data: hello }, { name: "dir/b.bin", data: bin }]));
  flipped[35] = (flipped[35] ?? 0) ^ 0xff;
  assert.throws(() => unzipStore(flipped), /zip: crc/);
});
test("11a gameZip: the play tree with its page naming the project module, the project module and the pictures, with no file under a .deleted/ folder anywhere, notes/ or sprite-recipes/, and no .tmp or other non-JSON file; build.json names every file by sha256 with the play build's commit and node; unzipped, it passes the APK www checks (play-only, no network URLs, no debug paths) and carries no writer: no @te/project-write, no migrations/<kind>/ write step, no file writing (the in-memory read-up load/migrate.js may ride, DSK E7)", async () => {
  const text = demo();
  text["units/.deleted/gone.json"] = "{}\n";
  text[".deleted/gone.json"] = "{}\n";
  text["effects/.deleted/gone.json"] = "{}\n";
  text["notes/n.json"] = "{}\n";
  text["sprite-recipes/s.json"] = "{}\n";
  text["scratch.tmp"] = "nope";
  text["readme.txt"] = "nope";
  const entries = unzipStore(await gameZip(play, text, { "ok.png": new Uint8Array([1, 2, 3]), ".deleted/x.png": new Uint8Array([9]) }));
  const js = textOf(entries.find((entry) => entry.name === "project/files.js")?.data ?? new Uint8Array());
  const meta = JSON.parse(textOf(entries.find((entry) => entry.name === "build.json")?.data ?? new Uint8Array())) as { files: Record<string, string> };
  assert.equal(entries.some((entry) => entry.name === "index.html") && entries.some((entry) => entry.name === "build.json") && entries.some((entry) => entry.name === "project/files.js") && entries.some((entry) => entry.name === "project/assets/ok.png") && !entries.some((entry) => entry.name.split("/").includes(".deleted") || entry.name.endsWith(".tmp") || entry.name.endsWith(".txt") || entry.name.startsWith("notes/") || entry.name.startsWith("sprite-recipes/")) && !js.includes("notes/") && !js.includes(".deleted") && !js.includes("scratch.tmp") && textOf(entries.find((entry) => entry.name === "index.html")?.data ?? new Uint8Array()).includes('data-game="project/files.js"') && entries.filter((entry) => entry.name !== "build.json").every((entry) => meta.files[entry.name] === createHash("sha256").update(entry.data).digest("hex")) && clean(entries) && apkOk(entries), true);
});
test("11a buildGame: a saved project goes through the Test gate into a zip of the play tree, the saved tree and its assets; a project Test refuses (a hard reader error, a missing picture a stage uses while openProject would still play, or an empty board) builds nothing, and a save that fails stops Build; a missing listed picture, a bad build.json or a page not under /maker/ throws Can't build, shown as the plain reason in the banner (interim until 11a2); playBase maps maker/<stamp>/ to play-stage/<stamp>/", async () => {
  const store = memoryStore();
  await put(store, demo());
  const built = await buildGame(store, PID, get);
  if (!built.ok) throw new Error(built.lines.join(" "));
  const saved = unzipStore(built.bytes);
  assert.equal(saved.some((entry) => entry.name === "project/files.js") && clean(saved) && apkOk(saved), true);
  const missing = demo();
  const project = JSON.parse(missing["project.json"] ?? "") as { project: { assets: Record<string, unknown> } };
  project.project.assets["asset_missingpic"] = { ext: "png" };
  missing["project.json"] = JSON.stringify(project);
  const map = JSON.parse(missing[MAP] ?? "") as { background: { layers: unknown[] } };
  map.background.layers.push({ assetId: "asset_missingpic", depth: 1, repeat: "none", fit: "none" });
  missing[MAP] = JSON.stringify(map);
  const held = memoryStore();
  await put(held, missing);
  const picture = await buildGame(held, PID, get);
  assert.equal(picture.ok === false && /picture/.test(picture.lines.join("\n")), true);
  const newer = demo();
  newer["project.json"] = (newer["project.json"] ?? "").replace("\"formatVersion\": 6", "\"formatVersion\": 99");
  const aged = memoryStore();
  await put(aged, newer);
  assert.equal((await buildGame(aged, PID, get)).ok, false);
  const empty = demo();
  const stage = JSON.parse(empty[STAGE] ?? "") as { playerSpawns: unknown[]; neutrals: unknown[]; enemyPool: { entries: unknown[] } };
  stage.playerSpawns = [];
  stage.neutrals = [];
  stage.enemyPool.entries = [];
  empty[STAGE] = JSON.stringify(stage);
  const bare = memoryStore();
  await put(bare, empty);
  const blank = await buildGame(bare, PID, get);
  assert.equal(blank.ok === false && /Place a unit/.test(blank.lines.join("\n")), true);
  const hole = memoryStore();
  await put(hole, demo());
  const wrapped: MakerStore = { ...hole, list: async (dir: string) => dir.endsWith("/assets/") ? [...await hole.list(dir), "gone.png"] : hole.list(dir), readBlob: (path: string) => path.endsWith("/assets/gone.png") ? Promise.resolve(null) : hole.readBlob(path) };
  await assert.rejects(buildGame(wrapped, PID, get), /Can't build: assets\/gone\.png/);
  const bad = async (name: string): Promise<string> => name === "build.json" ? `${JSON.stringify({ commit: "a".repeat(40), node: "x", entry: "index.html", files: { "index.html": 1 } }, null, 2)}\n` : get(name);
  await assert.rejects(buildGame(store, PID, bad), /Can't build: build\.json/);
  assert.throws(() => playBase("http://127.0.0.1/play/ab/home.js"), /Can't build: \/maker\//);
  assert.equal(playBase("http://127.0.0.1/maker/abc123def456/tools/maker/home.js"), "http://127.0.0.1/play-stage/abc123def456/");
  const home = readFileSync("tools/maker/home.ts", "utf8");
  assert.equal(/if \(state\.dirty\) await saveCurrent\(\);\n {2}if \(state\.dirty\) return;/.test(home) && /state\.banner = e instanceof Error \? e\.message : "Can't build"/.test(home), true);
});
test("11a play boot: Build game straight after opening ships each saved document byte for byte (a raw U+2028 and a v4 map included, nothing from notes/), and the zip's module plays the same as Test (old docs read up in memory by load/migrate.js, DSK E7)", async () => {
  const text = demo();
  text["project.json"] = (text["project.json"] ?? "").replace("\"name\": \"Demo\"", "\"name\": \"De\u2028mo\"");
  const old = JSON.parse(text[MAP] ?? "") as { formatVersion: number; background: unknown };
  old.formatVersion = 4;
  old.background = { mode: "colour" };
  text[MAP] = JSON.stringify(old);
  text["notes/n.json"] = "{\"a\":1}\n";
  const store = memoryStore();
  await put(store, text);
  const built = await buildGame(store, PID, get);
  if (!built.ok) throw new Error(built.lines.join(" "));
  const entries = unzipStore(built.bytes);
  const js = textOf(entries.find((entry) => entry.name === "project/files.js")?.data ?? new Uint8Array());
  assert.equal(js.includes("\u2028") && !js.includes("\\u2028") && js.includes(text[MAP] ?? "") && !js.includes("notes/") && Object.keys(text).filter(shipped).every((path) => js.includes(text[path] ?? "")) && clean(entries), true);
  const mod = await import(`data:text/javascript,${encodeURIComponent(js)}`) as { default: Parameters<typeof openProject>[0] };
  const parsed = parseProject(text);
  if (!parsed.ok) throw new Error(parsed.message);
  assert.deepEqual(openProject(mod.default).docs, openProject(parsed.files).docs);
});
test("11a build button: full-width secondary Build game, and disabled with a spinner and Building… while it builds", () => {
  const css = readFileSync("tools/maker/app.css", "utf8");
  const idle = buildButton("idle");
  const busy = buildButton("busy");
  assert.equal(idle.includes("btn ghost stage-row") && idle.includes('data-act="build"') && idle.includes("Build game") && !idle.includes("disabled") && busy.includes("disabled") && busy.includes('aria-busy="true"') && busy.includes("spin") && busy.includes("Building…") && css.includes(".spin") && css.includes("@keyframes spin"), true);
});
```

### `handoff/steps/tests/s11a-export-mvp/smoke.mjs` (new)

```js
// Step 11a export. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s11a-export-mvp/smoke.mjs . 8818 r1
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"; import { tmpdir } from "node:os"; import { dirname, extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8818", REV = "r1"] = process.argv;
if (!WT) { console.error("usage: node smoke.mjs <worktree> [port] [rev]"); process.exit(2); }
const root = resolve(WT), { build } = await import(pathToFileURL(join(root, "tools/maker/build.ts")).href);
const { unzipStore } = await import(pathToFileURL(join(root, "tools/export/zip.ts")).href);
const { shipped } = await import(pathToFileURL(join(root, "tools/export/game.ts")).href);
const www = mkdtempSync(join(tmpdir(), `s11a-maker-${REV}-`)), game = mkdtempSync(join(tmpdir(), `s11a-game-${REV}-`)); build(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".css": "text/css; charset=utf-8", ".png": "image/png" };
const listen = (dir, port) => new Promise((ok) => { const srv = createServer((rq, rs) => { let path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0])); if (path === "/") path = "/index.html"; if (path.endsWith("/")) path += "index.html"; const file = resolve(dir, "." + path); if (!file.startsWith(dir + sep) && file !== dir) { rs.writeHead(403); rs.end("no"); return; } try { const body = readFileSync(file); rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(body); } catch { rs.writeHead(404); rs.end("missing"); } }); srv.listen(port, "127.0.0.1", () => ok(srv)); });
const maker = await listen(www, Number(PORT)), play = await listen(game, Number(PORT) + 1);
const makerOrigin = `http://127.0.0.1:${PORT}`, gameOrigin = `http://127.0.0.1:${Number(PORT) + 1}`;
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const tap = async (page, act) => { const got = await page.waitForFunction((act) => { const el = document.querySelector(`[data-act="${act}"]`); if (!(el instanceof HTMLElement)) return null; if (document.querySelector(".scrim") !== null && el.closest(".scrim") === null) return null; el.scrollIntoView({ block: "center", inline: "nearest" }); const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2; const top = document.elementFromPoint(x, y); return top !== null && top.closest("[data-act]") === el ? { x, y } : null; }, act, { timeout: 15000 }); const pos = await got.jsonValue(); if (pos === null || typeof pos.x !== "number") throw new Error(`no ${act}`); await page.touchscreen.tap(pos.x, pos.y); };
const press = async (page, name) => { const btn = page.getByRole("button", { name }).first(); await btn.waitFor({ timeout: 15000 }); await btn.scrollIntoViewIfNeeded(); const box = await btn.boundingBox(); if (box === null) throw new Error(name); await page.touchscreen.tap(box.x + Math.min(box.width / 2, 24), box.y + box.height / 2); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, colorScheme: "light" });
    const page = await ctx.newPage(); const errs = []; page.on("pageerror", (e) => errs.push(String(e)));
    const step = async (name, fn) => { try { await fn(); check(`${name} @${width}`, errs.length === 0, errs.length === 0 ? "ok" : errs.join(" | ")); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e).split("\n")[0]); } };
    await page.goto(`${makerOrigin}/maker/`, { waitUntil: "load" });
    await press(page, "New project"); await press(page, "Continue"); await press(page, "Create");
    let id = "", gp = null;
    await step("1 zip", async () => {
      await page.waitForFunction(() => document.querySelector('[data-act="build"]') !== null, null, { timeout: 15000 });
      id = await page.evaluate(() => JSON.parse(window.__read()["project.json"]).project.id);
      const pending = page.waitForEvent("download", { timeout: 30000 }); await tap(page, "build"); const dl = await pending;
      if (dl.suggestedFilename() !== `${id}-game.zip`) throw new Error(dl.suggestedFilename());
      const entries = unzipStore(new Uint8Array(readFileSync(await dl.path())));
      for (const entry of entries) { const dest = join(game, entry.name); mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, entry.data); }
      const saved = await page.evaluate(() => Object.keys(window.__read())), copy = join(game, `w${width}.mjs`);
      writeFileSync(copy, readFileSync(join(game, "project/files.js"))); const mod = await import(pathToFileURL(copy).href);
      if (!entries.some((entry) => entry.name === "index.html") || !entries.some((entry) => entry.name === "build.json") || !entries.some((entry) => entry.name === "project/files.js") || Object.keys(mod.default).sort().join("\n") !== saved.filter(shipped).sort().join("\n")) throw new Error("zip shape");
    });
    await step("2 play", async () => {
      const off = [];
      gp = await ctx.newPage();
      gp.on("request", (rq) => { const u = rq.url(); if (u.startsWith(gameOrigin) || u.startsWith("data:") || u.startsWith("blob:")) return; off.push(u); });
      gp.on("pageerror", (e) => errs.push(String(e)));
      await gp.goto(`${gameOrigin}/index.html`, { waitUntil: "load" });
      await gp.waitForFunction((pid) => window.__play && window.__docs?.manifest?.project?.id === pid && document.querySelector("#back-maker") === null, id, { timeout: 15000 });
      if (off.length > 0) throw new Error(off[0]);
    });
    await step("3 win", async () => {
      if (gp === null) throw new Error("no game");
      await gp.evaluate(() => { window.__play.world.units.all().filter((u) => u.side === "wolves").forEach((u) => window.__play.world.units.remove(u.id)); });
      const end = gp.locator("#end"); await end.waitFor({ timeout: 15000 }); const box = await end.boundingBox(); if (box === null) throw new Error("end");
      await gp.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await gp.waitForFunction(() => window.__play.outcome === "win" && document.querySelector("#hud h2")?.textContent === "Victory", null, { timeout: 15000 });
    });
    await ctx.close();
  };
  await run(390); await run(360);
  if (bad === 0) console.log("SMOKE PASS"); else { console.log("SMOKE FAIL"); process.exitCode = 1; }
} finally { await browser.close(); maker.close(); play.close(); rmSync(www, { recursive: true, force: true }); rmSync(game, { recursive: true, force: true }); }
```
