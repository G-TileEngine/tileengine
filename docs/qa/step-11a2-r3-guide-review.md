# QA: step 11a2 r3 kit check (guide, paste, trial patch)

2026-11-26, QA & Build Guard. Verdict: **NOT OK TO SEND** (one must-fix, one line).

## Checked
- Hashes match EA's message: guide `26c5d6a6…` (136 lines), paste `985f21fc…` (12 lines), patch `c11f3b20…` (241 lines).
- `git apply` on main `0d8060a3`: clean. Six files, count 141 (126+ 15−), as Measured.
- My own run on that tree: green 1167 pass, 0 fail; tsc only the 3 base errors; 23 smokes; s11a2 on 8822 passes 6/6; audit 135/149/149 PASS.
- s8c failed once in the full run (3 FAIL, "no hero"), then passed solo 2/2. The patch doesn't touch it, so I'm calling it a flake. Noted here in case it comes back.
- Code matches the merged 11a: `building` kept, `built`/`builtFile` on their own lines, `download(file)`, `forgetBuild`/`closeBuild`. The open-project reset is on its own line in `run` (EA ruling 7).
- game.ts carries 1–2 are done: `FILES` has one source and is used, and the dead `??` defaults are gone. Zip bytes are unchanged (11a tests and s11a pass).
- Mutations: I accept M26/M27 surviving by design (ruling 6). I accept M30 as equivalent, because an empty `raw` fails the commit regex and throws the same `Can't build: build.json`.

## Must-fix
1. **Try again stays tappable while it rebuilds, so a double tap downloads twice.** `buildNow` sets `building = "busy"` but leaves `built` alone. The error sheet's scrim keeps covering the screen, and Try again stays live while 11a's Build game button sits disabled underneath. `go` (home.ts L33) queues acts, so a second tap runs a whole second build after the first: a second download and a second ready sheet. A Done tap during the rebuild queues too, and then closes the ready sheet as soon as it opens.
   - Repro: route `build.json` to a 404 and tap Build game, so the error sheet shows. Unroute it and tap Try again twice quickly. You get two `<id>-game.zip` downloads.
   - Fix: `built = null;` on its own line in `buildNow`, before the busy `paint()`. The sheet then closes and the user sees Building….
   - It needs a check that catches its removal. For example, smoke 2 can wait for `[data-sheet="build"]` to be gone, or a disabled Building… button to show, after the Try again tap, and before the download. Count goes 141 to 142, and home.ts stays under its cap of 40.

## Nit (not blocking)
- build-sheet.ts builds `&` as `String.fromCharCode(38)`. That adds reader load. Use a literal `"&"`, or say in a comment why not.

## Carries
- 11b's go-line stays held until 11b r3 (EA: r2's tools/apk/build.ts:115 uses the trial's gameZip signature). I'll check it as one diff against the 11a2 merge.
