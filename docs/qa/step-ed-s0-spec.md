# QA spec: Effect Designer slice S0 (flag test page)

Owner: QA & Build Guard · 2026-11-16, Europe/London (UTC+0) · status: SPEC for the S0 build (not yet built).
Base: main `d982155b` (tree `53d5a756`, 742/0). Source: `qa-runs/effect-designer/scope.md`, sha256 `b59258efe1d1f5e0c92fdb37a307e9f8287024ccb6a61cd5c978c9b812b95f31` (prefix `b59258ef`, copied from `/workspace/share/effect-designer/scope.md` at 01:23 London). That is **scope r1**, the hash EA asked to verify. This spec is written against r1. The share file was not edited by QA.
While this spec was being written, share was replaced (01:25 London) by **scope r2**, sha256 `683716af2e33a71aa46dc7af6b7bcd3a9dc896d959f678daaa378e3d220d05c1`, which cites r1 as `b59258ef`. r2 was not used as the source, and it was not copied over the qa-runs r1 file. The S0 protocol in r2 is the same six points. Later-slice naming did move: r2 stores layers as `parts[]` / step field `part` (the UI still says "Layer"); shelf and house style share CN-022; path/tiers/linger are CN-023/024/025 (they were CN-024/025/026 in r1). S0 stubs use the flag tokens in §3 and must not hard-code CN numbers or `layers[]` field names. Seed rules already in this spec (out of range or non-integer → notice and play as 0) match r2 §6(b).
S0 is tools only, about 250 lines, size rule 150–400 changed lines including shipped tests (up to 400 is normal). Publishing the page to gh-pages needs **RaiKynn's typed OK**. This spec does not edit the scope or any EA file.

§10 of the scope is the test method (the six points given to EA). An idea leaves the spike and gets its own slice only when points 2–6 are green on both phones. S0 itself is the harness that makes that measurement possible.

## Done means

S0 is done when a tools-only flag page, built on the existing device page and the G5b TEMPLATE, implements the six protocol points, exposes a hook or a dummy load for all ten bold ideas in engine order, stays on one clock and one rAF (`raf-driver`) with UNIT/TILE as the only pipes, ships tests that catch the plants in §5, passes the export audit (no editor or devtools in a Render or gh-pages tree), and shows a 2-minute readout the CEO can send back from the S21 Ultra and the Red Magic 9 Pro. Graduation of an idea to a later slice is not part of S0 done.

## 1. What S0 must contain

Build on `tools/device-page/` and `docs/qa/device-runs/TEMPLATE.md`. Do not fork a second site that skips `build.ts` / `check.ts`. Flags off must leave the current page's `fx-live` path, L1 hashes and particle seed byte-stable (the new HUD and scheduler may be on screen; they must not change the game canvas or `hash32` inputs). No `src/` runtime change in this slice (no R1–R5, and no readers for the later CNs). Existing FX caps stay (48 particles, 2 lights per effect, 60 draws per effect, 120 draws and 4 lights a frame, 96-dot pool). Merging never becomes a second live effect (scope G-5, §6a).

**1. Flag parser (kill-switch).** Read `?bold=` as a comma-separated list of the tokens in §3. Absent, empty, or `off` means every idea is off. Tokens are exact lowercase names; trim whitespace; ignore empties between commas; a repeated token counts once. An unknown token is a visible notice and is not treated as on (fail closed). `?seed=` is an integer `0…2³¹−1`; absent equals 0, which must keep today's particle hash (`hash32(mapSeed, e.id, i, 0)`). Out-of-range or non-integer seeds are noticed and fall back to 0, not clamped silently (do not repeat the G5b `?ps` nit). One idea per scored run; several tokens in one URL may only be used as an unscored combined stress.

**2. A/B block scheduler.** One visit is 2 minutes of alternating 20-second off/on blocks: OFF 0–20, ON 20–40, OFF 40–60, ON 60–80, OFF 80–100, ON 100–120 (six blocks, three of each). The on blocks run the flagged dummy or hook; the off blocks are the same scene with that idea fully out. Compare the pooled on blocks with the pooled off blocks on p95 frame time, dropped frames (>25 ms) and max frame. Block labels and remaining seconds are on screen and must match the clock. Visit time may follow the page's existing host-frame path (the `HostEnv` wrapper around `raf-driver`, as today's 60 s window does). It must not start a second `requestAnimationFrame` loop, a `setInterval` / `setTimeout` tick, or a second sim clock. "Run again" restarts the six-block plan from OFF.

