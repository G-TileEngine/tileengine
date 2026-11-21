# QA recheck: rebuild record step-06a r2

- Record: docs/rebuild/step-06a.md r2, 6504 lines, sha256 f168e358…337c, hash-object d73411a2ef5b2c768c0955df5b093c75ac78f714.
- Against: r1 842bef65 and review rebuild-step-06a-review.md (8af30654).
- Verdict: **OK**.

`diff r1 r2` changes only L15, L92 and L184:
1. L15 now reads "QA postmerge: Postmerge PASS (QA): merge 23b5755f, 1093/0, pins 5/5, smoke 0 failed." This matches the qa-postmerge.sh RESULT PASS.
2. L92 add-ability.test.ts is now :94-102, and 23b5755f closes the test at L102.
3. L92 rules.test.ts is now :93-102, and 23b5755f closes the test at L102.
4. L184 drops the UA string. HB:51 names the headless shell only.

No other line changed, so the r1 checks still hold: 44 appendix blocks, stamp 4eb4ed272938, G7 392.
