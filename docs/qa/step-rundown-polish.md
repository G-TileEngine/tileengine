# Step rundown: polish on main `d982155b` (2026-11-16, Europe/London)

QA & Build Guard. Worktree: `qa-runs/rundown/main` at `d982155b` (tree `53d5a756`). TMPDIR under `qa-runs/rundown/tmp`. Nothing was pushed or published. No EA-owned files were edited. No new `refs/cmp/*` were required.

## Verdict

No must-fixes. Main is green **742/0**. typecheck, lint, deps, `check:state` and `check:law` all exit 0. Sims, pixel smoke/suite, stress and particle budgets hold. Law holds. The G4 step doc **is** on main (`5d41f2fd`, sha256 `559900c5`). The known carries remain as deferred should-fix / notes; none have been silently lost or contradicted.

Device page: staged only, `check ok`, export audit clean. Not pushed to gh-pages.

## 1. Main chain and identity

`git log --first-parent` from `d982155b` back through `f128bc5a` is exactly EA's claimed chain, oldest first, with no extra or missing first-parent commits. Author and committer on every commit in this stretch are `G-TileEngine <G-TileEngine@users.noreply.github.com>`.

| sha | subject (short) |
|---|---|
| `f128bc5a` | Merge PR #50: Step P1 light walls + door gaps (chatB + QA fix-b) |
| `689de762` | Step P1: G6-adopt QA's one-sided light-wall test (M2), floor 703 |
| `e9b8056b` | D3 follow-up: QA nits (a)-(f), post-P1 cites |
| `baeccfa8` | Step G1 kit: render tidy step doc + 3 shipped tests |
| `30a664c6` | Step G4 kit: match loop step doc + 5 shipped tests |
| `6a2e129f` | Merge step G1: render tidy (chatA + QA fix-a) |
| `cbb326ef` | Step G1: merge-time step doc update (G6 row, cap row, ruling, floor 713) |
| `e58d5ce2` | Step G2b kit: effect pieces step doc + 3 shipped tests |
| `6ca9e03a` | Merge step G4: match loop (chatA + QA fix-a) |
| `5d41f2fd` | Step G4: merge-time step doc update (G6 row, cap row, ruling, floor 726) |
| `d982155b` | Merge step G2b: effect pieces (chatA) |

Kit push lists (sha256 of the share lists, not git objects) also match EA: G1 `b165cdf2` (`/workspace/share/g1/push-sha256.txt`), G4 `8a4396f6` (`/workspace/share/g4/push-sha256.txt`), G2b `9eb7c32d` (`/workspace/share/g2b/push-sha256.txt`).

## 2. Step doc hashes on main

These are **sha256 of the file bytes**, not git blob shas. The prefixes EA quoted are the sha256 prefixes. The git blobs are different (`73598950`, `e5535d59`, `e3aba9f4`).

| step | path on `d982155b` | sha256 | blob |
|---|---|---|---|
| G1 | `handoff/steps/step-g1-render-tidy.md` | `f98df4994578778d87b5dc32a2c47976acc11e5dae15db69d9c30466d5faa063` | `7359895082bd3bafe7da3445309ea9ce61b7287a` |
| G2b | `handoff/steps/step-g2b-effect-pieces.md` | `3f1a0a9c013cef9c3fdebff37708260109987cfd60d7971941e0d087737f9e7c` | `e5535d5976fb5cf681ad8a2751e91f65162d7661` |
| G4 | `handoff/steps/step-g4-match-loop.md` | `559900c56df33ce99384c58223380ab831026445bf9dac7bff9315bb9d528f84` | `e3aba9f48682da8ff1b2858fc5ff6a7118697b5e` |

The G4 merge-time doc **is on main**. `5d41f2fd` updates only `handoff/steps/step-g4-match-loop.md` (+6/−2). At `6ca9e03a` (the G4 merge) the file still hashed `2be50002`; after `5d41f2fd` it is `559900c5`. This is not missing.

The step docs keep their own acceptance floors (P1 703, G1 713, G4 726, G2b 719). That is expected. G2b has no merge-time G6 row after PR #53 because the picked build needed no QA fix-a.

## 3. Whole-main checks (`d982155b`, deps present)

`node_modules` was linked. Without it, gates and perf-34b are known env fails on main too; with it, the full suite ran.

