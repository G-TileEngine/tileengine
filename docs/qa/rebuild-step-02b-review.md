# QA review: rebuild record step 02b

QA & Build Guard, 2026-11-19, Europe/London. Read-only, after `git fetch` (origin/main `b3b74070`).
Record: `/workspace/share/rebuild/step-02b.md`, sha256 `3c478f01…be2e`, 883 lines.

## Verdict: NOT OK (one cite fix; every fact and every byte of code matches)

## 1. Facts vs git and the 02b review
- Base `34fda674` (PR #79 merge), floor 1039 (guide L8): match.
- Commits `1df36efc` (tree `aa5bdf92`) and `ad86194f` (tree `3464e06e`): match.
- Merge `fdf29002` "Merge PR #80: Step 02b: play-stage carries", 2026-11-19 03:23 GMT. Tree `b0eed0b8…`, parents `10308bba` and `ad86194f`: match. `fdf29002..b3b74070` adds only `docs/qa/step-02b-review.md`.
- 7 product files with the stated numstat. load.ts is 4+/3− (the +1 is `});` at L17 with `recipeIn` on L18 for carry 8). Total 45+15=60, 1041/0, smoke `d528795e`: these match QA:14-17 and V:77-95.
- Carry A (load.ts:9/17/19, project.ts:54/56, board.ts:21/132, match.ts:95/136), carry 8 (load.ts:18/21) and carry B (build.ts:35): each line holds the code the record says.
- The other four play-stage files have the same blobs as at `477e021e`. The guide blob is `a25a44ff` and the r6 blob at `477e021e` is `25c0ee1a`. QA doc `e4859b48`/`c556565e` has 42 lines and V `4121cfc2` has 144: all match.

## 2. Cites
Every QA, V, guide, code and `docs/rebuild/step-02.md:90` cite was read at its stated commit. Each points at a non-blank line that supports the claim, with one exception:
- **L55**: `touch-play.test.ts:8-9 and :12 switch idOf / wolfTo to bundledDocs().recipes (QA:27)`. QA L27 covers carry 8 and the dropped `?.` guards. It does not say the helpers switched to `bundledDocs().recipes`. Lines that do say it: guide L50 and HANDBACK L58 at `ad86194f`.

## 3. Appendix (scripted)
- Each `### path` section was extracted from the appendix. Each full block equals `git show fdf29002:<path>` byte for byte: **7/7 OK**.
- Each edited file's diff block equals `git diff 34fda674 fdf29002 -- <path>`: **6/6 OK**.
- Blob table: 7/7 blob ids and line counts match `fdf29002`.
- Missing: only `handback/step-02b/r1/HANDBACK.md`. It is excluded on purpose as not product (L35), the same as in step-02.

## 4. Shape
Same as `docs/rebuild/step-02.md` on main: title, brief and sources lines, then sections (a)–(f), QA non-blockers, the blob check and the full-code appendix. Edited files add a diff before the full file, which suits a step that edits existing files.

## Must-fix
1. `/workspace/share/rebuild/step-02b.md:55`: change `(QA:27)` to `(guide L50, HB:58)`.

No non-blockers.
