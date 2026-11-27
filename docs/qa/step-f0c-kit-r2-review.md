# QA re-check: F0c kit r2 (CN-029 swap + pools gate)

Reviewer: QA & Build Guard. Date: 2026-11-27.
Verdict: **OK TO SEND**, with one text fix before the push (below). No further review round.

## What I checked

- Kit files: `sha256sum -c SHA256SUMS` (SHA256SUMS `17270e72…`) all OK. Guide `eedea9ec…` (165 lines), test `87097007…` (121 lines), plants `39f67d7b…` (34 lines), paste `c1c074ab…`, trial patch `40269c17…`.
- Base: `49db9f47` is docs-only on `b2cb571f` (only `docs/qa/step-f0c-kit-review.md`, +47). It is origin/main.
- Trial: `git am` of the patch on `49db9f47` gives tree `2475f873…`, matching the guide. The test in the tree is byte-identical to the shipped file.
- Size: numstat 187 lines in 12 files (excluding handback and lockfile), matching the Files table and under the 400 cap.
- Green: `npm run green` exit 0, **1180 pass, 0 fail** (floor 1180).
- tsc: only the 3 base errors (`tools/effect-designer/page.ts` L101, `tools/maker/home.ts` L92 twice).
- Smokes: all 25 PASS, solo, unedited, with the same ok counts the guide lists.
- Export audit: 136 / 150 / 150 files, AUDIT PASS.
- Plants: `plants-f0c.py` r2 **13/13 caught** on my own trial tree.
- `rg "picks: 0" tools/play-stage` finds nothing. `PLAY_LIMITS` is read at `tools/play-stage/load.ts` L28, `project.ts` L66 and L113, and defined once at `read-project.ts` L11.

## r1 must-fixes

1. **load.ts engine cap: FIXED.** L28 passes `stageLimits: PLAY_LIMITS`; the test pins it and P9 (widened to 8/16) is caught.
2. **arriveIn L113: ACCEPTED as redundant.** I read `arriveIn`: every path returns `openProject(files, toId)` or passes through `openProject({...files, [path]: stage with new playerSpawns}, toId)`, and only `playerSpawns` changes, so L66 re-reads the same pool with `PLAY_LIMITS`. My own plant widening L113 alone was MISSED by the full suite, as EA predicted: it is an equivalent mutant, not a gap. P10 and P11 cover it together with L66.
3. **Test L60 one-line start: FIXED** (`mock.fn`, callCount 0).
4. **Paste tsc line: FIXED** (all 3 base errors).

Design notes: Ruling 4's project-wide vs per-stage scope line is in; UX's line is confirmed; the "Use a fixed list" (after F6) and 11a2 ready-sheet (11c2) carries are in.

## Rule 8 (EA's question)

Ruling 7 now forbids unbraced `if (…) throw …;` and `if (…) return …;` in new code. **That is my intent**: an unbraced if-body is a body that holds a statement, so it takes its own lines. It applies to new code only. Existing dense lines on main are not rewritten, and the only edits inside them are the ones Files names (here `project.ts` L66 and L113). The trial complies: the new `if`s in src, tools and the test are all braced, and the one unbraced `if` touched is the named L66 edit.

## Fix before the push (text only)

- Guide L112 cites `plants-f0c.py` as sha256 `88ca5665…`. That is the **r1** script (`plants-f0c.py.r1`). The r2 script is `39f67d7b00f6f2b27d1d0e76d8bf6afb52c243b8de0acf5e0cb193a834ab730f`. Fix the hash. I'll check it on the pushed guide; no re-review needed.

## Carries (not blocking)

- 11c1 carries to 11c2 still stand (my 11c1 r2 review § Carries).
