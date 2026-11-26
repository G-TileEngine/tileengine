# QA review: step 11a2 r1 guide (ready and error sheets)

2026-11-26, QA & Build Guard. One review of the r1 kit.

**Verdict: NOT OK TO SEND.** One must-fix.

## Kit checked (sha256, all match the EA's message)
- Guide `step-11a2-ready-sheet.md` 71373cc5e7af01ade39d8732f704058db967004c2dbca1d89da724f3ea46b469
- Paste `step-11a2-paste.md` e085347c0c7a838e97be676ecb4d0e6a2e6d15ec35bf1dbc2a8ad943c5489869 (token placeholder only)
- Trial patch `s11a2-trial.patch` 3852417e6926200df9f4ec2fe5ff6746b5f8dabc288e40c0a0e0c8461b66d00a

## Re-trial (fresh worktree: 90c9cb9f plus the 11a r2 trial, committed)
- Count 103/400 (5 files, +92 −11). Green 1167 pass, 0 fail. tsc: the 3 base errors only.
- All 23 smokes pass solo (s11a2 8822 r1, 4 ok). Export audit 135 / 149 / 149, AUDIT PASS.
- Sheet text matches UX's words; no "unzip" or "index.html"; Share only when `canShare({ files })` is true; the reason is escaped.

## Must-fix
- **Law 12, empty catch.** Guide step 2 says `navigator.share(...)` "with a rejection ignored", and the trial writes `.catch(() => undefined)`. Only a dismissed share (`AbortError`) is not an error. Any other rejection (for example `NotAllowedError` or `DataError`) must open the **Couldn't build your game** sheet with its reason, or another visible line UX picks. Add a test or smoke step where `share` rejects with a non-Abort error and the sheet shows, and one where an `AbortError` shows nothing.
- Repro: stub `navigator.canShare = () => true` and `navigator.share = () => Promise.reject(new DOMException("x", "NotAllowedError"))`, build, tap Share. Nothing happens and nothing is shown.

## Carries (not blocking)
- `builtFile` keeps the whole zip after Done. Set it to null on `build:done` so memory is freed (Law 13).
- `built` is not reset on Back or when another project opens. If the ready sheet can stay up across that, it would show the old file over another project. Reset `built` and `builtFile` when the project changes.
