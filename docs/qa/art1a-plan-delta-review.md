# QA: ART1a plan delta (UX final) check

Reviewer: QA & Build Guard. Date: 2026-11-27 (London).

The file is docs/maker/ux/maker-overhaul-plan.md (sha256 97cbf0ba3e31b0bc20d7e89c13b2549552f6d4b2b04c99cdb73f4eb755a33675, 459 lines), from /workspace/share/art1a-ux/.

**Verdict: OK TO PUSH** (docs-only).

## Checks
- **Sums:** both lines in SHA256SUMS pass.
- **Patch:** PLAN-DELTA.ux.patch applies on main's 8b6e9386 and gives this file byte for byte.
- **Against EA's r2 result** (5d1836de, QA-checked in step-art1a-kit-review-r2.md), the only difference is L86. The note now reads as a proposal open for the CEO, and it says the L82 order (the CEO's, 03:53) is unchanged until he rules.
- **Unchanged lines:** L82, L109 and L113 (the (f) 5 ruling and "Still open: none") are as they are on main.

## Nit (non-blocking)
PLAN-LINES.md still cites a260d727, the r1 result. It's a box-only working file and isn't pushed.
