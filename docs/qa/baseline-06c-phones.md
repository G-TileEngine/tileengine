# Phone baseline: baseline-06c/ (6c checkpoint)

QA & Build Guard, 2026-11-23 GMT. This is the reference that later steps compare against (roadmap L81; step 6 guide L217 and L226).

- **Build:** live https://g-tileengine.github.io/tileengine/baseline-06c/, gh-pages 8d6ea725, built from aa2ef7e3 (build.json sha256 1ff795b2). The post-publish check passed: docs/qa/baseline-06c-postpublish.md.
- **Run:** the CEO, on his two test phones, 2026-11-23, about 13:16 London (GMT).
- **Source:** the CEO's screenshots of the DONE readouts, which he sent in Chief Of Staff's chat. CoS transcribed them, and QA has not seen the screenshots. Device IMEI and serial numbers are deliberately not recorded.

| Readout | Samsung Galaxy S21 Ultra (ordinary) | Red Magic 9 Pro (high end) |
|---|---|---|
| frame ms p50 | 16.7 | 16.5 |
| frame ms p95 | 16.7 | 16.6 |
| frame ms max | 24.9 | 16.7 |
| dropped (>25 ms) | 0 | 0 |
| over 50 ms | 0 | 0 |
| frames (of N) | 3601 | 3625 |
| canvas MB | 6.3 | 7.1 |
| dpr | 2.8 | 3.0 |
| heap MB peak | 9.5 | 9.5 |
| GC | n/a (browsers don't expose it) | n/a |

## Reading it

- Both phones hold the 60 Hz frame budget. p95 is at or below 16.7 ms, and no frame was dropped over 3600+ frames. The S21 Ultra's worst frame (24.9 ms) stays under the 25 ms drop line.
- Canvas MB counts on-screen canvases only, and it scales with dpr and screen size.
- The heap peak is 9.5 MB on both phones. That is the memory reference for Law 13 (bounded memory).
- The desktop-headless numbers in the post-publish doc (dsf 3, about 120 frames) are only a smoke test. They are not part of this baseline.

## How later steps compare

A later checkpoint is run the same way: the same page shape, a DONE readout and both phones. It is compared against this table. A regression is reported if p95 goes above 16.7 ms, if any frame is dropped or goes over 50 ms on either phone, or if the heap peak grows by more than the new content explains. Any cache added under step 6 guide L217 must show a gain against these numbers.