**3. Worst case first.** The scored scene is the stress setup: max emitters, both lights, 40 moving units on the 64×64 map, looping effects against the live caps, fractional walk offsets, at DPR 3 where the device allows it (if the phone is already at or above 3, do not upsample again). Measure first on the S21 Ultra; the Red Magic 9 Pro is the high check.

**4. Live per-idea budget line.** The HUD shows the idea, the active token, the current block (OFF or ON, index, seconds left), p50 / p95 / max, dropped, over-50, frames, the G5b canvas MB (backend bytes plus the main canvas), heap MB when `performance.memory` exists (else `heap n/a`), the same-seed hash state, and a red/green line against §3's budget. The line goes **red** when any of these hold: on-block p95 exceeds off-block p95 by more than the idea's ms budget; p95 exceeds 1.1 × the refresh interval (18.3 ms at 60 Hz) with the 60 cap on; any frame exceeds 50 ms; dropped frames exceed 1 %; canvas MB exceeds 160; heap MB exceeds 160 when it is available; or the hash check fails. A red line means the idea does not graduate. It is a spike verdict, not a runtime throw in `src/`.

**5. Same-seed hash check.** Run the flagged scene twice with the same `?seed=` (and the same tokens). Frame hashes at fixed sim times on the one clock must match. Hash the game canvas or a stable draw-list fingerprint, never the HUD DOM. A mismatch is a visible FAIL and turns the budget line red. Two visits or an in-page second pass are both fine; the readout must say which. Flags off and `seed=0` must not move the existing L1 pins.

**6. On-screen canvas and heap watch.** Keep the G5b canvas formula. Show heap next to it when the browser exposes it (Android Chrome / Samsung Internet should). Do not add canvas and heap together (they can overlap). Both lines use 160 MB as the red mark. This is the device-page cap, not ARCHITECTURE-v0's decoded-stage meter (see §7).

**Result readout the CEO sends back.** At 120 s the box says DONE and freezes a copy-paste / screenshot block: phone, idea token, seed, cap/lite, off p50/p95/max/dropped/over-50/frames, on same, on−off p95 delta, canvas peak, heap peak or n/a, hash PASS/FAIL, budget green/red, lite switches, and a one-line picture note. No IMEI, serial, or other device identifier.

**Law, always.** One `createClock` and one `createDriver` / `raf-driver` frame loop. The existing one-shot `requestAnimationFrame(() => live.start())` kick is allowed; a second looping rAF is a kill. Dummy work runs from the driver's `view` / frame path or from that clock, never from wall timers. Anything that aims or hits a unit or a cell goes through UNIT or TILE only. Dummy living-linger and path samples are visual placement only; hits still round to a cell and use those pipes (ARCHITECTURE-v0 §12.10). `src/` stays free of `Date`, `performance.now`, and rAF (tools may use the existing host-gap path).

## 2. Stubs vs later slices

Most ideas land after S0. For those, S0 only needs the harness hook and a **dummy load that mimics the cost**. A dummy must (a) run only in ON blocks when its token is set, (b) stay inside existing FX caps, (c) stay one `LiveFx` per cast, (d) be seeded, (e) live under `tools/`, not `src/runtime` or `src/editor`, and (f) be honest enough that a green S0 is not an under-count (prefer slightly heavy over a no-op). S0 numbers do not prove the final slice; they are the gate to write it.

## 3. Per-idea table (engine order)

Budgets marked **[E]** are QA's proposed S0 lines, because the scope only gives the example "≤2 ms of the frame on the S21". They are added p95 on the S21 Ultra at 60 Hz (on blocks minus off blocks) under the shared caps: p95 ≤ 18.3 ms with the 60 cap, dropped ≤ 1 %, no frame over 50 ms, canvas ≤ 160 MB, heap ≤ 160 MB when known. The Red Magic 9 Pro uses the same numbers as a high check.

