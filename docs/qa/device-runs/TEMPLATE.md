# Phone test log (copy this file for each phone and each run, named `YYYY-MM-DD-<phone>.md`)

**Before you start (once).** The computer needs Node. To check, open a terminal (Mac: press Cmd+Space, type Terminal, press Enter. Windows: press the Windows key, type PowerShell, press Enter), type `node -v` and press Enter. You need v22.18 or newer, and on the 23 line v23.6 or newer: `v22.18.0`, `v23.6.0` or `v24.11.0` are all fine. If it says "not found", or shows a lower number such as `v20.11.0`, `v22.17.1` or `v23.5.0` (v23.5 crashes), ask for Node to be installed or updated first.

**No computer? (Android phone)** Use one of these two ways, then go on at step 5 below.
- **The website link (easiest, once it is published).** Open the link you were sent (it ends in `/device-page/`) in Chrome on the phone you are testing. Nothing to install.
- **Termux (runs the page from a phone).** Once per phone:
  1. Install F-Droid from f-droid.org, then install **Termux** from F-Droid (the Play Store copy is too old).
  2. Open Termux and type `pkg install nodejs git` and press Enter (answer `y` if it asks). Then type `node -v`: it must show v22.18 or newer.
  3. Type `git clone --depth 1 https://github.com/G-TileEngine/tileengine` and press Enter.
  4. In the phone's Settings, open Apps, then Termux, then Battery, and choose Unrestricted (turn battery optimisation off), so the phone does not stop Termux.
  Each time:
  1. Open Termux. Type `cd tileengine` and press Enter, then `termux-wake-lock` and press Enter (it keeps Termux awake).
  2. Type `node tools/serve.ts` and press Enter. It prints a link. A link with `127.0.0.1` opens only on this same phone. The notes under step 3 of "How to run it" below (ExperimentalWarning, a port already used, a Node that is too old) apply here too.
  3. To test this same phone (for example the S21 Ultra): open that link in Chrome on it, and write "served from this phone" in the Run column of every row you fill.
  4. To test another phone: on the phone running Termux, look up its IP address in Settings, Wi-Fi, the network you are on, and open `http://<that address>:<port>/tools/device-page/` on the other phone, where `<port>` is the number after the last `:` in the link Termux printed (usually 8734). If it does not open (some Wi-Fi blocks phones from seeing each other), turn on the Termux phone's hotspot and join it from the other phone. Then find the hotspot address on the other phone: Settings, Wi-Fi, tap the hotspot network, and read Router (or Gateway). Use that address with the same port.
  5. When you are done, go back to Termux and press Ctrl+C (on the Termux keyboard row: CTRL, then C).

**How to run it.**
1. Put the computer and the phone on the same Wi-Fi.
2. Open a terminal in the engine folder. Mac: open Terminal, type `cd ` (with a space after it), drag the engine folder from Finder into the Terminal window, and press Enter. Windows: open the folder, click the address bar, type `powershell` and press Enter.
3. Type `node tools/serve.ts` and press Enter. If the computer asks whether to allow incoming connections, choose Allow.
   - A line that mentions "ExperimentalWarning" may appear. That is normal; you can ignore it.
   - If it says the port "is already used by another program" (or "EADDRINUSE"), some other program is using that port; it may be another copy of this page. Close that program or terminal window (or restart the computer or phone) and try again, or type the other command it suggests, such as `node tools/serve.ts 8735`.
   - If it says "This needs Node v22.18 or newer", or "ERR_UNKNOWN_FILE_EXTENSION", this Node is too old to run the page: install a newer one first (see Before you start).
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
- Android version and browser:
- Power saving on? (yes / no)
- How the page was opened: website link / Termux on this phone (served from this phone) / Termux on another phone / computer
- Termux only: the printed link opened? (yes / no)

| Run | 60 fps cap | lite | p50 ms | p95 ms | max ms | dropped (>25 ms) | over 50 ms | frames | canvas MB | pixel check | lite ON at the end? | switches |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 fresh start | off | auto | | | | | | | | | | |
| 2 fresh start | on | auto | | | | | | | | | | |
| 3 fresh start | off | off | | | | | | | | | | |
| 4 warm phone: tap "run again" each time DONE shows, for 10 minutes; write down the last run | off | auto | | | | | | | | | | |
| 5 Power saving on (Android: Settings, Battery, Power saving) | off | auto | | | | | | | | | | |

**What good looks like** (QA's budgets; numbers marked [E] are estimates that this log checks):
- p95 at or under 1.1 × the screen refresh interval (18.3 ms at 60 Hz) with the 60 cap. Reason: a vsync-locked phone puts p95 just above one interval (S21 Ultra: p50 16.7, p95 17.8), so "at or under 16.7 ms" could never be met. The renderer's own share should stay at or under 4 ms [E].
- Dropped frames at or under 1 % of all frames, and no frame over 50 ms [E].
- Row 4's p95 at most 1.25 times row 1's p95 [E].
- Canvas MB at or under 160 [E] (from step 35g5b it counts the main canvas too).
- With Power saving on, 30 fps is expected. The picture must still be correct.

**Questions.**
- Did lite turn on by itself? At what second? Did it turn off again?
- After lite turned off, did it come back soon? Each time it turns off, it waits twice as long before it may turn off again: 10 s, then 20 s, then 40 s, up to 5 minutes. It never goes back to shorter waits until you reload the page. Did that feel right, or did it stay on too long?
- Did anything look wrong? For example: blurry or soft pixels, bars at the edges in a different colour from the background, stutter when you turned the phone, or flicker.
- Screenshots (file names):
- Anything else:
