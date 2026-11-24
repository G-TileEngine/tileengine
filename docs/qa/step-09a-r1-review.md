# QA review: step 9a r1 (art backgrounds), PR #99

**Verdict: OK TO MERGE** with `--expect-tree 1fadf9ee3976565a4405abf1d0762b78181610fb`. No must-fix. QA, 2026-11-24 (UK time).

- Branch `step/step-09-art-backgrounds-r1-chatA`. Base `6e9d624f`. Code head `f1fe4d14` (tree `9842ca58`). Tip `f58bae6b`; tip vs code head adds only `handback/step-09-art-backgrounds/r1/HANDBACK.md` (has a "Code head" label; no raw test log, no shots).
- Guide: `step-09-art-backgrounds.md` r2, sha256 `0de2c56f`. CoS verify report `a6ef3e76`.

## My rerun (own worktree at f1fe4d14, real `npm ci`)

| Check | Result |
|---|---|
| Count vs base, excluding handback | 18 files, +261/-28 = **289** (gate 400; trial was 335, same 18 files) |
| `npm run green` | exit 0, **1134/0** (floor 1134) |
| tools tsc | only the 3 base errors (effect-designer page.ts L101, maker home.ts L85 x2) |
| s9 `. 8811 qa` | 12 ok at 390 and 360, SMOKE PASS; waitForFunction only, no waitForTimeout |
| s8 `. 8810 qa step-09-art-backgrounds` | SMOKE PASS; file sha `0de37442`, unedited |
| S0 8797 | TOUCH SMOKE PASS; file sha `d528795e`, unedited |
| Export audit (`s8-audit.mjs`) | AUDIT PASS (132 / 146 / 144 loose filter) |
| Trial merge onto main `acdbf3f1` | `merge-tree` = `1fadf9ee`, clean; shortstat vs main excl. handback = the same 289 |
| Empty catch in touched files | none |

## Mutation checks

- Remove the writeAutosave queue (`lane`) in session.ts: test "autosave: two links in a row write in order, and each write reads the slot once" fails. Restored, passes. The one-slot-read / overlapping-autosave carry is closed.
- Swallow the decode failure in page.ts (`catch { return null; }`): s9 step 6 "won't open" fails at 360. Restored, passes. Law 12 won't-open path is guarded.
- Skip the in-play "missing" note in page.ts: s9 still passes, because step 5 proves the test-gate hard block (`assetFileMissing`, "A picture this project uses is missing: assets/…") before play starts. The in-play branch is a second line of defence with no test of its own (same non-blocker as at guide r2).

## Code read (Law 12, 13, build law)

- page.ts: null `art()` pushes "Background picture missing: <file>" and adds 1 to `stats.failed`; a `createImageBitmap` or context failure pushes "couldn't be opened" and adds 1. Notes join into the HUD note row. `bare()` runs only if a layer drew. One clock: the backdrop rides the existing driver frame; no new rAF.
- store.ts `readBlob`: returns null only on NotFoundError/TypeMismatchError, rethrows the rest. `readTree` skips the top-level `assets/`; `movePrefix` renames assets first.
- backdrop.ts: look data only; depth clamped 0..1, bad repeat becomes `none`, `fit` ignored (documented in the doc comment and HB:139).
- Memory: `misses` grows once per layer; `sheets` holds one canvas per layer.

## Non-blockers

- HANDBACK PR line ("opened by Chief Of Staff from the branch") was written before PR #99 existed.
- page.ts never calls `bmp.close()` after copying to the OffscreenCanvas; the bitmap waits for GC. Small, per layer, once.
- Tight caps: page.ts 16/17, store+test-launch 20/21, read-project 9/10.
- Helper 7a88f154 finding 2 (`board.scene()` new `assets` object each call, so the memo key changes every frame) predates 9a.
- The name `shown` shadowing in page.ts (noted at guide r2).
- Out of scope, as the guide says: benched-member rejoin, walled-off-pocket spill, project.ts L102 null grid, 9b upload work.

## Next

Postmerge on CoS's merge sha with `qa-postmerge.sh <merge> f58bae6b`, then the step-09 rebuild record review. The 8c paste then goes on the 9a merge base, floor 1134 + 1.
