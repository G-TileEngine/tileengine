# Rebuild record: step 0, play-stage touch input (S0)

Original brief: [`docs/maker/steps/step-00-play-input.md`](../maker/steps/step-00-play-input.md) (identical copy at `handoff/steps/s0-play-input.md`). Screen spec: `docs/maker/maker-spec/MS-00-play-input-and-talk.md`. The brief says what had to be built. This file says what was built, what went wrong, and how to land the same result first time.

Sources for every fact below: PR #76 and branch `step/step-s0-play-input-r1-chatA`; `handback/s0-play-input/r1/HANDBACK.md` (cited as HB); `docs/qa/step-s0-kit-review.md` (KR1), `docs/qa/step-s0-kit-r2-review.md` (KR2) and `docs/qa/step-s0-handback-review.md` (QA). Line numbers are at the commit named.

## (a) Start and finish

Start from the baseline in [`baseline.md`](baseline.md): commit `1b834c31`, tree `12f833ed`, 1014 tests. Check that first; this step builds on it.

| | Value |
|---|---|
| Base the brief named | `501057027cc27321b631c40ed3ef7d5552ac792a` (P1-9, PR #75), 1014 tests |
| Base actually used | `1b834c3162c33e698a6c389a286c63fc8dc994f4`, origin/main when the builder started. `50105702` is an ancestor, and `tools/play-stage` and `src` are identical between them (HB:49) |
| Branch | `step/step-s0-play-input-r1-chatA`. The brief said `step/s0-play-input-r1-chatA`; the chat's go-line named the longer form (HB:49) |
| Commits | `6a5897ab` code (tree `9e8f47d8`), `3a1fb485` hand-back (tree `ea99548c`) |
| Merge | PR #76 "S0: touch play input (step 0)", merge commit `9a9ca90e556711665d360455731d06845f87a8a3`, 2026-11-18 18:58 (UK time) |
| Tests | 1014 + N=9 = **1023 pass / 0 fail** (HB:16, QA:14) |
| Size | 256 changed lines in six files outside the smoke (cap 400); smoke 107 lines (own cap 130) (HB:50, QA:16) |
| QA verdict | OK TO OPEN PR, no must-fixes (QA:5-7) |

## (b) Files

All under `tools/play-stage` plus one test and one smoke. Nothing in `src/` changed; `gestures.ts` and the rules tables are byte-identical to the base (QA:16).

| File | Change | Lines (cap) | Purpose |
|---|---|---|---|
| `tools/play-stage/touch.ts` | new | 63 (75) | Pointer gestures: tap, drag-to-pan, pinch-zoom, cancel; hit-tests through the camera with the backing-store scale |
| `tools/play-stage/page.ts` | edit | 35 (35) | Wires the five pointer events into `createTouch`, takes pointer capture, drops the old 280 ms double-tap `centre()` |
| `tools/play-stage/match.ts` | edit | 65 (85) | Tap router `feed`: one-tap commit, implicit Wait on unit switch, the `done` set, `choose` returns `noTarget`, `endTurn` from any phase, `closeTalk`, `recentreTarget` |
| `tools/play-stage/board.ts` | edit | 4 (8) | `pointer()` sends gesture intents through a swappable `feed` route instead of straight to `intend` |
| `tools/play-stage/hud.ts` | edit | 11 (25) | `#recentre` button and the Talk sheet with a 48 px Close, replacing `#bubble` |
| `tests/tools/touch-play.test.ts` | new | 78 (100) | The nine unit tests (sha256 `fb892de92c6b9214cb1e3c0c2fb5674043ccab638784547b7ffed432ffc6e4b2`, HB:40) |
| `handoff/steps/tests/s0-play-input/touch-smoke.mjs` | new | 107 (130) | Browser gate: trusted touch through `page.ts` at 390 and 360 wide. Shipped sha256 `a4a607b2…`; refrozen in step 1b as `d528795e…` (see `step-01b.md`) |
| `handback/s0-play-input/r1/*` | new | not counted | HANDBACK.md plus test, typecheck, checks and stat output |

The nine test titles (`tests/tools/touch-play.test.ts:20-70` at `9a9ca90`): one tap selects and walks; Attack then one tap hits the wolf; Talk opens the panel and Close spends the action; switching to the archer after a move does an implicit Wait; pan then tap selects the unit under the finger; pinch sends cancel and fires no tap; a quick double tap never wedges input; End Turn clears targeting, actMenu and unitSelected, runs the wolves and returns; no targets means no target mode, an off-target tap cancels back to Selected, and unit keys are safe.

## (c) Key code and git commands

Every file's full code is in the appendix at the end of this file, taken from the merge commit `9a9ca90` (new files in full; edited files as the exact diff from the base plus the full file as merged). Git commands:

```
git show 9a9ca90 --stat
git diff 1b834c31..9a9ca90 -- tools/play-stage tests/tools/touch-play.test.ts handoff/steps/tests/s0-play-input
git show 9a9ca90:tools/play-stage/touch.ts
```

**`createTouch` signature and the hit test** (`tools/play-stage/touch.ts:6-21` at `9a9ca90`). The hit test multiplies by the canvas backing-store scale `kx/ky`, removes the `fitView` padding at the current zoom, then adds the camera offset. That's the core fix for "nothing could be selected after a pan".

```ts
export type TouchEv = { readonly id: number; readonly offsetX: number; readonly offsetY: number; readonly clientX: number; readonly clientY: number; readonly timeStamp: number; readonly pointerType: string };
export type TouchBox = { readonly devW: number; readonly devH: number; readonly kx: number; readonly ky: number; readonly cols: number; readonly rows: number };
export function createTouch(o: { match: { pointer(s: PointerSample): void }; cam: PlayCam; box: () => TouchBox }): {
  down(e: TouchEv): void; move(e: TouchEv): void; up(e: TouchEv): void; cancel(e: TouchEv): void; hit(offsetX: number, offsetY: number): { x: number; y: number };
} {
  const hit = (ox: number, oy: number): { x: number; y: number } => {
    const b = o.box(), f = fitView(b.devW, b.devH, o.cam.s, TILE, TILE);
    return { x: (ox * b.kx - f.padX) / f.s + o.cam.x, y: (oy * b.ky - f.padY) / f.s + o.cam.y };
  };
```

**Drag threshold, pan and tap release** (`touch.ts:51-62`). Ten CSS px or more is a drag; a drag sends `cancel` for the armed tap and pans in art pixels (`dx·kx/cam.s`), then clamps. A tap only fires `up` if no pinch or drag happened.

```ts
if (!drag && Math.hypot(e.clientX - ax, e.clientY - ay) >= 10) { drag = true; if (armed !== null) send("cancel", e, armed); armed = null; }
if (drag && prev !== undefined) { const s = o.cam.s || 1; pan(o.cam, -((e.clientX - prev.x) * b.kx) / s, -((e.clientY - prev.y) * b.ky) / s); clamp(o.cam, fitView(…)…); }
up(e) {
  const wasP = pinch, wasD = drag; pts.delete(e.id);
  if (pts.size > 0) return;
  if (!wasP && !wasD && armed === e.id) send("up", e);
  pinch = false; drag = false; armed = null; base = null;
},
cancel(e) { if (pts.has(e.id)) reset(e); },
```

**Page wiring** (`git diff 1b834c31..9a9ca90 -- tools/play-stage/page.ts`). All five pointer events go to `createTouch`, with capture on `pointerdown`. The box uses `canvas.width / rect.width`, falling back to `clientWidth × devicePixelRatio` only for the raw 300×150 canvas before the first frame.

```ts
for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const)
  canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType };
    if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
```

**Board route** (`board.ts`, 4 lines): `pointer(sample) { for (const intent of gestures(sample)) route(intent); }` with a `feed` getter/setter, so `match.ts` can install its router without editing `gestures.ts`.

**Match router** (`tools/play-stage/match.ts:153-170` at `9a9ca90`, trimmed). One tap on a lit cell commits by sending `TargetCell` twice (the existing two-call contract of `intend` stays). Tapping another ready unit from `actMenu` spends the current unit first (implicit Wait).

```ts
const commit = (at: Sq): unknown => { const cell = { c: at.c, r: at.r }; api.intend({ type: "TargetCell", at: cell }); return api.intend({ type: "TargetCell", at: cell }); };
play.feed = (intent: DoorIntent): unknown => {
  if (talk !== null || play.walk !== null || side !== "player" || outcome !== null) return undefined;
  const phase = play.world.phases.battle, at = atOf(intent);
  if (phase === "targeting" && at !== null && listed(play.aims, at)) return commit(at);
  if (phase === "targeting") {
    const from = back(); play.aims = []; talk = null; play.followId = null;
    if (intent.type === "SelectUnit" && ready(intent.unitId) && intent.unitId !== play.selected) { if (from !== "unitSelected") spend(); return api.intend(intent); }
    return undefined;
  }
  if (intent.type === "SelectUnit" && !ready(intent.unitId)) return undefined;
  if (phase === "unitSelected" && intent.type === "TargetCell") { if (at !== null && listed(play.reach, at)) return commit(at); baseIntend({ type: "Cancel" }); wipe(); return undefined; }
  if (phase === "actMenu" && intent.type === "SelectUnit" && intent.unitId !== play.selected) { spend(); return api.intend(intent); }
  if (phase === "actMenu" && intent.type === "SelectUnit") return undefined;
  return api.intend(intent);
};
```

**End Turn from any phase** (`match.ts:111-117`). Walks back through legal edges (targeting → Cancel, plus UNDO_MOVE if it was armed from unitSelected; actMenu → spend; unitSelected → Cancel), wipes the view, then ends the side. `((): Side => side)()` re-reads the live binding after `finish()` changes it; it isn't a cast (HB:54).

```ts
endTurn() {
  if (play.walk !== null || side !== "player" || outcome !== null) return;
  if (play.world.phases.battle === "targeting") back();
  const now = play.world.phases.battle;
  if (now === "actMenu") spend(); else if (now === "unitSelected") baseIntend({ type: "Cancel" });
  wipe(); turns += 1; if (finish()) return; const next = ((): Side => side)(); if (next === "wolves") { queue = [...play.bot(play.world, next)]; pump(); }
},
```

Other pieces in the same diff: `choose()` returns `"noTarget"` before sending `ChooseAction` when the list is empty; `spent` is a `Set<string>` exposed read-only as `done` and cleared only when the side becomes `player` again; `closeTalk()` spends the action; `recentreTarget()` returns the selected unit's cell or the first live player unit.

## (d) What went wrong, in order, and the fix

1. **Kit r1: the gate never touched `page.ts`** (KR1:5-11). The first kit had only `createTouch` unit tests and a test 10 that grepped `page.ts` for listener names. That can't catch a wiring bug (stale camera, `devicePixelRatio` used instead of backing-store scale, wrong padding). Fix: a seventh file, a Playwright smoke sending trusted touch through the real page at 390 and 360, using `k = canvas.width / rect.width`. Test 10 was dropped, so N went from 10 to 9 (KR2:25, :37).
2. **Kit r1 flag: test 5's pan could be vacuous** (KR1:32). A pan that the clamp rejects leaves the old and new maths on the same cell. Fix: test 5 pans 120 CSS px *left* at `cam.s === 18`, `cam.y === 34`, so `cam.x` grows by 20 (KR2:21, :36).
3. **Kit r2: the smoke didn't play the whole sequence** (KR2:9-11). It never walked, never opened Talk, never did a second action. Fix: smoke steps 1-7 = select, walk, attack, pan then select, talk (sheet visible, Close), end turn, buttons ≥ 44 px, at both widths. The smoke cap went from 70 to its own 130 outside the 400 (brief line 4, CoS r4 ruling).
4. **Smoke helper must-fix during the build** (HB:45). Step 6 accepted the end state only, so a turn that never reached the wolves could still pass. Fix: wrap `play.bot` before the tap and require a call with side `wolves`, then side `player`, `turns + 1`, `idle`, `done.size === 0`.
5. **Headless Chrome doesn't scale the canvas** (HB:55-56). With deviceScaleFactor 3 the canvas stays 1×, so `seatCam` put the knight off-canvas. Fix, accepted by QA as camera placement and not input (QA:20): the smoke sets `cam.s = floor(min(canvas.width/96, canvas.height/144))` and frames the knight before the step-6 reselect. `band()` and Recentre still use `clientWidth × devicePixelRatio` because `page.ts` was at its 35-line cap; on a real phone that equals the backing store.
6. **`npm run green` exited 1 on lint the step didn't cause** (HB:17, :57). eslint found 15 errors in `ui-shell/mock-effects-v3/js/fx-render.js` and `fx-ui.js`, added on the base by `15f73fb`, on the do-not-touch list. QA ruled it doesn't block S0 and must be fixed separately with a config-only ignore (QA:22-24). Fixed on main in `8a737c5f` ("lint: ignore ui-shell prototypes", `eslint.config.mjs` one line).
7. **Base and branch drift** (HB:49). The paste named base `50105702` and branch `step/s0-play-input-r1-chatA`. The builder used `1b834c31` (play-stage and src identical) and `step/step-s0-play-input-r1-chatA`. Both were accepted, but later briefs name the exact base and branch.
8. **Tool versions differed** (HB:56, QA:20). The builder ran playwright-core 1.64.0 with the Playwright headless shell, because `/usr/bin/google-chrome` wasn't on its box. QA reran with 1.59.1 and `/usr/bin/google-chrome`. Both passed.
9. **Left open by QA (flags, not fixes)** (QA:26-30): restoring the old 280 ms double-tap wedge in `page.ts` wouldn't fail any gate; tests 5 and 6 can't go red on the base once `touch.ts` exists; TP-4 (only the wolf side gets a bot, `SIDES` in `match.ts`, and one wolf can take both actions) is carried as S0b (HB:60, KR1:22).
10. **Later, step 1b broke the frozen smoke**: it found units by `unitId === "knight"`, which became a ULID. Refrozen at `9fc49890` to look up by sprite id. Recorded in `step-01b.md` (d).

## (e) Do it right first time

- Base on the exact commit the go-line names and use its branch name. Write the base in the HANDBACK.
- Change only the seven files, each within its cap, 400 or fewer outside the smoke, smoke 130 or fewer. No `src/` change. `gestures.ts` and `camera-touch.ts` stay untouched.
- Hit-test with the backing-store scale `canvas.width / rect.width`, never `devicePixelRatio` alone, and always add `cam.x/cam.y` after removing the `fitView` padding at `cam.s`.
- Drag starts at 10 CSS px (`hypot ≥ 10`). Hold stays the mapper's existing 500 ms. A drag or pinch sends `cancel` and never a tap. A gesture cancel never emits a `Cancel` intent (a pan must not change the selection).
- One tap commits by calling `intend(TargetCell)` twice from the match router. Don't change `intend`'s contract.
- `endTurn` must work from targeting, actMenu and unitSelected by walking the legal edges, then wipe, then end the side.
- Unit-id lookups use `world.units.get`, `Set` or `Map` only, never a plain-object key (so `constructor` and `__proto__` are safe).
- The smoke must require the wolves' bot call in step 6, not just the end state, and must fit the camera itself in headless Chrome.
- At the S0 merge, `npm run green` still fails on the 15 ui-shell lint errors; judge S0 by `npm test` (1023/0) and the smoke. The later `8a737c5f` adds `ui-shell/**` to the eslint ignore list, and from step 1a on `npm run green` must exit 0. Don't loosen eslint.
- As merged in S0, the smoke finds units by `unitId` (`knight`, `archer`, `wolf`, `villager`). That is the blob in this file and the sha256 in (f). After 1b the official smoke was refrozen to look up by scene sprite id (`starter:hero-sword`, `starter:hero-staff`, `starter:enemy-wolf`, `starter:npc-villager`); see `step-01b.md` (d) 7. Renaming a starter sprite means updating that later smoke in the same push.

## (f) Rebuild check

S0 as merged (expect 1023; `npm run green` fails at this commit only on the ui-shell lint fixed later in `8a737c5f`):

```
git worktree add --detach /tmp/s0 9a9ca90 && cd /tmp/s0
npm ci && npm test            # tests 1023, fail 0
sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs   # a4a607b2f4ff4453d1ac53ecc20e39b9750ec95d96a4061ce3e6a42a0df7f68a
sha256sum tests/tools/touch-play.test.ts                      # fb892de92c6b9214cb1e3c0c2fb5674043ccab638784547b7ffed432ffc6e4b2
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797
#   ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
```

Against the merge tree: on your rebuild branch, `git diff 9a9ca90 HEAD -- tools/play-stage tests/tools/touch-play.test.ts handoff/steps/tests/s0-play-input` must be empty. The blob table below lists the exact git blob id each file must have; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id.

On current main the S0 behaviour is checked by the refrozen smoke (sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`) and the 1036-test suite; see `step-01b.md` (f).

## Blob check

Each file must have exactly this git blob id at `9a9ca90e`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `handoff/steps/tests/s0-play-input/touch-smoke.mjs` | `101f87e021ed812607d8c2485565a7ef1f8c3453` | 107 |
| `tests/tools/touch-play.test.ts` | `72d0d62753f2d145e121bafeb8ef48c7c75f571c` | 78 |
| `tools/play-stage/board.ts` | `5debfad4584e9c0608cc11017aa073abd3cd11a9` | 136 |
| `tools/play-stage/hud.ts` | `285907c0e1421bf630f377072f8343abc2c29a19` | 37 |
| `tools/play-stage/match.ts` | `46af8281c5e5f302d0a3c1225b43eac3471b05eb` | 172 |
| `tools/play-stage/page.ts` | `5dfee4cce2b2e831531a8d47243fce1af7328b6a` | 54 |
| `tools/play-stage/touch.ts` | `27e070362f6e23e83d0192122c57935b64c3a674` | 63 |

## Appendix: full code as merged (S0, PR #76)
New files are given in full. Edited files are given as the exact diff from `1b834c31` to `9a9ca90e`, then in full as merged. Copy them byte for byte; the blob table checks you did.

### `handoff/steps/tests/s0-play-input/touch-smoke.mjs` (new)

`````js
// S0 touch smoke. PLAYWRIGHT_CORE=<dir> CHROME=<bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797
import { createServer } from "node:http"; import { createRequire } from "node:module"; import { mkdtempSync, readFileSync, rmSync } from "node:fs"; import { tmpdir } from "node:os"; import { extname, join, normalize, resolve, sep } from "node:path"; import { pathToFileURL } from "node:url";
const PW = process.env.PLAYWRIGHT_CORE ?? "/workspace/node_modules/playwright-core/";
const req = createRequire(PW.endsWith("/") ? PW : `${PW}/`), { chromium } = req(PW.endsWith("/") ? `${PW}index.js` : `${PW}/index.js`);
const [, , WT, PORT = "8797"] = process.argv;
if (!WT) { console.error("usage: node touch-smoke.mjs <worktree> [port]"); process.exit(2); }
const root = resolve(WT);
const { fitView } = await import(pathToFileURL(join(root, "src/runtime/render/fit.ts")).href);
const { buildWeb } = await import(pathToFileURL(join(root, "tools/apk/build.ts")).href);
const www = mkdtempSync(join(tmpdir(), "s0-smoke-")); buildWeb(www, "0".repeat(40), root, true);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" }, origin = `http://127.0.0.1:${PORT}`;
const srv = createServer((rq, rs) => { const path = normalize(decodeURIComponent((rq.url ?? "/").split("?")[0]) === "/" ? "/index.html" : decodeURIComponent((rq.url ?? "/").split("?")[0])), file = resolve(www, "." + path); if (!file.startsWith(www + sep) && file !== www) { rs.writeHead(403); rs.end("no"); return; } try { rs.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" }); rs.end(readFileSync(file)); } catch { rs.writeHead(404); rs.end("missing"); } });
await new Promise((ok) => srv.listen(Number(PORT), "127.0.0.1", ok));
let bad = 0; const check = (name, ok, detail) => { if (!ok) bad += 1; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${detail}`); };
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/usr/bin/google-chrome", headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });
const shot = async (page) => page.evaluate(() => { const c = document.querySelector("#board"), rect = c.getBoundingClientRect(), cam = window.__cam; return { w: c.width, h: c.height, left: rect.left, top: rect.top, rw: rect.width, rh: rect.height, x: cam.x, y: cam.y, s: cam.s }; });
const screenOf = (g, c, r) => { const k = g.w / g.rw, ky = g.h / g.rh, f = fitView(g.w, g.h, g.s, 16, 16); return { x: g.left + (f.padX + ((c + 0.5) * 16 - g.x) * f.s) / k, y: g.top + (f.padY + ((r + 0.5) * 16 - g.y) * f.s) / ky, f }; };
const tileOf = (cam, ox, oy) => { const f = fitView(cam.w, cam.h, cam.s, 16, 16); return { c: Math.floor(((ox * (cam.w / cam.rw) - f.padX) / f.s + cam.x) / 16), r: Math.floor(((oy * (cam.h / cam.rh) - f.padY) / f.s + cam.y) / 16) }; };
const tapCell = async (page, c, r) => { const g = await shot(page), at = screenOf(g, c, r); await page.evaluate(() => { window.__up = null; }); await page.touchscreen.tap(at.x, at.y); await page.waitForTimeout(60); const up = await page.evaluate(() => window.__up), tile = up === null ? null : tileOf(up.cam, up.x, up.y); if (up === null || up.trust !== true || tile === null || tile.c !== c || tile.r !== r) throw new Error(`tap ${c},${r} -> ${JSON.stringify({ at, up, tile })}`); };
const until = async (page, ms) => { const t = Date.now(); while (Date.now() - t < ms) { if (await page.evaluate(() => window.__wait())) return; await page.waitForTimeout(40); } throw new Error("timeout"); };
const fingers = async (page, pts) => { const cdp = await page.context().newCDPSession(page); const send = (type, at) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: at.map((p, i) => ({ x: p[0], y: p[1], id: i + 1 })) }); await send("touchStart", pts); for (let i = 1; i <= 6; i += 1) await send("touchMove", pts.map((p) => [p[0] + p[2] * i, p[1] + p[3] * i])); await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] }); await cdp.detach(); };
try {
  const run = async (width) => {
    const ctx = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const page = await ctx.newPage(); const errs = [], ext = [];
    page.on("pageerror", (e) => errs.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
    page.on("request", (r) => { const u = r.url(); if (!(u.startsWith(origin) || u.startsWith("data:") || u.startsWith("blob:"))) ext.push(u); });
    await page.goto(`${origin}/`, { waitUntil: "load" });
    await page.waitForFunction(() => window.__play !== undefined && window.__hud !== undefined && window.__driver.stats.draws > 0, null, { timeout: 15000 });
    await page.evaluate(() => { const c = document.querySelector("#board"); window.__up = null; c.addEventListener("pointerup", (e) => { const cam = window.__cam, b = c.getBoundingClientRect(); window.__up = { trust: e.isTrusted, x: e.offsetX, y: e.offsetY, cam: { w: c.width, h: c.height, rw: b.width, rh: b.height, x: cam.x, y: cam.y, s: cam.s } }; }, true); window.__hud.hideBanner(); window.__play.followId = null; const s = Math.max(1, Math.floor(Math.min(c.width / 96, c.height / 144))); Object.assign(window.__cam, { x: 0, y: 0, follow: null, s }); });
    await page.waitForTimeout(80);
    const knight = await page.evaluate(() => window.__play.world.units.all().find((u) => u.unitId === "knight").id);
    const turns0 = await page.evaluate(() => window.__play.view().turns);
    const step = async (name, ms, fn) => { try { await Promise.race([fn(), new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms))]); check(`${name} @${width}`, true, "ok"); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
    await step("1 select", 5000, async () => { const at = await page.evaluate((id) => window.__play.world.units.get(id).at, knight); await tapCell(page, at.c, at.r); const sel = await page.evaluate(() => window.__play.selected); if (sel !== knight) throw new Error(`selected ${sel}`); });
    await step("2 walk", 5000, async () => {
      const cell = await page.evaluate(() => { const c = window.__play.reach[0]; return c ? { c: c.c, r: c.r } : null; }); if (cell === null) throw new Error("no reach");
      const from = await page.evaluate((id) => { const u = window.__play.world.units.get(id); return { c: u.at.c, r: u.at.r }; }, knight);
      await page.evaluate((p) => { window.__wait = () => { const u = window.__play.world.units.get(p.id); return window.__play.walk === null && u.at.c === p.c && u.at.r === p.r && window.__play.world.phases.battle === "actMenu"; }; }, { id: knight, c: cell.c, r: cell.r });
      await tapCell(page, cell.c, cell.r); await until(page, 4800);
      const moved = await page.evaluate((p) => { const u = window.__play.world.units.get(p.id); return u.at.c !== p.c || u.at.r !== p.r; }, { id: knight, c: from.c, r: from.r }); if (!moved) throw new Error("still at start");
    });
    await step("3 attack", 5000, async () => {
      const placed = await page.evaluate((id) => { const play = window.__play, me = play.world.units.get(id), occ = (c, r) => play.world.units.all().some((u) => u.alive && u.at.c === c && u.at.r === r); const spots = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dc, dr]) => ({ c: me.at.c + dc, r: me.at.r + dr })).filter((p) => play.world.grid.inBounds(p) && play.world.grid.isOpen(p) && !occ(p.c, p.r)); const wolf = play.world.units.all().find((u) => u.unitId === "wolf" && u.alive); if (spots[0] === undefined || wolf === undefined || !play.world.units.moveTo(wolf.id, spots[0], "move").ok) return null; return { id: wolf.id, c: spots[0].c, r: spots[0].r, before: play.world.log.entries().filter((e) => e.action.kind === "ability").length }; }, knight);
      if (placed === null) throw new Error("no neighbour");
      const btn = await page.locator("#attack").boundingBox(); if (btn === null) throw new Error("no attack");
      await page.touchscreen.tap(btn.x + btn.width / 2, btn.y + btn.height / 2); await page.waitForTimeout(40); await tapCell(page, placed.c, placed.r);
      const got = await page.evaluate((p) => { const play = window.__play, hp = play.world.rules.state().units.find((u) => u.id === p.id)?.hp ?? 99; return { hp, phase: play.world.phases.battle, done: play.done.has(p.knight), logs: play.world.log.entries().filter((e) => e.action.kind === "ability").length, before: p.before }; }, { ...placed, knight });
      if (!(got.hp < 4 && got.phase === "idle" && got.done && got.logs === got.before + 1)) throw new Error(JSON.stringify(got));
    });
    await step("4 pan then select", 5000, async () => {
      await page.evaluate(() => { const c = document.querySelector("#board"); window.__play.followId = null; const s = Math.max(window.__cam.s, Math.floor(Math.min(c.width / 96, c.height / 144))); Object.assign(window.__cam, { x: 0, y: 0, follow: null, s }); });
      const g0 = await shot(page), s0 = g0.s; await fingers(page, [[g0.left + 28, g0.top + g0.rh - 28, -8, 0], [g0.left + 52, g0.top + g0.rh - 28, 8, 0]]);
      const g1 = await shot(page); if (!(g1.s > s0)) throw new Error(`zoom ${s0}->${g1.s}`);
      const pan = await shot(page); await fingers(page, [[pan.left + pan.rw / 2, pan.top + pan.rh / 2, -20, 0]]);
      const g2 = await shot(page), grew = g2.x - g1.x, want = (120 * (g2.w / g2.rw)) / g2.s; if (!(g2.x > 0 && Math.abs(grew - want) <= 0.5)) throw new Error(`pan x ${g1.x}->${g2.x} grew ${grew} want ${want}`);
      const spot = await page.evaluate(() => {
        const play = window.__play, cam = window.__cam, c = document.querySelector("#board"), s = Math.max(1, Math.trunc(cam.s)), artW = Math.floor(c.width / s), artH = Math.floor(c.height / s);
        const open = (col, row) => play.world.grid.inBounds({ c: col, r: row }) && play.world.grid.isOpen({ c: col, r: row }) && !play.world.units.all().some((u) => u.alive && u.at.c === col && u.at.r === row);
        const on = (col, row) => (col + 0.5) * 16 > cam.x + 16 && (col + 0.5) * 16 < cam.x + artW - 16 && (row + 0.5) * 16 > cam.y + 16 && (row + 0.5) * 16 < cam.y + artH - 16;
        let ar = null, vi = null;
        for (let r = 0; r < play.world.grid.rows && ar === null; r += 1) for (let col = 0; col < play.world.grid.cols; col += 1) { if (!on(col, r) || !open(col, r)) continue; const nb = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dc, dr]) => ({ c: col + dc, r: r + dr })).find((p) => on(p.c, p.r) && open(p.c, p.r)); if (nb !== undefined) { ar = { c: col, r }; vi = nb; break; } }
        if (ar === null || vi === null) return null;
        const archer = play.world.units.all().find((u) => u.unitId === "archer" && u.alive), villager = play.world.units.all().find((u) => u.unitId === "villager" && u.alive);
        if (archer === undefined || villager === undefined || !play.world.units.moveTo(archer.id, ar, "move").ok || !play.world.units.moveTo(villager.id, vi, "move").ok) return null;
        return { archer: archer.id, ac: ar.c, ar: ar.r, vc: vi.c, vr: vi.r };
      });
      if (spot === null) throw new Error("no on-screen pair");
      await tapCell(page, spot.ac, spot.ar); const sel = await page.evaluate(() => window.__play.selected);
      const g3 = await shot(page), at = screenOf(g3, spot.ac, spot.ar), dpr = await page.evaluate(() => devicePixelRatio || 1);
      const oldC = Math.floor((((at.x - g3.left) * dpr) - at.f.padX) / g3.s / 16), oldR = Math.floor((((at.y - g3.top) * dpr) - at.f.padY) / g3.s / 16);
      if (sel !== spot.archer || (oldC === spot.ac && oldR === spot.ar)) throw new Error(JSON.stringify({ sel, spot, oldC, oldR }));
      await page.evaluate((s) => { window.__spot = s; }, spot);
    });
    await step("5 talk", 5000, async () => {
      const live = await page.evaluate((t0) => ({ side: window.__play.side, turns: window.__play.view().turns, t0 }), turns0); if (live.side !== "player" || live.turns !== live.t0) throw new Error(JSON.stringify(live));
      const spot = await page.evaluate(() => window.__spot), talk = await page.locator("#talk").boundingBox(); if (talk === null || spot === null) throw new Error("no talk");
      await page.touchscreen.tap(talk.x + talk.width / 2, talk.y + talk.height / 2); await page.waitForTimeout(40); await tapCell(page, spot.vc, spot.vr);
      const panel = await page.evaluate(() => { const n = document.querySelector("#sheet"), q = n.getBoundingClientRect(), st = getComputedStyle(n); return { show: st.display !== "none", h: q.height, text: n.textContent ?? "", vh: innerHeight }; });
      if (!(panel.show && panel.h > 0 && panel.h <= panel.vh * 0.35 && panel.text.includes("Villager") && panel.text.includes("Hello, traveler."))) throw new Error(JSON.stringify(panel));
      const close = await page.locator("#close").boundingBox(); if (close === null || close.width < 44 || close.height < 44) throw new Error("close");
      await page.touchscreen.tap(close.x + close.width / 2, close.y + close.height / 2); await page.waitForTimeout(40);
      const after = await page.evaluate((s) => { const n = document.querySelector("#sheet"); return { hidden: getComputedStyle(n).display === "none", phase: window.__play.world.phases.battle, knight: window.__play.done.has(s.knight), archer: window.__play.done.has(s.archer) }; }, { ...spot, knight });
      if (!(after.hidden && after.phase === "idle" && after.knight && after.archer)) throw new Error(JSON.stringify(after));
    });
    await step("6 end turn", 10000, async () => {
      const end = await page.locator("#end").boundingBox(); if (end === null) throw new Error("no end");
      await page.evaluate((t0) => {
        const play = window.__play; window.__saw = false; const bot = play.bot.bind(play);
        play.bot = (world, side) => { if (side === "wolves") window.__saw = true; return bot(world, side); };
        window.__wait = () => window.__saw === true && play.side === "player" && play.view().turns === t0 + 1 && play.world.phases.battle === "idle" && play.done.size === 0;
      }, turns0);
      await page.touchscreen.tap(end.x + end.width / 2, end.y + end.height / 2); await until(page, 9000);
      await page.evaluate((id) => { const u = window.__play.world.units.get(id), c = document.querySelector("#board"), cam = window.__cam, s = Math.max(1, Math.trunc(cam.s)); window.__play.followId = null; cam.follow = null; cam.x = Math.max(0, (u.at.c + 0.5) * 16 - Math.floor(c.width / s) / 2); cam.y = Math.max(0, (u.at.r + 0.5) * 16 - Math.floor(c.height / s) / 2); }, knight);
      const at = await page.evaluate((id) => window.__play.world.units.get(id).at, knight); await tapCell(page, at.c, at.r);
      const sel = await page.evaluate(() => window.__play.selected); if (sel !== knight) throw new Error(`reselect ${sel}`);
    });
    await step("7 buttons", 5000, async () => {
      const hud = await page.evaluate(() => [...document.querySelectorAll("button")].filter((b) => { const s = getComputedStyle(b), q = b.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && q.width > 0 && q.height > 0; }).map((b) => { const q = b.getBoundingClientRect(); return { id: b.id, w: q.width, h: q.height }; }));
      const small = hud.filter((b) => b.w < 44 || b.h < 44); if (small.length > 0 || !hud.some((b) => b.id === "recentre") || errs.length > 0 || ext.length > 0) throw new Error(JSON.stringify({ small, recentre: hud.some((b) => b.id === "recentre"), errs, ext }));
    });
    await ctx.close();
  };
  await run(390); await run(360);
} finally { await browser.close(); srv.close(); rmSync(www, { recursive: true, force: true }); }
console.log(bad === 0 ? "TOUCH SMOKE PASS" : `TOUCH SMOKE FAIL (${bad})`);
process.exit(bad === 0 ? 0 : 1);
`````

### `tests/tools/touch-play.test.ts` (new)

`````ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { fitView } from "../../src/runtime/render/index.ts";
import { TILE } from "../../tools/play-stage/board.ts";
import { createCam } from "../../tools/play-stage/camera-touch.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { createTouch, type TouchEv } from "../../tools/play-stage/touch.ts";
const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => { const id = m.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id; if (id === undefined) throw new Error(unitId); return id; };
const hpOf = (m: ReturnType<typeof createMatch>, id: string): number => m.world.rules?.state().units.find((u) => u.id === id)?.hp ?? 0;
const logs = (m: ReturnType<typeof createMatch>): number => m.world.log.entries().filter((e) => e.action.kind === "ability").length;
const wolfTo = (m: ReturnType<typeof createMatch>, c: number, r: number): string => { const w = m.world.units.all().find((u) => u.unitId === "wolf" && u.alive); if (w === undefined) throw new Error("wolf"); if (!m.world.units.moveTo(w.id, { c, r }, "move").ok) throw new Error("wolf move"); return w.id; };
function rig(moveMs = 40) {
  const m = createMatch(undefined, moveMs), cam = createCam(12), box = () => ({ devW: 1170, devH: 1992, kx: 3, ky: 3, cols: m.world.grid.cols, rows: m.world.grid.rows }), touch = createTouch({ match: m, cam, box });
  let t = 1000, n = 1;
  const screen = (c: number, r: number) => { const b = box(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); return { x: (((c + 0.5) * TILE - cam.x) * f.s + f.padX) / b.kx, y: (((r + 0.5) * TILE - cam.y) * f.s + f.padY) / b.ky }; };
  const ev = (id: number, x: number, y: number, time: number): TouchEv => ({ id, offsetX: x, offsetY: y, clientX: x, clientY: y, timeStamp: time, pointerType: "touch" });
  const tap = (c: number, r: number, gap = 80) => { const p = screen(c, r), id = n++; touch.down(ev(id, p.x, p.y, t)); touch.up(ev(id, p.x, p.y, t + 16)); t += gap; };
  return { m, cam, touch, screen, tap, land: () => { m.world.clock.advance(500); m.sync(); }, ev, nid: () => n++, now: () => t, bump: (dt: number) => { t += dt; } };
}
test("touch: one tap selects the knight and one tap on a reach cell walks", () => {
  const g = rig(), knight = idOf(g.m, "knight"); g.tap(0, 8); assert.equal(g.m.selected, knight);
  const dest = g.m.reach[0]; assert.ok(dest !== undefined); g.tap(dest.c, dest.r); assert.equal(g.m.world.phases.battle, "moving");
  g.land(); assert.equal(g.m.world.phases.battle, "actMenu"); assert.equal(g.m.world.units.get(knight)?.at.c, dest.c); assert.equal(g.m.world.units.get(knight)?.at.r, dest.r);
});
test("touch: Attack then one tap on the wolf hits it", () => {
  const g = rig(), knight = idOf(g.m, "knight"); assert.equal(g.m.world.units.moveTo(knight, { c: 2, r: 1 }, "move").ok, true);
  const wolf = wolfTo(g.m, 2, 0), before = hpOf(g.m, wolf), n0 = logs(g.m); g.tap(2, 1); assert.equal(g.m.choose("basic"), null); g.tap(2, 0);
  assert.ok(hpOf(g.m, wolf) < before); assert.equal(g.m.world.phases.battle, "idle"); assert.ok(g.m.done.has(knight)); assert.equal(logs(g.m), n0 + 1);
});
test("touch: Talk opens the panel through the match layer; Close spends the action", () => {
  const g = rig(), knight = idOf(g.m, "knight"); assert.equal(g.m.world.units.moveTo(idOf(g.m, "villager"), { c: 0, r: 7 }, "move").ok, true);
  g.tap(0, 8); assert.equal(g.m.choose("talk"), null); g.tap(0, 7); assert.deepEqual(g.m.talk, { name: "Villager", text: "Hello, traveler." });
  g.tap(1, 8); assert.equal(g.m.selected, knight); assert.deepEqual(g.m.talk, { name: "Villager", text: "Hello, traveler." });
  g.m.closeTalk(); assert.equal(g.m.talk, null); assert.equal(g.m.world.phases.battle, "idle"); assert.ok(g.m.done.has(knight));
});
test("touch: after a move, tapping the archer switches with an implicit Wait", () => {
  const g = rig(), knight = idOf(g.m, "knight"), archer = idOf(g.m, "archer"); g.tap(0, 8); g.tap(0, 7); g.land();
  assert.equal(g.m.world.phases.battle, "actMenu"); g.tap(1, 8); assert.equal(g.m.selected, archer); assert.equal(g.m.world.phases.battle, "unitSelected"); assert.ok(g.m.done.has(knight));
  const k = g.m.world.units.get(knight); assert.ok(k !== undefined); g.tap(k.at.c, k.at.r); assert.equal(g.m.selected, archer);
});
test("touch: pan then tap selects the unit under the finger", () => {
  const g = rig(), mx = 40 / 3, my = 1900 / 3, t0 = g.now(), a = g.nid(), b = g.nid();
  g.touch.down(g.ev(a, mx - 10, my, t0)); g.touch.down(g.ev(b, mx + 10, my, t0 + 5)); g.touch.move(g.ev(a, mx - 20, my, t0 + 10)); g.touch.move(g.ev(b, mx + 20, my, t0 + 15));
  g.touch.up(g.ev(a, mx - 20, my, t0 + 20)); g.touch.up(g.ev(b, mx + 20, my, t0 + 25)); assert.equal(g.cam.s, 18); assert.ok(g.cam.x <= 2); assert.equal(g.cam.y, 34);
  const x0 = g.cam.x, id = g.nid(); g.touch.down(g.ev(id, 180, 400, g.now() + 30)); g.touch.move(g.ev(id, 60, 400, g.now() + 40)); g.touch.up(g.ev(id, 60, 400, g.now() + 50));
  assert.ok(Math.abs(g.cam.x - x0 - 20) <= 0.01); assert.equal(g.cam.y, 34); const p = g.screen(1, 8); g.bump(80); g.tap(1, 8); assert.equal(g.m.selected, idOf(g.m, "archer"));
  const hit = g.touch.hit(p.x, p.y), f = fitView(1170, 1992, g.cam.s, TILE, TILE); assert.equal(Math.floor(hit.x / TILE), 1); assert.equal(Math.floor(hit.y / TILE), 8);
  assert.ok(Math.floor(((p.x * 3 - f.padX) / f.s) / TILE) !== 1 || Math.floor(((p.y * 3 - f.padY) / f.s) / TILE) !== 8);
});
test("touch: pinch sends cancel, fires no tap, and the next tap works", () => {
  const g = rig(), s0 = g.cam.s, t0 = g.now(), a = g.nid(), b = g.nid();
  g.touch.down(g.ev(a, 200, 80, t0)); g.touch.down(g.ev(b, 240, 80, t0 + 5)); g.touch.move(g.ev(a, 160, 80, t0 + 10)); g.touch.move(g.ev(b, 280, 80, t0 + 15));
  g.touch.up(g.ev(a, 160, 80, t0 + 20)); g.touch.up(g.ev(b, 280, 80, t0 + 25)); assert.ok(g.cam.s > s0); assert.equal(g.m.selected, null);
  g.bump(40); g.tap(0, 8); assert.equal(g.m.selected, idOf(g.m, "knight"));
});
test("touch: a quick double tap never wedges input", () => {
  const g = rig(), knight = idOf(g.m, "knight"); g.tap(0, 8, 60); g.tap(0, 8, 60); g.tap(0, 7); g.land();
  assert.equal(g.m.world.units.get(knight)?.at.r, 7); assert.equal(g.m.world.phases.battle, "actMenu"); const wolf = wolfTo(g.m, 0, 6), n0 = logs(g.m);
  assert.equal(g.m.choose("basic"), null); g.tap(0, 6, 60); g.tap(0, 6, 60); assert.equal(logs(g.m), n0 + 1); assert.ok(hpOf(g.m, wolf) >= 0);
});
test("touch: End Turn clears targeting, actMenu and unitSelected, runs the wolves and returns", () => {
  for (const phase of ["unitSelected", "actMenu", "targeting"] as const) {
    const g = rig(), knight = idOf(g.m, "knight"); g.tap(0, 8); if (phase !== "unitSelected") { g.tap(0, 7); g.land(); }
    if (phase === "targeting") { wolfTo(g.m, 0, 6); assert.equal(g.m.choose("basic"), null); }
    g.m.endTurn(); for (let i = 0; i < 40 && g.m.side !== "player"; i += 1) { g.m.world.clock.advance(40); g.m.sync(); }
    assert.equal(g.m.side, "player"); assert.equal(g.m.world.phases.battle, "idle"); assert.equal(g.m.done.size, 0); assert.equal(g.m.aims.length, 0); assert.equal(g.m.talk, null);
    const at = g.m.world.units.get(knight); assert.ok(at?.alive); g.tap(at.at.c, at.at.r); assert.equal(g.m.selected, knight);
  }
});
test("touch: no targets means no target mode; an off-target tap cancels back to Selected; unit keys are safe", () => {
  const g = rig(); g.tap(0, 8); assert.equal(g.m.choose("basic"), "noTarget"); assert.equal(g.m.world.phases.battle, "unitSelected");
  wolfTo(g.m, 0, 7); assert.equal(g.m.choose("basic"), null); g.tap(5, 8); assert.equal(g.m.world.phases.battle, "unitSelected"); assert.equal(g.m.aims.length, 0);
  const g2 = rig(); g2.tap(0, 8); g2.tap(0, 7); g2.land(); wolfTo(g2.m, 0, 6); assert.equal(g2.m.choose("basic"), null); g2.tap(5, 8);
  assert.equal(g2.m.world.phases.battle, "actMenu"); assert.equal(g2.m.aims.length, 0);
  const snap = [g2.m.world.phases.battle, g2.m.selected, g2.m.aims.length, g2.m.done.size, g2.m.talk] as const;
  assert.doesNotThrow(() => { g2.m.feed({ type: "SelectUnit", unitId: "constructor" }); g2.m.feed({ type: "SelectUnit", unitId: "__proto__" }); });
  assert.deepEqual([g2.m.world.phases.battle, g2.m.selected, g2.m.aims.length, g2.m.done.size, g2.m.talk], [...snap]);
});
`````

### `tools/play-stage/board.ts` (edited)
Diff `1b834c31..9a9ca90e`:

`````diff
diff --git a/tools/play-stage/board.ts b/tools/play-stage/board.ts
index 9f43954..5debfad 100644
--- a/tools/play-stage/board.ts
+++ b/tools/play-stage/board.ts
@@ -75,6 +75,7 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
   const gestures = createGestureMapper({ cellPx: TILE, tapMaxPx: 12, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (at) => world.units.occupantAt(at) });
   const fx = createPlayFx(body.effects), looks = dress(world.grid, body.looks), worn = new Map<string, SceneAsset>();
   let selected: string | null = null, pending: Sq | null = null, reach: Sq[] = [], preview: Sq[] = [], walk: Walk | null = null, aims: Sq[] = [], aimKind: "basic" | "spell" = "basic", followId: string | null = null, onLand: (() => void) | null = null;
+  let route: (intent: DoorIntent) => unknown = (intent) => intend(intent);
   const mark = (): void => { reach = selected === null ? [] : reachCells(world.grid, world.units, selected, step.reach); };
   const sync = (): void => {
     if (walk === null || selected === null) return;
@@ -121,7 +122,8 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
     get aimKind() { return aimKind; }, set aimKind(v: "basic" | "spell") { aimKind = v; },
     get followId() { return followId; }, set followId(v: string | null) { followId = v; },
     get selected() { return selected; }, get reach() { return reach; }, get pending() { return pending; }, get walk() { return walk; },
-    pointer(sample: PointerSample): void { for (const intent of gestures(sample)) intend(intent); },
+    get feed() { return route; }, set feed(fn: (intent: DoorIntent) => unknown) { route = fn; },
+    pointer(sample: PointerSample): void { for (const intent of gestures(sample)) route(intent); },
     scene() {
       sync();
       const aimSheet = aimKind === "spell" ? AIM_S : AIM_A, aimOver = world.phases.battle === "targeting" ? aims.map((c) => ({ band: "fxGround" as const, sheet: aimSheet, x: c.c * TILE, y: c.r * TILE })) : [];
`````

Full file at `9a9ca90e`:

`````ts
import { installOne } from "../../src/rules/behaviours/registry.ts";
import { reachCells, walkTo } from "../../src/rules/move/path.ts";
import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.ts";
import { botAbilityPriority } from "../../src/rules/turns/bot-ability-priority.ts";
import { createGestureMapper } from "../../src/runtime/input/gestures.ts";
import type { PointerSample } from "../../src/runtime/input/types.ts";
import type { Pixels } from "../../src/runtime/render/bakes.ts";
import type { Sheet } from "../../src/runtime/render/types.ts";
import type { SceneAsset } from "../../src/runtime/scene/world-scene.ts";
import { createPlayer } from "../../src/sim/player.ts";
import type { DoorIntent } from "../../src/sim/types.ts";
import { createWorld } from "../../src/sim/world.ts";
import { xGo, type Event } from "../../src/state/index.ts";
import type { Sq } from "../../src/types/core-types.ts";
import { DEMO_LOAD, DEMO_TALK, RECIPES, TEAM, TILE, docsToInput, recipeOf, type PlayDocs } from "./load.ts";
import { createPlayFx, fxPx } from "./fx.ts";
import { dress, dressPx, unitAsset } from "./looks.ts";

export { recipeOf, TILE };
const FONT: Readonly<Record<string, readonly number[]>> = {
  A: [14, 17, 17, 31, 17, 17, 17], C: [14, 17, 16, 16, 16, 17, 14], K: [17, 18, 20, 24, 20, 18, 17],
  M: [17, 27, 21, 21, 17, 17, 17], V: [17, 17, 17, 17, 17, 10, 4], W: [17, 17, 17, 21, 21, 27, 17], "?": [14, 17, 2, 4, 4, 0, 4],
};
const cache = new Map<string, Pixels>();
const sheet = (id: string): Sheet => ({ id, columns: 1, fw: TILE, fh: TILE });
const REACH = sheet("play:reach-player"), PATH = sheet("play:path-player"), AIM_A = sheet("play:aim-attack"), AIM_S = sheet("play:aim-spell");
function bake(id: string, rgb: number, letter: string): Pixels {
  const hit = cache.get(id); if (hit !== undefined) return hit;
  const data = new Uint8ClampedArray(TILE * TILE * 4), r = (rgb >>> 16) & 255, g = (rgb >>> 8) & 255, b = rgb & 255;
  for (let i = 0; i < data.length; i += 4) { data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255; }
  const rows = letter === "" ? undefined : FONT[letter] ?? FONT["?"];
  if (rows !== undefined) for (let y = 0; y < rows.length; y += 1) { const bits = rows[y] ?? 0; for (let x = 0; x < 5; x += 1) if ((bits & (1 << (4 - x))) !== 0) { const o = ((y + 4) * TILE + (x + 5)) * 4; data[o] = 248; data[o + 1] = 244; data[o + 2] = 230; data[o + 3] = 255; } }
  const px = { w: TILE, h: TILE, data }; cache.set(id, px); return px;
}
export function pixelsOf(id: string): Pixels | undefined {
  const dressed = dressPx(id); if (dressed !== undefined) return dressed;
  const sparked = fxPx(id); if (sparked !== undefined) return sparked;
  if (id === "play:floor") return bake(id, 0x243044, "");
  if (id === "play:reach-player") return bake(id, 0x3b82f6, "");
  if (id === "play:path-player") return bake(id, 0xf0c14a, "");
  if (id === "play:aim-attack") return bake(id, 0xe04848, "");
  if (id === "play:aim-spell") return bake(id, 0xf08a30, "");
  for (const recipe of Object.values(RECIPES)) if (recipe.id === id) return bake(id, TEAM[recipe.team], recipe.name.slice(0, 1));
  return id.startsWith("starter:unknown-") ? bake(id, TEAM.neutral, "?") : undefined;
}
export const MIN_CELL_CSS = 44;
export const HUD_TOP = 48, ROW_FOOT = 88, PLATE_H = 44, HUD_FOOT = ROW_FOOT + PLATE_H;
export const boardBox = (viewH: number): { top: number; height: number } => ({ top: HUD_TOP, height: Math.max(0, viewH - HUD_TOP - HUD_FOOT) });
export function fit(devW: number, devH: number, cols: number, rows: number, dpr: number): { s: number; padX: number; padY: number } {
  const mw = cols * TILE, mh = rows * TILE, fitted = Math.floor(Math.min(devW / mw, devH / mh)), minS = Math.ceil((MIN_CELL_CSS * dpr) / TILE);
  const s = Math.max(Number.isFinite(minS) && minS >= 1 ? minS : 1, Number.isFinite(fitted) && fitted >= 1 ? fitted : 1);
  return { s, padX: Math.floor((devW - Math.floor(devW / s) * s) / 2), padY: Math.floor((devH - Math.floor(devH / s) * s) / 2) };
}
/** Own ability rows only. A prototype key such as `constructor` is not a spell. */
export function spellRef(setup: { readonly abilities?: Readonly<Record<string, readonly { readonly effectRef: string }[]>> }, id: string): string | undefined {
  const bag = setup.abilities; if (bag === undefined || !Object.hasOwn(bag, id)) return undefined; return bag[id]?.[0]?.effectRef;
}
type Walk = { path: readonly Sq[]; from: Sq; t0: number; dur: number };
export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
  const talk = docs?.talk ?? DEMO_TALK;
  const body = docs === undefined ? DEMO_LOAD : { ...docs, talk };
  const world = createWorld(docsToInput(body).input);
  const go = (e: Event): void => { const from = world.phases.battle; if (from === undefined) throw new Error("play: phase"); world.phases = { ...world.phases, battle: xGo(from, e) }; };
  go({ type: "BATTLE_READY" }); go({ type: "DEPLOY_DONE" }); go({ type: "ROUND_BEGIN" }); go({ type: "SIDE_BEGIN" });
  const installed = installOne(STEP_PATTERN, {});
  if (installed.out === null) throw new Error("play: step-pattern");
  const step = installed.out;
  let n = 0;
  const spent = installOne(ACTION_BUDGET, {});
  if (spent.out === null) throw new Error("play: action-budget");
  const budget = spent.out;
  const player = createPlayer(world, { side: "player", moveMs, nextId: () => `p${n += 1}`, step, spellOf: (id) => { const u = world.units.get(id); return u === undefined ? undefined : spellRef(body.rules, u.unitId); } });
  const bot = botAbilityPriority({ setup: body.rules, stepReach: step.reach, actionsPerTurn: budget.actionsPerTurn });
  const gestures = createGestureMapper({ cellPx: TILE, tapMaxPx: 12, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (at) => world.units.occupantAt(at) });
  const fx = createPlayFx(body.effects), looks = dress(world.grid, body.looks), worn = new Map<string, SceneAsset>();
  let selected: string | null = null, pending: Sq | null = null, reach: Sq[] = [], preview: Sq[] = [], walk: Walk | null = null, aims: Sq[] = [], aimKind: "basic" | "spell" = "basic", followId: string | null = null, onLand: (() => void) | null = null;
  let route: (intent: DoorIntent) => unknown = (intent) => intend(intent);
  const mark = (): void => { reach = selected === null ? [] : reachCells(world.grid, world.units, selected, step.reach); };
  const sync = (): void => {
    if (walk === null || selected === null) return;
    const t = walk.dur <= 0 ? 1 : (world.clock.now() - walk.t0) / walk.dur;
    if (t >= 1) {
      world.units.setOffset(selected, null);
      const from = world.phases.battle;
      if (from === "moving") { let phase = xGo(from, { type: "MOVE_DONE" }); if (autoWait) { phase = xGo(phase, { type: "WAIT" }); phase = xGo(phase, { type: "UNIT_DONE", next: "idle" }); } world.phases = { ...world.phases, battle: phase }; }
      walk = null; pending = null; preview = []; mark(); onLand?.(); return;
    }
    const steps = walk.path.length, f = t * steps, i = Math.min(steps - 1, Math.floor(f)), a = i === 0 ? walk.from : walk.path[i - 1], b = walk.path[i];
    if (a === undefined || b === undefined) return;
    world.units.setOffset(selected, { dx: (b.c - a.c) * (f - i), dy: (b.r - a.r) * (f - i) });
  };
  const intend = (intent: DoorIntent) => {
    if (intent.type === "SelectUnit") {
      const stepped = player.feed(intent);
      pending = null; preview = [];
      selected = stepped.reject === null ? intent.unitId : selected;
      if (stepped.reject !== null) selected = null;
      mark(); return stepped;
    }
    if (intent.type === "Cancel") { pending = null; preview = []; return player.feed(intent); }
    if (intent.type !== "TargetCell") return player.feed(intent);
    const at = intent.at, same = pending !== null && pending.c === at.c && pending.r === at.r, targeting = world.phases.battle === "targeting";
    const on = (targeting ? aims : reach).some((c) => c.c === at.c && c.r === at.r);
    if (!same && !on) { pending = null; preview = []; return { reject: "notReachable" as const, preview: [] as readonly Sq[] }; }
    if (!same) { pending = { c: at.c, r: at.r }; preview = targeting ? [pending] : (selected === null ? [] : walkTo(world.grid, world.units, selected, step.reach, at) ?? []); return { preview }; }
    const stepped = player.feed(intent);
    pending = null; preview = [];
    if (stepped.action?.kind === "move" && stepped.path !== undefined && selected !== null) {
      const u = world.units.get(selected);
      walk = { path: stepped.path, from: { c: u?.at.c ?? at.c, r: u?.at.r ?? at.r }, t0: world.clock.now(), dur: stepped.action.durationMs ?? 0 };
      followId = selected; sync();
    }
    return stepped;
  };
  return {
    world, step, intend, sync, bot, pixels: pixelsOf, autoWait, go, fx, looks,
    focus(id: string | null): void { selected = id; pending = null; preview = []; mark(); },
    arm(next: Walk): void { walk = next; sync(); },
    landed(fn: (() => void) | null): void { onLand = fn; },
    get aims() { return aims; }, set aims(v: readonly Sq[]) { aims = v.map((c) => ({ c: c.c, r: c.r })); },
    get aimKind() { return aimKind; }, set aimKind(v: "basic" | "spell") { aimKind = v; },
    get followId() { return followId; }, set followId(v: string | null) { followId = v; },
    get selected() { return selected; }, get reach() { return reach; }, get pending() { return pending; }, get walk() { return walk; },
    get feed() { return route; }, set feed(fn: (intent: DoorIntent) => unknown) { route = fn; },
    pointer(sample: PointerSample): void { for (const intent of gestures(sample)) route(intent); },
    scene() {
      sync();
      const aimSheet = aimKind === "spell" ? AIM_S : AIM_A, aimOver = world.phases.battle === "targeting" ? aims.map((c) => ({ band: "fxGround" as const, sheet: aimSheet, x: c.c * TILE, y: c.r * TILE })) : [];
      const overlays = selected === null ? aimOver : [...reach.map((c) => ({ band: "fxGround" as const, sheet: REACH, x: c.c * TILE, y: c.r * TILE })), ...preview.map((c) => ({ band: "fxGround" as const, sheet: PATH, x: c.c * TILE, y: c.r * TILE })), ...aimOver];
      const assets: Record<string, SceneAsset> = { ...looks.assets, "play:fx": { sheet: { id: "play:fx", columns: 4, fw: TILE, fh: TILE } } };
      const units = world.units.all().map((u) => { const id = recipeOf(u.unitId).id; const asset = worn.get(id) ?? unitAsset(id); worn.set(id, asset); assets[id] = asset; return { id: u.id, sprite: id, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
      return { cols: world.grid.cols, rows: world.grid.rows, tileW: TILE, tileH: TILE, mapSeed: world.seed, assets, layers: looks.layers, units, objects: looks.objects, overlays, effects: fx.ingest(world.log, world.clock.stepMs, world.clock.now()), style: looks.style, waterTiles: looks.waterTiles, seeThroughCanopy: true as const };
    },
  };
}
`````

### `tools/play-stage/hud.ts` (edited)
Diff `1b834c31..9a9ca90e`:

`````diff
diff --git a/tools/play-stage/hud.ts b/tools/play-stage/hud.ts
index a2132ad..285907c 100644
--- a/tools/play-stage/hud.ts
+++ b/tools/play-stage/hud.ts
@@ -5,19 +5,20 @@ export type HudView = {
   readonly actions: { readonly basic: Btn; readonly spell: Btn; readonly talk: Btn; readonly wait: Btn; readonly end: Btn };
 };
 type Btn = { readonly show: boolean; readonly on: boolean };
-type Act = { choose(kind: "basic" | "spell" | "talk"): void; wait(): void; endTurn(): void; restart(): void; menu(): void };
-const css = `html,body{margin:0}#hud{position:fixed;inset:0;pointer-events:none;font:16px sans-serif;color:#f4efe2}#hud button{pointer-events:auto;min-width:48px;min-height:48px;border:0;border-radius:8px;background:#1c2838;color:#f4efe2}#top{position:absolute;left:0;right:0;top:0;height:${HUD_TOP}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#menu{width:48px;height:48px;margin-left:auto}#banner{position:absolute;left:0;right:64px;top:0;height:${HUD_TOP}px;box-sizing:border-box;background:#14213d;color:#e8c872;border-top:2px solid #e8c872;border-bottom:2px solid #e8c872}#plate{position:absolute;left:0;right:0;bottom:${ROW_FOOT}px;height:${PLATE_H}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#face{width:32px;height:32px;background:#2f6fad}#hp{width:120px;height:10px;background:#243044}#hp i{display:block;height:10px;background:#3dd68c}#row{position:absolute;left:0;right:0;bottom:24px;height:64px;display:flex;align-items:center;gap:8px;padding:0 8px}#end{margin-left:auto;margin-right:12px;outline:2px solid #2f6fad}#bubble{position:absolute;left:8px;bottom:160px;max-width:280px;background:#f4efe2;color:#1c140c;padding:8px;border-radius:8px}#bubble b{display:block}#veil{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,10,16,.72);pointer-events:auto}#card{background:#101826;padding:16px;border:2px solid #e8c872;text-align:center}#card button{margin:8px}#hud #banner{pointer-events:none}`;
+type Act = { choose(kind: "basic" | "spell" | "talk"): void; wait(): void; endTurn(): void; restart(): void; menu(): void; recentre(): void; closeTalk(): void };
+const css = `html,body{margin:0}#hud{position:fixed;inset:0;pointer-events:none;font:16px sans-serif;color:#f4efe2}#hud button{pointer-events:auto;min-width:48px;min-height:48px;border:0;border-radius:8px;background:#1c2838;color:#f4efe2}#top{position:absolute;left:0;right:0;top:0;height:${HUD_TOP}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#menu{width:48px;height:48px;margin-left:auto}#recentre{width:48px;height:48px;flex:none}#banner{position:absolute;left:0;right:64px;top:0;height:${HUD_TOP}px;box-sizing:border-box;background:#14213d;color:#e8c872;border-top:2px solid #e8c872;border-bottom:2px solid #e8c872}#plate{position:absolute;left:0;right:0;bottom:${ROW_FOOT}px;height:${PLATE_H}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#face{width:32px;height:32px;background:#2f6fad}#hp{width:120px;height:10px;background:#243044}#hp i{display:block;height:10px;background:#3dd68c}#row{position:absolute;left:0;right:0;bottom:24px;height:64px;display:flex;align-items:center;gap:8px;padding:0 8px}#end{margin-left:auto;margin-right:12px;outline:2px solid #2f6fad}#sheet{position:absolute;left:8px;right:8px;bottom:${ROW_FOOT + PLATE_H}px;max-height:35%;box-sizing:border-box;display:none;overflow:auto;background:#f4efe2;color:#1c140c;padding:8px;border-radius:8px;pointer-events:auto;font-size:16px}#sheet b{display:block}#sheet button{width:48px;height:48px}#veil{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,10,16,.72);pointer-events:auto}#card{background:#101826;padding:16px;border:2px solid #e8c872;text-align:center}#card button{margin:8px}#hud #banner{pointer-events:none}`;
 export function createHud(act: Act): { hideBanner(): void; render(view: HudView): void } {
-  const root = document.createElement("div"); root.id = "hud"; root.innerHTML = `<style>${css}</style><div id="top"><span id="pill"></span><button id="menu" type="button">Menu</button></div><button id="banner" type="button">YOUR TURN</button><div id="plate"><i id="face"></i><span id="who"></span><span id="hp"><i></i></span><span id="hpText"></span></div><div id="row"><button id="attack" type="button">Attack</button><button id="spell" type="button">Spell</button><button id="talk" type="button">Talk</button><button id="wait" type="button">Wait</button><button id="end" type="button">End turn</button></div><div id="bubble"><b></b><span></span></div><div id="veil"><div id="card"><h2></h2><p></p><p id="turns"></p><button id="restart" type="button">Restart</button><button id="back" type="button">Back</button></div></div>`;
+  const root = document.createElement("div"); root.id = "hud"; root.innerHTML = `<style>${css}</style><div id="top"><span id="pill"></span><button id="recentre" type="button">Recentre</button><button id="menu" type="button">Menu</button></div><button id="banner" type="button">YOUR TURN</button><div id="plate"><i id="face"></i><span id="who"></span><span id="hp"><i></i></span><span id="hpText"></span></div><div id="row"><button id="attack" type="button">Attack</button><button id="spell" type="button">Spell</button><button id="talk" type="button">Talk</button><button id="wait" type="button">Wait</button><button id="end" type="button">End turn</button></div><div id="sheet"><b></b><span></span><button id="close" type="button">Close</button></div><div id="veil"><div id="card"><h2></h2><p></p><p id="turns"></p><button id="restart" type="button">Restart</button><button id="back" type="button">Back</button></div></div>`;
   document.body.append(root);
   const q = (id: string): HTMLElement => { const n = root.querySelector(`#${id}`); if (!(n instanceof HTMLElement)) throw new Error(id); return n; };
-  const banner = q("banner"), veil = q("veil"), bubble = q("bubble");
+  const banner = q("banner"), veil = q("veil"), sheet = q("sheet");
   const buttons: Record<"basic" | "spell" | "talk" | "wait" | "end", HTMLElement> = { basic: q("attack"), spell: q("spell"), talk: q("talk"), wait: q("wait"), end: q("end") };
   let held = true;
   const hideBanner = (): void => { held = false; banner.style.display = "none"; };
   banner.addEventListener("click", hideBanner); q("menu").addEventListener("click", () => act.menu());
   q("attack").addEventListener("click", () => act.choose("basic")); q("spell").addEventListener("click", () => act.choose("spell"));
   q("talk").addEventListener("click", () => act.choose("talk")); q("wait").addEventListener("click", () => act.wait()); q("end").addEventListener("click", () => act.endTurn());
+  q("recentre").addEventListener("click", () => act.recentre()); q("close").addEventListener("click", () => act.closeTalk());
   q("restart").addEventListener("click", () => act.restart()); q("back").addEventListener("click", () => act.restart());
   window.setTimeout(hideBanner, 1260);
   const render = (view: HudView): void => {
@@ -26,7 +27,7 @@ export function createHud(act: Act): { hideBanner(): void; render(view: HudView)
     const bar = q("hp").querySelector("i"); if (bar instanceof HTMLElement) bar.style.width = `${view.max <= 0 ? 0 : Math.max(0, Math.min(120, Math.round((120 * view.hp) / view.max)))}px`;
     q("end").style.outlineColor = view.side === "player" ? "#2f6fad" : "#b23b32";
     for (const key of ["basic", "spell", "talk", "wait", "end"] as const) { const b = buttons[key], row = view.actions[key]; b.style.display = row.show ? "block" : "none"; b.style.opacity = row.on ? "1" : "0.4"; }
-    const said = view.talk; bubble.style.display = said === null ? "none" : "block"; if (said !== null) { const name = bubble.querySelector("b"), text = bubble.querySelector("span"); if (name !== null) name.textContent = said.name; if (text !== null) text.textContent = said.text; }
+    const said = view.talk; sheet.style.display = said === null ? "none" : "block"; if (said !== null) { const name = sheet.querySelector("b"), text = sheet.querySelector("span"); if (name !== null) name.textContent = said.name; if (text !== null) text.textContent = said.text === "" ? "…" : said.text; }
     const over = view.outcome !== null; veil.style.display = over ? "flex" : "none";
     const title = q("card").querySelector("h2"), blurb = q("card").querySelector("p");
     if (over && title !== null && blurb !== null) { title.textContent = view.outcome === "win" ? "Victory" : view.outcome === "lose" ? "Defeat" : "Draw"; blurb.textContent = view.outcome === "lose" ? "Your units fell" : "All enemies defeated"; q("turns").textContent = `${view.turns} turns`; }
`````

Full file at `9a9ca90e`:

`````ts
import { HUD_TOP, PLATE_H, ROW_FOOT } from "./board.ts";
export type HudView = {
  readonly turn: string; readonly side: string; readonly name: string; readonly hp: number; readonly max: number; readonly selected: boolean;
  readonly outcome: "win" | "lose" | "draw" | null; readonly turns: number; readonly talk: { readonly name: string; readonly text: string } | null;
  readonly actions: { readonly basic: Btn; readonly spell: Btn; readonly talk: Btn; readonly wait: Btn; readonly end: Btn };
};
type Btn = { readonly show: boolean; readonly on: boolean };
type Act = { choose(kind: "basic" | "spell" | "talk"): void; wait(): void; endTurn(): void; restart(): void; menu(): void; recentre(): void; closeTalk(): void };
const css = `html,body{margin:0}#hud{position:fixed;inset:0;pointer-events:none;font:16px sans-serif;color:#f4efe2}#hud button{pointer-events:auto;min-width:48px;min-height:48px;border:0;border-radius:8px;background:#1c2838;color:#f4efe2}#top{position:absolute;left:0;right:0;top:0;height:${HUD_TOP}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#menu{width:48px;height:48px;margin-left:auto}#recentre{width:48px;height:48px;flex:none}#banner{position:absolute;left:0;right:64px;top:0;height:${HUD_TOP}px;box-sizing:border-box;background:#14213d;color:#e8c872;border-top:2px solid #e8c872;border-bottom:2px solid #e8c872}#plate{position:absolute;left:0;right:0;bottom:${ROW_FOOT}px;height:${PLATE_H}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#face{width:32px;height:32px;background:#2f6fad}#hp{width:120px;height:10px;background:#243044}#hp i{display:block;height:10px;background:#3dd68c}#row{position:absolute;left:0;right:0;bottom:24px;height:64px;display:flex;align-items:center;gap:8px;padding:0 8px}#end{margin-left:auto;margin-right:12px;outline:2px solid #2f6fad}#sheet{position:absolute;left:8px;right:8px;bottom:${ROW_FOOT + PLATE_H}px;max-height:35%;box-sizing:border-box;display:none;overflow:auto;background:#f4efe2;color:#1c140c;padding:8px;border-radius:8px;pointer-events:auto;font-size:16px}#sheet b{display:block}#sheet button{width:48px;height:48px}#veil{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,10,16,.72);pointer-events:auto}#card{background:#101826;padding:16px;border:2px solid #e8c872;text-align:center}#card button{margin:8px}#hud #banner{pointer-events:none}`;
export function createHud(act: Act): { hideBanner(): void; render(view: HudView): void } {
  const root = document.createElement("div"); root.id = "hud"; root.innerHTML = `<style>${css}</style><div id="top"><span id="pill"></span><button id="recentre" type="button">Recentre</button><button id="menu" type="button">Menu</button></div><button id="banner" type="button">YOUR TURN</button><div id="plate"><i id="face"></i><span id="who"></span><span id="hp"><i></i></span><span id="hpText"></span></div><div id="row"><button id="attack" type="button">Attack</button><button id="spell" type="button">Spell</button><button id="talk" type="button">Talk</button><button id="wait" type="button">Wait</button><button id="end" type="button">End turn</button></div><div id="sheet"><b></b><span></span><button id="close" type="button">Close</button></div><div id="veil"><div id="card"><h2></h2><p></p><p id="turns"></p><button id="restart" type="button">Restart</button><button id="back" type="button">Back</button></div></div>`;
  document.body.append(root);
  const q = (id: string): HTMLElement => { const n = root.querySelector(`#${id}`); if (!(n instanceof HTMLElement)) throw new Error(id); return n; };
  const banner = q("banner"), veil = q("veil"), sheet = q("sheet");
  const buttons: Record<"basic" | "spell" | "talk" | "wait" | "end", HTMLElement> = { basic: q("attack"), spell: q("spell"), talk: q("talk"), wait: q("wait"), end: q("end") };
  let held = true;
  const hideBanner = (): void => { held = false; banner.style.display = "none"; };
  banner.addEventListener("click", hideBanner); q("menu").addEventListener("click", () => act.menu());
  q("attack").addEventListener("click", () => act.choose("basic")); q("spell").addEventListener("click", () => act.choose("spell"));
  q("talk").addEventListener("click", () => act.choose("talk")); q("wait").addEventListener("click", () => act.wait()); q("end").addEventListener("click", () => act.endTurn());
  q("recentre").addEventListener("click", () => act.recentre()); q("close").addEventListener("click", () => act.closeTalk());
  q("restart").addEventListener("click", () => act.restart()); q("back").addEventListener("click", () => act.restart());
  window.setTimeout(hideBanner, 1260);
  const render = (view: HudView): void => {
    q("pill").textContent = view.turn; banner.textContent = view.turn; banner.style.background = view.side === "player" ? "#14213d" : "#6b1d2a";
    q("plate").style.display = view.selected ? "flex" : "none"; q("who").textContent = view.name; q("hpText").textContent = `${view.hp}/${view.max}`;
    const bar = q("hp").querySelector("i"); if (bar instanceof HTMLElement) bar.style.width = `${view.max <= 0 ? 0 : Math.max(0, Math.min(120, Math.round((120 * view.hp) / view.max)))}px`;
    q("end").style.outlineColor = view.side === "player" ? "#2f6fad" : "#b23b32";
    for (const key of ["basic", "spell", "talk", "wait", "end"] as const) { const b = buttons[key], row = view.actions[key]; b.style.display = row.show ? "block" : "none"; b.style.opacity = row.on ? "1" : "0.4"; }
    const said = view.talk; sheet.style.display = said === null ? "none" : "block"; if (said !== null) { const name = sheet.querySelector("b"), text = sheet.querySelector("span"); if (name !== null) name.textContent = said.name; if (text !== null) text.textContent = said.text === "" ? "…" : said.text; }
    const over = view.outcome !== null; veil.style.display = over ? "flex" : "none";
    const title = q("card").querySelector("h2"), blurb = q("card").querySelector("p");
    if (over && title !== null && blurb !== null) { title.textContent = view.outcome === "win" ? "Victory" : view.outcome === "lose" ? "Defeat" : "Draw"; blurb.textContent = view.outcome === "lose" ? "Your units fell" : "All enemies defeated"; q("turns").textContent = `${view.turns} turns`; }
    if (!held) banner.style.display = "none";
  };
  return { hideBanner, render };
}
`````

### `tools/play-stage/match.ts` (edited)
Diff `1b834c31..9a9ca90e`:

`````diff
diff --git a/tools/play-stage/match.ts b/tools/play-stage/match.ts
index 0bc1e50..46af828 100644
--- a/tools/play-stage/match.ts
+++ b/tools/play-stage/match.ts
@@ -22,7 +22,8 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
   const win = installOne(WIN_CONDITION, {});
   if (win.out === null) throw new Error("play: win-condition");
   const wiped = wipeRule(win.out, SIDES);
-  let side: Side = "player", outcome: Outcome | null = null, talk: Talk | null = null, round = 1, turns = 0, queue: Action[] = [];
+  let side: Side = "player", outcome: Outcome | null = null, talk: Talk | null = null, round = 1, turns = 0, queue: Action[] = [], armed: "unitSelected" | "actMenu" | null = null;
+  const spent = new Set<string>();
   const spellList = (id: string): { id: string }[] => {
     const actor = play.world.units.get(id), bag = rules.abilities;
     if (actor === undefined) return [];
@@ -42,7 +43,7 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
     const i = SIDES.indexOf(side), last = i + 1 >= SIDES.length;
     go({ type: "CHECK_NONE", next: last ? "roundEnd" : "sideStart" });
     if (last) { go({ type: "ROUND_END" }); round += 1; go({ type: "ROUND_BEGIN" }); }
-    side = SIDES[(i + 1) % SIDES.length] ?? "player"; go({ type: "SIDE_BEGIN" }); return false;
+    side = SIDES[(i + 1) % SIDES.length] ?? "player"; if (side === "player") spent.clear(); go({ type: "SIDE_BEGIN" }); return false;
   };
   const landMove = (action: Action): boolean => {
     const at = action.target !== null && action.target.pipe === "tile" ? action.target.at : undefined, unit = play.world.units.get(action.actor);
@@ -67,6 +68,7 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
   /** Ability confirm lands in `resolving`. Walk the legal edges back to `idle` (or `play.result` on a wipe) so the player can select again and End turn. Talk stays on `actMenu` and does not take `UNIT_DONE`. */
   const settle = (): void => {
     if (play.world.phases.battle !== "resolving") return;
+    if (play.selected !== null) spent.add(play.selected);
     go({ type: "RESOLVE_DONE" });
     const got = wiped(play.world, { round, side });
     if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return; }
@@ -75,6 +77,13 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
     play.followId = null;
   };
   play.landed(() => { if (side !== "wolves") return; go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); pump(); });
+  const wipe = (): void => { play.aims = []; talk = null; play.focus(null); play.followId = null; };
+  const back = (): "unitSelected" | "actMenu" | null => {
+    if (play.world.phases.battle !== "targeting") return null;
+    const from = armed === "unitSelected" ? "unitSelected" : "actMenu";
+    baseIntend({ type: "Cancel" }); if (from === "unitSelected") go({ type: "UNDO_MOVE" }); armed = null; return from;
+  };
+  const spend = (): void => { if (play.world.phases.battle !== "actMenu") return; if (play.selected !== null) spent.add(play.selected); go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); play.followId = null; };
   const api = Object.assign(play, {
     intend(intent: DoorIntent) {
       const step = baseIntend(intent);
@@ -90,13 +99,29 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
     sync() { baseSync(); },
     choose(kind: "basic" | "spell" | "talk"): string | null {
       const id = play.selected; if (id === null) return "noUnit";
+      const list = kind === "spell" ? spellList(id) : targetsFor(play.world.grid, play.world.units, id, kind === "talk" ? "interact" : "basic", rules);
+      if (list.length === 0) return "noTarget";
+      const from = play.world.phases.battle;
       const step = baseIntend({ type: "ChooseAction", actionId: kind === "talk" ? "interact" : kind, unitId: id });
       if (!("reject" in step) || step.reject !== null) return "reject" in step && step.reject !== null ? step.reject : "illegal";
-      const list = kind === "spell" ? spellList(id) : targetsFor(play.world.grid, play.world.units, id, kind === "talk" ? "interact" : "basic", rules);
+      armed = from === "unitSelected" ? "unitSelected" : "actMenu";
       play.aims = cells(list); play.aimKind = kind === "spell" ? "spell" : "basic"; return null;
     },
-    wait() { if (play.world.phases.battle !== "actMenu") return; go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); play.followId = null; },
-    endTurn() { if (play.world.phases.battle === "actMenu") api.wait(); if (side === "player") turns += 1; if (finish()) return; if (side === "wolves") { queue = [...play.bot(play.world, side)]; pump(); } },
+    wait() { spend(); },
+    endTurn() {
+      if (play.walk !== null || side !== "player" || outcome !== null) return;
+      if (play.world.phases.battle === "targeting") back();
+      const now = play.world.phases.battle;
+      if (now === "actMenu") spend(); else if (now === "unitSelected") baseIntend({ type: "Cancel" });
+      wipe(); turns += 1; if (finish()) return; const next = ((): Side => side)(); if (next === "wolves") { queue = [...play.bot(play.world, next)]; pump(); }
+    },
+    closeTalk() { talk = null; if (play.world.phases.battle === "actMenu") spend(); play.focus(null); },
+    recentreTarget(): Sq | null {
+      const cur = play.selected === null ? undefined : play.world.units.get(play.selected);
+      if (cur !== undefined && cur.alive) return { c: cur.at.c, r: cur.at.r };
+      const own = play.world.units.all().find((u) => u.alive && u.side === "player");
+      return own === undefined ? null : { c: own.at.c, r: own.at.r };
+    },
     restart: () => createMatch(docs, moveMs),
     view() {
       const id = play.selected, unit = id === null ? undefined : play.world.units.get(id), phase = play.world.phases.battle, on = unit !== undefined && unit.alive;
@@ -115,5 +140,33 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
   Object.defineProperty(api, "side", { get: () => side });
   Object.defineProperty(api, "outcome", { get: () => outcome });
   Object.defineProperty(api, "talk", { get: () => talk });
-  return api as typeof api & { readonly side: Side; readonly outcome: Outcome | null; readonly talk: Talk | null };
+  Object.defineProperty(api, "done", { get: () => spent });
+  const same = (a: Sq, b: Sq): boolean => a.c === b.c && a.r === b.r;
+  const listed = (list: readonly Sq[], at: Sq): boolean => list.some((c) => same(c, at));
+  const atOf = (intent: DoorIntent): Sq | null => {
+    if (intent.type === "TargetCell") return intent.at;
+    if (intent.type !== "SelectUnit") return null;
+    const u = play.world.units.get(intent.unitId); return u === undefined ? null : u.at;
+  };
+  const ready = (id: string): boolean => { const u = play.world.units.get(id); return u !== undefined && u.alive && u.side === "player" && !spent.has(id); };
+  const commit = (at: Sq): unknown => { const cell = { c: at.c, r: at.r }; api.intend({ type: "TargetCell", at: cell }); return api.intend({ type: "TargetCell", at: cell }); };
+  play.feed = (intent: DoorIntent): unknown => {
+    if (talk !== null || play.walk !== null || side !== "player" || outcome !== null) return undefined;
+    const phase = play.world.phases.battle, at = atOf(intent);
+    if (phase === "targeting" && at !== null && listed(play.aims, at)) return commit(at);
+    if (phase === "targeting") {
+      const from = back(); play.aims = []; talk = null; play.followId = null;
+      if (intent.type === "SelectUnit" && ready(intent.unitId) && intent.unitId !== play.selected) { if (from !== "unitSelected") spend(); return api.intend(intent); }
+      return undefined;
+    }
+    if (intent.type === "SelectUnit" && !ready(intent.unitId)) return undefined;
+    if (phase === "unitSelected" && intent.type === "TargetCell") {
+      if (at !== null && listed(play.reach, at)) return commit(at);
+      baseIntend({ type: "Cancel" }); wipe(); return undefined;
+    }
+    if (phase === "actMenu" && intent.type === "SelectUnit" && intent.unitId !== play.selected) { spend(); return api.intend(intent); }
+    if (phase === "actMenu" && intent.type === "SelectUnit") return undefined;
+    return api.intend(intent);
+  };
+  return api as typeof api & { readonly side: Side; readonly outcome: Outcome | null; readonly talk: Talk | null; readonly done: ReadonlySet<string> };
 }
`````

Full file at `9a9ca90e`:

`````ts
import type { Action } from "../../src/core/log/index.ts";
import { inOrthogonalReach, targetsFor, wipeRule, WIN_CONDITION } from "../../src/rules/battle/index.ts";
import { installOne } from "../../src/rules/behaviours/registry.ts";
import { walkTo } from "../../src/rules/move/path.ts";
import { submit } from "../../src/sim/actions.ts";
import type { DoorIntent } from "../../src/sim/types.ts";
import type { Outcome } from "../../src/state/index.ts";
import type { Sq } from "../../src/types/core-types.ts";
import { createPlay, spellRef } from "./board.ts";
import { DEMO_SETUP, DEMO_TALK, recipeOf, type PlayDocs } from "./load.ts";

/** Orthogonal reach of the demo line-shot when a row omits reach. Not an engine rule. */
export const DEFAULT_SPELL_REACH = 3;
const SIDES = ["player", "wolves"] as const;
type Side = (typeof SIDES)[number];
type Talk = { readonly name: string; readonly text: string };
type Btn = { readonly show: boolean; readonly on: boolean };

export function createMatch(docs?: PlayDocs, moveMs = 200) {
  const play = createPlay(docs, moveMs, false), rules = docs?.rules ?? DEMO_SETUP, lines = docs?.talk ?? DEMO_TALK;
  const baseIntend = play.intend, baseSync = play.sync;
  const win = installOne(WIN_CONDITION, {});
  if (win.out === null) throw new Error("play: win-condition");
  const wiped = wipeRule(win.out, SIDES);
  let side: Side = "player", outcome: Outcome | null = null, talk: Talk | null = null, round = 1, turns = 0, queue: Action[] = [], armed: "unitSelected" | "actMenu" | null = null;
  const spent = new Set<string>();
  const spellList = (id: string): { id: string }[] => {
    const actor = play.world.units.get(id), bag = rules.abilities;
    if (actor === undefined) return [];
    const row = bag !== undefined && Object.hasOwn(bag, actor.unitId) ? bag[actor.unitId]?.[0] : undefined;
    const reach = row?.reach ?? DEFAULT_SPELL_REACH, out: { id: string }[] = [];
    for (const foe of play.world.units.all()) if (foe.alive && foe.id !== actor.id && foe.side !== actor.side && foe.side !== "neutral" && inOrthogonalReach(actor.at, foe.at, reach)) out.push({ id: foe.id });
    return out;
  };
  const cells = (list: readonly { id: string }[]): Sq[] => list.flatMap((t) => { const u = play.world.units.get(t.id); return u === undefined ? [] : [u.at]; });
  const go = (e: Parameters<typeof play.go>[0]): void => { play.go(e); };
  const finish = (): boolean => {
    const from = play.world.phases.battle;
    if (from !== "idle" && from !== "unitSelected") return false;
    go({ type: "END_TURN" }); go({ type: "SIDE_END" });
    const got = wiped(play.world, { round, side });
    if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return true; }
    const i = SIDES.indexOf(side), last = i + 1 >= SIDES.length;
    go({ type: "CHECK_NONE", next: last ? "roundEnd" : "sideStart" });
    if (last) { go({ type: "ROUND_END" }); round += 1; go({ type: "ROUND_BEGIN" }); }
    side = SIDES[(i + 1) % SIDES.length] ?? "player"; if (side === "player") spent.clear(); go({ type: "SIDE_BEGIN" }); return false;
  };
  const landMove = (action: Action): boolean => {
    const at = action.target !== null && action.target.pipe === "tile" ? action.target.at : undefined, unit = play.world.units.get(action.actor);
    if (at === undefined || unit === undefined) return false;
    play.focus(action.actor); play.followId = action.actor; go({ type: "SELECT_UNIT", unitId: action.actor });
    const path = walkTo(play.world.grid, play.world.units, action.actor, play.step.reach, at);
    if (path === null || path.length === 0) return false;
    go({ type: "TAP_MOVE_CELL", at: { c: at.c, r: at.r } });
    const dur = moveMs * path.length;
    submit(play.world, { ...action, durationMs: dur });
    play.arm({ path, from: { c: unit.at.c, r: unit.at.r }, t0: play.world.clock.now(), dur });
    return play.walk !== null;
  };
  const pump = (): void => {
    while (queue.length > 0 && play.walk === null) {
      const action = queue.shift(); if (action === undefined) break;
      if (action.kind === "move" && landMove(action)) return;
      if (action.kind !== "move") submit(play.world, action);
    }
    if (queue.length === 0 && play.walk === null && side === "wolves" && !finish() && side === "wolves") { queue = [...play.bot(play.world, "wolves")]; pump(); }
  };
  /** Ability confirm lands in `resolving`. Walk the legal edges back to `idle` (or `play.result` on a wipe) so the player can select again and End turn. Talk stays on `actMenu` and does not take `UNIT_DONE`. */
  const settle = (): void => {
    if (play.world.phases.battle !== "resolving") return;
    if (play.selected !== null) spent.add(play.selected);
    go({ type: "RESOLVE_DONE" });
    const got = wiped(play.world, { round, side });
    if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return; }
    go({ type: "CHECK_NONE", next: "unitDone" });
    go({ type: "UNIT_DONE", next: "idle" });
    play.followId = null;
  };
  play.landed(() => { if (side !== "wolves") return; go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); pump(); });
  const wipe = (): void => { play.aims = []; talk = null; play.focus(null); play.followId = null; };
  const back = (): "unitSelected" | "actMenu" | null => {
    if (play.world.phases.battle !== "targeting") return null;
    const from = armed === "unitSelected" ? "unitSelected" : "actMenu";
    baseIntend({ type: "Cancel" }); if (from === "unitSelected") go({ type: "UNDO_MOVE" }); armed = null; return from;
  };
  const spend = (): void => { if (play.world.phases.battle !== "actMenu") return; if (play.selected !== null) spent.add(play.selected); go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); play.followId = null; };
  const api = Object.assign(play, {
    intend(intent: DoorIntent) {
      const step = baseIntend(intent);
      if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "interact") {
        const target = step.action.target, id = target !== null && target.pipe === "unit" ? target.unitId : undefined, u = id === undefined ? undefined : play.world.units.get(id);
        const key = u === undefined ? "" : `talk-${u.unitId}`;
        const text = Object.hasOwn(lines, key) ? lines[key] ?? "" : Object.hasOwn(lines, "talk-villager") ? lines["talk-villager"] ?? "" : "";
        talk = { name: u === undefined ? "" : recipeOf(u.unitId).name, text };
        play.world.phases = { ...play.world.phases, battle: "actMenu" };
      } else if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "ability") settle();
      return step;
    },
    sync() { baseSync(); },
    choose(kind: "basic" | "spell" | "talk"): string | null {
      const id = play.selected; if (id === null) return "noUnit";
      const list = kind === "spell" ? spellList(id) : targetsFor(play.world.grid, play.world.units, id, kind === "talk" ? "interact" : "basic", rules);
      if (list.length === 0) return "noTarget";
      const from = play.world.phases.battle;
      const step = baseIntend({ type: "ChooseAction", actionId: kind === "talk" ? "interact" : kind, unitId: id });
      if (!("reject" in step) || step.reject !== null) return "reject" in step && step.reject !== null ? step.reject : "illegal";
      armed = from === "unitSelected" ? "unitSelected" : "actMenu";
      play.aims = cells(list); play.aimKind = kind === "spell" ? "spell" : "basic"; return null;
    },
    wait() { spend(); },
    endTurn() {
      if (play.walk !== null || side !== "player" || outcome !== null) return;
      if (play.world.phases.battle === "targeting") back();
      const now = play.world.phases.battle;
      if (now === "actMenu") spend(); else if (now === "unitSelected") baseIntend({ type: "Cancel" });
      wipe(); turns += 1; if (finish()) return; const next = ((): Side => side)(); if (next === "wolves") { queue = [...play.bot(play.world, next)]; pump(); }
    },
    closeTalk() { talk = null; if (play.world.phases.battle === "actMenu") spend(); play.focus(null); },
    recentreTarget(): Sq | null {
      const cur = play.selected === null ? undefined : play.world.units.get(play.selected);
      if (cur !== undefined && cur.alive) return { c: cur.at.c, r: cur.at.r };
      const own = play.world.units.all().find((u) => u.alive && u.side === "player");
      return own === undefined ? null : { c: own.at.c, r: own.at.r };
    },
    restart: () => createMatch(docs, moveMs),
    view() {
      const id = play.selected, unit = id === null ? undefined : play.world.units.get(id), phase = play.world.phases.battle, on = unit !== undefined && unit.alive;
      const max = unit === undefined ? 0 : (Object.hasOwn(rules.stats, unit.unitId) ? rules.stats[unit.unitId]?.hp : rules.base.hp) ?? rules.base.hp;
      const hp = on ? play.world.rules?.state().units.find((u) => u.id === unit.id)?.hp ?? max : 0;
      const menu = on && (phase === "unitSelected" || phase === "actMenu" || phase === "targeting");
      const basic = on ? targetsFor(play.world.grid, play.world.units, unit.id, "basic", rules) : [], interact = on ? targetsFor(play.world.grid, play.world.units, unit.id, "interact", rules) : [], spells = on ? spellList(unit.id) : [];
      const btn = (show: boolean, hot: boolean): Btn => ({ show, on: hot });
      const spellOn = on && spellRef(rules, unit.unitId) !== undefined;
      return {
        turn: side === "player" ? "YOUR TURN" : "ENEMY TURN", side, name: on ? recipeOf(unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
        actions: { basic: btn(menu, basic.length > 0), spell: btn(menu && spellOn, spells.length > 0), talk: btn(on && interact.length > 0, interact.length > 0), wait: btn(phase === "actMenu", phase === "actMenu"), end: btn(true, true) },
      };
    },
  });
  Object.defineProperty(api, "side", { get: () => side });
  Object.defineProperty(api, "outcome", { get: () => outcome });
  Object.defineProperty(api, "talk", { get: () => talk });
  Object.defineProperty(api, "done", { get: () => spent });
  const same = (a: Sq, b: Sq): boolean => a.c === b.c && a.r === b.r;
  const listed = (list: readonly Sq[], at: Sq): boolean => list.some((c) => same(c, at));
  const atOf = (intent: DoorIntent): Sq | null => {
    if (intent.type === "TargetCell") return intent.at;
    if (intent.type !== "SelectUnit") return null;
    const u = play.world.units.get(intent.unitId); return u === undefined ? null : u.at;
  };
  const ready = (id: string): boolean => { const u = play.world.units.get(id); return u !== undefined && u.alive && u.side === "player" && !spent.has(id); };
  const commit = (at: Sq): unknown => { const cell = { c: at.c, r: at.r }; api.intend({ type: "TargetCell", at: cell }); return api.intend({ type: "TargetCell", at: cell }); };
  play.feed = (intent: DoorIntent): unknown => {
    if (talk !== null || play.walk !== null || side !== "player" || outcome !== null) return undefined;
    const phase = play.world.phases.battle, at = atOf(intent);
    if (phase === "targeting" && at !== null && listed(play.aims, at)) return commit(at);
    if (phase === "targeting") {
      const from = back(); play.aims = []; talk = null; play.followId = null;
      if (intent.type === "SelectUnit" && ready(intent.unitId) && intent.unitId !== play.selected) { if (from !== "unitSelected") spend(); return api.intend(intent); }
      return undefined;
    }
    if (intent.type === "SelectUnit" && !ready(intent.unitId)) return undefined;
    if (phase === "unitSelected" && intent.type === "TargetCell") {
      if (at !== null && listed(play.reach, at)) return commit(at);
      baseIntend({ type: "Cancel" }); wipe(); return undefined;
    }
    if (phase === "actMenu" && intent.type === "SelectUnit" && intent.unitId !== play.selected) { spend(); return api.intend(intent); }
    if (phase === "actMenu" && intent.type === "SelectUnit") return undefined;
    return api.intend(intent);
  };
  return api as typeof api & { readonly side: Side; readonly outcome: Outcome | null; readonly talk: Talk | null; readonly done: ReadonlySet<string> };
}
`````

### `tools/play-stage/page.ts` (edited)
Diff `1b834c31..9a9ca90e`:

`````diff
diff --git a/tools/play-stage/page.ts b/tools/play-stage/page.ts
index dadaf6a..5dfee4c 100644
--- a/tools/play-stage/page.ts
+++ b/tools/play-stage/page.ts
@@ -2,10 +2,11 @@ import { createDriver, type HostCanvas, type HostEnv } from "../../src/runtime/h
 import { createLighting, fitView } from "../../src/runtime/render/index.ts";
 import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
 import { boardBox, fit, TILE } from "./board.ts";
-import { centreOn, createCam, pan, seatCam, tickCam, zoomAt, type PlayCam } from "./camera-touch.ts";
+import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
 import { createHud } from "./hud.ts";
 import { litPlan, picturesOf, sourceOf } from "./looks.ts";
 import { createMatch } from "./match.ts";
+import { createTouch } from "./touch.ts";
 import { DEV } from "./dev.ts"; // dev-only
 
 const canvas = document.querySelector("#board");
@@ -32,9 +33,8 @@ const load = (id: string): Promise<OffscreenCanvas> => {
 };
 const hud = createHud({
   choose: (kind) => match.choose(kind), wait: () => match.wait(), endTurn: () => match.endTurn(), menu: () => undefined,
-  restart: () => location.reload(),
+  restart: () => location.reload(), closeTalk: () => match.closeTalk(), recentre: () => { const at = match.recentreTarget(); if (at === null) return; const b = band(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, at, f, 0, TILE, 0); clamp(cam, f, match.world.grid.cols, match.world.grid.rows); },
 });
-const placed = (): { s: number; padX: number; padY: number } => { const box = band(); return { s: cam.s, padX: box.padX, padY: box.padY }; };
 const driver = createDriver({
   env, canvas: canvas as HostCanvas, clock: match.world.clock, clear: "#0d1220", load, pixels,
   view: () => {
@@ -45,33 +45,8 @@ const driver = createDriver({
     return { scene: link.scene(match.scene(), { tMs: match.world.clock.now(), stepMs: match.world.clock.stepMs }), lights: litPlan(lighting, match.looks, link.lit), shake: link.shake, x: cam.x, y: cam.y, s: cam.s };
   },
 });
-const send = (kind: "down" | "move" | "up" | "cancel", e: PointerEvent): void => {
-  const box = placed(), ratio = dpr();
-  const pointer = e.pointerType === "pen" ? "pen" : e.pointerType === "touch" ? "touch" : "mouse";
-  match.pointer({ kind, id: e.pointerId, pointer, x: (e.offsetX * ratio - box.padX) / box.s, y: (e.offsetY * ratio - box.padY) / box.s, ms: Math.max(0, Math.round(e.timeStamp)) });
-};
-const pts = new Map<number, { x: number; y: number }>();
-let drag = false, anchor = { x: 0, y: 0 }, lastTap = 0;
-const centre = (e: PointerEvent): void => {
-  const box = band(), ratio = dpr(), x = (e.offsetX * ratio - box.padX) / cam.s, y = (e.offsetY * ratio - box.padY) / cam.s;
-  const unit = match.world.units.all().find((u) => u.alive && u.at.c === Math.floor(x / TILE) && u.at.r === Math.floor(y / TILE));
-  if (unit !== undefined) { centreOn(cam, unit.at, fitView(box.devW, box.devH, cam.s, TILE, TILE), 0, TILE, 0); match.followId = unit.id; }
-};
-canvas.addEventListener("pointerdown", (e) => { pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); drag = false; anchor = { x: e.clientX, y: e.clientY }; if (pts.size === 1) send("down", e); });
-canvas.addEventListener("pointermove", (e) => {
-  const prev = pts.get(e.pointerId); if (prev === undefined) return;
-  if (pts.size >= 2) {
-    const before = [...pts.values()]; pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); const after = [...pts.values()];
-    const a = before[0], b = before[1], c = after[0], d = after[1];
-    if (a !== undefined && b !== undefined && c !== undefined && d !== undefined) { const was = Math.hypot(a.x - b.x, a.y - b.y) || 1, now = Math.hypot(c.x - d.x, c.y - d.y) || 1, box = band(); zoomAt(cam, cam.s * (now / was), box.devW, box.devH, match.world.grid.cols * TILE, match.world.grid.rows * TILE, e.offsetX * dpr(), e.offsetY * dpr(), dpr()); }
-    return;
-  }
-  const dx = e.clientX - prev.x, dy = e.clientY - prev.y; pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
-  if (!drag && Math.hypot(e.clientX - anchor.x, e.clientY - anchor.y) > 8) { drag = true; send("cancel", e); }
-  if (drag) pan(cam, -dx, -dy); else send("move", e);
-});
-canvas.addEventListener("pointerup", (e) => { pts.delete(e.pointerId); if (!drag && e.timeStamp - lastTap < 280) { lastTap = 0; centre(e); } else if (!drag) { lastTap = e.timeStamp; send("up", e); } drag = false; });
-canvas.addEventListener("pointercancel", (e) => { pts.delete(e.pointerId); send("cancel", e); });
+const touch = createTouch({ match, cam, box: () => { const ratio = dpr(), rect = canvas.getBoundingClientRect(), raw = canvas.width === 300 && canvas.height === 150, devW = !raw && canvas.width > 0 ? canvas.width : canvas.clientWidth * ratio, devH = !raw && canvas.height > 0 ? canvas.height : canvas.clientHeight * ratio; return { devW, devH, kx: rect.width > 0 && !raw && canvas.width > 0 ? canvas.width / rect.width : ratio, ky: rect.height > 0 && !raw && canvas.height > 0 ? canvas.height / rect.height : ratio, cols: match.world.grid.cols, rows: match.world.grid.rows }; } });
+for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType }; if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
 const place = (): void => { const box = boardBox(innerHeight); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px` }); };
 place(); addEventListener("resize", () => { place(); seated = false; });
 seat();
`````

Full file at `9a9ca90e`:

`````ts
import { createDriver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
import { createLighting, fitView } from "../../src/runtime/render/index.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { boardBox, fit, TILE } from "./board.ts";
import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
import { createHud } from "./hud.ts";
import { litPlan, picturesOf, sourceOf } from "./looks.ts";
import { createMatch } from "./match.ts";
import { createTouch } from "./touch.ts";
import { DEV } from "./dev.ts"; // dev-only

const canvas = document.querySelector("#board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
const match = createMatch();
const link = createSceneLink(sourceOf((id) => match.pixels(id))), lighting = createLighting(), pixels = picturesOf((id) => match.pixels(id), link);
const cam: PlayCam = createCam(1);
let seated = false;
const dpr = (): number => devicePixelRatio || 1;
const band = (): { s: number; padX: number; padY: number; devW: number; devH: number } => {
  const ratio = dpr(), devW = canvas.clientWidth * ratio, devH = canvas.clientHeight * ratio;
  return { ...fit(devW, devH, match.world.grid.cols, match.world.grid.rows, ratio), devW, devH };
};
const seat = (): void => { const box = band(); if (canvas.clientWidth > 0) { seatCam(cam, box.s, dpr()); seated = true; } };
const env = { requestAnimationFrame: (cb: (ts: number) => void) => requestAnimationFrame(cb), cancelAnimationFrame: (id: number) => cancelAnimationFrame(id), document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return devicePixelRatio; } } as HostEnv;
const load = (id: string): Promise<OffscreenCanvas> => {
  const px = pixels(id);
  if (px === undefined) return Promise.reject(new Error(id));
  const baked = new OffscreenCanvas(px.w, px.h), g = baked.getContext("2d");
  if (g === null) return Promise.reject(new Error(id));
  const image = new ImageData(new Uint8ClampedArray(px.data), px.w, px.h);
  g.putImageData(image, 0, 0);
  return Promise.resolve(baked);
};
const hud = createHud({
  choose: (kind) => match.choose(kind), wait: () => match.wait(), endTurn: () => match.endTurn(), menu: () => undefined,
  restart: () => location.reload(), closeTalk: () => match.closeTalk(), recentre: () => { const at = match.recentreTarget(); if (at === null) return; const b = band(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, at, f, 0, TILE, 0); clamp(cam, f, match.world.grid.cols, match.world.grid.rows); },
});
const driver = createDriver({
  env, canvas: canvas as HostCanvas, clock: match.world.clock, clear: "#0d1220", load, pixels,
  view: () => {
    if (!seated) seat();
    const box = band(), shown = fitView(box.devW, box.devH, cam.s, TILE, TILE);
    if (match.followId !== null) { const u = match.world.units.get(match.followId); if (u !== undefined) tickCam(cam, 16, u.at, shown); }
    hud.render(match.view());
    return { scene: link.scene(match.scene(), { tMs: match.world.clock.now(), stepMs: match.world.clock.stepMs }), lights: litPlan(lighting, match.looks, link.lit), shake: link.shake, x: cam.x, y: cam.y, s: cam.s };
  },
});
const touch = createTouch({ match, cam, box: () => { const ratio = dpr(), rect = canvas.getBoundingClientRect(), raw = canvas.width === 300 && canvas.height === 150, devW = !raw && canvas.width > 0 ? canvas.width : canvas.clientWidth * ratio, devH = !raw && canvas.height > 0 ? canvas.height : canvas.clientHeight * ratio; return { devW, devH, kx: rect.width > 0 && !raw && canvas.width > 0 ? canvas.width / rect.width : ratio, ky: rect.height > 0 && !raw && canvas.height > 0 ? canvas.height / rect.height : ratio, cols: match.world.grid.cols, rows: match.world.grid.rows }; } });
for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType }; if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
const place = (): void => { const box = boardBox(innerHeight); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px` }); };
place(); addEventListener("resize", () => { place(); seated = false; });
seat();
if (DEV) Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud, __fx: match.fx, __link: link }); // dev-only
driver.start();
`````

### `tools/play-stage/touch.ts` (new)

`````ts
import type { PointerSample } from "../../src/runtime/input/types.ts";
import { fitView } from "../../src/runtime/render/index.ts";
import { TILE } from "./board.ts";
import { clamp, pan, zoomAt, type PlayCam } from "./camera-touch.ts";

