# QA review: rebuild record step 2 (`/workspace/share/rebuild/step-02.md`)

QA & Build Guard, 2026-11-19, Europe/London. Read-only. Record sha256 `3c47fe1f…644d`, 2354 lines. Checked against git after `git fetch` (origin/main `4e5a2201`), the QA docs on main and CoS's report (sha256 `7b046232…`).

## Verdict: NOT OK (two citation fixes; no code or fact error)

### Must-fix
1. **L11:** `(… QA1:4)` → `(… QA1:3)`. QA1 L4 is blank; the base and docs-only claim is on L3.
2. **L82:** `(QA1:16, QA2:18)` → `(QA1:14, QA2:18)`. QA1 L16 is blank; the corrupt-card live check is on L14.

## 1. Facts vs git: pass, apart from the two cites
- **Base:** `772f7aa2` is `9fc49890` plus one docs-only commit with 9 files (L11).
- **r1 commits and verdict:** `55f8ca5`, `b90a14e`, `6bb80d7` (tree `4db9c105`) and `477e021e` (tree `52421f1a`) are correct. r1 was NOT OK at 436 = 397 + 39 (L12–13, L86).
- **r2 commits and numbers:**
  - `d797b8b` is the code head (tree `4a934890`), and `46fd3346` is the tip (tree `328d6199`).
  - Tests are 1039/0 with N=3.
  - The shortstat is 12 files, 377 insertions.
  - The stamp is `701bc957035c` and the smoke sha is `d528795e…`.
- **Merge:** PR #79 is `34fda67498e1…`, "Merge PR #79: Step 2: Home, save and load (r2)". It was authored at 03:04 GMT (UK time), with tree `16b91d1b` and parents `b999f6e6` and `46fd3346` (L16). Main `4e5a2201` adds only `docs/qa/step-02-r2-review.md` (L17).
- **Play stage:** `git diff --quiet 772f7aa2 34fda674 -- tools/play-stage tests/tools/touch-play.test.ts` is clean, and `play-stage-carries.test.ts` is absent at `34fda674` (L22).
- **(b) file table:** the 13 product line counts equal the numstat. `data/templates/demo.tileproj` equals `fixtures/demo.tileproj` at `34fda674`, and its blob ids match `step-01a.md` (for example `ea41249c`, `e6f3383f`, `fdddf778`).
- **Carries moved to 02b ((d)6):** 59 lines across the 5 play-stage files, `touch-play.test.ts` and the carry test, with N=2. 1041 dropped to 1039. These match QA1 and V2.
- **Guide revisions:** r8 on main is blob `7df0f328`, and the branch has r6 blob `25c0ee1a` (L3). Main's step-03 is r9. r8 L16 is the S0 smoke line and r8 L61 is the `app.css` row, as cited.
- **Code line cites at `34fda674`:** all correct. They are `home.ts` 27–28 (`rowFrom`), 31 (`refresh` skip), 33 (`saveCurrent`) and 38 (`restore`); `store.ts` 23 (rename loop) and 26–31 (`movePrefix`); `project.ts` 7 (the greyed Test); `build.ts` 11; `index.html` 6; `save.ts` 13–14 (staleRev before readOnly). The toast claim (L70: a failed restore keeps the toast, and only success clears it) matches `home.ts` 38.
- **Review docs on main `4e5a2201`:** `step-02-handback-review.md` is `e8a4032a…` (54 lines), `step-02-r7-02b-review.md` is `ce569888…` (30) and `step-02-r2-review.md` is `99d6ca73…` (33). Every other QA1 and QA2 cite lands on the right line: QA1 5–9, 18, 19, 24–29, 40 and 44–54, and QA2 5–7, 10–12, 14–16, 18, 20, 24, 26–30 and 32–33. The V1 and V2 cites (V1 192–198, 354 and 366; V2 19–31, 41, 45, 49, 59–62, 74, 104, 120 and 142–144) match the current report.

## 2. Appendix, by script: pass
A Python script read every `### \`path\` (new)` block (33 blocks, all with 5-backtick fences) and compared each body byte for byte with `git show 34fda674:<path>`. The result is **0 mismatches**. The blob table has 33 rows, and every blob id and line count equals `git rev-parse 34fda674:<path>` and the file's newline count. Of the `git diff --name-only 772f7aa2 46fd3346` paths, only the 10 `handback/step-02-home-save-load/r1/*` files (5 PNGs, HANDBACK.md and 4 text files) are missing from the appendix. L46 excludes them on purpose as not product, the same as step-01a and 01b. Every product file is present.

## 3. Shape: pass
The section order is the same as `docs/rebuild/step-01a.md` and `step-01b.md`: sections (a) to (f), then Blob check, then Appendix "full code as merged (…, PR #…)". There is one addition, "QA non-blockers carried forward" (L134), between (f) and Blob check. It lists QA1 carries 1–11 (8 marked as moved to 02b) and the QA2 r2 rulings correctly. It's fine to keep.

## Non-blocking
- The V1 and V2 cites point at a mutable share file. Add its sha256 (`7b046232…` today) to L5 so the line numbers stay checkable.
