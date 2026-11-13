## Testing the renderer (QA)

Owner: QA & Build Guard. Written 2026-11-13 (Europe/London) for `docs/research/renderer-research.md` (Engine Architect leads). Paste-ready section.
Reads against: ARCHITECTURE-v0 §0 (one clock, one rAF file), §12.1–12.6 (draw order, camera, chunks, Canvas2D decision, integer path, limits), §12.10 (effect size snap), §12.11 (memory meter); END-GAME-REQUIREMENTS §2 (no dev overlay in exports); the painter goldens (`docs/qa/goldens/`, `painter-golden-test-plan.md`); `tests/sim/speed-memory.test.ts` (gc + large-object heap style); `scripts/check-law.sh` and gh-pages `tools/check-pages.mjs` (rg/no-dependency gate style).

**Labels used on every number:** **[S]** sourced (link in Sources), **[D]** an existing TileEngine decision (doc §), **[M]** measured by QA on this box on 2026-11-13 (headless Chromium 158.0.8127.18, probes in `/workspace/qa-runs/renderer-probe/`), **[E]** QA estimate, to be re-calibrated on the first renderer build.

### R0. Principles

1. **Test the backing store, not the screen.** The pixel-exact gate reads the canvas's own pixels (`getImageData` or a Node rasteriser). Screenshots run through the compositor, CSS scaling and colour management. They are a second layer that only proves the canvas-to-CSS mapping.
2. **Two checks per artefact.** Our probes show that one check is not enough [M]. With smoothing off, a 0.5 px camera offset and a 2.5× scale add **no** foreign colour (palette closure: 0 foreign px), while a run-length check catches both. With smoothing on, palette closure catches it (108 and 96 foreign px). So every pixel test runs **palette closure + run-length + exact hash**.
3. **Zero tolerance on the integer path.** `advancedRender` false is the locked default [D §12.5]. Any differing byte fails, as with the painter goldens (§1.6 of the painter plan). Tolerance exists only in a separately named "blend" class (R1.6).
4. **Count work in CI and time it on devices.** CI runners have no GPU and noisy clocks. CI asserts on things it can count exactly: draw calls, chunk rebuilds, pixels covered, bytes held. Frame time is a trend check in CI and a pass/fail check on a real phone (R2).
5. **Laws stay laws.** `check:law` bans `performance.now` and any rAF outside `src/runtime/host/raf-driver.ts` [D §0]. Every timing probe therefore lives in tests, in `@te/devtools`, or reads the rAF timestamp the driver already receives. None lives in `src/`.

### R1. Golden-image and pixel-exact checks

#### R1.1 Two layers, same as the painter

| Layer | Runs where | What it proves | Gate |
|---|---|---|---|
| **L1: recording renderer (Node)** | `node --test` (green) | The draw list: every `drawImage`/`fillRect` the frame issues, with its args. Asserts integer args, the integer scale `s`, draw order §12.1, and counts. A tiny integer nearest-neighbour blitter in the test turns the list into RGBA, which gets hashed. | green |
| **L2: real canvas readback (browser)** | Playwright: Chromium headless shell, Firefox, WebKit | The browser's Canvas2D gives the same RGBA as L1 for the same draw list (`getImageData` on a `{colorSpace:"srgb", willReadFrequently:true}` context, as the painter's L2 did). | pixel suite |
| **L3: compositor screenshot** | Playwright `scale:"device"` at DPR 1, 2, 2.625, 2.75, 3 | The backing store maps 1:1 to device pixels, there is no CSS rescale, letterbox bars are correct, and `image-rendering: pixelated` is present. | pixel suite |

Why L1 can be green: the `Renderer` interface (`beginFrame, drawImage, fillRect, endFrame`, §12.4) is small enough to fake with no DOM. The painter goldens already show that a pure-JS RGBA hash is reproducible across V8, JSC and SpiderMonkey, and that `putImageData`→`getImageData` matches it in all three engines (24,576 px checked, 0 mismatches; `goldens/browser-results-2026-11-09.md`) [D]. L2 extends that claim from `putImageData` to integer-scaled `drawImage` with smoothing off.

#### R1.2 Whole-number scaling (1×/2×/3×/4×) and odd DPRs

