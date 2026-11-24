# Phone check: baseline-08b/ (8c stair walk)

QA & Build Guard, 2026-11-24 (UK time). Compared against docs/qa/baseline-06c-phones.md L31.

**Verdict: PASS for the stair walk, with a minor L31 regression noted (1 dropped frame in 4 of the 20 runs). Not a blocker.**

- **Build:** live https://g-tileengine.github.io/tileengine/baseline-08b/?scene=shop, gh-pages c4d11b44, built from main dde07b67. The post-publish check passed: docs/qa/baseline-08b-republish-postpublish.md.
- **Run:** the CEO, 2026-11-24, 22:32 to 22:45 UK time, 10 runs per phone. Each run used a fresh reload, tapped the Hero, then walked one square right onto the stairs (link c1,r4) before DONE.
- **Source:** the CEO's DONE screenshots, transcribed by CoS (QA has not seen them). No device IMEI or serial is recorded.
- **Not counted:** one Red Magic run at 22:29, made before the directions were given (stage changes 0).

| Readout (10 runs each) | S21 Ultra | Red Magic 9 Pro | 06c reference (S21 / RM) |
|---|---|---|---|
| stage changes | 1 in all 10 | 1 in all 10 | n/a |
| p50 | 16.7 | 16.5-16.6 | 16.7 / 16.5 |
| p95 | 16.7 | 16.6 | 16.7 / 16.6 |
| max | 16.9-33.4 | 16.7, one 33.0 | 24.9 / 16.7 |
| dropped (>25 ms) | 1 in 3 runs (22:37, 22:38, 22:45) | 1 in 1 run (22:41) | 0 / 0 |
| over 50 ms | 0 | 0 | 0 / 0 |
| worst in 3 frames after swap | 16.7-25.1 | 16.6 | n/a |
| frames | 3604-3607 | 3624-3625 | 3601 / 3625 |
| canvas MB, dpr | 6.3, 2.8 | 7.1, 3.0 | same |
| heap MB peak | 9.5 | 9.5 | 9.5 / 9.5 |

## Reading it

- The stair walk works on both phones: 20 out of 20 runs changed stage.
- p95 holds the 60 Hz budget, no frame went over 50 ms, and the heap peak is flat at 9.5 MB (Law 13 holds). Swap cost is at most one 25 ms frame on the S21 and nothing visible on the Red Magic.
- Under L31, any dropped frame counts as a regression. There were 4 single drops in about 72,400 frames (0.006%); all were 25.1-33.4 ms, and only one (S21 at 22:37) fell in the swap window. The 06c reference was a single run on the skirmish page with no swap, so it is not like-for-like. These drops are recorded, not blocked. If a later step adds load to the swap, check this line again.

## Open findings (not this step)

1. **No stair marker.** The board never draws stage links, so the stair tile looks like the floor on every device. The CEO could not find it without directions. This needs an EA slice that draws a link marker on the board.
2. The readout title still says "baseline 06c" (cosmetic drift).