| Order | Idea (UX) | Flag | Lands | S0 hook | Worst-case setup | Budget [E] | Determinism / hash | Pass / kill |
|---|---|---|---|---|---|---|---|---|
| 1 | Caster colours (B3) | `caster` | E9 (editor: nearest ramp key + boost-contrast; no runtime) | Stub: run the nearest-ramp + contrast step over every live unit and effect each ON frame, then play the result as ordinary ramp keys on one `LiveFx` | 40 units, 4 looping effects, every caster remapped, style missing no required key | +0.5 ms; no extra MB | Same seed and same casters → same ramp keys and same frame hash. No off-palette `#rgb` invention | Pass if delta and hashes hold. Kill if a hex colour is invented, if the dummy is a no-op, or if the line stays green when over |
| 2 | Breed (B1) | `breed` | E4/E5 (editor flatten of 2–3 parents, 6 Mix×dice children) | Stub: flatten 3 cap-level parents into 6 seeded children (48 particles, 2 lights, ≤12 steps). **One** child plays at a time; the other five are still docs, not live effects | 3 parents already at the 48/2/12 cap; dice all 6 children every ON block | +2.0 ms; memory is docs only (no 6 canvases) | Same seed → same 6 children and the same playing child's hash. `variant_seed` 0 matches today's hash on the off path | Pass if one child plays inside caps. Kill if 6 `LiveFx` are stacked (144 particles / 6 lights — §6a), or if trim of linger steps is silent (no meter line) |
| 3 | Tap the rhythm (B4) | `rhythm` | E8 (editor writes `start_at_ms` on the 30 ms grid, with undo) | Stub: apply seeded ±30 ms nudges to every step or layer of the live effects, snapped to the grid | All 4 looping effects, several steps each, nudges on every ON block | +0.3 ms | Same seed → same `start_at_ms` list and same hash. Off blocks drop the nudges | Pass if nudges snap to 30 ms and hashes match. Kill if nudges use wall time or unsapped ms |
| 4 | Export as asset (B10) | `export` | E10 (tools; gated on S0 heap numbers) | Stub: an offline bake of the worst looping effect to a sprite-sheet-sized buffer (a frame sequence at the page backing, DPR 3 when allowed). No real file download required. The bake must not start a second rAF; it may pause the live preview, but it must not hitch a live frame over 50 ms | Max particles and lights, longest comfortable loop, full backing store | Peak canvas ≤ 160 MB and peak heap ≤ 160 MB; live p95 still under the shared caps. **Report the peak MB** (E10 depends on this number, not only a boolean) | Two bakes with the same seed are byte-equal. Bake output is not required to match L1 | Pass if peaks are shown and under 160 and hashes of two bakes match. Kill if heap is unwatched, if a second rAF or `setInterval` drive the bake, or if the peak is missing from the readout |
| 5 | Power-up tiers (B7) | `tiers` | later CN (r1 CN-025 / r2 CN-024; host passes a plain int 0–2; scale within 48) | Stub: the page passes `tier=2` as a plain int in ON blocks (0 when off) and scales particle/punch dummies inside the caps | Tier 2 at 48 particles, 2 lights, punch at the existing cap; never HP or mana | +1.0 ms vs tier 0; still ≤48/2/60 | Same seed + same tier → same counts and hash. Tier is an int, not a stat name | Pass if caps hold and the host input is an int. Kill if the stub reads `hp`/`mana`/`cost`, or if tier 2 exceeds 48 particles |
| 6 | Draw the spell (B2) | `path` | later CN + R3 ext. (needs E2; r1 CN-024 / r2 CN-023); step `path` ≤16 points `{dc,dr}` on a 1/8-tile grid + `smooth` | Stub: one piece follows a 16-point snapped path from caster to target on the 30 ms grid, with smoothing on. Placement only; a hit still goes through TILE or UNIT | One effect, 16 points, smoothing on, full travel every loop, 40 units as clutter | +2.0 ms | Same seed + same points → same path samples and hash. Off blocks do not walk the path | Pass if points snap and pipes hold. Kill if the stub imports `src/fx` / BTF flight, or aims with a third pipe |
| 7 | World-aware linger (B6) | `linger6` | later CN (r1 CN-026 / r2 CN-025; needs G2/E3 and host tile tags) | Stub: a bounded in-page tag map (grass / water) and at hit a linger swap (scorch on grass, steam on water) as ordinary pieces on the same `LiveFx`. No real G2 link | 64×64 with mixed tags, many hits each loop | +1.5 ms; tag map bounded (one entry per cell or a compact stencil, not grown per frame) | Same seed + same tags → same swap and hash | Pass if the swap is palette-safe and bounded. Kill if it needs or invents a sim import, or if the tag map grows without a cap |
| 8 | Element reactions (B5) | `react` | editor suggestion first (Librarian table, switchable); in-game only via fusion's host swap | Stub: a fire + frost pair suggests steam as a ramp key (table lookup). No in-game second model; if a visual is shown, it is a pre-baked swap of one doc | Several fire/frost pairs in the 4-effect scene | +1.0 ms | Same pair + seed → same suggestion and same hash. Switchable off with the flag | Pass if the result stays on the palette and is one effect. Kill if a new colour is invented or a second `LiveFx` is stacked |
| 9 | Combo fusion (B8, stretch) | `fusion` | stretch; host pre-baked swap (M14). True runtime fusion is deferred | Stub: when two dummies hit one cell in the same beat, the host swaps in one pre-baked fused doc and drops the pair. `fx-live` still sees one effect per ability | Packed field, many overlapping hits | +2.0 ms | Same seed + same hit cells → same fused id and hash | Pass if one `LiveFx` and caps hold. Kill if the two sources stay stacked (budget blow, double hit-stop / shake) |
| 10 | Living linger (B9, stretch) | `living` | stretch; would be new per-tile runtime state. S0 must **not** add that state to `src/` | Stub: a visual-only spread across tiles with a hard cap (64 tiles, or the map cell count, never more), a distinct ramp, and a "visual only" label. No occupancy, no HP, no hazard | Worst spread to the cap on the 64×64 map | +2.5 ms; memory bounded (Law 13): a fixed slot or byte cap, released when the flag is off | Same seed → same spread set and hash. Off blocks drop every tile | Pass if the cap holds, the look is visual-only, and hashes match. Kill if the set grows past the cap, if any rule/stat is written, or if a second clock or rAF drives the spread |

