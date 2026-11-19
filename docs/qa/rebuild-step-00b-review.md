# QA review: rebuild record step-00b (draft)

**Verdict: NOT OK. Four small text fixes: one rebuild-command trap and three cites. The code, blobs, appendix and facts all match.**

Record `/workspace/share/rebuild-00b/docs/rebuild/step-00b.md`: 1105 lines, hash-object `db8805ce`, sha256 `9147c8b4`. Checked against merge `d62f87bc` (tree `84968a8d`, parents `461596eb` / `87f67eae`), guide blob `68a9138e`, HB `0c8e67a0`, QA `f353f7f4` (36 lines) and V `2dc0c51a` (214 lines).

## Must-fix
1. **L195, a rebuild trap.** It says "From a clean tree at `02efdd04`, after the 7 product files match the blob table". Every command after it compares commits (`02efdd04..HEAD`), so uncommitted rebuild files are never measured. **Repro:** on a worktree at `02efdd04`, copy the 7 files from `d62f87bc` without committing. `git diff --shortstat 02efdd04..HEAD -- . ':!handback/**' ':!docs/**'` prints nothing; after a commit it prints 7 files, 130+/37-.
   **Fix:** `From a rebuild branch on \`02efdd04\` with the 7 product files committed and matching the blob table (or on the merge \`d62f87bc\`):`
2. **L14:** "V §10" for the merge tree. V §10 is the check list; the merge tree is **V §11**. **Fix:** `V §10, QA:36` → `V §11, QA:36`.
3. **L76:** "`finish` (`match.ts:36-45`)". The quoted block runs to the closing `};` at L46. **Fix:** `match.ts:36-46`. Likewise **L136**: `dressPx` (`looks.ts:34-41`), whose block closes at L42. **Fix:** `looks.ts:34-42`.
4. **L240 (non-blocker 6):** "verified on 4 empty-side cases". My follow-up ran 4 node repro cases at `aeb9a623`. Three had a bot side with no units or no legal actions (only-wolves free roam, an emptied `rival`, three emptied bot sides). The fourth was a no-spawn stage where the Merchant was killed for `lose`. That finding is a QA follow-up reply, not part of QA `f353f7f4`.
   **Fix:** `This was checked by QA in a follow-up (not in QA f353f7f4) with 4 node repro cases at aeb9a623, 3 of them with a bot side that had no units or no legal actions: none hung, each End Turn returned to me or ended with an outcome.`

## Checks (PASS)
- **Blob table (L248-256):** all 7 blob ids and line counts match `d62f87bc`. The set equals `git diff --name-only 02efdd04 87f67eae -- . ':!handback/**'`.
- **Appendix:** a script compared all 12 blocks byte for byte. The 2 new files and 5 "as merged" blocks equal `git show d62f87bc:<path>`. The 5 diff blocks equal `git diff 02efdd04 d62f87bc -- <path>`.
- **Code cites:** they match at `d62f87bc` (apart from the two range ends in fix 3): `sides.ts:1-12`, `board.ts:46,65,75-76,78-79,120,135` (base L45 `TEAM[recipe.team]`), `match.ts:23-24,45,65,78,115,134,170`, `hud.ts:3,25,28`, `load.ts:6-9,16`, and the test ranges `:32-36/37-43/44-48/49-53/54-60/61-72/73-79`. The inline snippets are the exact lines with a uniform indent strip, which is fine.
- **Guide, HB, QA and V cites:** they check out. Guide: L3, L9-12, L10, L19-20, L39, L43, L45, L48-60, L66-83, L86-98, L101, L109, L114. HB: 3, 15-25, 26, 29, 43-105, 108, 109, 114. QA: 3, 8-14, 17-18, 22-23, 26-27, 31-33, 36. V: §4, §7, check 5 and check 14. Checklist §3 I is at L67 and G7 at L26; BUILD_GUIDE is L123.
- **Facts:** 1060/0. 130 + 37 = 167 (10 files and 1346+/37- on the merge without `':!docs/**'`, which is right). Stamp `aea638c4c7f6`. Tree `84968a8d`. Merged 19:29 UTC (UK time). Golden `90dde42a`. S0 `d528795e` (blob `1f50845a`, 107 lines). The 7 names match guide L77-83 character for character. The base-fail detail matches HB:29. Main is still `d62f87bc`.
- **Rebuild commands, run on a committed rebuild branch on `02efdd04`:** both shortstats give 7 files, 130+/37-, and the product equals the merge. Green exit 0 with 1060/0, the 7 ✔ sides lines and parity ✔. Golden and S0 shas match, and the golden diff is empty. The build gives `aea638c4c7f6`. S0 gives 7 ok at 390 and 7 at 360; s3 gives 18 ok and TOUCH SMOKE PASS; s4a gives 16 ok and SMOKE PASS. No working-tree-vs-index `git diff`; the only trap is the uncommitted case in fix 1.
- **Non-blockers (L235-240):** items 1-3 match QA:31-33. Item 4 matches QA:27. Item 5 (the second `side !== me` re-checks `side` after `finish()` moves it) and item 6 (`pump` is bounded by `order.length`) match my follow-up finding; only item 6's wording needs fix 4.
- **CEO attribution:** none in the record apart from quoting the checklist heading, which is real.
