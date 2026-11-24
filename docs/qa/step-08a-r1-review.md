# QA review: step 8a r1 (autosave links), PR #95

**Verdict: NOT OK, 3 must-fixes, one rework round (r2).**

| | |
|---|---|
| Branch | `step/step-08a-autosave-links-r1-chatA` |
| Tip | `a9ccade3cce110c10f64d700280ffeb6ff95285e` (tree `d8a232b9`), handback folder only |
| Code head | `3d3d253966b6ba65559dfb1fd1d020641a3f1e6d` (tree `ca5f1598`) |
| Base | `9f7f7e526bf8655b903c7722c478bfe913d77405` (= main) |
| Guide | `docs/maker/steps/step-08-autosave-links.md` r4, sha256 `35403881`, 247 lines |
| Go-line | `/workspace/share/step-08a-goline.md` (N = 8, floor 1122, caps 398) |

## What passes (my own runs, clean worktree at the tip, real `npm ci`)

- `npm run green`: 1122/0. All 8 named step 8 tests pass, and step 7's 6 `stage link` tests pass. Test 8 median 0.91 ms.
- `one-parser.test.ts` and `baseline-page.test.ts` are unedited. The other test edits stay in scope: trusted-saves L36–37, L41, L47 and L55 (session-save key only), stage-links (the 4 `arriveIn` call sites only), and smoke.test.ts L14 (pin `439f403d`).
- `npx tsc --noEmit -p tools/tsconfig.json`: the 3 base errors only (effect-designer L101, home.ts L85 ×2). Nothing new.
- s8 smoke (port 8810): 16 ok and SMOKE PASS. S0 touch smoke (port 8797, sha `d528795e`, unedited): 14 ok and TOUCH SMOKE PASS. The smoke is 44/55 lines, uses only `waitForFunction`, and has no init script.
- Export audit (`s8-audit.mjs`): AUDIT PASS. Play-stage has 131 files, baseline 145, and the maker play tree 142 (131 direct).
- Count: 355/400. Every per-file cap is met on numstat, but see must-fix 2.
- Must NOT items read clean: no catch on the slot read; the session check runs before any write; a refused or unreadable file is never overwritten; a link taken in a contest writes nothing (Q7 retreat); a stage with no string id throws `play: stage id`; no `?? []` for hp or rules; `party()` is read before `stop()`.
- D28 shape: session-save v1 at `tileengine/saves/<id>/autosave.json`; rev and engine mismatches are notices; dangling refs give `saveRefDropped`.
- HANDBACK: has the Code head label, "PR: none yet from the branch.", all sections, helpers, and no raw log. The 4 shots match their captions.

## Must-fixes for r2

### 1. Arrival search walks about 525,000 cells whenever the party is bigger than the free cells (Law 13, mobile performance)
`arrival()` in `src/rules/session/links.ts` pushes every neighbour into the queue, including walls, taken cells and off-map cells, until Manhattan 512 from the first arrival cell. When fewer free cells exist than `size`, it never fills up, so it walks the whole diamond (about 525k cells, with a Set entry and an object for each). The same happens when `grid` is null, because `free` is then false everywhere.

Repro: save the script below outside the tree, then run `node --experimental-strip-types qa-arrival-repro.mjs <worktree>`. Results on my computer (a desktop CPU; a phone is slower):