export type TouchEv = { readonly id: number; readonly offsetX: number; readonly offsetY: number; readonly clientX: number; readonly clientY: number; readonly timeStamp: number; readonly pointerType: string };
export type TouchBox = { readonly devW: number; readonly devH: number; readonly kx: number; readonly ky: number; readonly cols: number; readonly rows: number };
type Pt = { x: number; y: number; ox: number; oy: number };
type Pinch = { dist: number; x: number; y: number; s: number };

/** Pointer gestures for the play page. No DOM globals: the page owns capture. */
export function createTouch(o: { match: { pointer(s: PointerSample): void }; cam: PlayCam; box: () => TouchBox }): {
  down(e: TouchEv): void; move(e: TouchEv): void; up(e: TouchEv): void; cancel(e: TouchEv): void; hit(offsetX: number, offsetY: number): { x: number; y: number };
} {
  const pts = new Map<number, Pt>();
  let drag = false, pinch = false, armed: number | null = null, base: Pinch | null = null, ax = 0, ay = 0, clock = 0;
  const ptr = (t: string): PointerSample["pointer"] => (t === "pen" || t === "touch" ? t : "mouse");
  const hit = (ox: number, oy: number): { x: number; y: number } => {
    const b = o.box(), f = fitView(b.devW, b.devH, o.cam.s, TILE, TILE);
    return { x: (ox * b.kx - f.padX) / f.s + o.cam.x, y: (oy * b.ky - f.padY) / f.s + o.cam.y };
  };
  const send = (kind: PointerSample["kind"], e: TouchEv, id = e.id): void => {
    const h = hit(e.offsetX, e.offsetY), ms = Math.max(clock, Math.max(0, Math.round(e.timeStamp))); clock = ms;
    o.match.pointer({ kind, id, pointer: ptr(e.pointerType), x: h.x, y: h.y, ms });
  };
  const put = (e: TouchEv): void => { pts.set(e.id, { x: e.clientX, y: e.clientY, ox: e.offsetX, oy: e.offsetY }); };
  const pair = (): [Pt, Pt] | null => { const v = [...pts.values()], a = v[0], b = v[1]; return a !== undefined && b !== undefined ? [a, b] : null; };
  const reset = (e: TouchEv): void => { if (armed !== null) send("cancel", e, armed); pts.clear(); drag = false; pinch = false; armed = null; base = null; };
  return {
    hit,
    down(e) {
      put(e);
      if (pts.size === 1) { drag = false; pinch = false; base = null; armed = e.id; ax = e.clientX; ay = e.clientY; send("down", e); return; }
      if (armed !== null) send("cancel", e, armed);
      const pr = pair();
      pinch = true; drag = false; armed = null;
      base = { dist: pr === null ? 1 : Math.hypot(pr[0].x - pr[1].x, pr[0].y - pr[1].y) || 1, x: o.cam.x, y: o.cam.y, s: o.cam.s };
    },
    move(e) {
      if (pts.get(e.id) === undefined) return;
      const prev = pts.get(e.id);
      put(e);
      if (pinch && base !== null) {
        const pr = pair(); if (pr === null) return;
        const now = Math.hypot(pr[0].x - pr[1].x, pr[0].y - pr[1].y) || 1, b = o.box();
        o.cam.x = base.x; o.cam.y = base.y; o.cam.s = base.s;
        zoomAt(o.cam, base.s * (now / base.dist), b.devW, b.devH, b.cols * TILE, b.rows * TILE, ((pr[0].ox + pr[1].ox) / 2) * b.kx, ((pr[0].oy + pr[1].oy) / 2) * b.ky, b.kx);
        return;
      }
      const b = o.box();
      if (!drag && Math.hypot(e.clientX - ax, e.clientY - ay) >= 10) { drag = true; if (armed !== null) send("cancel", e, armed); armed = null; }
      if (drag && prev !== undefined) { const s = o.cam.s || 1; pan(o.cam, -((e.clientX - prev.x) * b.kx) / s, -((e.clientY - prev.y) * b.ky) / s); clamp(o.cam, fitView(b.devW, b.devH, o.cam.s, TILE, TILE), b.cols, b.rows); }
      else if (!drag) send("move", e);
    },
    up(e) {
      const wasP = pinch, wasD = drag; pts.delete(e.id);
      if (pts.size > 0) return;
      if (!wasP && !wasD && armed === e.id) send("up", e);
      pinch = false; drag = false; armed = null; base = null;
    },
    cancel(e) { if (pts.has(e.id)) reset(e); },
  };
}
`````
