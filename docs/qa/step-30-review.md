# Step 30 review: world → picture link (proto)

## r1 (full review, 2026-11-13)

**Verdict: NOT OK.** The fixes are small and a tested patch is ready (`qa-runs/step-30-review/qfix/`, `qfix.patch`, +7/−3 in 2 files, still within caps). The code is correct on every area EA asked us to push on. The one code bug is notice duplication (F-1). The rest is test gaps in exactly those push areas (F-2): a build could get the stable-scene key or the chunk gate wrong and still pass the kit's tests.

Work dir: `/workspace/qa-runs/step-30-review/` (proto copy of /tmp/r30, `ea/` = scratch-ea files, `kit/` = kit, README, spine, step-29 kit, project-format). There was no step-30 folder in share, so nothing was copied from there. /tmp, scratch-ea and share are untouched.

### Gates

| Check | Result |
|---|---|
| Bundle | sha256 d12f72ce… matches; `git bundle verify` ok; head r30 = ca27193 (one commit on 09f3028) |
| Ref | `refs/cmp/s30-proto-r1` → ca27193 (new) |
| Kit hashes (EA working tree) | step-30 kit 124b5ed6, README 6eda7348, spine a78ea23f. All match. (The proto itself still has the step-29 README/spine, d140fb87/34b1949c.) |
| origin/main | 09f3028 (PR #37, step 29 chatB + test fix b9dc457/8f03230) |
| merge-tree onto origin/main | clean, **bb69d40e2ead22fa444710b37715168c016c01dd** (= the r30 tree; fast-forward) |
| tsc / tests / green | tsc 0; serial 562/0 twice; `npm run green` exit 0 (test, typecheck, lint, deps, check:state, check:law) |
| Pins | core-types 61fad786, package.json 1e5dd82c, depcruise 45a3dbaa, check-law 4d7bbf48, lock d7f64a09. Unchanged. No CN, no handoff change |
| Sims / smokes | 48/2 afc89d56, 22/28 b8007292 byte-identical; 20 smoke lines identical to the step-29 baseline |
| Size / caps | 255 lines (+233/−22) in 9 files, the kit's 9 files exactly. world-scene.ts 82/86, draw-list 62/66, frames 44/48, types 31/35, raf-driver 86/90, clock.ts 139/142 (trimmed; cap unchanged), render-core.test 125/129, raf-driver.test 153/157, world-scene.test 124/128 |
| raf-driver.test re-base | the kit states the reason (Files list: "the rig gains an optional `clock` and one new test pins the step 30 driver and clock carries"). Only that file is re-based |
| Build law | rAF only in raf-driver.ts; one clock; world-scene.ts imports only `render/index.ts` and type `core/notice.ts` (no sim/state). render-core.test changes are the two ruling lines only; no scope creep |
| EA plants | 43/43 caught by the named tests (same as EA's result file) |

### Push areas

**(1) Overflow culling: correct.**
- Fuzz (`extra/qa/probes30.ts` P1): 2500 random cases.
  - tile sizes 8/15/16, non-square;
  - off-size sheets from 1×1 to 64×80, including smaller-than-cell, wide-only and tall-only;
  - s = 1–3, view sizes 8–90 px, negative scroll and cameras past every edge.
- Each case renders the culled list and a reference copy of draw-list with culling removed (`qa/nocull`), then compares pixels.
- **0 cases with any pixel different** (8 084 vs 125 522 cmds).
- The widen is per layer (one sheet per layer), so a max-sheet widen isn't needed. The bounds have one row/column of slack (integer art px), so no visible overflow pixel can be culled.

**(2) Off-size layers are never chunked: proven.**
- Fuzz P2: 400 mixed scenes (cell-sized, tall-only, wide-only, off-size, animated and smaller layers; ground and above), comparing chunked and live pictures.
  - **0 bad cases.**
  - 558 chunk cmds, **0 naming an off-size layer**.
- Path argument:
  - `chunkedList` emits `chunk:` ids only for a layer with `fw === tileW && fh === tileH`.
  - canvas2d bakes only on a `chunk:` draw, using the scene passed to `world()`.
  - The driver passes the same scene object to `world()` and then `chunkedList`.
- P3: one backend over 21 frames, with layer index 0/1 swapping and the same sheet id/image switching 16×16 → 16×32 → 16×16 → 32×16 → 24×40, rev bumping each frame. **0 bad frames**; the cached 16×16 chunks are reused correctly when the layer switches back.

**(3) Stable-scene identity: correct.**
- 100 frames with a new world object and a new, shuffled unit array return the same scene.
- Facing, action, offset, sprite, death (no die action), seed, cols and tileW changes each give a new scene and keep `ground`.
- New `layers`/`assets` identities rebuild ground.
- Driver (S7):
  - a walking unit draws 60/s with 0 chunk rebuilds;
  - rev doesn't bump while still;
  - a still world settles to the idle clip's own rate (the unit's idle clip animates, ~10/s; 0/s with static art, as the kit test shows).
- Identity leaks found: see F-1, N-1 and N-2.

### Findings

**F-1: notices repeat every time the `assets` record changes identity (unbounded).**
- `scene()` re-runs `checkClips` for **every** asset whenever the record object changes. The host builds `Sheet` from decoded images, so it will rebuild the record as each sheet loads.
- Repro (probe S4): one asset with `fps: 0`, then 20 record rebuilds with the same asset objects (one new asset each) → notices 1 → **21** `clipFpsInvalid`.
- The kit says "once per asset object (not per frame)".
- Fix (no line change): `checked = new WeakSet<SceneAsset>()`, and check an asset only if it isn't in the set.
- Test: the r26 warning test also calls `link.scene({ ...w, assets: { ...assets, more: hero } })` and still expects exactly 3 codes. It fails if the fix is reverted.
- EA's plant S16 becomes an equivalent mutant under the fix. Retarget it to drop the WeakSet guard.

**F-2: the kit tests don't pin EA's three push areas well enough.**
Our 34 behaviour plants (`tools/qa30-plants.py`) against the proto tests: 18 caught, **16 missed**. All of these pass every test:
- (a) **Chunk gate checks only one axis** (Q6 width-only, Q7 height-only). A tall-only 16×32 layer (the common r27 case: trees) would be chunked and its overflow cut at chunk edges. The test uses 24×32, which trips both axes.
- (b) **Culling widen uses the wrong axis** (Q4 fw↔fh, Q5). The culling test uses a square 40×40 sheet.
- (c) **Stable-scene key and resets** (Q8–Q16): dropping facing, action, offset, sprite or map/seed from the key, not comparing `objects`/`overlays` identity, keeping old layers when `assets` changes, or keeping the old scene when `layers` change. In a build, a turning or attacking unit would freeze on screen, or a tileset that loads late would never appear. The stable test only checks a cell move.

Fix (tests only, +4 lines, world-scene.test.ts 128/128):
- the chunk-edge test also checks a 16×40 and a 40×16 layer;
- the culling test compares a 40×8 and an 8×40 layer against a crop of a whole-map picture;
- the stable test checks that each key field and each identity bumps, from a settled link, and that a later `assets` record makes a missing tileset layer appear.

With qfix: Q plants 27/34 caught (the 7 left are N-6), F-1 revert caught, `npm run green` exit 0, 562/0, EA plants 42/43 (S16 equivalent, see F-1).

### Nits
- **N-1 Units-key collision:** the key joins fields with `|`, `,` and `;`. A unit id containing them can alias another world: probe S5 returns the 1-unit scene for a 2-unit world. Engine ids won't contain these, but `JSON.stringify` or a `\u0000` separator closes it for free.
- **N-2 Identity contract is easy to break:** a host that writes `objects: []` or `overlays: []` each frame gets a new scene every frame (60/60, probe S3). Consider treating two empty arrays as equal, or put it in bold in the host-shell carry. In-place tile edits with a stable `layers` identity stay stale (S6), as the contract says.
- **N-3 (step 28, pre-existing):** the chunk signature lacks tile size and frame size. If the map tile size changes while the sheet keeps its id, image and columns, the old-size chunk is reused (P3b: 3584 px wrong). Carry to s34, or keep the host-shell rule "new driver on project switch".
- **N-4:** an offscreen overlay before `startMs` still lowers `dueMs` (one extra wake at startMs). Harmless.
- **N-5 (DSK):** a non-finite `ms[]` entry (NaN) gives `clipMs` NaN, so `nextMs` is NaN and the clip silently freezes (negative/0/null are clamped to one tick). The format says `int[]`, but nothing validates it. A reader check or a clamp?
- **N-6 Test gaps left (minor):** clipFpsIgnored/clipMsLength with an empty `ms[]` (Q17, Q19); §7.3 step 3 order `a-down` before bare `a` (Q20); fps between 0 and 1 (Q31). Q26 (seed key without sheet id) and Q28 (dy scaled by tileW) only matter for non-square tiles.
- **N-7 Scene purity is fenced only for sim:**
  - `import "../../state/index.ts"`, `import "../host/raf-driver.ts"` or an `hp` word in world-scene.ts pass every gate (G4, G6, G7).
  - sim is caught by depcruise, wall time by check-law and lint, `document` by tsc, rAF by check-law, and render→scene by depcruise plus the purity test.
  - The kit carries this to the next pin CN. The test file is at its cap, so it stays a carry.
- **N-8:** a walking unit bumps rev 60/s, so `world()` re-signs every cached chunk each frame (existing s34 carry N-6). Fine at match sizes.

### EA open questions
1. X6d "dx doesn't break c ties": agree (no mid-walk flicker).
2. Unknown action → idle: fine.
3. Units key string: fine for now (see N-1); a host revision counter is the s34 path.
4. DSK names: project-format **r28** (`data/project-format.md` e45d6932, newer than the kit's r27 343a72e9) already names `clipMsLength` and `clipFpsIgnored`, so this is answered.
5. Move ms padding and warnings into the reader: later, with N-5.

### Carries
Unchanged from the kit (next-pin CN fences for scene/host, s34 perf items including the units key cost and off-size live drawing, L2 browser gate, host-shell items). Add N-3 (chunk signature vs tile size) to s34 and N-7 (scene import fence for state/host and game words) to the next pin CN.

## r2 recheck (e04de4a, lean) — OK TO SEND

Inputs copied to `qa-runs/step-30-review/r2/`; bundle 22d88068 verifies (head e04de4a, one commit on ca27193), fetched as `refs/cmp/s30-proto-r2`. Kit step-30 589d931c, README 68898029, spine f62c1d8a, project-format c7cd04f4 (r29): all match.

- **Merge:** `git merge-tree --write-tree origin/main(09f3028) e04de4a` is clean: **4b5a7d0a901265a644c979ad2efd002e6587104f** (equal to the r2 tree).
- **Gates:** tsc 0; tests run serially twice gave 563/0 both times; `npm run green` passed, including check:law. Sims, the 20 smokes and the pins (45a3dbaa d7f64a09 1e5dd82c 4d7bbf48 61fad786) are unchanged from r1. No CN or handoff change.
- **Size:** 10 files, +250/−23 (273 lines). Every file is within its cap. The three re-bases (world-scene.ts 84/88, frames.ts 46/50, world-scene.test.ts 136/140) each have a reason written in the kit.
- **EA plants:** s30-plants-r2.py caught 74/74. S16 now targets the F-1 WeakSet. The F-2 plants (Q4–Q16) and the r29 plants are in.
- **F-1 fixed:** notices stay at 1 → 1 over 20 rebuilds of the assets record, and the S16 plant is caught by a test.
- **F-2 fixed:** I re-ran my 34 behaviour plants (anchors adjusted for the JSON key and for `same()`). Tests now catch 31/34, up from 27 with the qfix.
  - Key fields and identity are still pinned after EA's switch to fresh non-empty arrays: Q8–Q14 are all caught.
  - Still missed, as with the r1 qfix: Q26 (unit seed key without the sheet id), Q28 (unit dy scaled by tileW) and Q33 (start() after dispose). These carry.
- **r29:**
  - With 2 bad clips I get exactly 2 `clipMsInvalid` notices, still 2 after 20 rebuilds.
  - No `clipMsLength` (a 3-entry ms[] on 2 frames) and no `clipFpsIgnored` (fps 12 alongside a bad ms[]).
  - Playback falls back to fps: 12 fps → 80 ms on a 10 ms tick; no fps → 8 fps.
  - NaN, negative, zero, string and null entries all invalidate the ms[].
  - Tests cover empty ms[], fps 0.5 → 2000 and the §7.3 step-3 order (Q17/Q19/Q20 caught).
- **Nits:**
  - **N-1 fixed:** the r1 separator collision and a JSON-quote injection id both give a new scene.
  - **N-2 fixed:** fresh `[]` each frame for objects or overlays gives 0 new scenes.
  - **N-4 fixed:** an offscreen overlay before startMs gives `dueMs` null.
- **No regressions** (small N):
  - culling fuzz 500 cases / 0 bad;
  - chunk fuzz 100 / 0 bad (130 chunk cmds, 0 naming an off-size layer);
  - layer size switching 0 bad;
  - S1 100/100 same.
- **R2-N1 (new nit, carry):** if a clip's `ms` is present but not an array (`null`, `"100"`, `100`, `{}`), `link.scene()` throws a TypeError, and `clipMs` throws for null, string or object. A hand-edited file then fails to draw every frame, because nothing in src/project checks clips. The `clipMs` null crash was already in r1. r29 only rules on bad entries. Suggested fix with no line cost:
  - `badMs`: `ms !== undefined && (!Array.isArray(ms) || ms.some(...))`;
  - clipMs gate: `Array.isArray(clip.ms) && clip.ms.length > 0 && !badMs(clip.ms)`.
  - Alternatively, the format could rule that a non-array `ms` counts as `clipMsInvalid`.
- **Carries:**
  - R2-N1.
  - Q26/Q28/Q33 test gaps.
  - From r1: N-3 (chunk signature ignores tile size; P3b still 3584 px wrong, step 28), N-5 (NaN ms freeze, now covered by r29), N-7 (scene purity fenced only for sim) and N-8 (60 rev/s while walking; still 60).