- **Matrix [E]:** zoom steps `s ∈ {1,2,3,4}` × DPR `{1, 2, 2.625, 2.75, 3}` × viewports `{360×800, 411×731, 390×844, 731×411}` (portrait and landscape) × 2 fixture stages (one with a 32 px tile, one with a 48 px tile). Every PR runs the L1 slice (s 1–4, DPR 1 and 3). Nightly runs the full matrix on L2 and L3.
- **Why odd DPRs need their own test (measured [M]):** a canvas with a CSS-sized backing store (`width = cssWidth`) and `image-rendering: pixelated` produces art-pixel runs of **5/6** device px at DPR 2.625 and **6/5** at DPR 2.75. Those are uneven pixel widths, but no foreign colour appears, so only the run-length check fails. At integer DPRs the same bug gives even runs of the wrong width (4 at DPR 2, 6 at DPR 3), which a run-width == expected `s` check catches. The §12.5 design (backing = device px, CSS = backing/dpr) gave uniform runs of 2 at all five DPRs.
- **Backing-store assertions (L3, every viewport):**
  - `canvas.width === devicePixelContentBoxSize.inlineSize` where supported (Chromium) [S: web.dev, MDN];
  - elsewhere, `canvas.width === round(cssWidth × dpr)` and `getComputedStyle(canvas).width × dpr` within 0.5 px of `canvas.width`. WebKit has no `devicePixelContentBox` [S: caniuse, WebKit bug 219005]. In practice iPhones use DPR 2 or 3, but treat that as a reason for the fallback test, not proof the fallback is safe;
  - `getComputedStyle(canvas).imageRendering === "pixelated"` [S: MDN image-rendering].
- **Run-length check (`runsOK(row, s)`):** for every row and column inside the map rectangle, split the pixels into runs of equal colour. Every run that lies between two colour boundaries must have a length that is a multiple of `s`, and every run on a sprite edge must start at a coordinate ≡ camera phase (mod `s`). Fixture art uses a **1-px checker or stripe test tile**, so every art pixel boundary is a colour boundary. On normal art, equal neighbouring pixels merge runs, so the strict check runs only on the test tiles.

#### R1.3 Nearest-neighbour sampling and context state

- **Instrumented context (test mode only, like painter §1.7):** wrap `getContext` and record `imageSmoothingEnabled` at every `drawImage`. Fail on `true` while `advancedRender` is false. Also assert `colorSpace: "srgb"`, and `willReadFrequently` on any read-back canvas (EA decision 2 in the painter plan).
- **Resize resets context state.** Setting `canvas.width` reset `imageSmoothingEnabled` from `false` to `true` in Chromium [M]. The HTML spec says so too [S: HTML canvas]. §12.5 already says to re-set it after every resize. The test resizes, draws one frame, and asserts the recorded flag is `false`.
- **Palette closure:** `colours(output, mapRect) ⊆ colours(all source assets in view) ∪ {letterboxColour, background.colour, stock wall #20242C, grid/highlight colours} ∪ allowedBlend`. On the integer path with opaque art, `allowedBlend` is empty. Measured [M]: smoothing on → 108 foreign px on a 4×4 sprite at 3×; this is the blur detector.
- **Edge sharpness (cheap and redundant):** across every art-pixel boundary in the test tile, the device-px transition is a single step (no intermediate pixel). This follows from closure + run-length on the test tile, so implement it only if those two leave a gap.

#### R1.4 Snapped camera and letterboxing

- **Integer args:** L1 asserts every `dx, dy, dw, dh` is an integer and `dw = sw × s`, `dh = sh × s` on the integer path. Parallax offsets equal `round(cameraOffset × depth)` in whole art px [D §12.1].
- **Camera snap across easing:** drive the camera through the 120 ms smoothstep ease [D §12.2] with the test clock at 1 ms ticks. Every rendered frame's draw offset must equal `round(x × s)` device px. No frame may hold a fractional offset, including mid-ease and at pinch release.
- **Letterbox:** for viewport sizes that are not a multiple of `s × tile`, the bars are exactly `letterboxColour`, centred (floor/ceil split; EA to fix which side gets the odd pixel, see Q3). The map rectangle is a whole multiple of `s`. With `screenFit: crop`, there are no bars and the crop is centred. A fixture where the map is smaller than the view checks centring (§12.2 clamp).
- **Chunk seams sentinel:** set `letterboxColour`/background to `#FF00FF` (in no fixture palette). Any sentinel pixel inside the map rectangle means a seam or a gap between chunks or tiles. This one check also covers the scaled path's padding rule (§12.5).

