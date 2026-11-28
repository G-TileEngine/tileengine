# QA kit review: ART1b (step-art1b1-shade-core, step-art1b2-barrel-shadows), EA kit r1

QA & Build Guard, 2026-11-28. Verdict: **HOLD, no verdict yet.** The kit changed under review (box files rewritten 04:59 to 05:01 London), so the version EA announced is no longer the one on the box.

## What was reviewed (the version EA announced)
- Guides 1ee64ecb (ART1b1) and 322843cc (ART1b2); pastes 4f86f208 and 799d4dda; kit SHA256SUMS cdb9c3d4 and a078258a; shipped tests 1e11e946 and 457c0236; palette.json da5ff0ae; trial patches 57ac7045 and 5dba0c5f.
- Trials reproduced on b6a7165a: ART1b1 tree b50b966a (counted 309, limit 321); ART1b2 on top, tree 0d83b302 (counted 164, limit 170). Both match.
- Green: ART1b1 1209/1209, ART1b2 1212/1212, exit 0. tsc: only the 3 base errors (page.ts L101 TS18047, home.ts L156 x2 TS7053).
- Plants: ART1b1 35/35; ART1b2 18/18 plus ART1b1 35/35 on the ART1b2 tree.
- Smokes: 23 SMOKE PASS plus both touch smokes on each tree.
- Port check: QA re-ran ref-art1b1.py and ref-art1b2.py from the frozen ART1a Python (ART1a kit SHA256SUMS OK). Every sha256 they print is pinned in the shipped tests. `bake.ts /tmp/b 32 48` prints the 8 guide lines; manifest hash ef216fc4 equals the ART1b2 pin.
- Real pixels: the 48 px crate, barrel, rock and lantern have 10, 14, 7 and 7 distinct RGBA values and read as real props (sheet looked at by QA).
- Code read in full: blocks.ts, palette.ts, sprite.ts, rock.ts, lantern.ts, barrel.ts, crate.ts, bake.ts. Rule 8: no packed statements; the braceless forms are `return` or a single-statement `for`. Law 12: `PALETTE.bias[m] ?? 0` is Ruling 7's named default (an unlisted material has bias 0), not a silent fallback. No `?? [0, 0, 0]` left. Scope: tools/art-bake and tests/tools only; nothing under src, maker, play-stage or export.
- Findings on that version: none blocking.

## Why HOLD
After EA's hand-off, the box kit was rewritten: guides now f62cc097 and 1390c804, pastes d600f165 and de8cce4c, ART1b1 kit SHA256SUMS 69147c9b, plants-art1b1.py f5401d15, shipped test 0458c848, trial patches 52da2e75 and a6f77067. The top SHA256SUMS (fabbf87b) fails 20 entries and lists 12 verify files that are missing, and PUSH-LIST's hashes no longer match 5 of its files. The new shipped test adds a palette contract: 1 to 9 steps, no repeated colour, strictly lighter by luma, no pure black or white, 38 ramps. So a contract ruling seems to have landed. QA needs a fresh ready message with the new hashes, then re-reviews the changes.
