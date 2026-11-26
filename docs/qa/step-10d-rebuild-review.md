# QA review: step 10d postmerge and rebuild record

QA & Build Guard, 2026-11-26.

## Postmerge: PASS
`bash /workspace/cos-tools/qa-postmerge.sh a8f2e2fd8e059df3f35dc53f5b51397a0476aaa7 07f12d8d878c7af6ce62be321728ec578e0afc39`:
- Tree `ed4a2bf3ee9007ccea3749005ae4425d4995ac5b` (as predicted); parents `de22e8af` and `07f12d8d`; parent2 = picked tip; noreply author and committer.
- src/tests/tools diff merge-base..tip equals parent1..merge; merge vs tip has nothing else; pins 5/5 unchanged.
- npm green exit 0, **1160 pass, 0 fail**; smokes 0 failed.
- `RESULT PASS merge a8f2e2fd (1 warning)`. The warning is main moving by one commit (`beda5948`, the QA r1 review doc only).

## Rebuild record: QA OK
Drafts under `/workspace/share/step-10d-rebuild/`:
- `docs/rebuild/step-10d.md` sha256 `9c342eabb06ac45dfef8c515d11bff98132ce604e587badf09a91c34936c9b9a`, 655 lines.
- `docs/rebuild/README.md` sha256 `b8464e979b907c6ba7667d54ccf9631e7a9c98248a964e5aad6435b27c7c55e4`, 74 lines.

Checks:
- Appendix: 10 blocks, **0 mismatches**. Each of the 6 edited-file diff blocks equals `git diff -U3 de22e8af a8f2e2fd -- <file>`; each of the 4 new files is reproduced in full as at `a8f2e2fd`.
- Blob table: all 10 blob ids and line counts match `a8f2e2fd`. Every sha256 in § (b) matches the file at the merge.
- `git diff a8f2e2fd origin/main` is only `docs/qa/step-10d-r1-review.md` (so § (f)'s product-equality claim holds).
- README differs from main only by the new row 29.
- Helpers `f5e7a87d`, `be284aae`, `a9e95058` and the three `/tmp` scripts are recorded. Attribution: rulings are labelled EA or DSK; "CEO" appears only in the republish rule (the CEO's own typed OK). No CEO ruling invented.
- QA1 notes 1–4 are carried accurately.

Wording nits (fold in with the postmerge line; not blocking):
1. Fold the postmerge result above into the three "QA postmerge is not in at the time of this draft" lines (L5, L16 and § (d)).
2. § (c) and § (f) say "Smokes under google-chrome". The builder's runs used chrome-headless-shell (HB § Smoke); the CoS and QA runs used `/opt/google/chrome/chrome`. Say that, or drop the browser name.
