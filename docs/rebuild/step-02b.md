# Rebuild record: step 02b, play-stage carries A and B

Original brief: [`docs/maker/steps/step-02b-play-stage-carries.md`](../maker/steps/step-02b-play-stage-carries.md) r2 (blob `a25a44ff`, sha256 `c6bcd1d4bbffc846d036d91c1246b5ba8196a8d0797114aed42e69e3f40099fc`, on main `10308bba` and at the merge). Do [`step-02.md`](step-02.md) first; this step starts on its merge. The carry text in the brief (L36–37) is byte-identical to step 2 guide r6 L76–77 (sha256 `13167721c67ce5ddf2bee42e2130875b90130bb75ff3492faa9047d63d8b7563`, blob `25c0ee1a` at `477e021e`; QA:21, V:59). This file records exactly what shipped.

Sources: PR #80 and branch `step/step-02b-play-stage-carries-r1-chatA` (tip `ad86194f`, code head `1df36efc`); `handback/step-02b/r1/HANDBACK.md` at `ad86194f` (HB); `docs/qa/step-02b-review.md` (QA, sha256 `c556565e88d18944821a58b81fb42699a957f9117cee64705b0be09dfdb6b662`, blob `e4859b48`, 42 lines); Chief Of Staff verify report `/workspace/share/step02b-verify/report.md` (V, sha256 `4121cfc2cec1aaccdffe247b71d58138d0878ba0bacad637d9448ba7adf6643f`, 144 lines). Line numbers are at the commit named. Code line cites are at merge `fdf29002` unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `34fda67498e1f1eac0f6bcff0fecd1f5678d3fa0`, the step 2 merge (PR #79). Floor **1039** tests (guide L8) |
| Commits | `1df36efc` feat (give each load its own recipe map; code head, tree `aa5bdf92`), `ad86194f` hand-back (tree `3464e06e`) (V:19-23, QA:6). Linear, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| QA verdict | **OK TO OPEN PR** (QA:11). One builder run, no rework |
| Merge | PR #80 "Step 02b: play-stage carries", merge commit `fdf29002ae7438152a1593a8529acecf6292b3f6`, 2026-11-19 03:23 (UK time). Tree `b0eed0b82759bfb94064aa44dfed55c6bd9208bd` (the same tree CoS and QA merged against `10308bba`; V:127, QA:37). First parent `10308bbac2e40eb846c45c9bce844acde9557eec` (step-02 rebuild record and QA reviews, two docs-only commits after `34fda674`), second parent `ad86194f` |
| After the merge | main moved to `b3b74070e7a46f1e97753f708ae151649a33d9b2`, which only adds `docs/qa/step-02b-review.md` on top of `fdf29002` |
| Tests | 1039 + N=2 (carry A, carry B) = **1041 pass / 0 fail** (QA:14, V:77, V:80) |
| Size | `git diff --shortstat 34fda674..ad86194f -- . ':!handback/**'` = 7 files, **45 insertions + 15 deletions = 60** ≤ 400, and under the 70-line cap sum (guide L53, L68; QA:16, V:88, V:91) |
| Stamp | none. This step does not build the maker (V:109) |
| Smoke | sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`, unchanged. 7 ok at 390 and 7 at 360, `TOUCH SMOKE PASS` (QA:15, V:117) |

## (b) Files

From `git diff --name-status 34fda674..ad86194f -- . ':!handback/**'`. Line counts are `git diff --numstat` insertions and deletions.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `tools/play-stage/load.ts` | edited | 7 (4+/3−, cap 8) | Freeze `RECIPES` (`Readonly<…>` plus `Object.freeze`). Add `recipeIn(map, id)`. Make `PlayDocs.recipes` required (carry 8) |
| `tools/play-stage/project.ts` | edited | 6 (3+/3−, cap 8) | `playDocsOf` builds a per-load copy of `RECIPES` plus that project's unit-id aliases, never writes `RECIPES`, and returns `recipes` with the docs |
| `tools/play-stage/board.ts` | edited | 4 (2+/2−, cap 5) | Unit sprites look up `recipeIn(body.recipes, u.unitId)`, not `recipeOf` |
| `tools/play-stage/match.ts` | edited | 6 (3+/3−, cap 8) | Talk names and the HUD unit name look up `recipeIn(body.recipes, …)`, not `recipeOf` |
| `tools/play-stage/build.ts` | edited | 2 (1+/1−, cap 3) | Carry B: in `build()`'s `walk`, the `.json.js` text replaces each raw U+2028 with `\u2028` and each raw U+2029 with `\u2029`. No `JSON.parse` |
| `tests/tools/touch-play.test.ts` | edited | 7 (4+/3−, cap 8) | `idOf` / `wolfTo` look names up in `bundledDocs().recipes`. No other change to the test |
| `tests/tools/play-stage-carries.test.ts` | new | 28 (cap 30) | One test per carry (Done when) |

Hand-back file `handback/step-02b/r1/HANDBACK.md` is on the merge tree but is excluded from this list, as it is not product. There is no `test-output.txt` in the tree (QA:18, V:51). The folder is the short path, not the full step id the brief names at L15; QA accepted that (QA:40).

## (c) Key code and git commands

Every file's full code is in the appendix at the end of this file, taken from the merge commit `fdf29002`. To see it in git:

```
git log --oneline 34fda674..ad86194f
git diff --stat 34fda674..ad86194f -- . ':!handback/**'
git diff --shortstat 34fda674..ad86194f -- . ':!handback/**'
git diff 34fda674..fdf29002 -- tools/play-stage tests/tools/touch-play.test.ts tests/tools/play-stage-carries.test.ts
git show fdf29002:tools/play-stage/load.ts
```

**Carry A: each load keeps its own recipe map.** `RECIPES` is declared `Readonly` and frozen (`tools/play-stage/load.ts:9`, `Object.freeze({`). The freeze ends on its own line (`load.ts:17`, `});`). `playDocsOf` builds `recipes` as `{ ...RECIPES }` and writes unit-id aliases only onto that copy (`tools/play-stage/project.ts:54`). It returns `recipes` with the docs (`project.ts:56`). `board.ts` looks unit sprites up with `recipeIn(body.recipes, u.unitId)` (`tools/play-stage/board.ts:132`); the sprite id is still the starter class id (`starter:hero-sword` and so on). `match.ts` looks talk names and the HUD unit name up the same way (`tools/play-stage/match.ts:95`, `:136`). `recipeOf` still reads the starter map (`load.ts:19`) and `board.ts:21` still re-exports it. The only remaining `RECIPES[…]` is that read in `recipeOf`; nothing writes `RECIPES` (QA:22-25).

**Carry 8: `PlayDocs.recipes` is required.** The field is `readonly recipes: Readonly<Record<string, Recipe>>`, with no `?` (`load.ts:21`). `recipeIn` (`load.ts:18`) takes that map and does not accept `undefined`. A missing id still uses the existing named `fallback(id)` (QA:17, QA:27).

**Carry B: U+2028 and U+2029 in `.json.js`.** `build()`'s walk (`tools/play-stage/build.ts:35`) emits `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}` and does not `JSON.parse` the JSON (QA:26). Plant P2 stays green: there is no `JSON.parse` in `tools/play-stage/*.ts`.

**Tests.** `tests/tools/play-stage-carries.test.ts:9-18` is carry A: snapshot `RECIPES`, two loads, `Object.isFrozen(RECIPES)`, deep-equal to the snapshot, the first load has aliases, the second load's map has none of them, and the second unit resolves as `"Knight"`. `:19-28` is carry B: a temp project name `A\u2028B\u2029C`, the emitted `.json.js` has no raw separators, it does contain the six-character escapes, and importing it returns the original string (V:67). `tests/tools/touch-play.test.ts:8-9` and `:12` switch `idOf` / `wolfTo` to `bundledDocs().recipes` (guide L50, HB:58).

## (d) What went wrong, in order, and the fix

1. **Why 02b was split from step 2.** Step 2 r1 went over the 400-line gate (436 counted). QA's must-fix 1b and the CoS ruling moved carries A and B out of step 2 into this step, because those carries were 59 changed lines of play-stage work on top of a maker step that was already tight (guide L3; `docs/rebuild/step-02.md:90`). Step 2 r2 reverted the five play-stage files and the carry test, and green fell from 1041 to 1039. This run bases on that merge (`34fda674`) and puts the carries back, with carry 8 (`PlayDocs.recipes` required) included (guide L38).

2. **The counted run is 60, not the guide's 59.** The r1 reference work at `477e021e` packed `}); export const recipeIn = …` on one line, and `recipeIn` accepted `map | undefined`. This run ends the `RECIPES` freeze with `});` on `load.ts:17` and puts `recipeIn` on `:18`, with a required map and no `map !== undefined` check, which carry 8 needs. So `load.ts` is 4+/3− (7) instead of the guide's 3+/3− (6). The other four play-stage files are byte-identical to r1 `477e021e` (same git blob ids). The total is **60** (45+/15−), still under the 70-line cap sum and the 400 limit. QA accepted this (QA:17, V:95; guide L45, L53).

3. **No rework.** The first run was **OK TO OPEN PR** (QA:11). Mutation checks on the carry tests failed in the expected direction: unfreezing `RECIPES` or writing aliases into it fails carry A; emitting the raw separators fails carry B (QA:28-33). Merge-tree of `10308bba` and `ad86194f` was clean at tree `b0eed0b8`. Green on that tree was 1041/0, and the smoke printed 14/14 ok with PASS (QA:37, V:127, V:129). PR #80 merged as `fdf29002`. The merge keeps main's docs (the r2 brief and the step-02 rebuild record), not a different brief.

## (e) Do it right first time

- Base on `34fda674`. Floor 1039, land at 1041 (N=2: carry A, carry B). Edit only the five play-stage files, `tests/tools/touch-play.test.ts` and new `tests/tools/play-stage-carries.test.ts`. No maker, template, fixture, kit, package or tsconfig edits, and no second adapter.
- `RECIPES` is `Readonly` and `Object.freeze`d, and is never written after module load. Each load gets its own map from `playDocsOf`. `PlayDocs.recipes` is required. `recipeIn(map, id)` does not accept `undefined`. A missing id still uses the existing named `fallback(id)`.
- Escape U+2028 and U+2029 in `.json.js` at emit time. Do not `JSON.parse` the JSON.
- Line gate: `git diff --shortstat <base>..HEAD -- . ':!handback/**'` is 400 or fewer. The caps sum to 70 and are guidance.
- Commit no raw `test-output.txt`. Put the `ℹ tests/pass/fail/…` summary in HANDBACK.md § Green. The last commit adds only the hand-back. From Step 3 on, the folder must use the full step id, `handback/step-02b-play-stage-carries/r<N>/` (QA:40).
- Run the frozen S0 smoke (`d528795e…`) at 390 and 360. Do not change any unit's sprite id. Do not edit the kit under `handoff/steps/tests/`.
- Push: author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`. The token environment variable must hold the real token, not placeholder text. Never print or commit it.

## (f) Rebuild check

Run on the merge `fdf29002` (tree `b0eed0b8`). `main` at `b3b74070` is this merge plus the QA review doc only. Re-run on 2026-11-19 at the merge tree: `npm run green` exit 0 with 1041 pass / 0 fail; the official shortstat is 7 files, 45 insertions and 15 deletions (60); the smoke printed every ok line at 390 and 360 and `TOUCH SMOKE PASS` (V, QA).

```
git worktree add --detach /tmp/s02b fdf29002 && cd /tmp/s02b
npm ci && npm run green           # exit 0; tests 1041, fail 0
git diff --shortstat 34fda674..HEAD -- . ':!handback/**'
#   7 files changed, 45 insertions(+), 15 deletions(-)
git diff --exit-code 477e021e HEAD -- tools/play-stage/board.ts tools/play-stage/build.ts tools/play-stage/match.ts tools/play-stage/project.ts   # empty
sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797
#   ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
```

Against the merge tree: on your rebuild branch, `git diff fdf29002 HEAD -- tools/play-stage tests/tools/touch-play.test.ts tests/tools/play-stage-carries.test.ts` must be empty. The blob table below lists the exact git blob id each file must have at `fdf29002`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id.

## QA non-blockers carried forward

From QA:40-42. None of these blocked the PR.

1. The HANDBACK is at `handback/step-02b/r1/`, but guide L15 asks for `handback/step-02b-play-stage-carries/r<N>/`. Accepted: it is not product and not in the gate, and the HANDBACK names the full step id, base, code head and tree. From Step 3 on, the folder must use the full step id (QA:40).
2. "PR: opened by Chief Of Staff from the branch": accepted. S1b and step 2 use the same wording (QA:41).
3. Guide L7 still says the step 2 sha is TBD: accepted. The guide wrote it before the merge, and HANDBACK names base `34fda674`, the PR #79 merge, which the branch is built on. It is optional to pin `34fda674` in L7 in a later docs pass (QA:42).

## Blob check

Each file must have exactly this git blob id at `fdf29002`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tests/tools/play-stage-carries.test.ts` | `578fce50b7fcdb3ffc0c22579a1bd1c26f58be0e` | 28 |
| `tests/tools/touch-play.test.ts` | `0f9937c22c84a19aeb6e5719728c587bdd0f97d0` | 79 |
| `tools/play-stage/board.ts` | `8c307b48e46b7ae91c5ba897284e61ff380e2c3c` | 136 |
| `tools/play-stage/build.ts` | `83f477fe570d02b64aa6a261cab26c2e1cfc461c` | 50 |
| `tools/play-stage/load.ts` | `cccece55d87cc6dbbc538a68ddb6bb4d9bce7d92` | 26 |
| `tools/play-stage/match.ts` | `877a198b1f7b6422efc54e2b987b50f75110fb9f` | 173 |
| `tools/play-stage/project.ts` | `7a0d8d4954dd455c758d7eb0ab0320fd688fc089` | 64 |

## Appendix: full code as merged (step 02b, PR #80)
New files are given in full. Edited files are given as the exact diff from `34fda674` to `fdf29002`, then in full as merged. Copy them byte for byte; the blob table checks you did.

### `tests/tools/play-stage-carries.test.ts` (new)
`````ts
import assert from "node:assert/strict"; import { test } from "node:test";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os"; import { join } from "node:path"; import { fileURLToPath, pathToFileURL } from "node:url";
import { readProject } from "../../src/project/load/index.ts";
import { build } from "../../tools/play-stage/build.ts";
import { RECIPES } from "../../tools/play-stage/load.ts";
import { bundledFiles, playDocsOf } from "../../tools/play-stage/project.ts";
const SHA = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", REPO = fileURLToPath(new URL("../../", import.meta.url));
test("carry A: RECIPES stays frozen and each load keeps its own aliases", () => {
  const snap = structuredClone(RECIPES), load = readProject(bundledFiles());
  if (!load.ok || load.readOnly || load.project === null) throw new Error("demo");
  const first = playDocsOf(load.project), id = "unit_01JOTHER000000000000000001", knight = load.project.units["unit_01JDAN00000000000000000001"];
  if (knight === undefined) throw new Error("knight");
  const second = playDocsOf({ ...load.project, units: { [id]: { ...knight, id, name: "Knight" } } }), aliases = Object.keys(first.recipes).filter((key) => !Object.hasOwn(RECIPES, key));
  assert.equal(Object.isFrozen(RECIPES), true); assert.deepEqual(RECIPES, snap); assert.ok(aliases.length > 0);
  for (const key of aliases) assert.equal(Object.hasOwn(second.recipes, key), false);
  assert.equal(second.recipes[id]?.name, "Knight"); assert.equal(Object.hasOwn(RECIPES, aliases[0] ?? ""), false);
});
test("carry B: U+2028 and U+2029 are escaped in .json.js and import back", async () => {
  const root = mkdtempSync(join(tmpdir(), "carry-b-")), out = mkdtempSync(join(tmpdir(), "carry-out-"));
  for (const dir of ["src", "tools", "fixtures"]) cpSync(join(REPO, dir), join(root, dir), { recursive: true });
  const file = join(root, "fixtures/demo.tileproj/project.json"), doc = JSON.parse(readFileSync(file, "utf8")) as { project: { name: string } };
  doc.project.name = "A\u2028B\u2029C"; writeFileSync(file, JSON.stringify(doc)); build(out, SHA, root);
  const emitted = readFileSync(join(out, "fixtures/demo.tileproj/project.json.js"), "utf8");
  assert.equal(emitted.includes("\u2028") || emitted.includes("\u2029"), false); assert.match(emitted, /\\u2028/); assert.match(emitted, /\\u2029/);
  const mod = await import(pathToFileURL(join(out, "fixtures/demo.tileproj/project.json.js")).href) as { default: { project: { name: string } } };
  assert.equal(mod.default.project.name, "A\u2028B\u2029C"); rmSync(root, { recursive: true }); rmSync(out, { recursive: true });
});
`````

### `tests/tools/touch-play.test.ts` (edited)
Diff `34fda674..fdf29002`:

`````diff
diff --git a/tests/tools/touch-play.test.ts b/tests/tools/touch-play.test.ts
index 556458c..0f9937c 100644
--- a/tests/tools/touch-play.test.ts
+++ b/tests/tools/touch-play.test.ts
@@ -1,14 +1,15 @@
 import assert from "node:assert/strict";
 import { test } from "node:test";
 import { fitView } from "../../src/runtime/render/index.ts";
-import { recipeOf, TILE } from "../../tools/play-stage/board.ts";
+import { TILE } from "../../tools/play-stage/board.ts"; import { bundledDocs } from "../../tools/play-stage/project.ts";
 import { createCam } from "../../tools/play-stage/camera-touch.ts";
 import { createMatch } from "../../tools/play-stage/match.ts";
 import { createTouch, type TouchEv } from "../../tools/play-stage/touch.ts";
-const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => { const id = m.world.units.all().find((u) => u.alive && recipeOf(u.unitId).name.toLowerCase() === unitId)?.id; if (id === undefined) throw new Error(unitId); return id; };
+const named = bundledDocs().recipes;
+const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => { const id = m.world.units.all().find((u) => u.alive && named[u.unitId]?.name.toLowerCase() === unitId)?.id; if (id === undefined) throw new Error(unitId); return id; };
 const hpOf = (m: ReturnType<typeof createMatch>, id: string): number => m.world.rules?.state().units.find((u) => u.id === id)?.hp ?? 0;
 const logs = (m: ReturnType<typeof createMatch>): number => m.world.log.entries().filter((e) => e.action.kind === "ability").length;
-const wolfTo = (m: ReturnType<typeof createMatch>, c: number, r: number): string => { const w = m.world.units.all().find((u) => u.alive && recipeOf(u.unitId).name.toLowerCase() === "wolf"); if (w === undefined) throw new Error("wolf"); if (!m.world.units.moveTo(w.id, { c, r }, "move").ok) throw new Error("wolf move"); return w.id; };
+const wolfTo = (m: ReturnType<typeof createMatch>, c: number, r: number): string => { const w = m.world.units.all().find((u) => u.alive && named[u.unitId]?.name.toLowerCase() === "wolf"); if (w === undefined) throw new Error("wolf"); if (!m.world.units.moveTo(w.id, { c, r }, "move").ok) throw new Error("wolf move"); return w.id; };
 function rig(moveMs = 40) {
   const m = createMatch(undefined, moveMs), cam = createCam(12), box = () => ({ devW: 1170, devH: 1992, kx: 3, ky: 3, cols: m.world.grid.cols, rows: m.world.grid.rows }), touch = createTouch({ match: m, cam, box });
   let t = 1000, n = 1;
`````

Full file at `fdf29002`:

`````ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { fitView } from "../../src/runtime/render/index.ts";
import { TILE } from "../../tools/play-stage/board.ts"; import { bundledDocs } from "../../tools/play-stage/project.ts";
import { createCam } from "../../tools/play-stage/camera-touch.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { createTouch, type TouchEv } from "../../tools/play-stage/touch.ts";
const named = bundledDocs().recipes;
const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => { const id = m.world.units.all().find((u) => u.alive && named[u.unitId]?.name.toLowerCase() === unitId)?.id; if (id === undefined) throw new Error(unitId); return id; };
const hpOf = (m: ReturnType<typeof createMatch>, id: string): number => m.world.rules?.state().units.find((u) => u.id === id)?.hp ?? 0;
const logs = (m: ReturnType<typeof createMatch>): number => m.world.log.entries().filter((e) => e.action.kind === "ability").length;
const wolfTo = (m: ReturnType<typeof createMatch>, c: number, r: number): string => { const w = m.world.units.all().find((u) => u.alive && named[u.unitId]?.name.toLowerCase() === "wolf"); if (w === undefined) throw new Error("wolf"); if (!m.world.units.moveTo(w.id, { c, r }, "move").ok) throw new Error("wolf move"); return w.id; };
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
Diff `34fda674..fdf29002`:

`````diff
diff --git a/tools/play-stage/board.ts b/tools/play-stage/board.ts
index c2ceed6..8c307b4 100644
--- a/tools/play-stage/board.ts
+++ b/tools/play-stage/board.ts
@@ -13,7 +13,7 @@ import type { DoorIntent } from "../../src/sim/types.ts";
 import { createWorld } from "../../src/sim/world.ts";
 import { xGo, type Event } from "../../src/state/index.ts";
 import type { Sq } from "../../src/types/core-types.ts";
-import { RECIPES, TEAM, TILE, docsToInput, recipeOf, type PlayDocs } from "./load.ts";
+import { RECIPES, TEAM, TILE, docsToInput, recipeIn, recipeOf, type PlayDocs } from "./load.ts";
 import { bundledDocs } from "./project.ts";
 import { createPlayFx, fxPx } from "./fx.ts";
 import { dress, dressPx, unitAsset } from "./looks.ts";
@@ -129,7 +129,7 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
       const aimSheet = aimKind === "spell" ? AIM_S : AIM_A, aimOver = world.phases.battle === "targeting" ? aims.map((c) => ({ band: "fxGround" as const, sheet: aimSheet, x: c.c * TILE, y: c.r * TILE })) : [];
       const overlays = selected === null ? aimOver : [...reach.map((c) => ({ band: "fxGround" as const, sheet: REACH, x: c.c * TILE, y: c.r * TILE })), ...preview.map((c) => ({ band: "fxGround" as const, sheet: PATH, x: c.c * TILE, y: c.r * TILE })), ...aimOver];
       const assets: Record<string, SceneAsset> = { ...looks.assets, "play:fx": { sheet: { id: "play:fx", columns: 4, fw: TILE, fh: TILE } } };
-      const units = world.units.all().map((u) => { const id = recipeOf(u.unitId).id; const asset = worn.get(id) ?? unitAsset(id); worn.set(id, asset); assets[id] = asset; return { id: u.id, sprite: id, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
+      const units = world.units.all().map((u) => { const id = recipeIn(body.recipes, u.unitId).id; const asset = worn.get(id) ?? unitAsset(id); worn.set(id, asset); assets[id] = asset; return { id: u.id, sprite: id, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
       return { cols: world.grid.cols, rows: world.grid.rows, tileW: TILE, tileH: TILE, mapSeed: world.seed, assets, layers: looks.layers, units, objects: looks.objects, overlays, effects: fx.ingest(world.log, world.clock.stepMs, world.clock.now()), style: looks.style, waterTiles: looks.waterTiles, seeThroughCanopy: true as const };
     },
   };
`````

Full file at `fdf29002`:

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
import { RECIPES, TEAM, TILE, docsToInput, recipeIn, recipeOf, type PlayDocs } from "./load.ts";
import { bundledDocs } from "./project.ts";
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
  const body = docs ?? bundledDocs(), talk = body.talk ?? {}, chosen = body.chosen ?? [], tiles = body.tiles ?? [];
  const world = createWorld(docsToInput({ ...body, talk, chosen, tiles }).input);
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
      const units = world.units.all().map((u) => { const id = recipeIn(body.recipes, u.unitId).id; const asset = worn.get(id) ?? unitAsset(id); worn.set(id, asset); assets[id] = asset; return { id: u.id, sprite: id, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
      return { cols: world.grid.cols, rows: world.grid.rows, tileW: TILE, tileH: TILE, mapSeed: world.seed, assets, layers: looks.layers, units, objects: looks.objects, overlays, effects: fx.ingest(world.log, world.clock.stepMs, world.clock.now()), style: looks.style, waterTiles: looks.waterTiles, seeThroughCanopy: true as const };
    },
  };
}
`````

### `tools/play-stage/build.ts` (edited)
Diff `34fda674..fdf29002`:

`````diff
diff --git a/tools/play-stage/build.ts b/tools/play-stage/build.ts
index 0c3aaf7..83f477f 100644
--- a/tools/play-stage/build.ts
+++ b/tools/play-stage/build.ts
@@ -32,7 +32,7 @@ export function build(out: string, commit: string, root: string = ROOT, dev = fa
   const bj = join(out, "build.json"), prior = existsSync(out) && readdirSync(out).length > 0, text = prior && existsSync(bj) ? readFileSync(bj, "utf8") : "";
   if (prior && (text === "" || !ours(text) || !onlyBuild(out, text))) throw new Error(text === "" ? `build: ${out} is not empty; give an empty folder` : `build: ${out}/build.json is not one this builder wrote (commit, node, entry, files) or the folder holds other files; give an empty folder`);
   const bag = new Map<string, string>(), seen = new Set<string>();
-  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); if (rel.includes("editor")) throw new Error(`build: ${rel}`); const raw = readFileSync(join(root, rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, dev ? raw : release(raw, rel), walk)); };
+  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); if (rel.includes("editor")) throw new Error(`build: ${rel}`); const raw = readFileSync(join(root, rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, dev ? raw : release(raw, rel), walk)); };
   walk(ENTRY); bag.set("index.html", toHtml(readFileSync(join(root, PAGE), "utf8")));
   const files = Object.fromEntries([...bag].sort(([a], [b]) => (a < b ? -1 : 1))), sums = Object.fromEntries(Object.keys(files).map((k) => [k, sha(files[k] ?? "")]));
   const body = `${JSON.stringify({ commit, node: process.versions.node, entry: "index.html", files: sums }, null, 2)}\n`;
`````

Full file at `fdf29002`:

`````ts
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { stripTypeScriptTypes } from "node:module";
import { dirname, join, relative, resolve } from "node:path";
import { posix } from "node:path";
import { fileURLToPath } from "node:url";
export const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url)));
export const ENTRY = "tools/play-stage/page.ts", PAGE = "tools/play-stage/index.html", SCRIPT = ['src="./page.ts"', 'src="./tools/play-stage/page.js"'] as const;
export const toHtml = (html: string): string => html.replace(SCRIPT[0], SCRIPT[1]).replace("</title>", '</title><link rel="icon" href="data:,">');
export const sha = (text: string): string => createHash("sha256").update(text).digest("hex");
export const strip = (src: string): string => stripTypeScriptTypes(src, { mode: "strip" });
export const ours = (text: string): boolean => { const keys = [...text.matchAll(/\n {2}"([^"\\]+)":/g)].map((m) => m[1] ?? ""); return keys.join() === "commit,node,entry,files" && /\n {2}"commit": "[0-9a-f]{40}",\n/.test(text) && /\n {2}"node": "[^"\\]*",\n/.test(text) && /\n {2}"entry": "index.html",\n/.test(text) && /\n {2}"files": \{/.test(text); };
export const onlyBuild = (out: string, text: string): boolean => { const files = new Set([...text.matchAll(/\n {4}"([^"\\]+)":/g)].map((m) => m[1] ?? "")); return readdirSync(out, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).every((e) => { const name = relative(out, join(e.parentPath, e.name)).replaceAll("\\", "/"); return name === "build.json" || files.has(name); }); };
const RENAME = /(from\s+|import\s+)"(\.[^"]*)"/g;
export function toJs(rel: string, src: string, dep: (rel: string) => void): string {
  const out = strip(src).replace(RENAME, (all, pre: string, spec: string) => { const json = spec.endsWith(".json"), next = json ? `${spec}.js` : spec.replace(/\.ts$/, ".js"), base = posix.normalize(posix.join(posix.dirname(rel), spec)), file = json ? base : base.replace(/\.js$/, ".ts"); dep(json || file.endsWith(".ts") ? file : `${file}.ts`); return `${pre}"${next}"`; }).replace(/\s+with\s*\{\s*type:\s*"json"\s*\}/g, "");
  const bad = /(?:from\s+|import\s+)"([^."][^"]*)"/.exec(out); if (bad !== null) throw new Error(`build: non-relative import ${bad[1] ?? ""} in ${rel}`); return out;
}
export const refuse = (head: string, asked: string | undefined, dirty: string): string | null => dirty !== "" ? "build: the checkout has uncommitted changes; build.json must name a real commit" : asked !== undefined && asked !== head ? `build: ${asked} is not the checked-out commit ${head}; check it out first` : null;
export const DEV_ONLY = "// dev-only";
export function release(src: string, rel = ""): string {
  return src.split("\n").filter((line) => {
    const cut = line.trimEnd(), code = cut.endsWith(DEV_ONLY) ? cut.slice(0, -DEV_ONLY.length).trimEnd() : null;
    if (code !== null) { if (code !== 'import { DEV } from "./dev.ts";' && !/^if \(DEV\)/.test(code)) throw new Error(`release: ${rel} dev-only line must be an if (DEV) statement`); return false; }
    if (/(^|[^A-Za-z0-9_])DEV([^A-Za-z0-9_]|$)/.test(line)) throw new Error(`release: ${rel} DEV is used outside a dev-only line`);
    return true;
  }).join("\n");
}
export function build(out: string, commit: string, root: string = ROOT, dev = false): string {
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error("build: commit must be a full 40-character sha");
  const bj = join(out, "build.json"), prior = existsSync(out) && readdirSync(out).length > 0, text = prior && existsSync(bj) ? readFileSync(bj, "utf8") : "";
  if (prior && (text === "" || !ours(text) || !onlyBuild(out, text))) throw new Error(text === "" ? `build: ${out} is not empty; give an empty folder` : `build: ${out}/build.json is not one this builder wrote (commit, node, entry, files) or the folder holds other files; give an empty folder`);
  const bag = new Map<string, string>(), seen = new Set<string>();
  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); if (rel.includes("editor")) throw new Error(`build: ${rel}`); const raw = readFileSync(join(root, rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029")}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, dev ? raw : release(raw, rel), walk)); };
  walk(ENTRY); bag.set("index.html", toHtml(readFileSync(join(root, PAGE), "utf8")));
  const files = Object.fromEntries([...bag].sort(([a], [b]) => (a < b ? -1 : 1))), sums = Object.fromEntries(Object.keys(files).map((k) => [k, sha(files[k] ?? "")]));
  const body = `${JSON.stringify({ commit, node: process.versions.node, entry: "index.html", files: sums }, null, 2)}\n`;
  if (existsSync(out)) rmSync(out, { recursive: true });
  mkdirSync(out, { recursive: true });
  for (const [name, src] of Object.entries(files)) { const dest = join(out, name); mkdirSync(dirname(dest), { recursive: true }); writeFileSync(dest, src); }
  writeFileSync(bj, body); return body;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = process.argv[2], asked = process.argv[3];
  if (out === undefined) { console.error("usage: node tools/play-stage/build.ts <out folder> [commit, which must be HEAD]"); process.exit(1); }
  const head = String(execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8", cwd: ROOT })).trim(), dirty = String(execFileSync("git", ["status", "--porcelain", "--untracked-files=no"], { encoding: "utf8", cwd: ROOT })), why = refuse(head, asked, dirty);
  if (why !== null) { console.error(why); process.exit(1); }
  build(out, asked ?? head);
}
`````

### `tools/play-stage/load.ts` (edited)
Diff `34fda674..fdf29002`:

`````diff
diff --git a/tools/play-stage/load.ts b/tools/play-stage/load.ts
index 8fe3eaa..cccece5 100644
--- a/tools/play-stage/load.ts
+++ b/tools/play-stage/load.ts
@@ -6,7 +6,7 @@ export const TILE = 16;
 export const TEAM = { player: 0x2f6fad, wolves: 0xb23b32, neutral: 0xc6a15a } as const;
 export type Recipe = { readonly id: string; readonly name: string; readonly team: keyof typeof TEAM };
 const fallback = (id: string): Recipe => ({ id: `starter:unknown-${id}`, name: "Unknown", team: "neutral" });
-export const RECIPES: Record<string, Recipe> = {
+export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
   knight: { id: "starter:hero-sword", name: "Knight", team: "player" },
   archer: { id: "starter:hero-staff", name: "Archer", team: "player" },
   cleric: { id: "starter:hero-cleric", name: "Cleric", team: "player" },
@@ -14,10 +14,11 @@ export const RECIPES: Record<string, Recipe> = {
   merchant: { id: "starter:npc-merchant", name: "Merchant", team: "player" },
   villager: { id: "starter:npc-villager", name: "Villager", team: "neutral" },
   wolf: { id: "starter:enemy-wolf", name: "Wolf", team: "wolves" },
-};
+});
+export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
 export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
 export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
-export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>> };
+export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>> };
 export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
   const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
   if (hostSeed === undefined) throw new Error("play: seed");
`````

Full file at `fdf29002`:

`````ts
import type { BattleSetup } from "../../src/rules/battle/battle.ts";
import type { SimInput } from "../../src/sim/types.ts";
import type { CoreTileType } from "../../src/types/core-types.ts";

export const TILE = 16;
export const TEAM = { player: 0x2f6fad, wolves: 0xb23b32, neutral: 0xc6a15a } as const;
export type Recipe = { readonly id: string; readonly name: string; readonly team: keyof typeof TEAM };
const fallback = (id: string): Recipe => ({ id: `starter:unknown-${id}`, name: "Unknown", team: "neutral" });
export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
  knight: { id: "starter:hero-sword", name: "Knight", team: "player" },
  archer: { id: "starter:hero-staff", name: "Archer", team: "player" },
  cleric: { id: "starter:hero-cleric", name: "Cleric", team: "player" },
  crate: { id: "starter:prop-crate", name: "Crate", team: "neutral" },
  merchant: { id: "starter:npc-merchant", name: "Merchant", team: "player" },
  villager: { id: "starter:npc-villager", name: "Villager", team: "neutral" },
  wolf: { id: "starter:enemy-wolf", name: "Wolf", team: "wolves" },
});
export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>> };
export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
  const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
  if (hostSeed === undefined) throw new Error("play: seed");
  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: { picks: 0, waveUnits: 0 }, hostSeed, engineVersion: "0.0.0", projectHash: "demo" }, talk: docs.talk };
}
`````

### `tools/play-stage/match.ts` (edited)
Diff `34fda674..fdf29002`:

`````diff
diff --git a/tools/play-stage/match.ts b/tools/play-stage/match.ts
index a05b609..877a198 100644
--- a/tools/play-stage/match.ts
+++ b/tools/play-stage/match.ts
@@ -7,7 +7,7 @@ import type { DoorIntent } from "../../src/sim/types.ts";
 import type { Outcome } from "../../src/state/index.ts";
 import type { Sq } from "../../src/types/core-types.ts";
 import { createPlay, spellRef } from "./board.ts";
-import { recipeOf, type PlayDocs } from "./load.ts";
+import { recipeIn, type PlayDocs } from "./load.ts";
 import { bundledDocs } from "./project.ts";
 
 /** Orthogonal reach of the demo line-shot when a row omits reach. Not an engine rule. */
