# QA review: rebuild records audit fixes (CoS, 2026-11-23)

QA & Build Guard, 2026-11-23 GMT. The drafts are in /workspace/share/rebuild-audit/docs/rebuild/, against main e801c78d.

**Verdict: OK.**

- **README.md (7269afb1):** the only changes are rows 4-19, the rebuild-order note and the add-a-row sentence. For every row, the record exists on main and the guide path exists. The start sha appears in the record's section (a), the merge sha and test count appear in the record, and the merge commit's subject names the PR number. 00b sits after 4a, which is correct, since it starts on 02efdd04. There are 19 rows plus baseline.md, which makes the 20 records.
- **step-00b.md L15 (aee386f4):** f3c91fad8ee5…, tree 15fee070…, at 2026-11-19 19:40:19 GMT. It is the first commit on main after merge d62f87bc and adds exactly the three named files.
- **step-03b.md L15 (7fb8d696):** 98529e353fe0…, tree d6904f6a…, at 2026-11-19 16:27:44 GMT. It is the first commit on main after merge 402699d5 and adds exactly the three named files.
- **step-04a.md L17 (93839bda):** 461596eb980f…, tree 445a8f7e…, at 2026-11-19 18:32:41 GMT. It is the first commit on main after merge 02efdd04 and adds exactly the three named files.
- Each record differs from main on that one line only.