Shared kill rules, every idea: the flag is ignored; an ON block is mislabelled OFF or the reverse; the HUD stays green when a budget is broken; a hash mismatch is not flagged; a second rAF loop or a second sim clock appears; canvas or heap crosses 160 MB without a red line; a dummy runs in OFF blocks or when its token is absent; UNIT/TILE are bypassed; `src/` is changed.

## 4. Test-file expectations

Shipped tests count toward the 150–400 line cap, so keep them tight and put them under `tests/tools/` (or next to the existing 35g5a tests). They must run in Node as part of green. They must not need a physical phone. Flags-off must leave pixel smoke and the base L1 hashes (`1:150x98:04b5748d`, `2:150x98:6865666d`, `3:150x98:846e2223`) unchanged. Do not take the scope's "smoke 21 unchanged" as a literal count — main already has more cases after G5b; the pin is "no existing smoke or L1 case moves when flags are off."

Expected coverage (one file or several; names are suggestions):

- `ed-s0-flags.test.ts` — parse `?bold=` and `?seed=`: absent, empty, `off`, known lists, repeats, whitespace, unknown tokens fail closed, seed 0 / absent, out-of-range seed noticed and not silently clamped.
- `ed-s0-ab.test.ts` — six 20 s blocks, labels OFF/ON in order, pooled on vs off, "run again" restarts at OFF, no second rAF / interval in the scheduler.
- `ed-s0-hud.test.ts` — the line is green under budget and **goes red** for over-budget p95, a frame over 50 ms, dropped > 1 %, canvas > 160, heap > 160, and a hash FAIL.
- `ed-s0-hash.test.ts` — same seed matches; a forced mismatch is flagged; flags off + seed 0 does not move L1 or today's particle hash.
- `ed-s0-stubs.test.ts` — each of the ten tokens turns only its dummy on; caps hold; breed/fusion stay one `LiveFx`; living is bounded and empty when off; tiers take a plain int; path/linger hits use UNIT or TILE; no `src/fx` import.
- `ed-s0-law.test.ts` — `requestAnimationFrame` in `src/` is still only `raf-driver.ts`; the page has no second looping rAF; dummy modules do not use `setInterval` / `setTimeout` / `Date.now` as a clock.
- `ed-s0-build.test.ts` (or an extension of the 35g5a build/check tests) — `build` + `check` stay green; the export audit in §6 fails if editor, devtools, or an unused dummy file ships.