@@ -92,7 +92,7 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
         const target = step.action.target, id = target !== null && target.pipe === "unit" ? target.unitId : undefined, u = id === undefined ? undefined : play.world.units.get(id);
         const key = u === undefined ? "" : `talk-${u.unitId}`;
         const text = key !== "" && Object.hasOwn(lines, key) ? lines[key] ?? "" : "";
-        talk = { name: u === undefined ? "" : names[u.unitId] ?? recipeOf(u.unitId).name, text };
+        talk = { name: u === undefined ? "" : names[u.unitId] ?? recipeIn(body.recipes, u.unitId).name, text };
         play.world.phases = { ...play.world.phases, battle: "actMenu" };
       } else if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "ability") settle();
       return step;
@@ -133,7 +133,7 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
       const btn = (show: boolean, hot: boolean): Btn => ({ show, on: hot });
       const spellOn = on && spellRef(rules, unit.unitId) !== undefined;
       return {
-        turn: side === "player" ? "YOUR TURN" : "ENEMY TURN", side, name: on ? names[unit.unitId] ?? recipeOf(unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
+        turn: side === "player" ? "YOUR TURN" : "ENEMY TURN", side, name: on ? names[unit.unitId] ?? recipeIn(body.recipes, unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
         actions: { basic: btn(menu, basic.length > 0), spell: btn(menu && spellOn, spells.length > 0), talk: btn(on && interact.length > 0, interact.length > 0), wait: btn(phase === "actMenu", phase === "actMenu"), end: btn(true, true) },
       };
     },
`````

Full file at `fdf29002`:

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
import { recipeIn, type PlayDocs } from "./load.ts";
import { bundledDocs } from "./project.ts";

/** Orthogonal reach of the demo line-shot when a row omits reach. Not an engine rule. */
export const DEFAULT_SPELL_REACH = 3;
const SIDES = ["player", "wolves"] as const;
type Side = (typeof SIDES)[number];
type Talk = { readonly name: string; readonly text: string };
type Btn = { readonly show: boolean; readonly on: boolean };

export function createMatch(docs?: PlayDocs, moveMs = 200) {
  const body = docs ?? bundledDocs(), play = createPlay(body, moveMs, false), rules = body.rules, lines = body.talk ?? {}, names = body.names ?? {};
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
        const text = key !== "" && Object.hasOwn(lines, key) ? lines[key] ?? "" : "";
        talk = { name: u === undefined ? "" : names[u.unitId] ?? recipeIn(body.recipes, u.unitId).name, text };
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
        turn: side === "player" ? "YOUR TURN" : "ENEMY TURN", side, name: on ? names[unit.unitId] ?? recipeIn(body.recipes, unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
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

### `tools/play-stage/project.ts` (edited)
Diff `34fda674..fdf29002`:

`````diff
diff --git a/tools/play-stage/project.ts b/tools/play-stage/project.ts
index e7e189e..7a0d8d4 100644
--- a/tools/play-stage/project.ts
+++ b/tools/play-stage/project.ts
@@ -3,7 +3,7 @@ import { installOne } from "../../src/rules/behaviours/registry.ts";
 import { TERRAIN } from "../../src/rules/behaviours/terrain.ts";
 import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
 import type { CoreTileType } from "../../src/types/core-types.ts";
-import { RECIPES, type PlayDocs } from "./load.ts";
+import { RECIPES, type PlayDocs, type Recipe } from "./load.ts";
 import { DEMO_LOOKS } from "./looks.ts";
 import project from "../../fixtures/demo.tileproj/project.json" with { type: "json" }; import slice from "../../fixtures/demo.tileproj/catalogue/slice.json" with { type: "json" }; import mapFile from "../../fixtures/demo.tileproj/maps/map_01JDAM00000000000000000001.json" with { type: "json" }; import stageFile from "../../fixtures/demo.tileproj/stages/stage_01JDAS00000000000000000001.json" with { type: "json" };
 import u1 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000001.json" with { type: "json" }; import u2 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000002.json" with { type: "json" }; import u3 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000003.json" with { type: "json" }; import u4 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000004.json" with { type: "json" };
@@ -51,9 +51,9 @@ export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
     const line = knob(setup, cat, "talk", "line"); talk[key] = typeof line === "string" ? line : "";
   }
   const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
