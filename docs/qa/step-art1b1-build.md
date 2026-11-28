# QA review: step ART1b1 shade core r1 (PR #119): MUST-FIX (rework round 1 of 1)

Date: Sat 28 Nov 2026 (Europe/London). Guide 7de44991 r1. Base main 5a371ec7 (tree 89be4c1f). Code head e35dbabb (tree 81beb09a). Tip eed4a89b (tree f2156ad7; adds only handback/step-art1b1-shade-core/r1/). Two commits, G-TileEngine noreply.

## Checked by QA (worktree /tmp/q/p119 at e35dbabb)
- merge-tree onto 5a371ec7 = f2156ad73f3e6da0b1ce3b5bc911c3780104d240 (= tip tree, fast-forward).
- Counted 357 (limit 368, trial 352); 9 files = the guide's Files list; sprite.ts 77+/11- = 88 (on cap).
- Shipped test 0458c848... and palette.json da5ff0ae... byte-identical.
- npm ci && npm run green: 1209 pass / 0 fail, exit 0. tools tsc: only the 3 base errors.
- plants-art1b1.py 38/38 caught; tree clean after.
- bake.ts 32 48: the six pinned RGBA hashes (crate 99ef690d/97047142, rock dbeb8b41/fa49fcaa, lantern bb33ae60/643c5c02).
- The rewrite away from the trial text is accepted as such: guide L192 allows any equivalent layout if the pins and plants hold, and they do.

## Must-fix (law 12, guide L51)
1. sprite.ts L86 `const step = s.step[i] ?? 0;` -> `const step = at(s.step, i);` Guide L51: pixel reads in new code go through at(), which throws. This line brings back the exact `s.step[i] ?? 0` missing-step fallback that this step exists to remove (base L75). The trial used at().
2. sprite.ts L73 `(mix[i] ?? 0)` -> `mix[i]`. New line; mix is an Rgb tuple indexed by 0|1|2, so the default is dead code and a silent default (the trial had none).
3. palette.ts L42 `const hexes = p.ramps[name] ?? [];` -> walk `Object.entries(p.ramps)` (as the trial did) so no default is needed. New code; not one of the ART1a shims L51 lets stay.
All three are one-for-one swaps: counts and caps do not move. After the fix: green >= 1209/0, plants 38/38, the six bake hashes unchanged, no `??` added outside the ART1a shim lines and the Ruling 7 bias line.

## Not must-fix (noted)
- named() order bias then outlineBy: only the first error text differs if both fail. OK.
- roundEven rewritten with braced branches: equivalent for the bake inputs, pinned by the hashes. OK.
