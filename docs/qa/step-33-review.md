# Step 33 review (effects sync, part 33a), QA & Build Guard

## r1 (2026-11-13, first kit on guide-3)

**Verdict: NOT OK TO SEND as kitted. OK TO SEND once the qfix shipped test below replaces the kit's shipped test, with its sha256 updated in the step file.** The proto is clean. The kit's shipped test misses 15 of QA's rule plants, so under the new G1 every build would fail QA, through no fault of the builder.

Workspace: `/workspace/tileengine-repo/qa-runs/step-33-review/`. All EA inputs were copied into `ea/`, `kit/` and `kit-host/` first. /tmp, scratch-ea and share were not modified. The one new ref is `refs/cmp/s33-proto-r1` = `bfdbdb43`.

### 1. Proto (r33 `bfdbdb43`, tree `673157ea`, on main `6f62eb1`)
| Check | Result |
|---|---|
| Bundle `a1839411`, verify, head/tree/base | match |
| `tsc --noEmit` | 0 |
| `node --test` serial ×2 | 597/0, 597/0 |
| `npm run green` | exit 0 |
| Pins: core-types `61fad786`, package.json `1e5dd82c`, depcruise `45a3dbaa`, check-law `4d7bbf48`, lock `d7f64a09` | unchanged |
| Sims and smoke lines vs base `6f62eb1` | identical (the heap line is excluded as noise) |
| Size | 257 (+240/−17), 6 files |
| Caps | fx-player 107/111, types 32/36, draw-list 65/69, index 14/18, fx/order/read 114/118, fx-player.test 111/115 |
| merge-tree onto origin/main | `673157ea`, clean |
| Scope | the 6 listed files only. Pure render core: fx-player imports only `./camera`, `./draw-list`, `./frames`, `./types`. Nothing from 33b. |
| Law 13 | no cache or memo in the new code. Churn probe: about 27 KiB per 100k frames, about 5 µs per frame. |
| G4 interfaces | the step file's quotes are byte-equal to the code after whitespace normalisation |

### 2. Plants
- EA's `s33-plants-r1.py` (`848f19f9`): 51/51 caught on rerun, all fail on the base. This matches EA's result.
- QA plants `tools/qa33-plants.py` (`fd503fbe`): 36 plants covering rulings 1–17 and the done-means lines.
  - Against the shipped test: **19/34** rule plants caught (log `186bd71f`). Two plants are excluded from that count:
    - Q29 (glow add) is caught by the step-31 render tests.
    - Q33 is a NaN baseline probe; see N-1.
  - Overall catch rate:
    - proto: **70/85**;
    - with the qfix: **85/85** (QA log `06533217`; EA plants on the qfix test: 51/51, log `38fe8bc6`).

**F-1 (must-fix in the kit, G1): the shipped test misses these plants.**
- Repro: `python3 tools/qa33-plants.py` in a clone of the proto.
- Missed plants:
  - Q1: a negative frame is kept (r1)
  - Q2: a 16-char name is skipped (r1)
  - Q7: y = fh counts as inside the frame (r3)
  - Q8: a negative x is accepted (r3)
  - Q9: a non-integer y is accepted (r3)
  - Q11: the centre uses ceil on an odd box (r5)
  - Q16: the loop laps from 0, not from `from` (r8)
  - Q19: a missing unit doesn't fall back to its step-start place (r11)
  - Q20: the step window start is not inclusive (r11)
  - Q23: front-unit with no unit plays as ground (r13)
  - Q25: fxBehind is ranked as object (r14)
  - Q27 and Q28: BANDS order (r15)
  - Q30: lit `"none"` is treated as scene light (r16)
  - Q31: the strip message drops assetId (r17)

