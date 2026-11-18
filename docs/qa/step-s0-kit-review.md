# QA kit review: s0-play-input r1 (play-stage touch input)

QA & Build Guard, 2026-11-18, Europe/London. Read-only. Kit `/workspace/tileengine/handoff/steps/s0-play-input.md` sha256 `2f66a6a8baebb0a610fd459c7fca13ebad7b6a62973f711f6fa4f71c9639b998` (matches the expected hash). Screen spec `/workspace/share/maker-spec/MS-00-play-input-and-talk.md` sha256 `e4e59a7a4f41b0cb9e30d456786d9c53571f9c557e5d86e0fd5c0795d3b5c2a2` (prefix `e4e59a7a4f41` matches). Base `501057027cc27321b631c40ed3ef7d5552ac792a`. Bug list: `docs/qa/p1-9-touch-play-bugs.md` sha256 `cb6ac3b72d8149ba0de2914327057c20fa6e95549c8356fec563f2cb9af4878a`. No edits to the kit, the spec, `handoff/`, or `/workspace/share`.

## Verdict: NOT OK TO SEND

One must-fix. No pin. The kit is otherwise a tight, buildable fix of TP-1–TP-3 inside `tools/play-stage`, with no `src/` changes, and it fits MS-00 with the R7 deferrals named.

### Must-fix

1. **The specified gate does not run through `page.ts` handlers and does not run at 360.** `tests/tools/touch-play.test.ts` drives `createTouch` with scripted `TouchEv`s on a single box of 1170×1992 dev px at dpr 3 (a 390×664 board, i.e. 390×844 minus the HUD bands). Test 10 only greps `page.ts` for listener names and for the absence of `lastTap` / `centre(`. That will not catch a wiring bug (stale cam, `devicePixelRatio` used where the P1-9 smoke already requires backing-store `k = canvas.width / clientWidth`, pad taken from the wrong fit). Add a CI pass that dispatches real `PointerEvent`s / Playwright touch through the page's handlers, with the camera panned, and assert select / attack / End Turn at **both 390 and 360**. A new kit-run smoke (the P1-9 pattern) or a seventh allowed file is fine; keep the 10 unit tests. Use the backing-store scale, not only `devicePixelRatio`.

### (a) Coverage of TP-1–TP-4

| Bug | Covered? | In the kit |
|---|---|---|
| TP-1 aim / Attack / Talk UI | **Yes** | X1 (in `targeting`, a tap on an `aims` cell becomes `TargetCell`, match layer, so `gestures.ts` can stay unchanged), X2 (`pointer()` must call `feed`, not the `createPlay` `intend` closure — otherwise Talk and `settle()` never run), X6/R1 (one tap commits by sending `TargetCell` twice), X8 (`choose` does not enter targeting with no targets), X10/R5 (Talk panel + Close, replaces `#bubble`) |
| TP-2 second action + post-walk follow | **Yes**, as move-then-act and unit switch | X7/R2 (implicit Wait when tapping another ready unit from `actMenu`; MS-00 §4: two heroes each act). Attack/Talk after a walk stay on `actMenu` and then use X1. A second walk is out of scope (no Undo; MS-00 has no second confirm and no second walk). Post-walk `followId` / `tickCam` is covered by the X4 hit test (`+ cam.x/cam.y`); there is no dedicated "walk, tick the follow camera, then tap" test — test 5 is a pinch+pan instead |
| TP-3 cam in `send()`, pan cancel, End Turn | **Yes**, with a product difference | X4 (`hit()` uses `fitView(..., cam.s)` pad and `+ cam.{x,y}`; pan is `−dx*dpr/cam.s` then `clamp`, called from `touch.ts` so `camera-touch.ts` can stay do-not-touch). X5 (capture, second-finger cancel, `pointercancel` / `lostpointercapture` reset). X3 (drop 280 ms `centre()`, Recentre button). X9/R4 (`endTurn` walks back through legal edges, then ends the side). MS-00 §3: a pan must **not** change mode or selection — so the kit correctly keeps gesture-`cancel` from emitting a `Cancel` intent, and relies on X9 to make End Turn work from `targeting` after a pan |
| TP-4 every AI side, not only wolves | **No** — documented carry | Goal and MS-00 §2 treat "only the wolf bot played" as the symptom of broken player input. Out of scope says "More bots than wolves. That is by design today (`match.ts:14,65`)" and lists `SIDES` under stage 1 data work |

**TP-4 scope flag (not a must-fix of this kit).** The hardcode is `tools/play-stage/match.ts:14` (`SIDES = ["player", "wolves"]`) and the three `side === "wolves"` pumps at `match.ts:65,77,99`. It is **not** under `src/`. The "no `src/` changes" / `gestures.ts` byte-identical rule does **not** block a play-stage fix: `match.ts` is already in the allowed file list (90-line cap). Leaving it out is a scope choice, not a law constraint. On the bundled demo only wolves exist, so this step's APK retest will not reveal other sides. Keep it as a later must-fix (stage 1 / the earlier TOUCH PLAY GATE item), not a silent drop. Related observation from the bug list, also not in this kit: the side-wide `actionsPerTurn = 2` budget let one demo wolf take both actions and left the other still.

### (b) The 10 tests as specified would fail on `50105702`

Mocked read-only against the base worktree `/tmp/q/te-50105702` (script `/tmp/q/s0-gate-on-base.mjs`), using `createMatch().pointer` / `endTurn` / `choose` and a source read of `page.ts` where `createTouch` does not yet exist. **All 10 fail on the base**, which is what we want of a regression gate, with one nuance on test 8.

