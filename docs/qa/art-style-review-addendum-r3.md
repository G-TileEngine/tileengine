# QA addendum: art-style.md r3 delta check

Date: 2026-11-27. This adds to docs/qa/art-style-review.md (0641f886).
Draft r3: /workspace/share/maker-look/art0/art-style.md, sha256 8f62dd2845df41e406f8fdfc7224075e8eef1cdb5a911649f66d585f9475fb94, 78 lines. r2 is kept as art-style.r2-0674d1ea.md (0674d1ea).

**Verdict: OK TO PUSH** as docs/maker/art-style.md.

The diff against 0674d1ea has five hunks, and they are only these:
1. **L4–L6:** style, build-now and method are now separate lines. Building now is labelled as CoS's recommendation and not yet a CEO ruling. The method carries the CEO's "Yes". This fixes 2.
2. **L12:** 30 sprites, which is 26 props plus 4 units, matching the manifest. This fixes 3.
3. **L16:** F3a moves the map and Test to 32 px from `map.tile`, and F3b only brings the pack in. This matches plan L76, L77 and L123, and fixes 1.
4. **L38:** names the six §6.2.5 keys, and says ART1a and DSK set the mapping. This covers carry 2.
5. **L57:** multiply in `Blend` is a format change for DSK. This covers carry 3.

**Carries still open, for CoS:**
- Plan (f) 5 at L109 and the ART1a sizing at L73 and L147–L150 need updating once this lands.
- The ART1a kit must carry the Python recipes and the checkpoint bytes.
- The CEO hasn't yet confirmed "build now, swap later".