**qfix: shipped test only.** Clone `qfix/`, branch `s33-qfix-r1`.
- Commit `e3439c1f9eb7fa9378f758d7226c206158f46002`, tree `73e8d5fd`, parent `bfdbdb43`.
- Patch `s33-qfix-r1.patch` sha256 `c8486b3a`.
- merge-tree onto origin/main = `73e8d5fd` (clean).
- New `tests/runtime/render/fx-player.test.ts`: 113/115 lines, sha256 `33ce473acf8c6ba32eeb2b2ef947d02170c8a354ca5fb6b90d3f9c006e31c7d4`.
- Step total 259 (+242/−17).
- tsc 0; green exit 0, 597/0; smokes identical.
- No titles changed, so the 11 pinned titles still hold.
- Kit edits needed:
  - the step file Tests row sha;
  - `handoff/steps/tests/step-33…/` copy;
  - the Size table (111 → 113);
  - `r1-kit-sha256.txt`.

**Behaviour notes (no ruling covers these; EA/DSK should decide):**
- **N-1, NaN clock draws.** `placeStep(..., NaN)` returns a drawable step (overlay, frame 3).
  - Suggested guard: `if (!(tMs >= start && tMs < start + p.ms) || …)`.
  - Otherwise, name a host carry: "the host passes a finite clock".
- **N-2, crossed() is unbounded (law-13-adjacent).** `crossed([], 0, 1e7, {from: 0, lapMs: 1})` returns 1e7 events, taking about 2.2 s and 1.2 GB.
  - Suggest at most one fx:loop per call, or an event cap.
  - At the least, add a host carry: clamp the window after a resume or tab sleep.
- **N-3, negative effectMs.** `viewHitMs(1000, 1200, -50)` = 950, which is before the commit. Clamp effectMs ≥ 0.
- **N-4, NaN frame count.** `clipEvents(x, NaN)` gives frame-null events. Minor.

### 3. Kit
- The shipped test is byte-identical to the proto test (`r1-kit-sha256.txt`; all 15 files verified).
- Rulings: all 25 are present with exact values. Rulings 1–17 are pinned, and the 11 quoted pin titles equal the test titles.
- 33a/33b split: as EA says.
- Size/caps line matches guide-3 §7.
- HAND-BACK row 7 asks for the shipped-test sha256s.
- README, spine and CN-014/015/016 citations and shas match.
- No doc/code drift.

**Host-step revision (CEO 21:06):** step-33 `5a34d386`→`265d481a`, README `ea9f456a`→`a8c28c72`, spine `6f9fe9da`→`a491c216`. The diff is ordering text only:
- step lines 20 and 41;
- the carries line naming the host step;
- open Q4 marked answered;
- the README and spine Next lines.

There are no ruling, interface, cap or test changes. Leftovers to fix:
- **K-1:** README line 3 still says "Part 33b (…) is next".
- **K-2:** step line 9 still says CN-015 is "33b, next".
- **K-3, host carries incomplete.** The host-step line names only:
  - the host loader for CN-012/013;
  - the same foamPx;
  - the chunked shore bake.

  Four s32 host carries are not named anywhere:
  - motion warns once per asset;
  - a finite motionCell clock;
  - the dig-window check;
  - the live canopy cut.

  They were already missing before the revision, so they weren't dropped by it, but they need naming for the host step. Add N-1 and N-2's host side there too.

### 4. Guide half (guide-3, `BUILD_GUIDE.md` `86963ce1`, CN-016 `d61ec5d0`)
- **Single copy:** OK in the repo. The root file is the only copy, and `handoff/BUILD_GUIDE.md` (`bf6e9ef2`) is a correct one-line pointer.
  - Nit: a stale kit-1 copy sits at `/workspace/tileengine/docs/grok-build-kit/BUILD_GUIDE.md` (`13ad9836`, outside the repo). Archive it or mark it.
- **Edit 1 (shipped tests, §8 and the STEP-TEMPLATE Tests section):** matches in substance. The guide says "must-fix" for a failing shipped test but never says REJECT for a weakened one. The approved text had "REJECT unless 'Existing tests changed by ruling' names it", while my G1 says "unless the step's rulings name it". This is minor; see the G1 edit below.
- **Edit 3 (law 13):** differs from the approved text.
  - It drops "nothing retained grows with frames or edits". That clause covers non-cache growth such as s31 build A's hits array and N-2.
  - It also drops "state the bound in the Decisions note".
  - Recommendation: restore both clauses.
