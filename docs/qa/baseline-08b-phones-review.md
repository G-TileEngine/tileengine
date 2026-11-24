# QA: baseline-08b stair phone check, S21 Ultra + Red Magic 9 Pro (2026-11-24, 17:33 to 17:54 London)

Verdict: **NOT VALID, rerun needed.** The stair swap was never measured.

Source: CoS transcribed the readouts from the CEO's screenshots. QA did not see the screenshots: the attachment names CoS gave don't match any file in its attachments folder.

## Why it's not valid
- In baseline-08b (from 42cc84b4), "stage changes" is `swaps.length`. `tools/baseline/page.ts` adds 1 to it only inside `travel`, which runs when a unit takes the stair link. Nothing walks the unit for you.
- All 10 runs show stage changes 0. So no stair was taken inside the 60 s window. A walk after DONE doesn't count, because the readout locks at DONE.
- The "worst after swap 0.0" line is therefore the empty default (`reduce` over no swaps), not a measurement.

## Frames, read against baseline-06c-phones.md L31 anyway
- The 06c S21 reference is 0 dropped and a max of 24.9 ms.
- Five of the 10 runs drop frames. At 17:33 there were 2 dropped and 1 over 50 ms (max 91.8). At 17:34, 17:36, 17:50 and 17:54 there was 1 dropped each.
- p95 stays at 16.7 on every run, and the heap peak stays at 9.5, the same as 06c.
- By the letter of L31, this is a regression flag on the shop scene even with no swap. The drops happened without a stage change, so the stairs didn't cause them. 06c had only one run per phone, so the scatter may be normal for the phone. A valid rerun decides it.
- The runs at 17:41 and 17:42 have identical numbers and are likely one run shot twice, so count it once.

## Rerun steps (each run)
1. Open https://g-tileengine.github.io/tileengine/baseline-08b/?scene=shop and fully reload it.
2. Within the first 60 s, before DONE shows, walk a unit onto the stair cell so the stage changes.
3. At DONE, the readout must show stage changes of 1 or more. If not, discard the run.
4. Record the worst-after-swap value and the frame lines. Do at least 10 valid runs on each phone.

## Drift, not blocking
The page title and the readout label still say "baseline 06c" on the 08b build. They are hard-coded in `index.html` and in `tools/baseline/readout.ts` L17. The label should be fixed the next time those files are edited.

## Red Magic 9 Pro (10 shots, same window)
- **Not valid either.** Stage changes is 0 on every shot, so no stair was taken before DONE.
- There are only about 3 distinct runs:
  - 17:33 (max 66.3, 1 dropped and 1 over 50 ms, against the 06c reference of 0 and 16.7);
  - 17:51 and 17:52, which are identical (1 dropped, max 33.1);
  - seven identical shots of a clean run (0/0, max 16.7, 3624 frames).
- The 120 Hz screen with frames near 16.6 ms matches 06c. That run was also on a 120 Hz screen and gave p50 16.5, so this is not a regression.
- The engine has one requestAnimationFrame loop and no frame cap. The 16.6 ms gaps mean the phone's browser delivered frames at 60 Hz.
- The frame budget the baseline compares against is 60 Hz.

## Both phones
NOT VALID, and new distinct runs are needed. Each run must show stage changes of 1 or more at DONE. Take one screenshot per run, and use a fresh reload for every run. Do at least 10 runs per phone.