- **A** (unit: one free cell, size 2): 309 ms, with about 50–100 MB of heap churn.
- **B** (travel: S2's map is open only at 0,4 and 1,4, a raider is on the stairs, and the party has 2 members): 358 ms for one link. That is one stair step on a mid-range phone, against the step 7 budget of under 4 ms.
- **C** (the stock shop, for control): 1.1 ms.

**Fix:** keep the search inside the map, so its worst case is bounded by the stage's own cells and not by 512. For example, flood only through cells `free` accepts, as the trial did. Keep N E S W order and named test 2's expected cells.

**Check:** I rerun A and B. Each must come back within the step 7 budget, and named test 2 must be unchanged.

```js
// usage: node --experimental-strip-types qa-arrival-repro.mjs <worktree>
import { join } from "node:path"; import { pathToFileURL } from "node:url";
const root = process.argv[2], load = (p) => import(pathToFileURL(join(root, p)).href);
const { arrival } = await load("src/rules/session/links.ts"), { shopFiles } = await load("tools/baseline/checkpoint.ts"), { arriveIn } = await load("tools/play-stage/project.ts");
const S1 = "stage_01JDES00000000000000000001", S2 = "stage_01JDES00000000000000000002", H = "unit_01M81X2BX5ANZS5PWVAFHNCASA", R = "unit_01M81X2PKRZ2NQKAHDV247ZRX3", MAP = "maps/map_01JDEM00000000000000000002.json";
const time = (label, f) => { const t0 = performance.now(), got = f(); console.log(`${label}: ${(performance.now() - t0).toFixed(1)} ms, ${got}`); };
time("A unit: 1 free cell, size 2", () => JSON.stringify(arrival([], "x", [{ c: 0, r: 0 }], 2, (sq) => sq.c === 0 && sq.r === 0)));
const files = shopFiles(), map = files[MAP], s2 = files[`stages/${S2}.json`];
const nook = { ...files, [MAP]: { ...map, logic: { ...map.logic, terrain: map.logic.terrain.map((_, i) => (i === 24 || i === 25 ? 0 : 1)) } }, [`stages/${S2}.json`]: { ...s2, enemyPool: { mode: "fixed", entries: [{ unitId: R, at: { c: 1, r: 4 } }] } } };
const party = { side: "player", members: [{ unitId: H, hp: 5 }, { unitId: R, hp: 5 }], bar: null };
time("B travel: S2 open only at 0,4 and 1,4, raider on the stairs, party of 2", () => { const got = arriveIn(nook, S1, S2, party); return `spawns ${JSON.stringify(got.docs?.stage?.playerSpawns)}, chosen ${got.docs?.chosen.length}, error "${got.error}"`; });
time("C stock shop, party of 2", () => JSON.stringify(arriveIn(files, S1, S2, party).docs?.stage?.playerSpawns));
```

### 2. `tools/maker/test-launch.ts` L4 joins five imports to fit the cap (guide L157, go-line hand-back rules)
L4 puts 5 imports on one line. Every other import in the file, and all four in the trial, sits on its own line. Split the same way, the file is 22 lines against a cap of 19. The guide says: "Don't wrap or split lines to dodge a cap, and don't join lines to fit one." Going over a cap is stop-and-report.

**Fix:** put one import per line and fit 19 without joining. The trial fit at 18; for example, it had no second `isObj`. If 19 can't be met, stop and report to EA for a cap ruling; don't ship a join.

**Check:** I read L1–10 and the numstat for the file.

### 3. The resume banner calls a dropped stage a "unitId"
In `tools/maker/home.ts` L79, every `saveRefDropped` is printed as `dropped unitId ${n.message}`. The reader (`src/project/read/session.ts` L35) also raises it for a missing `to` or `from` stage, so a deleted stage shows "Continued. Since the save: dropped unitId stage_…".

Repro: save an autosave, delete the stage it points to (after removing its links), then Continue.

**Fix:** the banner names what was dropped, whether the stage it was going to, the stage it came from, or the unit (the trial put the kind in the note detail). Same lines, no new ones.

**Check:** I read the two lines, and named test 9's dropped-ref case still passes.

## Carry for EA (not an r2 item)
- When the stage's free cells number fewer than the party, the extra members are dropped with no notice. In repro B, `chosen` is 2 but there is 1 spawn, and `match.party()` comes back with the hero only, so the next autosave loses the raider for good. The guide says "fills the nearest free cells instead of losing a unit" but is silent on this case. EA should rule on it, for example a notice or refusing the link.

## Non-blockers (no change needed)
- `levels.ts` L64 has unreachable narrowing (`continue`, `: null`, `: []`).
- `test-launch.ts` has a second `isObj`.
- `project.ts` L102: a null grid makes every cell not free. `openProject` then fails on the missing map or terrain anyway.
- `writeAutosave` reads the slot twice.
- `resumeNotes` is computed at `openId`'s rev (an existing carry).

## r2 floor
Base is still `9f7f7e52`. The r2 must keep 1122/0, the 3 tsc base errors, s8 16 ok, S0 14 ok, the audit, a count of 400 or less, and every cap without joins. Only the three files above (plus test 9 or test 2 lines, if touched) should change. Rerun the shots only if the UI changed (it shouldn't).