| check | result |
|---|---|
| `npm test` | **742/0** (0 cancelled, 0 skipped, 0 todo), ~9.9 s |
| `npm run typecheck` | 0 |
| `npm run lint` | 0 (`--max-warnings 0`) |
| `npm run deps` | 0 (107 modules, 342 deps) |
| `npm run check:state` | `check:state OK (src)` |
| `npm run check:law` | `check:law OK (src)` |
| sims | stage-fixed 48/2/0/0 history `afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`; stage-weighted 22/28/0/0 history `b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c` |
| pixel smoke | 0 failed; `canvas MB 2.5 (main canvas alone 1.0 MB)` |
| pixel suite | 0 failed; Chromium L2 frames 1–3 equal base L1 `1:150x98:04b5748d`, `2:150x98:6865666d`, `3:150x98:846e2223`. Firefox/WebKit skipped (not installed). |
| stress | A 27/0/0, p95 0.36/0.36/0.41; B 113/0/0, p95 0.47/0.50/0.46; C 181/0/0, p95 1.49/2.11/1.51; E 181/0/0, p95 1.91/1.93/2.39; L 27/373/0, p95 1.21/1.20/1.24 ms (under the 4 ms renderer share). |
| particle budget | limit 4 ms p95; laps p95 0.87 / 0.41 / 0.40 ms; counts `132/36/90/1`. The suite pin `[132, 36, 97, 2]` in `fx-particles.test.ts` still holds. |
| light budget | limit 4 ms p95; laps p95 0.87 / 0.59 / 0.49 ms; counts `1/1/0/4`. |

C lap 2 p95 2.11 ms and E lap 3 p95 2.39 ms sit a little over 2 ms on this box; L (the budgeted path) stays at 1.24 ms. Report only.

### Law

- One clock: `BUILD_GUIDE` law 1; `check:law` OK.
- One rAF: `requestAnimationFrame` / `cancelAnimationFrame` appear in `src/` only in `src/runtime/host/raf-driver.ts`.
- Pipes: UNIT and TILE only (`BUILD_GUIDE` law 3).
- No copied chess / BTF trees: `check:law` `no-btf-path` OK; no chess trees in the tree.
- Law 13: `check:law` does not itself enforce bounds, but the runtime caches spotted on this tree are bounded (visibility cache clears at 256, `LOOK.cacheBytes` 16 MiB, canvas default budget 32 MiB, LRU drop).

## 4. Findings

No must-fixes. Should-fix and notes below. Repro is against `d982155b`.

### Should-fix

1. **D3 host-guide: `raf-driver` still drops the skip remainder (G4 carry).** `src/runtime/host/raf-driver.ts` stall path does `o.clock.skip(whole)` and `catchUp(ms)` does `o.clock.skip(ms)` and both ignore `remainderMs`. After the G4 8 h cap, a long hidden-tab gap still needs the host to drain the remainder in chunks. `docs/host-guide.md` has no line for this. Agreed as OK to defer in the G4 review (ruling (d)).

2. **D3 host-guide: re-apply overlay stack and pause after load (G4 carry).** G4 snapshots omit `overlay.*` phases. A save taken during `overlay.saveLoad` / `overlay.settings` with a paused clock reloads unpaused and with no overlay keys. The host must re-apply those itself. `docs/host-guide.md` has no line for this.

3. **STATES §2 CLOSE prose is stale (G4 / D3 carry).** `docs/STATES.md:61` still says "They are a stack, so pause → settings → back to pause works." The table at line 68 already sends `CLOSE` from pause, settings and saveLoad to `overlay.none`, which is G4 ruling 3 / R3. The code is right; the sentence is not.

4. **G2b N1: `pixel_scale: 7` is not in the new item-10 list.** `tests/runtime/render/effect-pieces.test.ts` "item 10" covers null, absent, `match-sprite`, `'1'`–`'6'`, `'x'` and `'3.0'`, not `7`. The older 33b-3 test in `fx-particles.test.ts` flags `[9, 0, "big", 2.5]` and clamps `9` to 6. `7` takes the same clamp path but is not named. Defence in depth, not a miss.

5. **G2b N2: no named look-list fixture.** The G2b step doc UX look check (items 11 and 15a) is still a list only. There is no named scene, effect or fixture for UX to load.

6. **G4 N1: no time-boxed `skip(Number.MAX_SAFE_INTEGER)` in the shipped clock-skip tests.** `tests/core/clock-skip.test.ts` never calls `MAX_SAFE_INTEGER`. The raf-driver pin time-boxes `skip(1e8)` under 250 ms, and the 30 h remainder / `now` pins already catch an uncapped skip. A time-boxed `MAX_SAFE` assert would be defence in depth, not a miss.

### Notes

7. **G5b `?ps` is not clamped on the page.** `tools/device-page/page.ts:8,13` does `ps = Number(q.get("ps") ?? 1)` and writes `{ pixel_scale: ps }` whenever `ps > 1`. The comment says `?ps=2..6`, but `?ps=7` (or 99) is passed through; the engine `pixScale` then clamps to 6 and raises `outOfRange`. Tools only.

8. **Stress C/E p95 just over 2 ms on this box** (C lap 2 2.11, E lap 3 2.39). L stays under 1.25 ms. Not a budget miss.

