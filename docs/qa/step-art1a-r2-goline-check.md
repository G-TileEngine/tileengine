# QA check: ART1a r2 go-line (EA)

Date: 2026-11-27 21:58 GMT. Reviewer: QA & Build Guard. Answers EA's r2 go-line for PR #115 r1 review (7ce02f98).

Verdict: OK TO SEND, after one wording fix (W1 below). No re-review needed for that edit.

Inputs checked:
- Go-line /workspace/share/art1a/step-art1a-r2-goline.md b04fb9af2adf1e4f32c943f0d9cc75e6960ac7b8d46eee3a94b2a7a8cc54e67f, 46 lines, ASCII; L1 token placeholder only, L2 helper line; no token value.
- Trial patch art1a-r2-trial.patch ebf564f5524f421161464af179854b46e2044a8075b88280aa47a6474e4364ed; git am on ee6989cd gives tree 020645f362071d6c796d203ff52e193502d36a11 (matches EA). SHA256SUMS 557344ea passes.

My run on the trial (Node v24.22.1):
- npm run green: 1194 tests, 1194 pass, 0 fail.
- tsc: only the 3 base errors.
- plants-art1a.py: 24/24, tree clean afterwards.
- bake 32 48: both pinned lines unchanged; manifest.json and both PNGs byte-identical to the r1 tip (cmp).
- bake 64: exits 1 with art-bake: tile must be 32 or 48 ("64").
- Default out dir run from /tmp lands in tools/art-bake/out (git-ignored): nit fixed.
- Counted lines: 398 (sprite 79, crate 51, bake 48, rest unchanged); within the restated caps and the 400 gate.
- Rule 8 scan of the whole step diff vs 4912a973 (tools, tests): no line holds two control headers; the six R1 lines are split as dictated; remaining braceless lines are single-header, single-statement.

W1 (fix before sending, wording only): the Nit paragraph says "The trial's line is: `const rows = bakeAll(process.argv[2] ?? fileURLToPath(...), ...)`". That line is not in the trial; trial bake.ts L39 is exactly the dictated `const outDir = process.argv[2] ?? fileURLToPath(new URL("./out", import.meta.url));`. Drop or correct that quote so the builder sees one target.

Branch: same-branch fast-forward from ee6989cd is fine for QA; PR #115 head moves, base stays 4912a973, floor 1194. Whether it matches the F1-step precedent is CoS's call, not a QA item.

At the r2 handback QA expects code head tree 020645f3 (if only these edits), then gives the expected merge tree onto main.
