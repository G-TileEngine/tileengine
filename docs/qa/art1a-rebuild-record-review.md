# QA review: ART1a rebuild record and README row 36

Date: 2026-11-27 22:30 GMT. Reviewer: QA & Build Guard.

Verdict: OK TO PUSH on the C1-fixed record /workspace/share/art1a-record/out-c1fix/step-art1a.md cc9815eb891dfb12cf323480f6b4dd75048a7989779ce0a12240834a3ba4dfcd (682 lines; vs d539255e only L7, L12, L13, L206, L208 change, line numbers only; appendix byte-identical), with README ce90c751.

Inputs: /workspace/share/art1a-record/docs/rebuild/step-art1a.md d539255e6e847558a523bcc9124dd98fe78a91a161b6f2feac3153e323719329 (682 lines); README.md ce90c75142cf4ad1df7686c83a90eb4c929b55441c5435aa663c3a7b67e6f61c (81 lines).

Checked against merge 5e668961 and main 8791cecc:
- Appendix 9/9 byte-equal to git show / git diff (own parse). Blob table from git. Numstat 398, shortstat "9 files changed, 398 insertions(+)".
- README: only change from main f2cebe56 is row 36 at L51.
- Times: dad319a0 21:55, 6ed39a8e 22:09, 5e668961 22:14, 8791cecc 22:15 (git, UTC = London).
- Rebuild-check commands run on 5e668961: fence rg empty, src has no art-bake, kit SHA256SUMS all OK, palette.json equals the kit copy (ddf7456b), ref-palette.py "38 ramps", HB2 sha 8dcdf720.
- law-12 lines: sprite.ts L55/L71 at ee6989cd, L59/L75 at 5e668961 (verified).
- Guide L174 still says 2-8; QK2 withdrawal and UX/DSK palette contract recorded correctly.
- Attribution: art-style.md L3-L7 match (20:14/20:16 via CoS; build-now is CoS's recommendation; M3 card void). Rule 8 credit and V1's five-of-six note accurate. QA postmerge cited as chat, not repo.

C1 (fix, wording): the record says product line cites are at the merge, but four plan cites use the fea3098b numbering. On 5e668961 the plan's order line is L85 (not L82), (f) 5 is L113 (not L109) and "Still open" is L117 (not L113); the order line moved +3 and the (f) lines +4 (CoS caught QA's first count, L112/L116):
- L7 "order L82" -> "order L85".
- L12 "plan L109" -> "plan L113".
- L13 and L208 "plan L113" -> "plan L117".
- L206 "the L82 order" -> "the L85 order".
L9 is fine as is (it names fea3098b).

QA addendum to its own pushed doc art1a-plan-delta-review.md (6a6b1acd), not edited: its "L82" (order) and "L109, L113" use the fea3098b numbering; on 97cbf0ba / main they are L85, L113 and L117.