1. One tap on a reach cell only sets `pending` (phase stays `unitSelected`; knight still at 0,8). FAIL (X6 two-tap confirm).
2. `choose("basic")` then one pointer tap on the wolf: HP stays 4, phase `targeting`, `selected` null, 0 ability log entries. FAIL (TP-1 / X1+X2).
3. Talk via pointer: `talk` stays null, no `closeTalk`. FAIL (TP-1 / X2+X10).
4. After a walk, a pointer tap on the archer: `selected` null, phase still `actMenu`, no `done` set. FAIL (X7).
5. After a clamp-allowed 120 CSS px pan at 2× fit, the kit `hit()` formula lands on the archer (1,8); the base `send()` formula (`(offset*dpr − band.pad)/cam.s`, no `cam.x`, pad from `fit()` not `fitView` at `cam.s`) lands on (0,8), at both 390 and 360. FAIL (TP-3 / X4). **Caveat:** a pan that clamp rejects (cam.x stays 0) leaves both formulae on the same cell — the test must use a direction clamp allows, or "the old maths would have picked a different cell" is vacuous. Flag, not a must-fix.
6. Base `page.ts` has no `setPointerCapture`, no `lostpointercapture`, and `pointercancel` does not reset `drag`. FAIL (X5).
7. Base still has `lastTap` and `centre(`. FAIL (X3).
8. `endTurn()` from **targeting** leaves phase `targeting`, side `player`, `turns` 1. From **actMenu** and **unitSelected** the base already returns to player `idle` after the wolf turn. The test still FAIL overall (X9), but only the targeting case is the new cover.
9. At the demo start, `choose("basic")` returns `null` and enters `targeting` with `aims.length === 0`. FAIL (X8).
10. No `createTouch`, `lastTap` and `centre(` still present, no `lostpointercapture`. FAIL (X3/X5).

The unit harness, once written, would therefore go red on this base for TP-1, TP-2 (unit switch), TP-3 (mapping and End Turn from targeting), and the F2/F4 wedges. It would not, by itself, satisfy the "real pointer events through the page handlers, camera panned, 390 and 360" requirement — that is must-fix 1.

### (c) Build law and MS-00

- **play-stage only.** Allowed files: `touch.ts` (new, 80), `page.ts` (40), `board.ts` (10), `match.ts` (90), `hud.ts` (30), `tests/tools/touch-play.test.ts` (150). Total cap 400 (expect ~330). Do-not-touch includes `src/**`, existing tests, `tools/apk/**`, and `tools/play-stage/{load,looks,fx,build,dev,camera-touch}.ts`. Acceptance: `gestures.ts` and the rules tables byte-identical to the base. Holds.
- **One rAF.** No second loop is added; `createDriver` stays the clock. The older "second rAF in `page.ts`" carry is unchanged and still untested by unit tests.
- **400 lines or fewer.** Named per-file and total caps. R7 defers MS-00 extras specifically to keep the slice under the cap.
- **44 px targets.** Recentre and Close are 48 px (MS-00). Existing HUD buttons already have `min-width/min-height: 48px`. The kit does not re-assert 44/48 px at 360 with the new top-bar Recentre and the Talk Close — flag (the new browser pass in must-fix 1 should measure them).
- **No silent defaults.** Drag 10 CSS px and hold 500 ms (existing mapper; mapper is not edited) are named Decisions for the HANDBACK. One-tap commit is a router double-call so `intend()`'s two-call contract, and all shipped tests, stay unchanged (Law-12 friendly).
- **Plants.** Six plants are named and map to tests 5, 7, 2–3, 4, 8, 9. Missing: a plant that only breaks `page.ts` wiring / 360 (must-fix 1 would close that).
- **MS-00 fit.** Gestures, one-tap move/attack/talk, implicit unit switch, End Turn clears then ends, Recentre instead of double-tap-to-centre, Talk panel (minimum: name, text or "…", 48 px Close, ≤35% sheet, board taps ignored, pan still allowed) all match. R7 honestly defers typewriter, one-target chip, disabled-reason toasts, "2 units can still act" confirm, 8/24 px slop, follow-only-while-animating, and the 1.5 s settle fallback. Portrait 48 px on the Talk panel is in MS-00 §7 but is in neither R5 nor the R7 list — flag, treat as deferred. MS-00 phone acceptance #9 and #10 (disabled reasons; drag off the screen edge) are not unit-tested; X5 names `lostpointercapture` but there is no test  for "finger off the edge, then tap."

### Flags (not must-fixes)

- TP-4 / `SIDES` is in `tools/play-stage/match.ts`, not blocked by the src freeze; keep it on the later list (see (a)).
- Test 5 must pan in a clamp-allowed direction (see (b).5).
- No 44 px @ 360 measurement for Recentre / Close until must-fix 1 lands.
- `done` is a `Set` in `match.ts`, not the engine `action-budget` knob (that knob still only feeds the bot; no `src/` change can wire it). Acceptable for this slice; do not let it become a second rules table.
- Talk portrait, MS-00 §9.10 off-edge drag, and a dedicated post-walk `tickCam` then tap, are untested.
- Existing carries listed in the kit (multi-line `if (DEV) {`, `debugGlobals` vs untagged `window.__*`, etc.) stand.

Evidence: `/tmp/q/s0-gate-on-base.mjs` against `/tmp/q/te-50105702` at `50105702`. Kit and spec were hashed, not edited.