#### R1.5 Deterministic pixels: what we control

| Source of non-determinism | Control |
|---|---|
| GPU vs software raster | CI has no GPU. Headless Chromium rasterises Canvas2D in software. Determinism holds per engine **revision**, so pin the Playwright version (it pins browser revisions) and record the UA in the manifest header, as `browser-results-2026-11-09.md` does. |
| Colour management | Playwright already launches Chromium with `--force-color-profile=srgb` (seen in playwright-core `chromiumSwitches.js`) [S]. Contexts are created with `colorSpace:"srgb"`. What a physical P3 screen shows can't be hashed, and stays a known limit (painter plan §1.3). |
| Premultiplied alpha | Canvas bitmaps are premultiplied, so `putImageData`→`getImageData` may change RGB where alpha < 255 [S: HTML spec]. **Rule:** goldens hash only fully opaque frames: fixtures draw an opaque background, and alpha=0 pixels are normalised to `0,0,0,0` before hashing. Translucent FX go to the blend class. |
| WebGL (future backend) | Chrome removed the automatic SwiftShader WebGL fallback. Opting in with `--enable-unsafe-swiftshader` is the supported path for headless testing [S: blink-dev]. Playwright 1.59 adds that flag itself [S: playwright-core source]. A WebGL backend gets **its own** goldens (`NEAREST`, `premultipliedAlpha` stated, `preserveDrawingBuffer:true` for `readPixels`). Equality with the Canvas2D goldens is checked only on opaque integer-path frames. |
| Fonts (damage numbers, HUD) | Use the engine's built-in pixel font (§13) for anything inside a golden. Exclude system-font text, or mask it in L3. |
| Time | Frames come from the one clock at fixed integer ms (CN-001). Tests feed rAF timestamps. The rAF driver is never free-running in a test. |

#### R1.6 Golden storage, diff and update workflow

- **Hashes, not PNGs, for L1/L2.** A manifest `renderer-goldens.json` stores `key → SHA-256(RGBA, row-major)` with key `stage/viewport/dpr/s/cameraStep/frame`, plus a roll-up hash, the same format as `painter-node-v8-size32.json`. It's small, the review diff shows which keys changed, and it can't be "fixed" by re-encoding a PNG.
- **PNGs only on failure:** write `expected.png`, `actual.png` and `diff.png`, and report the first differing pixel (x, y, expected RGBA, actual RGBA) and the diff count (painter plan §1.6).
- **L3 uses Playwright `toHaveScreenshot`** with `scale:"device"`, `threshold: 0`, and `maxDiffPixels: 0`. Defaults are `threshold 0.2` and `scale "css"` [S: Playwright], so both must be set explicitly. Leaving `scale` at `css` would throw away the device pixels the test is about.
- **Blend class (only where blending is designed in):** the scaled path (`advancedRender` on), translucent FX, and roof fade. Compare with pixelmatch `includeAA: true`, `threshold ≤ 0.05`, and `windowSize` so scattered ±1 noise passes but a compact regression fails [S: pixelmatch README]. The palette closure here uses `allowedBlend` = colours precomputed from the source pairs at the declared alphas, ±1 per channel [E].
- **Update workflow:**
  1. Goldens change only through `npm run pixels:bake` (name TBD), which bakes twice and refuses to write if the two bakes differ.
  2. CI never writes goldens, and `--update-snapshots` is banned in CI.
  3. A golden change needs EA sign-off in the step's hand-back, the same rule as the locked painter SHA.

### R2. Frame-rate and memory budgets on mid-range phones

#### R2.1 What the sources say

