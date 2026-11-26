# QA review: step 11a2 r2 guide (ready and error sheets)

2026-11-26, QA & Build Guard. The one rework round after the r1 review (`step-11a2-guide-review.md`, NOT OK TO SEND).

**Verdict: OK TO SEND** once 11a merges and CoS fills `<11A MERGE SHA>` and `<11A COUNT>`.

## Kit checked (sha256)
- Guide `step-11a2-ready-sheet.md` 176cc2bc6b9e072beb0a16245f2a3ddb98a2e96b478405bd692894d900e7c9c0 (120 lines)
- Paste `step-11a2-paste.md` c762020b8436dd5326d9dd3ee244881c60bc0528cdb9d80d8d9a614c1367d13e (token, base and count placeholders only)
- Trial patch `s11a2-trial.patch` 0ee52a179dd84c6b747cc2e14385d4b6227e69941c6a4e0e89ad50fb7760fee7
- Unchanged and re-checked: 11a guide d44951f2; 11b guide 8f1b3976, paste a7250cc9, patch a22122d5.

## Re-trial (fresh: 90c9cb9f plus the 11a r2 trial, committed)
- Count 121/400 (5 files, +109 −12). Green 1167 pass, 0 fail. tsc: the 3 base errors only.
- All 23 smokes pass solo (s11a2 8822 r1, now 6 ok). Export audit 135 / 149 / 149, AUDIT PASS.
- 11b r2 re-applied on top: green 1170, 0 fail, all 24 smokes pass, audit PASS.

## r1 findings, checked
- Must-fix (Law 12): `shareBuild` now returns only on an `AbortError`; any other rejection opens the error sheet with its reason. Smoke step 3 covers both at 390 and 360. My own mutation (every rejection ignored) fails step 3 at both widths. Fixed.
- Carry (Law 13): `builtFile` is cleared on Done. Kept.
- Carry: `built` and `builtFile` reset when a project opens. Kept. EA ruling 6 is right that no test can see either today (the scrim and the `go` queue block the path), so M26/M27 surviving is accepted, not a finding.

## Carry (not blocking)
- 11b's Measured line still names the 11a2 r1 trial commit 93bd404c. That's fine for the guide; the 11b handback's own trial line must name the real 11a2 merge.