-  for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) RECIPES[id] = hit; }
+  const recipes: Record<string, Recipe> = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
   const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length);
-  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names };
+  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes };
 }
 export function openProject(files: ProjectFiles): { docs: (PlayOut & { readonly looks: typeof DEMO_LOOKS }) | null; error: string } {
   const load = readProject(files), error = load.report.map((r) => [r.code, r.path, r.detail].filter((part) => part !== undefined).join(" ")).join("\n");
`````

Full file at `fdf29002`:

`````ts
import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
import { installOne } from "../../src/rules/behaviours/registry.ts";
import { TERRAIN } from "../../src/rules/behaviours/terrain.ts";
import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
import type { CoreTileType } from "../../src/types/core-types.ts";
import { RECIPES, type PlayDocs, type Recipe } from "./load.ts";
import { DEMO_LOOKS } from "./looks.ts";
import project from "../../fixtures/demo.tileproj/project.json" with { type: "json" }; import slice from "../../fixtures/demo.tileproj/catalogue/slice.json" with { type: "json" }; import mapFile from "../../fixtures/demo.tileproj/maps/map_01JDAM00000000000000000001.json" with { type: "json" }; import stageFile from "../../fixtures/demo.tileproj/stages/stage_01JDAS00000000000000000001.json" with { type: "json" };
import u1 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000001.json" with { type: "json" }; import u2 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000002.json" with { type: "json" }; import u3 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000003.json" with { type: "json" }; import u4 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000004.json" with { type: "json" };
import u5 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000005.json" with { type: "json" }; import u6 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000006.json" with { type: "json" }; import u7 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000007.json" with { type: "json" };
import s1 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json" with { type: "json" }; import s2 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json" with { type: "json" }; import s3 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json" with { type: "json" }; import s4 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json" with { type: "json" }; import s5 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json" with { type: "json" };
type Obj = Record<string, unknown>;
export type PlayOut = PlayDocs & { readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[]; readonly names: Readonly<Record<string, string>>; readonly talk: Readonly<Record<string, string>> };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v), num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined), strs = (v: unknown): readonly string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const must = (v: number | undefined, why: string): number => { if (v === undefined) throw new Error(why); return v; };
function knob(setup: Obj, cat: Obj, behaviour: string, key: string): unknown {
  const answers = setup["answers"], row = isObj(answers) ? answers[key] : undefined;
  if (isObj(row) && row["source"] !== "default" && Object.hasOwn(row, "value")) return row["value"];
  const list = cat["behaviours"]; if (!Array.isArray(list)) return undefined;
  for (const b of list) if (isObj(b) && b["id"] === behaviour && Array.isArray(b["knobs"])) for (const k of b["knobs"]) if (isObj(k) && k["id"] === key) return k["default"];
  return undefined;
}
export const bundledFiles = (): ProjectFiles => ({
  "project.json": project, "catalogue/slice.json": slice, "maps/map_01JDAM00000000000000000001.json": mapFile, "stages/stage_01JDAS00000000000000000001.json": stageFile,
  "units/unit_01JDAN00000000000000000001.json": u1, "units/unit_01JDAN00000000000000000002.json": u2, "units/unit_01JDAN00000000000000000003.json": u3, "units/unit_01JDAN00000000000000000004.json": u4, "units/unit_01JDAN00000000000000000005.json": u5, "units/unit_01JDAN00000000000000000006.json": u6, "units/unit_01JDAN00000000000000000007.json": u7,
  "setups/setup_01JDAT00000000000000000001.json": s1, "setups/setup_01JDAT00000000000000000002.json": s2, "setups/setup_01JDAT00000000000000000003.json": s3, "setups/setup_01JDAT00000000000000000004.json": s4, "setups/setup_01JDAT00000000000000000005.json": s5,
});
/** Adapter only. Document JSON is already read by readProject. */
export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
  const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {};
  const stage = store.stages[stageId ?? strs(root["stages"])[0] ?? ""] ?? Object.values(store.stages)[0]; if (stage === undefined) throw new Error("play: stage");
  const map = store.maps[typeof stage["mapRef"] === "string" ? stage["mapRef"] : ""]; if (map === undefined) throw new Error("play: map");
  const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
  const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
  const stepped = installOne(STEP_PATTERN, {}).out; if (stepped === null) throw new Error("play: step");
  const stats: Record<string, { hp: number; atk: number }> = {}, reach: Record<string, number> = {}, abilities: Record<string, { reach: number; damage: number; effectRef: string }[]> = {}, names: Record<string, string> = {};
  for (const [id, unit] of Object.entries(store.units)) {
    const st = isObj(unit["stats"]) ? unit["stats"] : {}, hpBag = st["unit_hp"], atkBag = st["unit_atk"], row = { hp: num(isObj(hpBag) ? hpBag["value"] : undefined) ?? hp0, atk: num(isObj(atkBag) ? atkBag["value"] : undefined) ?? atk0 };
    stats[id] = row; if (typeof unit["name"] === "string") names[id] = unit["name"];
    for (const sid of strs(unit["setupIds"])) {
      const setup = store.setups[sid]; if (setup === undefined) continue;
      if (setup["behaviourId"] === "basic-attack") { const mode = knob(setup, cat, "basic-attack", "reach_mode"), ns = num(knob(setup, cat, "basic-attack", "custom_ns")), ew = num(knob(setup, cat, "basic-attack", "custom_ew")), got = mode === "one-tile-straight" ? 1 : mode === "custom-cross" ? Math.min(must(ns, "play: reach"), must(ew, "play: reach")) : mode === "same-as-step" ? stepped.reach : undefined; if (got !== undefined) reach[id] = got; }
      if (setup["behaviourId"] === "line-shot") abilities[id] = [...(abilities[id] ?? []), { reach: must(num(knob(setup, cat, "line-shot", "range")), "play: line-shot"), damage: must(num(knob(setup, cat, "line-shot", "damage")), "play: line-shot"), effectRef: "line-shot" }];
    }
  }
  const gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(root["loadout"]) ? root["loadout"] : {}, chosen: string[] = [];
  for (const id of [...strs(gear["required"]), ...strs(gear["roster"])]) if (!chosen.includes(id)) chosen.push(id);
  const talk: Record<string, string> = {};
  for (const n of Array.isArray(stage["neutrals"]) ? stage["neutrals"] : []) if (isObj(n) && typeof n["unitId"] === "string") for (const sid of strs(n["setupIds"])) {
    const setup = store.setups[sid], key = `talk-${n["unitId"]}`; if (setup === undefined || setup["behaviourId"] !== "talk" || Object.hasOwn(talk, key)) continue;
    const line = knob(setup, cat, "talk", "line"); talk[key] = typeof line === "string" ? line : "";
  }
  const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
  const recipes: Record<string, Recipe> = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length);
  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes };
}
export function openProject(files: ProjectFiles): { docs: (PlayOut & { readonly looks: typeof DEMO_LOOKS }) | null; error: string } {
  const load = readProject(files), error = load.report.map((r) => [r.code, r.path, r.detail].filter((part) => part !== undefined).join(" ")).join("\n");
  if (!load.ok || load.readOnly || load.project === null) return { docs: null, error };
  return { docs: { ...playDocsOf(load.project), looks: DEMO_LOOKS }, error };
}
export const openBundled = (): ReturnType<typeof openProject> => openProject(bundledFiles());
export const bundledDocs = (): NonNullable<ReturnType<typeof openBundled>["docs"]> => { const got = openBundled(); if (got.docs === null) throw new Error(got.error === "" ? "play: project" : got.error); return got.docs; };
`````
