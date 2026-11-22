# QA recheck: rebuild record step-06b r2

- Record: docs/rebuild/step-06b.md r2, 1520 lines, sha256 61e9599d…d731, hash-object 85fc8e62cfb2a6751307e5ce1517bbf76db4c8e6.
- Against: r1 31063e4b and review rebuild-step-06b-review.md (8ab4287d).
- Verdict: **OK**.

`diff r1 r2` changes only L13 and L16:
1. L16 now cites (HB:26, V:19, QA:8), and those lines state floor 1093+N=9 and 1102.
2. L13 now reads "s6b ×3 (one under CPU load; V:23, HB:43) … all pass (V:23, QA:8-14)". V:23 records the three s6b runs.

No other line changed, so the r1 checks still hold: 14 appendix sections, stamp ec57342595a1, G7 310.