Green becomes 742 + n with 0 fail / cancelled / skipped / todo. typecheck, lint, deps, `check:state` and `check:law` stay at 0. Sims and stress counts on the flags-off path are unchanged.

## 5. QA plants

The S0 build's tests must catch all of these. A miss is a must-fix. About ten, in the spirit of the six protocol points.

1. **Flag ignored.** `?bold=breed` leaves the breed dummy off (or every dummy always on). The ON blocks are then a no-op and a green line is a lie.
2. **Unknown token fails open.** `?bold=breed,lingr6` (typo) enables a real idea, or is dropped with no notice so the CEO thinks linger ran.
3. **A/B block mislabelled.** The first 20 s are reported as ON, or an ON block's frames are pooled into OFF, so the delta is meaningless.
4. **Scheduler uses a second clock.** Blocks are driven by `setInterval`, `setTimeout`, or a second `requestAnimationFrame` loop rather than the one driver / visit path.
5. **HUD does not go red.** On-block p95 is over off p95 + the idea budget, or canvas MB is over 160, and the line stays green (or DONE still says pass).
6. **Hash mismatch not flagged.** Two same-seed passes differ and the readout still says PASS.
7. **Second rAF loop.** A dummy or the page starts its own looping `requestAnimationFrame` besides `raf-driver` (the one-shot `start()` kick does not count).
8. **Stacked `LiveFx`.** The breed or fusion dummy leaves two (or six) live effects in play, so particles / lights / hit-stop can blow the per-ability caps.
9. **Unbounded dummy.** The living-linger set (or a tag/path list) grows every frame with no cap, a Law 13 miss.
10. **Canvas watch regresses.** The MB line omits the main canvas (the pre-G5b bug), so a 160 overflow can look green.
11. **Flags off are not stable.** With no `?bold` (or `?bold=off`) the L1 hashes or the particle seed change, so the page is no longer a baseline.
12. **Export / dummy uses wall noise.** The bake or a dummy calls `Math.random` or `Date.now` instead of `?seed=`, so the hash flakes.

## 6. Export audit

Dev tools must never leak into Render builds (ARCHITECTURE-v0 §4: `main.render.ts` imports neither `@te/runtime/debug` nor `@te/devtools`; there is no `if (DEV)` toggle to forget). A rendered game contains no editor or level builder.

S0 ships through the existing device-page builder: `node tools/device-page/build.ts <folder>` then `check.ts` prints `check ok`. The tree is only the page, `build.json`, and the runtime + pixel-suite files the page loads (P7 still allows `tools/pixel-suite/fixture.ts` and `l2.ts`). Reject a build that contains any of: `src/editor`, `tools/effect-designer` editor UI, devtools / `DebugPort` / preview overlay, tests, handoff, source maps, unused stub files, or a dummy that is not imported from the flagged page. Dummies live under `tools/device-page/` (or a subfolder that the page imports). They must not be added to `src/runtime`. The audit is a shipped test, not a manual glance.

Publishing is still one CoS push of a checked build to gh-pages `/device-page/`, and only after RaiKynn's typed OK. This spec does not publish anything.

## 7. Phone run sheet shape

Extend the G5b TEMPLATE; do not replace the five-row perf log. S0's scored sheet is a short 2-minute A/B card, one idea per visit.

**Header (from TEMPLATE):** date and time (Europe/London), phone (S21 Ultra or Red Magic 9 Pro), Android version and browser, power saving yes/no, how the page was opened (website / Termux / computer). No IMEI, serial, or other device identifier.

**Run setup.** Worst-case scene. 60 fps cap **on** (so the 18.3 ms line applies). Lite **off** for a scored A/B (auto-lite mid-block confounds the delta; say so if a run had to use auto). Open `?bold=<token>&seed=<n>`. Hold the phone upright; a rotate prompt must not sit inside a compared block (after DONE, or in a named gap, is fine). Leave it until the box says DONE at 2 minutes.

**Order.** S21 Ultra first, then the Red Magic 9 Pro. For harness checkout, one baseline visit (`?bold=off`) plus the dearest stubs first (`export`, `living`, `fusion`, `path`) are enough to prove the page. Graduation of any one idea still needs a scored visit for that token on both phones.

**Table, one row per visit:**

| Phone | token | seed | cap / lite | off p95 | on p95 | delta | off / on dropped | max on | canvas peak | heap peak | hash | budget | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Send back:** a screenshot of the DONE box, the table row, whether the line was red, anything that looked wrong (blur, stutter, flicker, a hitch at a block boundary), and whether lite switched. Not the IMEI or serial.

## 8. Review notes on scope §6–§9

These are QA notes on the proposal. They do not change the scope file.

**Risks.** M1, M14 and M6 are the ones S0 can actually catch: merges and swaps that blow the 48/2/12 caps or stack `LiveFx`; a looping preview that is too dear at DPR 3 on the S21. M15 (living linger mistaken for a hazard) is only testable as "visual-only, bounded, no rules writes" — a phone look will still need a CEO eye. M5 is a hard law check: the path stub must not import `src/fx`. M13 is process, not code: one typed OK for this page. M2, M4, M7–M12, M3 sit in later slices and should not leak into S0 as format or writer work.

**Missing budgets.** §10 gives one example ("≤2 ms of the frame on the S21") and the 160 MB cap. It does not give per-idea ms lines, an export peak-MB target besides 160, a living-linger tile cap, a breed "how many children play at once" cost, or a formal "on p95 ≤ off p95 + N" rule. The [E] numbers in §3 are QA's starting lines so the HUD has something to go red against; they can move after the first S21 numbers, but not silently. E10 is gated on S0 heap numbers — the readout must include the peak, not only pass/fail. There is also no budget for a combined multi-flag visit, which is why those visits are unscored.

**r2 naming (not in r1).** After this spec's source copy, r2 renamed stored layers to `parts[]` and renumbered the later CNs (see the header). That does not change the S0 protocol or the flag tokens. It is a testability note for E4+ and for anyone comparing this spec to the share file after 01:25.

**Drift against ARCHITECTURE-v0 and build law.** (1) ARCHITECTURE-v0 §0 "warn, don't block" and §12.11's 160 MB **decoded-stage** warn (never a block; with the chunk cache a phone warn is about 256 MB) is not the same 160 as the device-page **canvas/heap** cap. S0 must label its line as the G5b device cap, and must not teach a host that the engine should throw at 160. (2) A red S0 line fails the *idea*, it does not violate "warn, don't block" in `src/`. (3) §4 Preview vs Render: this page is a tools spike, not Render, but the gh-pages copy still must not ship devtools or editor code. (4) Living linger as "new per-tile runtime state" sits badly with G-5, the "two effect models" lesson, and Law 13; S0 must not preview that state inside `src/`. (5) Effect points that hit a unit or cell still go through UNIT or TILE (§12.10). (6) Tiers are a plain int from the host; core stays free of HP/mana. (7) The current tree is `src/` + BUILD_GUIDE, not the packages layout in ARCHITECTURE §1 — S0 follows the tree on `d982155b`. (8) Existing FX caps are real caps, not warnings; S0 must not raise or bypass them in the name of "no artificial caps." (9) `check:law` still bans `performance.now` and rAF in `src/`; the HUD may keep the page's host-gap path. (10) Scope §8's "smoke 21 unchanged" is stale against main after G5b; pin today's L1 and smoke, not the number 21.

**Testability gaps.** `performance.memory` is Chromium-family only — CEO phones are Android, but the HUD needs a `heap n/a` path and tests must not require the API. Hashing must exclude the HUD, or every visit will flake. Auto-lite and a mid-block rotate will confound A/B; the sheet turns those off for scored runs. Dummy cost may not match the real slice (especially breed if only one child plays, and export if the bake is smaller than E10). S0 should name the worst-case fixture and seed (G2b N2 is still open). Forcing DPR 3 on a real phone is not a URL flag today; say what the page does when `devicePixelRatio` is already 2.625 or 3. Block timing is host visit time, not sim time — that is consistent with the current page, but the hash samples themselves must be keyed on the one clock. The `?ps` clamp nit must not be repeated for `?bold` or `?seed`.

## 9. Out of scope for the S0 build

Implementing E1–E10 or the later CNs (020 onward). Raising FX budgets. A node editor, WebGL, sound, sprite-clip writing, or game rules in core. A second publish, or any gh-pages push without RaiKynn's typed OK. Editing `scope.md` or other EA-owned files.
