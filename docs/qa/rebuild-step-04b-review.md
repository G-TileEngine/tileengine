# QA review: rebuild record step-04b

**Verdict: NOT OK. 3 must-fixes and 1 small fix, all text-only.** The code, appendix and facts are all correct.

Record: `/workspace/share/rebuild-04b/docs/rebuild/step-04b.md`, 1288 lines, sha256 `1496b4f7…`, hash-object `c05d243f7cbc41b60bfe2ce0080124f58827efe7` (checked). Merge `a85ae665`: tree `e82c28d0`, parents `4867f363` and `82e8ab1c`, committed 2026-11-19 22:46 (UK time). `origin/main` is now `07c369ea`, and the only change after the merge is `docs/qa/step-04b-r2-review.md`.

## Must-fix
1. **L153, rebuild trap (working tree vs index).** The text "From a clean tree at `d62f87bc`, after the 10 product files match the blob table:" leaves the files uncommitted. Then `git diff --shortstat d62f87bc..HEAD` compares the base with itself and prints nothing. I ran it as written: empty. After a commit it gives 8 files, 308+34. Replace L153 with: "From a clean tree at `d62f87bc`, write the 10 product files so they match the blob table, then commit them on a rebuild branch (`git add -A && git commit -m rebuild`). HEAD is now that commit:"
2. **L191, wrong comparison.** `git diff d62f87bc HEAD -- <10 paths> must be empty` is false on a correct rebuild. After the commit I got 10 files, 374 insertions, 34 deletions. Before a commit it is empty for the wrong reason. Change `git diff d62f87bc HEAD --` to `git diff a85ae665 HEAD --`, keeping the same paths. I ran it on my committed rebuild: empty.
3. **L19, G7 rule cite.** Add the rule's source. Change "(guide L251 “as in 4a” L166, with the s4b smoke dir;" to "(G7: `docs/qa/handback-checklist.md` L26 and `BUILD_GUIDE.md` L123, insertions plus deletions; guide L251 “as in 4a” L166, with the s4b smoke dir;". Both lines hold the rule at `a85ae665`.

## Small fix
4. **L102, range end.** "The three named tests are in `tests/editor/stage-place.test.ts:23-31`" ends at the third test's opening line, but that test runs to L73. Change it to "`tests/editor/stage-place.test.ts:23-73` (opening lines :23, :24, :31)".

## Checked OK
- **Appendix (scripted):** all 14 blocks match the merge byte for byte. That is 10 full-file blocks against `git show a85ae665:<path>`, and 4 diff blocks (`paint.ts`, `stage.ts`, `home.ts`, `maker-law.test.ts`) against `git diff d62f87bc a85ae665 -- <path>`.
- **Blob table (L210-219):** all 10 blob ids and line counts match `git ls-tree` at `a85ae665`. The set is exactly `git diff --name-only d62f87bc 82e8ab1c` without `handback/`.
- **Rebuild, run with the corrected steps:** base plus the 10 blobs, committed, gives 8 files, 308+34=342. It is empty against `a85ae665` outside `docs/` and `handback/`. `npm run green` gives 1063/0. The maker build stamp is `cb00d1cf815f`, which confirms L20's claim that r2 left it unchanged. Golden `90dde42a` and S0 `d528795e` (blob `1f50845a`) are unchanged. On the merge without `':!docs/**'`, I get 12 files, 1503+34, as L19 says.
- **Facts:** 1063/0, N=3, r1 340 and r2 342, trees `a4b44f5d`/`4d1a434c`/`025b6cae`/`1e80d27e`/`e82c28d0`, the author line, HB1 `e75f06ce` and HB2 `857ae527` (39 lines), V1 `c22cb050` (50 lines) and V2 `381828e0` (30 lines), and QA1 `2d500838` and QA2 `49474b3f` (both on main), all match.
- **Cites:** every code cite matches `a85ae665`, including the range ends I checked. That covers `place.ts` 2-5, 11, 14-19, 31-36, 37-43, 44, 45-57, 58-62, 63-66; `talk.ts` 9, 14-15, 21-25; `setup.talk.json` 2-3, 9; `paint.ts` 36-41; `stage.ts` 28, 29, 31, 32, 35-41, 48, 127, 153, 159; `stage-sheets.ts` 3-8; `home.ts` 78, 91, 96; `stage-place.test.ts` 50-53; `smoke.mjs` 16, 17, 19-20, 28, 30, 31-45, 34; `maker-law.test.ts` 16, 33-35; and `page.ts:55`. All the guide (`35cc37db`), checklist L67, QA1, QA2, HB1 and HB2 line cites I checked point at the right text. The quotes are exact, including the types in `docAt` and `talkLimit`.
- **Attribution:** the record never mentions the CEO. The allow-list and must-fixes are credited to QA (QA1:8-9, QA2:24-32). The r1 and r2 history, the 6 carried non-blockers and my rulings are recorded accurately.
