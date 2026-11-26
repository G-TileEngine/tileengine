# QA check: filled 11a2 paste and 11a postmerge
Reviewer: QA & Build Guard, 2026-11-26 (London).

## 11a postmerge: PASS
`qa-postmerge.sh 7d73c74b bc94576c`: tree 522d02cc, parent2 is the picked tip, the src/tests/tools diff (merge-base..tip) matches parent1..merge, pins 5/5 unchanged, green 1165/0, smoke 0 failed. **RESULT PASS** with 1 warning: main moved by 1 commit (the QA review doc, docs only).

## 11a rebuild drafts: OK once the placeholders are filled
- Record `docs/rebuild/step-11a.md` (417efff6, 694 lines). Every new file's full text matches 7d73c74b. Every added line in home.ts, page.ts and app.css is present. All 10 blob ids match `git ls-tree`. Trees 04fc57e1 and 8c19cc93 are right. The QA ruling and carries are attributed to QA.
- Fill both `<QA POSTMERGE RESULT>` with: PASS (tree 522d02cc, pins 5/5, green 1165/0, smoke 0 failed; 1 warning: main moved by the QA review doc).
- README row 30 (a4a5bb28, 75 lines): a one-row add, and the row is right.

## Filled 11a2 paste (6bd4ac27, 12 lines): NOT OK TO SEND
The paste diff is fine on its own: floor 1167, the Base line, read the guide placeholders as 7d73c74b and 1165, and the builder runs its own audit. Leaving guide 176cc2bc byte-identical is fine.

The blocker is the line "The guide's trial base (90c9cb9f plus the 11a r2 trial …) stands: everything after the 11a merge is docs-only." That isn't true for code. The 11a2 trial was built on EA's 11a trial code, but 11a merged ChatA's own code, which is shaped differently:
- `BuildView` is `"idle" | "busy"`, not `{ mode }`.
- The variable is `building`, not `built`.
- `buildNow` and `download` are laid out differently.
- Test 3's banner assert is a different regex.

`git apply --check` of s11a2-trial.patch (0ee52a17) on 7d73c74b fails on `tests/tools/export-11a.test.ts`, `tools/maker/build-sheet.ts` and `tools/maker/home.ts`. The guide's code names (`built = { mode: … }`), the caps (home.ts 34, build-sheet 16, export-11a.test 4), the count 121 and the line cites were all set against the trial. So a builder on the real base may hit a cap and have to stop, or pack lines to fit.

**Fix:** EA re-trials 11a2 on 7d73c74b (or the new main), then refreshes the guide's code names, caps, count, line cites and Measured. CoS re-fills the paste, and I diff-check the result.

11b: s11b-trial.patch (a22122d5) applies cleanly on 7d73c74b (tools/apk only). Recheck it on the real 11a2 merge before its go-line.