- **Frame budget:** 60 Hz = 16.7 ms per frame. Browsers need about 6 ms of that, which leaves about **10 ms for app work** per frame [S: web.dev RAIL]. rAF follows the display rate, whatever it is [S: web.dev jank-busting]. So 90/120 Hz phones call the driver more often, and the fixed-step clock must not assume 60.
- **rAF is throttled:** iOS Low Power Mode throttles rAF to about **30 fps** [S: WebKit bug 168837; motion.dev], and Safari throttles cross-origin iframes (relevant to itch.io embeds) until the user taps [S: motion.dev].
- **Thermal:** in a 20-minute 3DMark Wild Life stress test, an iPhone 11 Pro fell from 7,945 to 4,106, a **51.7 %** stability score. Snapdragon 865 phones kept **>99 %** [S: HotHardware]. Sustained speed therefore varies by device and has to be measured on the phone, not guessed.
- **Mid-range GPUs:** Notebookcheck's 3DMark Wild Life Unlimited averages are **Mali-G57 MP2 1,234** (Helio G99 / Dimensity 6x00 class) and **Adreno 619 1,130** (SD 480/695/750G) [S]. That makes these two a sensible "mid-range floor" pair. Our renderer is Canvas2D with chunk blits, so a GPU score is context, not a budget input (§12.4 point 2 [D]).
- **Canvas limits:** iOS ≤ 17 allows **16,777,216 px** per canvas area, and iOS 18+ allows **67,108,864 px** [S via §12.6]. iOS 15 Safari capped **total canvas memory at 384 MB** and kept canvases alive until released (`width = height = 1`) [S: pqina; WebKit bug 195325]. The WebGL2 `MAX_TEXTURE_SIZE` floor is **4096** on 100 % of reports [S via §12.6, web3dsurvey].
- **JS heap API:** `performance.memory` is deprecated, Chromium-only and unreliable. Its replacement, `measureUserAgentSpecificMemory()`, needs a cross-origin-isolated page [S: MDN]. Use neither as a gate. Use CDP / Node heap statistics in CI and Web Inspector / DevTools on devices.

#### R2.2 Proposed budgets

| Budget | Value | Label | Measured how |
|---|---|---|---|
| Frame period | 16.7 ms at 60 Hz | [S] arithmetic | — |
| App work per frame (sim + renderer + UI) | ≤ 10 ms | [S] RAIL | device trace |
| Renderer `beginFrame…endFrame` CPU, p95, mid-range floor phone, 10 s pan | ≤ 4 ms | [E] | dev overlay from the rAF timestamp; DevTools trace |
| Dropped frames during a 10 s pan + 5 s idle at 60 Hz | ≤ 1 % of frames; no frame > 50 ms | [E]; 50 ms is the LoAF threshold [S] | overlay; LoAF in Chromium |
| Sustained: p95 at minute 10 vs minute 1 of a pan loop | ≤ 1.25× | [E] (sources show 1.0×–1.9× swings) | device protocol R2.4 |
| `drawImage` + `fillRect` per frame, typical stage (2 tile layers, walls, 40 units, 4 FX) | ≤ 300; chunk layers ≤ 12 blits each | [E] from §12.4's "~10–30 per layer" [D] | L1 counter, exact, green |
| Chunk rebuilds per frame | ≤ `rebuilds_per_frame` (2) | [D §12.3] | L1 counter, green |
| Idle frame (nothing moving, no animated tiles) | 0 draws; the renderer skips the frame | [E] | L1 counter, green |
| Single canvas/atlas/page | ≤ 4096 px per side, ≤ 16,777,216 px | [D §12.6] from [S] | asset loader assert + test |
| Chunk cache | 96 MB phone / 256 MB desktop | [D §12.3] | `chunkCacheBytes` test |
| Total live canvas bytes (cache + view buffer + atlases + minimap), phone | ≤ 160 MB, well under iOS's historic 384 MB | [E] (a 1179×2556 view buffer ≈ 12 MB) | test-mode canvas registry sums `4·w·h` |
| JS heap growth over a 2,000-frame pan loop, after gc | < 1 MiB large-object growth; no retained canvases | [E], step-26 heap-test style | node/CDP `HeapProfiler.collectGarbage` + heap stats |
| Effect particles | ≤ 32 per effect, ≤ 128 on screen | [E] | L1 counter |
| Glow layers | ≤ 2 per effect | [E] | L1 counter + overdraw map |
| Overdraw, world layer | max ≤ 4 draws per device px; mean ≤ 2.0 | [E]. 4× is the "red" band of Android's GPU overdraw tool [S] | overdraw map (R3.3) |

