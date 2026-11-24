# QA recheck: rebuild record step-08a

Fixed draft: /workspace/share/rb8a/docs/rebuild/step-08a.md, sha256 15befb26, 1316 lines. README.md is unchanged at sha256 91f8aca4. The first review is docs/qa/step-08a-rebuild-review.md (098543f1).

Verdict: **OK TO PUSH.**

- L143–145 now read "At 10ca0b0a (current main, which also adds the r2 review) against 9f7f7e52". L235–236 now read "At 10ca0b0a (current main) against 9f7f7e52". Both match `git diff --shortstat 9f7f7e52..10ca0b0a`, which gives 31 files, +408/-62.
- No "Against 10ca0b0a" is left anywhere in the file.
- I reran the content checks. All 30 appendix blocks and all 30 blob rows still match a0c1dad2.
