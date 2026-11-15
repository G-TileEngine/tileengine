# Phone test log: Red Magic 9 Pro (high end), 16:00–16:03

Build: live gh-pages page https://g-tileengine.github.io/tileengine/device-page/ from commit `9ea3dcaccfd39fdf25fd3120612fd8d73a9d0701` (build.json sha256 `f4380363`), opened from the website link with no computer. Run by RaiKynn; logged by QA from his screenshots (relayed by Chief Of Staff), and every number was read off the screenshots.

- Date and time: 2026-11-15, 16:00–16:03 London
- Phone (make and model): Red Magic 9 Pro (high end)
- System version (Android) and browser: Android 16 (build BQ2A.250705.001-BP2A.250605.031.A3; RedMagic OS 11, build number REDMAGICOS11.0.5MR1_GB, read off RaiKynn's About phone screen; that screenshot is not kept because it shows the IMEI), Chrome 157.0.8103.50. Model NX769J, Snapdragon 8 Gen 3, RAM 16 GB + 3 GB virtual, screen 2480×1116 (from the About phone and About Chrome screenshots, 16:25 London)
- Battery saver on? No (power saving off, confirmed by RaiKynn 16:05 London)

| Run | 60 fps cap | lite | p50 ms | p95 ms | max ms | dropped (>25 ms) | over 50 ms | frames | canvas MB | pixel check | lite ON at the end? | switches |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 fresh start | off | auto | 16.6 | 17.6 | 64.4 | 3 | 1 | 3613 (draws 3614) | 4.0 | see below | no | 0 |
| 2 fresh start | on | auto | not run | | | | | | | | | |
| 3 fresh start | off | off | not run | | | | | | | | | |
| 4 warm phone, 10 min (final DONE 16:23, full Chrome) | off | auto | 16.6 | 18.1 | 29.7 | 4 | 0 | 3622 (draws 3623) | 4.0 | PASS | no | 0 |
| 5 Low Power Mode (iPhone only) | n/a | | | | | | | | | | | |

Pixel check: **pixels PASS**. It was taken on a short re-run (p50 16.5, p95 18.0, max 21.7, 0 dropped, 0 over 50 ms of 105 frames, draws 106, canvas 4.0 MB, lite off, 0 switches), not on the 60 s run.

**Against the budgets (row 1):** Dropped 3 of 3613 = 0.08 %, well under 1 %. **One frame over 50 ms (64.4 ms)**, against the no-frame-over-50 [E] target: a single spike, flagged as a watch item, not a failure. Canvas 4.0 MB, far under 160. Lite stayed off.

**Row 4 against the budgets:** p95 18.1 is 1.03 times row 1's 17.6 (budget 1.25). Max 29.7, no frame over 50 ms, dropped 4 of 3622 = 0.11 %. Canvas stayed 4.0 MB after 10 warm minutes (no growth) and lite never switched on. All met. Row 1's single 64.4 ms spike did not repeat. This settles the light memory question for this phone: no fix needed.

**Notes:** The 60 s run screenshot is landscape, so the turn at about 40 s happened. The status bar shows the display set to 120 Hz, but p50 16.6 ms means the page ran at 60 fps, so the browser held it at 60 Hz. The first screenshot shows a 'phone test' title bar with share and close buttons (an in-app or custom tab), not the full Chrome address bar; the pixel-check screen is full Chrome. Row 4 was run in full Chrome. Rows 2–3 not run yet.

**Screenshots:** `redmagic9pro-run1-done.jpg`, `redmagic9pro-pixelcheck.jpg`, `redmagic9pro-row4-10min-done.jpg`, `redmagic9pro-about-chrome.jpg`, `redmagic9pro-about-phone.jpg` (in `/workspace/share/device-runs-35g5a/`)
