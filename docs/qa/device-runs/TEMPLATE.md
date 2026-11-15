# Phone test log (copy this file for each phone and each run, named `YYYY-MM-DD-<phone>.md`)

**Before you start (once).** The computer needs Node. To check, open a terminal (Mac: press Cmd+Space, type Terminal, press Enter. Windows: press the Windows key, type PowerShell, press Enter), type `node -v` and press Enter. You need version v22.18 or newer: `v22.18.0`, `v23.5.0` or `v24.11.0` are all fine. If it says "not found", or shows a lower number such as `v20.11.0` or `v22.17.1`, ask for Node to be installed or updated first.

**How to run it.**
1. Put the computer and the phone on the same Wi-Fi.
2. Open a terminal in the engine folder. Mac: open Terminal, type `cd ` (with a space after it), drag the engine folder from Finder into the Terminal window, and press Enter. Windows: open the folder, click the address bar, type `powershell` and press Enter.
3. Type `node tools/serve.ts` and press Enter. If the computer asks whether to allow incoming connections, choose Allow.
   - A line that mentions "ExperimentalWarning" may appear. That is normal; you can ignore it.
   - If it says "EADDRINUSE", the page is already running somewhere else on this computer (the port is in use). Close the other terminal window that is running the page (or restart the computer), then type the command again.
4. It prints a link that starts with `http://` and ends with `/tools/device-page/`. Type that exact link into the phone's browser. (If it prints more than one, try the first; if it does not open, try the next.) Leave the terminal open. Press Ctrl+C there when you are done.
5. Hold the phone upright and do not touch the screen. When the page says TURN THE PHONE SIDEWAYS NOW (about 40 s in), turn it.
6. At 60 s the box at the top left says DONE. Copy its numbers into the table, or take a screenshot of it.
7. Tap "pixel check" once. The box should then say "pixels PASS".

**Setting up each row.** The buttons are under the numbers in the box at the top left.
- "60 fps cap: off / on": tap it to switch. Tapping it starts the 60 s run again.
- "lite: auto / off / on": each tap moves to the next mode (auto → off → on → auto). Tap until it shows the mode in the row.
- "run again": starts a new 60 s run with the same settings.
Set both buttons first, then tap "run again" if the run already started, and wait for DONE.

- Date and time:
- Phone (make and model):
- System version (Android or iOS) and browser:
- Battery saver / Low Power Mode on? (yes / no)

| Run | 60 fps cap | lite | p50 ms | p95 ms | max ms | dropped (>25 ms) | over 50 ms | frames | canvas MB | pixel check | lite ON at the end? | switches |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 fresh start | off | auto | | | | | | | | | | |
| 2 fresh start | on | auto | | | | | | | | | | |
| 3 fresh start | off | off | | | | | | | | | | |
| 4 warm phone: tap "run again" each time DONE shows, for 10 minutes; write down the last run | off | auto | | | | | | | | | | |
| 5 Low Power Mode on (iPhone) | off | auto | | | | | | | | | | |

**What good looks like** (QA's budgets; numbers marked [E] are estimates that this log checks):
- p95 at or under 16.7 ms with the 60 cap. The renderer's own share should stay at or under 4 ms [E].
- Dropped frames at or under 1 % of all frames, and no frame over 50 ms [E].
- Row 4's p95 at most 1.25 times row 1's p95 [E].
- Canvas MB at or under 160 [E].
- In Low Power Mode, 30 fps is expected. The picture must still be correct.

**Questions.**
- Did lite turn on by itself? At what second? Did it turn off again?
- After lite turned off, did it come back soon? Each time it turns off, it waits twice as long before it may turn off again: 10 s, then 20 s, then 40 s, up to 5 minutes. It never goes back to shorter waits until you reload the page. Did that feel right, or did it stay on too long?
- Did anything look wrong? For example: blurry or soft pixels, bars at the edges in a different colour from the background, stutter when you turned the phone, or flicker.
- Screenshots (file names):
- Anything else:
