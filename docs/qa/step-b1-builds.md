# QA review: B1 behaviour runtime, ChatA r1 handback + EA catalogue pin (one builder, one pass)

Reviewer: QA & Build Guard, 2026-11-17 ~02:15 (Europe/London). Evidence: `docs/qa/qa-runs/b1/builds/`.
**Verdict: OK TO OPEN PR on head `3238dddbfbdd6e2d6475541a617ea697b0ee88e7` (EA pin on ChatA f3380466), expected merge tree onto main 6add89b6 = `ccb7f0ed828c43ac03646bb4265f5a7406519f47`.**
ChatA alone (f3380466) is **not** mergeable: its hand-built catalogue is not rev 26 (M1, closed by the EA pin). No QA pin needed.

## 1. Identity, chain, files
| Item | Expected | Found |
|---|---|---|
| ChatA bundle | 7f6c2e75 | 7f6c2e75, verify OK, needs bb7df0fc; tip f3380466 (tree 01de15c1), head cfd2bf05 |
| EA pin bundle | 94d12709 | 94d12709, verify OK, needs f3380466; 3238dddb, tree 4c5c097f |
| Chain | on bb7df0fc (kit Base) | 3346acc → cfd2bf0 → f338046 (handback) → 3238ddd (pin); bb7df0fc is on main |
| Identity | noreply | all 4 commits author+committer `G-TileEngine@users.noreply.github.com` |
| HANDBACK | 7b8c4702 | share copy = committed copy; quotes step sha f22b98fd (kit r8) |
| Shipped tests | 0100f227 / b717565a | byte-identical on ChatA and pin |
| File list | kit files + handback/ | 6 src + 2 tests (kit table) + 6 files under handback/; pins (package, lock, depcruise, check-law, core-types) unchanged |
| Pin diff | catalogue.ts only | `+44 −23` in catalogue.ts only |
| Generator | b7087fdd on rev26 ea8b3302 | asserts rev 26 + ea8b3302; my run → `8398d417…`, table 3b16c673 = pin's catalogue.ts = proto 32f9019c's (byte-equal) |
Size: ChatA 385 (src 185, tests 200); pin 406 (src 206, tests 200). Per-file caps all held (types 15/26, catalogue 46/48, registry 102/120, xp 17/26, terrain 21/24, index 5/6).

## 2. Gates (sequential; no p95 flake)
| Ref | Tests (floor) | deps | Other gates | sim / stress / smoke vs bb7df0fc |
|---|---|---|---|---|
| ChatA f3380466 | 851/0 (851) | 119 / 381 | all exit 0 | SAME (afc89d56, b8007292; 27/0/0…27/373/0) |
| Pin 3238dddb | 851/0 (851) | 119 / 381 | all exit 0 | SAME |
| Trial merge pin → origin/main 6add89b6 (`refs/cmp/b1-trial-main` 10aab7bf, tree **ccb7f0ed**, clean) | **874/0 (874)** = 858 + 16 | 122 / 391 | all exit 0 | SAME vs 6add89b6 |
CoS's trial claims (clean, ccb7f0ed, 874/0, 122/391) verified independently. origin/main re-fetched: still 6add89b6.

## 3. Plants (on the pin, both shipped test files)
| Set | Result | Adaptation |
|---|---|---|
| EA 99 (`b1-plants-list.py`) | **99/99** | 22 needles as-is (catalogue, freeze, 42/46/51/53/54, 87/88); 77 retargeted to ChatA's code, same mutation (`ea99-chatA.py`, one line each) |
| QA r3/r4 Q (31; Q2 dropped: unobservable, `get` is Map-based) | **31/31** | 8 as-is (Q23, Q26–Q32), 23 retargeted |
| N r7 (13) | **13/13** | N6–N8, N11, N12 as-is; 8 retargeted |
| Freeze S5a–f (6) | **6/6** | all as-is |
| L1–L10 (10) | **10/10** | L9 as-is; 9 retargeted |
Total **159/159**. Notable retargets: 35 (an early `return` after `read.add`), 40 (both the `*` row and the key loop), 70/78/79 (ChatA does not resolve inactive knobs, so the mutant resolves them), 83 (`playable` keyed on the unknownBehaviour code), 89/N3 (label check dropped plus `String()` on the length test).
ChatA alone: registry, xp-levels and terrain are identical to the pin, so the same results. Its catalogue is a different file, and the catalogue plants do not apply (see M1).

## 4. Parity vs proto 32f9019c (src fully re-written by ChatA; `b1-parity.ts` + the r3–r7 probes run in both trees, then diffed)
- r3/r4/r5/r7 probes: identical except `out tile mutate`. Proto freezes each terrain output tile; ChatA builds fresh unfrozen tiles per install. Not ruled, no leak: the next install is clean (R1).
- Ruled points, all identical to the proto:
  - GATE_DEFAULTS {card-hand false, menu true}; card-hand on hides the menu knobs.
  - strayValue: warns with a value, silent without, never plays.
  - L2 `{value, rev}` plays and a bare L2 is hard. L3/L4 on a non-perUnit knob → notPerUnit. A perUnit knob takes L4 over L3.
  - Catalogue deep-frozen (generator). TERRAIN, XP_LEVELS and their knob lists frozen.
  - N8: `Bog`/`BOG` hard (regex has no `i` flag); `-bog` hard; 32 chars ok, 33 hard.
  - Labels: 48 silent, 49 and 200 warn `outOfRange … .label` and are kept whole.
  - Non-record layer (5, "x", [1], true) → `unknownKnob xp-levels.* (answers)`; null silent.
  - HP: Infinity, 0, −1 and NaN → `invalidValue difficulty.hp`; 1e308 → `invalidValue (L5)`.
- Only other diff: key order inside a user list item (ChatA: user fields first, then the item defaults). Same values (R2).
- Drift: ChatA's catalogue vs rev 26 → knob order differs, `pvp_kills` default 1 (rev 26: 3), and other guessed ranges. Reserved tiles 14–15 are pit/ice; rev 26 has **path/dirt** at those slots (verified in rev26 json, 15 tiles). Its table stamp is 8e9d46a5. The pin has path/dirt and matches rev 26 exactly.

## 5. Findings
### Must-fix
- **M1: ChatA's catalogue.ts is not rev 26** (drift above; acceptance line "gen-catalogue.py reproduces catalogue.ts byte-identical" fails). Cause: kit defect (generator not shipped, EA owns). **Closed by EA pin 3238dddb**; nothing left on the pin.
### Should-fix
- **S1 (kit, EA):** green cannot see a hand-built slice. The test recomputes `CATALOGUE.table` from the live tables, so any self-consistent re-stamp passes (ChatA did, 851/0). Pin the literal `3b16c673…` in a shipped test, or ship the generator with a CI check, before the next catalogue step (B5/rev 27).
### Report-only
- R1: Terrain output tiles are not frozen (the proto froze them). Fresh per install, no shared state.
- R2: List items keep the user's key order first. A future snapshot hash of resolved lists would differ from the proto's order; nothing hashes them today.
- R3: The index no longer re-exports types `Gate`, `InstallCtx`, `KnobType`. Still exported from `types.ts`; the kit does not list index type re-exports; P1-1 imports `types.ts` directly.
- R4: deps 381 vs the kit's 380. The extra edge is `src/rules/behaviours/terrain.ts → src/core/plain.ts` (`isRecord` to filter list rows). Legitimate: rules may import core, and the kit's Depends lists `src/core/plain.ts`. ChatA disclosed it.
- R5: The HANDBACK PR line "PR: opened by Chief Of Staff from the bundle" is the text the kit **requires** (kit line 6), not leftover template. Report-only.
- R6: Size 406 with the pin. The kit's total cap is ≤ 450 (band 400–500 with reason), so this is inside the cap. **Ruling: accept.** The +21 over ChatA's 385 is EA's generated catalogue (46 lines, cap 48), and generated output from a kit defect is a valid band reason.
- R7: The HANDBACK says reserved "15th and 16th" slots. They are the 14th and 15th of 15.

## 6. Build law and HANDBACK
- No clock, rAF, timers, `Math.random` or `Date` in src; check:law OK; pure rules under `src/rules/behaviours`. Law 13: one memo per install, dropped on return.
- §0.6 Helpers & self-review: **present**. Three helpers (catalogue, a 20-case probe, a registry review honestly reported as stopped and redone by hand), plus self-review against Acceptance. Not thin.
- HANDBACK claims vs reality: 851/0, sim, stress and chaos lines, deps 119/381, diff 385, step sha f22b98fd, head cfd2bf05 all match. Its catalogue disclosure is accurate (rev 26 missing, pit/ice and pvp_kills guessed).
