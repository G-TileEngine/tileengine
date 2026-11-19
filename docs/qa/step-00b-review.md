# Step 00b (S0b) r1 review — 2026-11-19, Europe/London

Read-only. `git fetch -q origin`: `origin/main` is **`3bd3e5db`** (docs-only: 03b r3 + step-04 r6 `ba589ccc` + roadmap r11 + rulings `24cba61e` on top of `af9af6c0`). Floor on this tip is still **1036** (1b merge; no test-changing commit since). Guide `/workspace/tileengine/docs/maker/steps/step-00b-sides-from-data.md` is sha256 **`569f574499390f356f3135a7f774be894a613ebaaa2661cdc22897c0fd2aa47c`**, 114 lines, as claimed.

**Verdict: NOT OK** — 2 must-fixes below. Recheck those two lines only.

## Base, floor, caps, smoke, plants

- **Base / floor logic is stated in both cases, not hard-coded as 1043 only.** L9–11: base `3bd3e5db` or the latest main at the go-line; floor **1036 + 7 = 1043** on `3bd3e5db`; if CoS gives a later base (4a, or steps 2/3/03b), the floor is that base's count + 7, and CoS gives the number. L97 repeats this. That is enough. 1043 is correct only when the base is still `3bd3e5db`.
- Caps sum to **230** (25+35+20+10+22+8+110) of 400. Trial 155 (121+/34−) is consistent with the table. The 400 gate is `git diff --shortstat <base>..HEAD -- . ':!handback/**'` (L74, L97). This run does not touch fixtures, templates, tokens or a new smoke folder, so excluding only `handback/**` is fine (stricter, if anything).
- Touch smoke: frozen sha256 **`d528795e…`**, 107 lines, git blob `1f50845a`, last changed in `9fc4989` — all match `origin/main`. Required at **390 and 360**. Step 3 and 4a smokes only if already on the base. Good.
- Hand-back list: P2 (one-parser, allowlist stays empty) and parity seed **24301** / golden `90dde42a…` (confirmed on main) are in Done when, with an empty `git diff --stat` on `tests/tools/golden/`. `npm run green` includes `check:law` and `check:state`. P1 (`tests/project/load/law12.test.ts`) and P3 (`version-reject.test.ts`) are not named, but Must NOT forbids editing existing tests, so they stay under green. Not a must-fix.
- The 7 named tests (L77–83) are real behaviour tests (1–6) plus a play-stage source scan (7). Each must fail on the base. EA's trial numbers are claimed, not re-run here.

## Code claims on `3bd3e5db`, and R-E3 / R-E5

Every cited line holds: `match.ts` SIDES / `type Side` 15–16, `wipeRule` 25, `side = "player"` 26, `finish` 38–48 (`?? "player"`, `=== "player"` at 47), `pump` `"wolves"` ×3 at 67, `landed` 80, `endTurn` 113 / 117, `recentreTarget` 123, `view` 136, `ready` 152, `play.feed` 155; `board.ts` 45 / 73–74 / 132; `looks.ts` `animId` 12, `unitAsset` 28, `dressPx` 39–40; `load.ts` TEAM / `Recipe.team` / `fallback` / the 7 rows 6–16; `hud.ts` 25 and 28; `win.ts` `wipeRule` 17–29 (one-item list returns `"win"`); placements 23 / 27 / 43 already honour `neutrals[].side`; `targets.ts:10`, `battle.ts:60`, `bot-ability-priority.ts:18` already treat `"neutral"` as never a foe; no wolves-only budget in `action-budget.ts`. Demo stage `sides.enemyPool: "wolves"`; the Merchant (`unit_01JDAN…0007`) is the `neutrals[]` entry with `side: "player"`. Existing tests and golden shas match. Rule 7 (no `src/` change) is right for this scope.

Wording agrees with step-04 r6 (`ba589ccc`) Rules 13, the 4b **Prerequisite: S0b** paragraph (R-E3: sides from data, no wipe with one side; R-E5: colour by side, `RECIPES.team` is only the board colour today) and the no-enemy info row.

## Hard-coded sides on main

`rg wolves` on `origin/main`:

- **`src/` has none today.** Built-in defaults in engine code are `"player"` / `"rival"` / `"neutral"` only (`placements.ts`, `targets.ts`, `core-types.ts`). The guide leaves them alone. After this step there is still no `"wolves"` in `src/`.
- **In scope (removed):** `tools/play-stage/match.ts` (15, 67, 80, 117) and `load.ts` (6, 16). Test 7 gates the directory.
- **Carried, already named:** `tools/host-example/match-picture.ts:17` `["player","wolves"]`. This is a **hand-run host example**, not shipped runtime: the file header says so, and `BUILD_GUIDE.md` says `tools/host-example/` is never shipped (`src` never imports `tools/`; `package.json` exposes none; `npm test` does not run it). Safe to leave. It is named in Must NOT (L94) as out of scope, but not under **Carried, not this step**, and no later step is named to take it.
- **Not named (must-fix 2):** `scripts/sim.ts:15` still has `["stage-fixed", ["player","wolves"]]`. That is a hand-run `npm run sim` report, pinned byte-for-byte by `tests/sim/script.test.ts`. It is not play-stage and must not be edited in this run (the pin would fail). Fixtures and other tests also contain `"wolves"` as data; Must NOT already forbids editing them.

## Go-line order vs step-04 r6

**They agree on 4b waiting on S0b**, and on S0b belonging after 4a when both are ready. step-04 Go-line order item 3: 4b waits on 4a, **S0b** and 03b. It does not itself order S0b after 4a (the three are 4b prerequisites). S0b L12 correctly places this run after 4a and before 4b, notes the `looks.ts` overlap, and asks CoS to send the go-line on the 4a merge to avoid a rebase. 4a edits ground frames at lines **35, 46 and 49**; this step edits `dressPx` at **38–41** — same file, different lines. If 4a slips, running S0b on `3bd3e5db` is still allowed, **but they do share a file**, so the later of 4a / S0b must rebase `looks.ts`. The closing clause of L12 is wrong (must-fix 1).

## Laws

- **One clock / rAF, UNIT and TILE only, no game-specific engine code:** no new `src/` file, no new pipe, no `"wolves"` left in `src/` (already none). Play-stage `"wolves"` are removed and gated by test 7. Not restated in Must NOT; not a must-fix given Rule 7 and the scan.
- **Law 12:** L93 names `me` defaulting to `"player"` as the format §6.5 default, not a silent one. Missing `sides` / `loadout` is therefore covered. A **legal custom side string** (the demo's `"wolves"`, or `"rival"`) must play as that side — that is the point of R-E3; it is not an error. Format §6.5 L1077 (unknown id → warning, army plays as its default) is a reader concern and is correctly out of scope (no `src/` change). The zero-unit / only-neutral case is implied by Rule 2 (`contest` false → skip wipe, one-item `order`) but is not spelled out; a non-string `loadout` would also hit the `else "player"` branch. Name those two cases (niggle, not a must-fix): no units or only neutrals → `order` is `[me]`, `contest` false, free roam; a non-string `loadout` is a visible error, not a fallback.
- **Law 13:** the new sprite `Map` is built once in `createPlay` and is bounded by the number of units at start. The bound is implicit. A one-line statement would help; not a must-fix.

## Must-fixes

1. **`step-00b-sides-from-data.md:12`.** The sentence "If 4a slips, this step may run on `3bd3e5db`, because it shares no code with 4a" is false: both runs edit `tools/play-stage/looks.ts`. **Change** the closing clause to: keep the permission to run on `3bd3e5db` if 4a slips, and say the later merge rebases `looks.ts` (4a: ground frames at lines 35, 46 and 49; this step: `dressPx` at 38–41).

2. **`step-00b-sides-from-data.md:111–114` (Rulings needed / Carried).** Add a carry for `scripts/sim.ts:15`, which still has `["player","wolves"]` for the stage-fixed report. It is out of scope. Do not edit it: `tests/sim/script.test.ts` pins its 50-seed output. Optionally move `tools/host-example/match-picture.ts:17` onto the same carry list (already named at L94; safe to leave; no later step is assigned).

Hold the go-line until those two lines are fixed. Everything else in this r1 (scope, R-E3/R-E5, caps, smoke, plants, parity, step-04 go-line, and the 1043-vs-later-base floor) can stand.