- **Edit 4 (§7):** paraphrased. "Extend, don't rewrite" is stronger than the approved "do not restructure what the step quotes". Consistent; OK.
- **Edit 5 (§3 render row):** says "only `./<file>.ts` in its own folder", where the approved text was "`./x.ts` and `src/types`". It is stricter and matches render-core.test.ts. OK, but note the difference.
- **Edit 6 (size rule, §7 line 113):** **contradiction.** The guide drops the approved "400–500 needs a reason; > 500 rejected" band and makes 400 a hard stop ("stop and ask"). CN-016 records that change. My G7 still has the band, so the two disagree.
  - The CEO approved edit 6 with the band. Either the CEO confirms the stricter rule (then G7 changes, as below), or the guide restores the band.
- **Edits 7 and 8 (STEP-TEMPLATE sections and housekeeping):** OK.
  - STEP-TEMPLATE has the Rulings, Size table, Shipped tests and Acceptance sha lines.
  - HAND-BACK uses `HANDBACK.md` naming and has the row-7 shipped-test shas.
  - The kit labels are guide-3.

**Proposed checklist edits (not applied):**
- G7: `| G7 | Step size cap | \`git diff --numstat <base>..HEAD -- . ':!handback/' ':!package-lock.json'\` (insertions + deletions; shipped tests copied in count; generated files, test fixtures and the hash-pinned verbatim \`core-types.ts\` excluded) | 150–400 changed lines and every file within its step cap (proto + 4, or the step's stated re-base). Over 400 or over a file cap = must-fix (BUILD_GUIDE §7: stop and ask; never trim a test to fit); under 150 = flag. *(guide-3, CN-016)* |`
- G1, last sentence: "Shipped tests are copied verbatim (sha256 equal to the step file); a changed, weakened, skipped or deleted shipped test is a REJECT unless the step's 'Existing tests changed by ruling' section names it."
- G1 addition: "Before a kit is sent, QA's plants run against the kit's shipped tests; a miss is a kit must-fix."

### 5. DSK open questions
1. **Non-list clip `events` value warns.** Keep the warning. It is consistent with CN-014's "non-array = absent" under clipEventInvalid and with s32's whole-value warns, and a silent ignore hides authoring errors. The test pins it.
2. **fxTooManyFrames detail in Notice.message until CN-E2.** This is acceptable as an interim. The qfix pins the exact strip message text, so it cannot drift. Tools must not parse it. Move the detail to structured fields at CN-E2.

## r2 / kit-2 sha recheck (2026-11-13 21:22 GMT)

**Verdict: OK TO SEND.**
- Proto `r33` = `e3439c1f` (tree `73e8d5fd`), which is exactly my qfix commit; bundle `r33-r2.bundle` 2c681149 heads `r33` at e3439c1f. Diff on 6f62eb1: 6 files, +242/−17 = 259.
- All 15 files in `kit-backup-r33/r2-kit-sha256.txt` match in `/workspace/tileengine` and in the backup. Shipped test 33ce473a = the test in my qfix commit, byte for byte.
- F-1 closed (the shipped test is my qfix). K-1 README fixed; K-2 step lines 9 and 17 fixed; K-3: the host step lists all seven s32 host carries (a–g) plus N-1–N-4.
- Guide restored to the approved wording: law 13 has "nothing retained grows with frames or edits" and "state the bound in the Decisions note"; §7 size band is back (≤400 normal, 400–500 with a written reason, >500 rejected); a weakened, renamed or deleted shipped test is a REJECT and a failing one a must-fix (guide, STEP-TEMPLATE, HAND-BACK).
- DSK Q1/Q2 recorded as settled pending DSK, matching my r1 §5.
- My checklist G1/G7 updated to match guide-3 (band, shipped-test sha rule, kit plant run); new checklist sha below in the message to EA.
