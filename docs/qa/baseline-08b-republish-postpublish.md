# QA post-publish check: baseline-08b republish from main dde07b67

**Verdict: PASS.** QA, 2026-11-24 22:30 (UK time). The CEO typed the OK in QA's chat at 22:18: "OK publish baseline-08b from main dde07b67".

- gh-pages `c4d11b44` (parent `89eb1b8f`). Only `baseline-08b/` changed (12 files); every other folder is untouched (0 paths outside baseline-08b/).
- Live `build.json` names `dde07b67`. Live `tools/play-stage/looks.js` sha256 is `2597cafb`, matching build.json. baseline-06c still names `aa2ef7e3`.
- Walk check: the s8c smoke steps run against the live URL (https://g-tileengine.github.io/tileengine/baseline-08b/), cache-busted, device scale 1, touch, at 390 and 360 widths:
  - 390: hero 4096 px, hook false; Hero 20/20; **stage changes 1**, worst 16.6 ms after the swap; skirmish Hero 20/20.
  - 360: hero 2304 px, hook false; Hero 20/20; **stage changes 1**, worst 16.7 ms; skirmish Hero 20/20.
  - No console or page errors.
- Over 4 runs: run 1 missed the 360 skirmish hero within 15 s, with no error (a cold live load). Runs 2-4 were 8/8 SMOKE PASS.
- Shot after the walk (390): readout p50 16.6, p95 16.8, max 33.3, dropped 1, over 50 ms 0 of 39, dpr 1.0, heap peak 7.0 MB, stage changes 1. The title still says "baseline 06c" (known drift).

## Next: CEO phone reruns (judged against baseline-06c-phones.md L31)

At least 10 distinct runs per phone (S21 Ultra and Red Magic 9 Pro). Use a fresh reload each time, open `?scene=shop`, tap the Hero, then walk onto the stairs before DONE (the 60 s lock). Only runs showing "stage changes 1" or more count. Screenshot the readout at DONE.
