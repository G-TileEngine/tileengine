# Phone test log: Red Magic 9 Pro (high end), polish run-down, 01:24–01:29

Build: live gh-pages `72b17bec` device page https://g-tileengine.github.io/tileengine/device-page/ from main `d982155b6cf266f6f0f79da813452312dfd45e11`. Served files match push list `aae56023` 33/33, checked by QA at 01:21 London. Run by RaiKynn. Numbers are as relayed by Chief Of Staff from his DONE-box screenshots (429aa2e3, fb3d1ef8, 8569f750 in CoS attachments); QA could not open the screenshots.

- Date and time: 2026-11-16, 01:24–01:29 London
- Browser: in-app browser (version not stated); phone in 120 Hz mode; wifi; charging; battery about 73–75 %; battery saver not stated
- The page received 60 Hz frames (p50 16.6) despite 120 Hz mode, likely the in-app browser, so 120 Hz was not tested

| Run | 60 fps cap | lite | p50 ms | p95 ms | max ms | dropped (>25 ms) | over 50 ms | frames | canvas MB | pixel check | lite ON at end? | switches |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 defaults (01:24) | off | auto | 16.6 | 17.5 | 29.2 | 2 | 0 | 3623 (draws 3624) | 12.0 | PASS | no | 0 |
| 2 lite off (01:27) | off | off | 16.6 | 17.6 | 26.1 | 1 | 0 | 3622 (draws 3623) | 12.0 | PASS | no | 0 |
| 3 cap on (01:29) | on | off | 16.6 | 17.5 | 35.9 | 2 | 0 | 3622 (draws 3623) | 12.0 | PASS | no | 0 |

**Verdict: PASS.** All runs meet the G5b budgets at the 60 Hz the browser delivered: p95 ≤ 18.3 ms, dropped ≤ 1 % (worst 2/3622 = 0.06 %), no frame over 50 ms, canvas ≤ 160 MB.

**Notes:**
- For a true 120 Hz read, open the link in Chrome itself (optional).
- Row 4 (10-minute warm) was not part of this run-down.