All [E] rows get re-measured on the first renderer build. QA then proposes final numbers. They become warnings in the editor (CEO: warn, don't block), and gates only for engine-owned fixtures.

#### R2.3 Measuring in CI (Linux, no GPU)

- **Exact counters (green):** the L1 recording renderer counts draws, rebuilds, particles, glow layers, canvas bytes and overdraw. These are deterministic, so they gate.
- **Throttled timing (pixel suite, trend only):** Playwright Chromium + a CDP session, `Emulation.setCPUThrottlingRate({rate: 4})` (Chromium only) [S: CDP]. Script a 600-frame pan driven by the test, read Long Animation Frame entries (Chrome 123+) [S], and record per-frame renderer time from the rAF timestamps the driver already gets.
  - Report p50/p95 against the previous main run.
  - Fail only on a **> 25 % p95 regression with the same runner image** [E].
  - Never compare against an absolute ms value on a shared runner. DevTools' calibrated "mid-tier mobile" presets exist for desktop use [S], but a CI box is not a phone.
- **Heap (green):** reuse the `speed-memory.test.ts` pattern: `gc()`, `getHeapSpaceStatistics()` large-object space, and the delta over N frames. In the browser, use CDP `HeapProfiler.collectGarbage` and `Runtime.getHeapUsage`, not `performance.memory` [S: MDN].
- **Canvas registry (green):** in test mode, every canvas created goes through one factory that records `w·h·4`. A release sets `width = height = 1` and is recorded too [D §12.3]. The test asserts that the live bytes after a stage unload return to their baseline.

#### R2.4 Real-device protocol (cheap, about 15 minutes per release candidate)

Devices: the CEO's iPhone plus one Android at the mid-range floor (Mali-G57 MP2 or Adreno 619 class). This is the same self-test-page approach as painter plan §1.5. No device farm unless the CEO asks.

1. Open the **renderer self-test page** in Preview build mode (it has the dev overlay; the export does not). It runs the fixed 60-second script: pan, pinch through every `s`, 40 units moving, 4 FX, orientation flip.
2. The overlay shows frame-time p50/p95/max from the rAF timestamps, dropped frames, draws per frame, live canvas MB, and the golden roll-up pass/fail of three fixed frames read back with `getImageData`.
3. Run it cold. Then loop it for 10 minutes and run it again (thermal). On iOS, run it once in Low Power Mode, where 30 Hz is expected: the game must stay correct at 30 Hz, and only smoothness may drop.
4. For a failure, take a trace: Android over USB via `chrome://inspect` [S: Chrome remote debugging], iOS via Safari Web Inspector [S: WebKit]. Capacitor WebViews must have debugging switched on in debug builds only.
5. The CEO reads back the numbers (or a screenshot of the overlay). QA logs them in `docs/qa/device-runs/<date>.md`.

**Export audit link:** the overlay lives only in `@te/devtools` [D END-GAME §2]. The Render audit greps the exported bundle for the overlay's marker string and module id, and fails if either is found. A plant adds an overlay import to `main.render.ts`.

### R3. Catching shimmer, blur and glow overdraw automatically

#### R3.1 Shimmer (crawling pixels during pans)

- **Translation test (L1 green, L2 nightly):**
  1. Render a reference world image `W` once at scale `s`.
  2. Render a pan sequence: 120 frames along a fixed eased path, including diagonal and sub-art-pixel targets.
  3. For each frame `F_i` with draw offset `(ox_i, oy_i)` from the recorder: assert `ox_i, oy_i` are integers and `F_i[x,y] === W[x+ox_i, y+oy_i]` for every pixel in the overlap.

  Any resample, half-pixel or per-layer rounding mismatch breaks the equality.
- **Tile-hash stability (cheaper, L2):** hash each fully visible tile's device-px block. Every non-animated tile must have the same hash in every frame of the pan. A tile that changes hash while the camera moves means it is shimmering. Animated tiles are keyed by `(tile, animFrame)`.
- **Parallax:** a layer at depth `d` must translate by exactly `round(cameraOffset × d) × s` device px [D §12.1]. Assert per layer, not just for the whole frame. Background layers may move at a different rate but never by a fraction.
- **Units:** a unit moving between cells must move by whole device px per frame, and its sprite block hash must not change mid-move (except for clip frames).
- **Uneven pixel widths:** the run-length check from R1.2 runs on every frame of the pan, not just the first.

#### R3.2 Blur

- **Palette closure** per frame (R1.3), on the integer path. Measured [M]: catches smoothing on (108/96 foreign px). Misses half-pixel offsets and 2.5× when smoothing is off (0 foreign px), which is why R3.1 and run-length exist.
- **Scaled-content guard:** on the integer path, L1 fails any `drawImage` whose `dw/sw` or `dh/sh` isn't exactly `s` (or the effect `k × s` of §12.10). This also catches a CSS `transform: scale()` on the canvas in L3 (the backing-store vs computed-size assertion).
- **Effect size snap:** for picture effects, the drawn size is `source × max(1, round(wanted/source))`, and stock shapes are integers [D §12.10]. L1 asserts both.

#### R3.3 Glow and overdraw

- **Overdraw map (L1, green):** the recording renderer rasterises every draw's destination rect, clipped to the view and masked by the source's non-transparent pixels at integer scale, into a `Uint16Array` count buffer. It reports max, mean, and the share of pixels above 4. This is exact, needs no GPU, and runs per fixture frame. (Additive "lighter" compositing in a real canvas works too, but it needs recoloured masks and is engine-dependent, so it's L2 diagnostics at most.)
- **Per-effect budget:** every effect in the fx-order fixtures runs alone on a blank stage. Record its glow layers, particles, peak overdraw and draws per frame, and compare them with the budgets in R2.2. Results go into a committed `fx-budget.json`. Growth fails, the same baseline rule as `pages-html-baseline.json`.
- **Stray glow layer:** a glow drawn twice, or drawn after the effect ends, shows up as a changed count in `fx-budget.json` and as overdraw where no effect is active (the idle frame must have overdraw 0 outside the HUD).

#### R3.4 One rAF / one clock

- **Static (exists):** `check:law` gate `one-frame-loop` bans rAF outside `src/runtime/host/raf-driver.ts` [D §0]. Extend it to `cancelAnimationFrame` aliases (`window["requestAnimationFrame"]`, `globalThis.requestAnimationFrame` via destructuring) with an AST lint rule. The rg gate keeps catching the plain form.
- **Runtime (pixel suite):** before boot, wrap `window.requestAnimationFrame` to count pending callbacks. After boot, 10 s of play, resize, orientation flip, stage change and Preview reload, assert **pending ≤ 1 at every frame**, and that all callbacks come from the driver (a stack check in test mode). Also: no CSS transitions or animations on the canvas or its parents (`getAnimations()` is empty), as camera easing is clock-only [D §12.2].

#### R3.5 Resize, orientation and DPR change

- **Resize/orientation (L3):** `page.setViewportSize` from 411×731 to 731×411 and back, mid-pan. After each change, the next frame must have:
  - the new backing store sized per R1.2;
  - `imageSmoothingEnabled` false (the reset is measured [M]);
  - `s` recomputed (`sMin` rule §12.2);
  - camera clamping re-applied;
  - exactly one rAF loop;
  - no frame drawn with the old size (no stretched frame in the screenshot).
- **DPR change:** Chromium CDP `Emulation.setDeviceMetricsOverride({deviceScaleFactor})` live, from 2 → 2.625 → 3. The runtime must notice it through `matchMedia("(resolution: Ndppx)")` change or ResizeObserver [S: MDN devicePixelRatio], and pass R1.2 at the new DPR. On WebKit, run only a fresh context per DPR (no live switch in Playwright).

### R4. Build-law fit

#### R4.1 Where each check lives

| Check | green (`npm run green`, every PR) | pixel suite (Playwright; renderer PRs + nightly) | device (release candidates) |
|---|---|---|---|
| Integer draw args, scale, draw order (L1) | ✔ | | |
| L1 hashes vs manifest (s 1–4, DPR 1/3) | ✔ | full matrix | self-test roll-up |
| Palette closure, run-length, sentinel seams | ✔ (L1) | ✔ (L2, L3) | |
| Smoothing flag after resize (instrumented ctx) | ✔ (fake ctx) | ✔ (real) | |
| Pan translation + tile-hash stability | ✔ (L1) | ✔ (L2) | visual glance |
| Backing store vs CSS, odd DPRs, letterbox | | ✔ (L3) | ✔ |
| Draw/rebuild/particle/glow counters, overdraw map, `fx-budget.json` | ✔ | | overlay |
| Heap growth after gc, canvas registry | ✔ | ✔ (CDP) | Web Inspector / DevTools |
| One rAF (static) | ✔ `check:law` | ✔ runtime count | |
| Throttled frame-time trend | | ✔ (trend, 25 % rule) | ✔ (budgets) |
| Thermal, Low Power Mode, real P3 screen | | | ✔ |
| Dev overlay absent from export | ✔ export audit | | |

Green stays dependency-free (node:test, no DOM), the same as now. The pixel suite needs Playwright (and pixelmatch for the blend class). See Q1.

#### R4.2 Plants (each must fail its named check; reverted after)

| Plant | Must be caught by |
|---|---|
| PX1 `imageSmoothingEnabled = true` | palette closure; instrumented-ctx flag |
| PX2 smoothing not re-set after resize | resize test (flag + closure on the next frame) |
| PX3 camera offset not rounded (0.5 px) | integer-args assert; translation test |
| PX4 zoom 2.5× allowed on the integer path | scale assert; run-length (measured 3/2/3 runs [M]) |
| PX5 backing store = CSS size (no DPR) | L3 run-length at 2.625/2.75 (measured 5/6 [M]); run-width == s at 2/3 |
| PX6 `image-rendering: pixelated` removed | L3 computed-style assert; closure on screenshot |
| PX7 parallax `cameraOffset × depth` not rounded | per-layer translation test |
| PX8 chunk dest rect not snapped / 1 px gap | sentinel `#FF00FF` seam test |
| PX9 stray glow layer (drawn twice) | `fx-budget.json` growth; overdraw max |
| PX10 particle cap removed | particle counter |
| PX11 second rAF loop (e.g. in camera) | `check:law` one-frame-loop; runtime pending ≤ 1 |
| PX12 CSS transition on the canvas | `getAnimations()` empty |
| PX13 evicted chunk canvas not released | canvas registry bytes after unload |
| PX14 dirty chunk rebuilt every frame | rebuild counter |
| PX15 letterbox odd pixel on the wrong side / bars not `letterboxColour` | letterbox test |
| PX16 dev overlay imported into `main.render.ts` | export audit |
| PX17 non-sRGB context (`colorSpace:"display-p3"`) | instrumented-ctx attrs |

#### R4.3 What QA will require in the renderer step's "done means"

> Done means: `npm run green` passes with the L1 renderer tests: integer draw args and scale at s 1–4, palette closure, run-length, sentinel seams, pan translation, counters and overdraw within the step's stated budgets, `fx-budget.json` and the heap-after-gc test. The pixel suite passes on Chromium, Firefox and WebKit at DPR 1/2/2.625/2.75/3 with zero differing pixels on the integer path, and the resize/orientation/DPR and one-rAF runtime tests pass. Every plant PX1–PX17 that applies to the step fails its named test (reported as N/N). The goldens manifest was baked twice identically and changed only with EA sign-off. The device self-test numbers from one iPhone and one mid-range Android are recorded, with every [E] budget either met or re-proposed with the measured value.

### R5. Open questions for EA

1. **Dependencies:** may Playwright (and pixelmatch) become devDependencies on `main` for a `pixels` script outside `green`? The alternative is to keep them under `qa-runs/` as the painter browser matrix did. QA prefers in-repo, pinned, with the browser revision recorded.
2. **Recording renderer ownership:** should the L1 fake `Renderer` and blitter live in `tests/` (QA) or in `src/runtime/view/testing/` (shipped behind a test-only entry)? If it's in `src`, the export audit must prove it's tree-shaken.
3. **Letterbox odd pixel:** which side gets it (top/left or bottom/right)? §12.8 gives walls' odd pixel to bottom/right. QA suggests the same for consistency.
4. **Idle frames:** may the renderer skip drawing when nothing changed (the "0 draws" budget)? This saves battery but adds a dirty-flag path to test.
5. **Timing probe location:** is reading the rAF timestamp inside `raf-driver.ts` and exposing it via `DebugPort` acceptable under the one-clock law, given that `performance.now` stays banned?
6. **Translucency on the integer path:** do roof fade (§12.1 step 5) and FX alpha count as "designed blending"? If they do, those frames use the blend class, and the zero-tolerance claim covers only opaque frames.
7. **High-refresh phones:** at 90/120 Hz, should the driver render every rAF, or cap to 60 to save battery? This changes the frame-time budget denominator.

### Sources

- web.dev, RAIL model ("produce a frame in 10 ms"): https://web.dev/articles/rail
- web.dev, Jank busting / rAF frame budget: https://web.dev/articles/speed-rendering
- web.dev, Pixel-perfect rendering with devicePixelContentBox: https://web.dev/articles/device-pixel-content-box
- MDN, ResizeObserverEntry.devicePixelContentBoxSize: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/devicePixelContentBoxSize
- caniuse, devicePixelContentBoxSize: https://caniuse.com/mdn-api_resizeobserverentry_devicepixelcontentboxsize
- WebKit bug 219005 (devicePixelContentBox not implemented): https://bugs.webkit.org/show_bug.cgi?id=219005
- MDN, image-rendering: https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering
- MDN, imageSmoothingEnabled: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingEnabled
- MDN, Window.devicePixelRatio (resolution media-query change): https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
- HTML Standard, canvas (context reset on resize; premultiplied-alpha round-trip note): https://html.spec.whatwg.org/multipage/canvas.html
- Playwright, Visual comparisons / toHaveScreenshot options: https://playwright.dev/docs/test-snapshots and https://playwright.dev/docs/api/class-pageassertions
- Playwright source, Chromium launch switches (`--force-color-profile=srgb`; `--enable-unsafe-swiftshader`): https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/chromium/chromiumSwitches.ts (checked locally in playwright-core 1.59.1)
- pixelmatch README (threshold, includeAA, windowSize): https://github.com/mapbox/pixelmatch/blob/main/README.md
- blink-dev, Intent to Remove: SwiftShader Fallback: https://groups.google.com/a/chromium.org/g/blink-dev/c/yhFguWS_3pM
- Chrome DevTools Protocol, Emulation.setCPUThrottlingRate / setDeviceMetricsOverride: https://chromedevtools.github.io/devtools-protocol/tot/Emulation/
- Chrome DevTools, CPU throttling calibration: https://developer.chrome.com/docs/devtools/settings/throttling
- Chrome, Long Animation Frames API: https://developer.chrome.com/docs/web-platform/long-animation-frames
- MDN, performance.memory (deprecated, non-standard): https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory
- MDN, measureUserAgentSpecificMemory: https://developer.mozilla.org/en-US/docs/Web/API/Performance/measureUserAgentSpecificMemory
- WebKit bug 168837, rAF 30 fps in Low Power Mode: https://bugs.webkit.org/show_bug.cgi?id=168837
- Motion, When browsers throttle requestAnimationFrame: https://motion.dev/magazine/when-browsers-throttle-requestanimationframe
- HotHardware, 3DMark Wild Life stress test (iPhone 51.7 % stability; SD865 >99 %): https://hothardware.com/news/ul-benchmarks-3dmark-wildlife-stress-test-benchmark-iphone-android
- Notebookcheck, ARM Mali-G57 MP2: https://www.notebookcheck.net/ARM-Mali-G57-MP2-GPU-Benchmarks-and-Specs.537758.0.html
- Notebookcheck, Qualcomm Adreno 619: https://www.notebookcheck.net/Qualcomm-Adreno-619-GPU-Benchmarks-and-Specs.508997.0.html
- pqina, Total Canvas Memory Use Exceeds The Maximum Limit (iOS 15: 384 MB; release pattern): https://pqina.nl/blog/total-canvas-memory-use-exceeds-the-maximum-limit/
- WebKit bug 195325 (canvas memory reclaim): https://bugs.webkit.org/show_bug.cgi?id=195325
- Canvas area and texture limits: already sourced in ARCHITECTURE-v0 §12.6 (jhildenbiddle canvas-size, lionpuro.com, web3dsurvey MAX_TEXTURE_SIZE)
- Android, Debug GPU overdraw colour bands: https://google-developer-training.github.io/android-developer-advanced-course-practicals/unit-2-make-your-apps-fast-and-small/lesson-4-performance/4-1b-p-debug-gpu-overdraw-and-layout-inspector/4-1b-p-debug-gpu-overdraw-and-layout-inspector.html
- Chrome, Remote debug Android devices: https://developer.chrome.com/docs/devtools/remote-debugging
- WebKit, Enabling Web Inspector: https://webkit.org/web-inspector/enabling-web-inspector/
- Internal: `docs/qa/goldens/browser-results-2026-11-09.md`, `docs/qa/painter-golden-test-plan.md`, `tests/sim/speed-memory.test.ts`, `scripts/check-law.sh`, gh-pages `tools/check-pages.mjs`, probes `/workspace/qa-runs/renderer-probe/` (`probe.cjs`→`probe1.out`, `probe2.cjs`→`probe2.out`, `probe3.cjs`→`probe3.out`)
