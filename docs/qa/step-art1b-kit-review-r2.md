# QA kit re-review: ART1b, frozen kit (top SHA256SUMS 6d398ae5, 123/123 OK)

QA & Build Guard, 2026-11-28 ~05:50 London. Follows step-art1b-kit-review.md (2fa2f2d0, HOLD). Only what changed since that pass was re-reviewed. The r1 kit is parked at /workspace/share/art1b-r0/.

## Verdicts
- **ART1b1 (step-art1b1-shade-core): OK TO SEND.** No must-fix.
- **ART1b2 (step-art1b2-barrel-shadows): OK TO SEND**, after the ART1b1 merge. No must-fix.

## Checked
- Hashes: guide 7de44991 and paste 4304bf9b (ART1b1); guide 68cd1472 and paste bc81a639 (ART1b2); patches f5619929 and 3b6c6bd4; kit SHA256SUMS 69147c9b and a078258a (both `-c` OK); PUSH-LIST c5ecbef6 (30 rows, all match); VERIFY.md 523499fa. No token in the kit.
- Base: main 8420f4f8. The diff from b6a7165a is docs only: the plan (7 lines) and handoff/dsk-rulings/2026-11-28-art1-palette.md (blob 9999754e).
- Trials reproduced: ART1b1 tree 50f10b56 (counted 352, limit 368); ART1b2 tree 9fcc5c95 (counted 164, limit 170). Compared with r1, the product changes only in palette.ts (+35/−4) and the shipped test (+16/−4) in both trees. Everything else matches r1's reviewed code byte for byte, so the r1 pixel and port findings carry.
- Green 1209/0 (ART1b1) and 1212/0 (ART1b2). tsc shows only the 3 base errors. Plants 38/38; on ART1b2, 18/18 plus 38/38. Smokes: 23 SMOKE PASS on both trees, plus both touch smokes on ART1b2. Tree clean apart from the planted kits.
- palette.ts delta: luma (integer Rec.709, Math.round), rejectPure, then 1–9 steps, no repeat (case-insensitive, checked before luma), strictly increasing luma, and no #000000 or #ffffff in ramps, outline or outlineBy. Every failure throws (law 12). Rule 8 is clean, with braced blocks. The baseline has 38 ramps and passes; QA checked the luma independently, and no ramp has an equal or falling step.

## Flags (not must-fixes)
1. **Strict versus ≥.** DSK P1 (9999754e L9) says each step's luma must be ≥ the one before. The kit enforces strictly greater and attributes it to "UX's strictness" (guide Ruling 3). The guide states the merge openly and the baseline passes both rules. But QA found no file recording UX's strict ruling, in the repo or on the box. Please cite it (path or message time), or have DSK confirm that strict is the rule.
2. **DSK ruling ramp count.** 9999754e L9 says "All 40 ramps", but palette.json da5ff0ae has 38, as the guide and the test (`length === 38`) say. This needs a DSK addendum; it isn't the kit's to fix.
