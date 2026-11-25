# QA review: step 9b r1 (art upload), ChatA

**Verdict: OK TO MERGE.** Merge with `--expect-tree 15c69cc62eb48e4bc897cc56da14b09ea8f8e667`.

- PR: https://github.com/G-TileEngine/tileengine/pull/101, branch `step/step-09b-art-upload-r1-chatA`
- Base: main `8572cd05` (unmoved at review time)
- Tip `d0c537e5` (tree `15c69cc6`), code head `cd6c4e0c` (tree `a17d3728`); the tip adds only `handback/step-09b-art-upload/r1/HANDBACK.md` (96 lines, sha256 `e24523d0…`)
- Trial merge tree onto main: `15c69cc6` (QA reproduced it)
- Guide: `/workspace/share/s9b/step-09b-art-upload.md` (sha256 `1cd3ec43…`), reviewed in `docs/qa/step-09b-09c-guide-review.md`

## Checks (QA ran each on a fresh worktree at the tip)
| Check | Result |
|---|---|
| `npm ci` then `npm run green` | exit 0, **1141 pass / 0 fail** (floor 1141) |
| tools tsc | only the 3 base errors: effect-designer `page.ts:101`, maker `home.ts:88` ×2 |
| Count (`':!handback/**'`) | 11 files, +324 −30 = **354** (gate 400) |
| Per-file caps | picture 35/35, backdrop 17/18, page 9/12, board 7/12, hud 9/12, store 13/24, art 70/70, home 26/32, stage 3/6, test 98/100, smoke 67/70: all hold |
| s9b on 8813 | 14 ok, SMOKE PASS (390 and 360) |
| s9 8811 / s8 8810 / s8c 8812 / s6d 8808 / S0 8797 | 12 / 16 / 8 / 14 / 14 ok, all PASS, all unedited |
| Export audit `s8-audit.mjs` | AUDIT PASS (133 / 147 / 146) |
| Must NOT | no `src/**`, data, fixtures, behaviour-library, painter-proto, ui-shell, `levels.ts` or `match.ts` edits; no existing test or smoke edited; no new code beyond `uploadTypeUnsupported`; no new rAF, timer or loop; smoke has no `waitForTimeout` |

## Mutations (each reverted after)
- `dropUndo` made a no-op: s9b step 2 fails at 390 and 360.
- Duplicate without the asset copy: s9b step 6 fails at both widths.
- Continue with no fresh resume notes: s9b step 7 fails at both widths.
- `art()` moved back outside the `try` in `loadLayer`: named test 5 fails (5/6).
- Board builds a new `assets` object every frame: named test 6 fails (5/6).

## Code read
- The shipped code was written fresh, not pasted from the trial patch; it matches the guide's rules.
- `addPicture`: `readPicture` (a header read only) and `fits` run before the hash, the parse and any write. The picture and the index and map writes go in one `commitWrites`. A refusal writes nothing.
- `loadLayer`: the read, the sniff, the size check and the decode are in one `try`; an oversize file is named without a decode; `bmp.close()` is in `finally`; a null blob or no `art` gives the missing line. No empty catch: each catch returns a named line (Law 12).
- `board.scene()`: one `assets` object while the units' sprite list is unchanged; `bare()` resets it.
- `store.ts`: `writeBytes` on both stores and a byte-safe rename fallback; `commitWrites` takes text or bytes.
- `home.ts`: `saveStage()` runs before each background write; `dropUndo()` after a successful add or remove; Duplicate copies `assets/` in the same commit; `resumeNotes` is gone and Continue re-reads the slot at the current rev (guide Rule 11).
- `hud.ts`: `#noteX` closes the note and keeps it closed for the same text.

## Non-blockers (no rework)
1. HANDBACK L64 and L93 say `/workspace/share/s8/s8-audit.mjs` is not on disk. It is on the shared box; the builder's sandbox just didn't have it. QA ran it: AUDIT PASS.
2. The HANDBACK PR line was written before the PR existed (CoS noted this).
3. `makerStore.writeBytes` doesn't abort the writable if the write throws. `commitWrites` still removes the temp file and names the failure, so nothing is lost. A carry, not a fix now.
4. The upload handler reads the whole file into memory (`arrayBuffer`) before the size check. That is a read, not a decode, so the guide's "no decode, hash or write before the checks" holds. A carry for the phone memory budget if huge files ever matter.
5. Shipped 354 is above the trial's 304 (tests 98 vs 82, smoke 67 vs 57). Every cap holds.

## Next
- Postmerge on CoS's merge sha: `bash /workspace/cos-tools/qa-postmerge.sh <merge> d0c537e5`, floor 1141.
- Then the 9c handback, based on the 9b merge, floor 1142.