9. **Picked-up or already documented, so not open slips:**
   - G1 N1 (the `assert.ok` budget check hidden by a leading comment) is no longer true: `fx-particles.test.ts:140` runs `assert.ok(...)` and the comment trails the statement.
   - D3 N1 (`demo()` using test helpers) was picked up in `e9b8056b` with the comment "A real host plays the match its own way…".
   - P1 N1 (plainCopy ~93 MB heap before the effects cap) is already a host-guide rule (rule 11).
   - D3 N6 (BUILD_GUIDE `src/btf-adapters/src/fx-preset.ts` path) is already the text on main.

## 5. Versus EA's list (mismatch)

No mismatch.

- The first-parent chain and noreply identity match EA's list exactly.
- G1 `f98df499`, G2b `3f1a0a9c` and G4 `559900c5` are the sha256 prefixes of the three step docs on main (not blob shas).
- The G4 step doc is present via `5d41f2fd`. It is not missing.
- EA's known carries are all still present, as listed in §4 items 1–6: G2b N1, G2b N2, G4 N1, and the three D3 host-guide / STATES lines (raf-driver remainder after 8 h, re-apply overlay/pause after load, STATES §2 CLOSE text).
- Extra notes not on EA's list are §4 items 7–8 (`?ps` clamp, C/E p95). Item 9 records carries that were already picked up or documented, so they must not be re-listed as open.

## 6. Phone re-run prep (not published)

Built from the clean `d982155b` worktree (`git status --porcelain --untracked-files=no` empty; untracked `node_modules` link only).

- Staging dir: `/workspace/tileengine-repo/qa-runs/rundown/device-page/`
- Build commit: `d982155b6cf266f6f0f79da813452312dfd45e11` (also in `build.json`; Node `24.22.1`)
- `node tools/device-page/build.ts <staging>` then `node tools/device-page/check.ts <staging>` → **`check ok`**
- Push list: `/workspace/tileengine-repo/qa-runs/rundown/device-page-push-sha256.txt` (sha256 `aae56023bc4042c2196374d087f154ec8a2d82d6660c624d125d2b624d15f3ae`), 33 lines, paths relative to the staging dir
- File count: **33** (32 shipped files listed in `build.json`, plus `build.json`)
- Total size: **184807 bytes** (file contents)

### Export audit

`check.ts` already proves every shipped file is reached from `index.html`, every sha matches, the rebuild is byte-equal, and nothing extra sits in the folder.

The tree is only `index.html`, `build.json`, `tools/device-page/page.js`, `tools/pixel-suite/{fixture,l2}.js`, and the runtime they import (`src/core/clock`, `src/core/{limits,plain}.js`, `src/runtime/canvas`, `src/runtime/host/raf-driver.js`, `src/runtime/render/*`, `src/runtime/scene/world-scene.js`). No `editor`, tests, handoff, docs, eslint, node_modules, or unused file. `page.js` is the intended phone harness (buttons and readout), not an engine dev overlay. `index.html` loads only `./tools/device-page/page.js` and a `data:,` icon.

## 7. CEO run sheet

A standalone copy is at `qa-runs/rundown/CEO-run-sheet.md`. This build is **not** on gh-pages. When CoS publishes it, use the `/device-page/` link.

**Phones.** One 2-minute visit each on the Samsung Galaxy S21 Ultra and the Red Magic 9 Pro.

**How.** Open the page in the phone's browser, hold the phone upright and do not touch the screen. When it says to turn sideways, turn it. The box at the top left says DONE at 60 s — copy those numbers, then leave the page up until about 2 minutes and note anything that happens after DONE (a hitch, lite switching, flicker). Then tap **pixel check** once. The box should say "pixels PASS". For this short re-run leave **60 fps cap: off** and **lite: auto** as they start, unless the page already changed them.

**Budgets** (what good looks like):

- p95 at or under 1.1 × the screen refresh interval (**18.3 ms at 60 Hz**).
- Dropped frames at or under 1 % of all frames, and **no frame over 50 ms**.
- Canvas MB at or under **160** (this counts the main canvas too).
- The usual row-4 vs row-1 1.25× check does not apply to this single short run.

**Send back** (one note or screenshot set per phone):

- Phone (S21 Ultra or Red Magic 9 Pro), Android version, browser.
- Battery saver / Low Power Mode: yes or no.
- A screenshot of the DONE box, and of the box after pixel check.
- The numbers: p50, p95, max, dropped (>25 ms), over 50 ms, frames, canvas MB, whether lite was ON at the end, and how many lite switches.
- Anything that looked wrong after DONE, or at all: blur, edge bars, stutter when turning the phone, flicker.
- **Do not send the IMEI, the serial, or any other device identifier.**
