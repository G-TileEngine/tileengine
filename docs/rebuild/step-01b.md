# Rebuild record: step 1b, the play stage loads the project (S1b)

Original brief: [`docs/maker/steps/step-01-project-format.md`](../maker/steps/step-01-project-format.md), section "1b", and `docs/maker/data/s1-project-load.md` §9 (h). The builder read the brief on base `aa158fda` (sha256 `0e7d7618478cb0a111960d890318ab79168c92980af837cedbab87102cfd2be1`). Do `step-01a.md` first; this step starts on its merge.

Sources: PR #78 and branch `step/step-s1b-play-stage-switch-r1-chatA` (tip `ef29b514`); `handback/s1b-play-stage-switch/r1/HANDBACK.md` (HB); `docs/qa/step-s1b-handback-review.md` (QA); Chief Of Staff verify report `/workspace/share/s1b-verify/report.md` (V); smoke follow-up `/workspace/share/s1b-smoke/report.md` (SM); refreeze commit `9fc49890`. Line numbers are at the commit named.

## (a) Start and finish

| | Value |
|---|---|
| Base | `aa158fda573aac196965139700e4e9b5fd1bebd5` (1a merge, PR #77), **1034** tests |
| Commits | `8095ce71` feat (tree `5f94c423`), `ef29b514` hand-back (tree `add589d3`) (V:15-24) |
| QA verdict | **NOT OK**, one must-fix: the S0 touch smoke failed (QA:5-7). Cleared by the smoke follow-up, not by a branch rework |
| Merge | PR #78 "S1b: play stage loads the project (demo.tileproj via readProject/playDocsOf)", merge commit `57af7135f6d2d636f0bf81a5de2a348931305022`, 2026-11-18 23:48 (UK time). First parent `433fa3d` (QA review on main), second parent `ef29b514` |
| Smoke refreeze | `9fc498903ac615e75014f597e54af49fab547e27` on `57af7135`, 2026-11-18 23:55 (UK time): `handoff/steps/tests/s0-play-input/touch-smoke.mjs` 3 lines changed, sha256 `a4a607b2…` → `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` |
| Tests | 1034 + N=2 (parity golden, rejected project) = **1036 pass / 0 fail** (HB:7, V:69-74) |
| Size | `git diff --shortstat aa158fda..ef29b514 -- . ':!fixtures/**' ':!data/templates/**'` = 18 files, 229 + 75 = **304** ≤ 400; code commit alone 274 (V:76-81) |

## (b) Files

| File | Change | Purpose |
|---|---|---|
| `tools/play-stage/project.ts` | new, 64 lines (cap 65) | Statically imports the 16 fixture files; `bundledFiles`, `playDocsOf` (store → play docs adapter), `openProject`, `openBundled`, `bundledDocs` |
| `tools/play-stage/load.ts` | edit | Deletes `DEMO_LOAD`/`DEMO_MANIFEST`/`DEMO_MAP`/`DEMO_STAGE`/`DEMO_SETUP`/`DEMO_TALK`/`DEMO_SEED` and the hard-coded `TILES`; `docsToInput` takes `chosen` and `tiles` and reads the seed from the stage |
| `tools/play-stage/board.ts` | edit | `createPlay` defaults to `bundledDocs()` instead of `DEMO_LOAD` |
| `tools/play-stage/match.ts` | edit | `createMatch` defaults to `bundledDocs()`; deletes the villager `talk-villager` fallback; names come from `body.names` |
| `tools/play-stage/looks.ts` | edit | `DEMO_LOOKS` moves here as the one view-only constant; tile `rock` → `wall-block` |
| `tools/play-stage/build.ts` | edit | Follows `.json` imports, writes `<file>.json.js` as `export default ` + raw text, strips `with { type: "json" }`; `ours`/`onlyBuild` read `build.json` by regex, no `JSON.parse`, no `catch`; refuses any path containing `editor` |
| `tools/play-stage/page.ts` | edit | Boots with `openBundled()`; on failure shows the report text and starts no match |
| `tsconfig.json` | edit | `resolveJsonModule: true` |
| `tests/tools/demo-fixture.ts` | new, 17 lines | `U` (role → fixture ULID), `loadFixture()` walks the folder, `demoDocs()` = `readProject` + `playDocsOf` |
| `tests/tools/play-stage-parity.test.ts` | new, 32 lines | (a) seed 24301 bot v bot equals the 1a golden; a rejected project shows the error and doesn't fall back |
| `tests/project/load/one-parser.test.ts` | edit | P2 allowlist emptied; regex tightened |
| `tests/tools/play-stage.test.ts` | edit | Fixture ULIDs; seven units' hp/atk, `chosen` knight+archer, water and wall-block blocked, `.json.js` emit asserts |
| `tests/tools/play-stage-looks.test.ts`, `-p17`, `-p18`, `-p19` | edit | Fixture ULIDs and `DEMO_LOOKS` from `looks.ts`; p19 seed from the stage |
| `tests/tools/touch-play.test.ts` | edit | S0 tests look units up by `recipeOf(unitId).name` |
| `handback/s1b-play-stage-switch/r1/HANDBACK.md` | new | Hand-back |
| `handoff/steps/tests/s0-play-input/touch-smoke.mjs` | edit in `9fc49890` (after the merge) | Four lookups by scene sprite id instead of `unitId` |

## (c) Key code and git commands

Full code for every file is in the appendix, taken from `57af7135` (and `9fc49890` for the smoke).

```
git log --oneline aa158fda..ef29b514
git diff --stat aa158fda..57af7135
git diff aa158fda..57af7135 -- tools/play-stage tests tsconfig.json
git show 9fc49890                      # the smoke refreeze
git show 57af7135:tools/play-stage/project.ts
```

**Open a project** (`tools/play-stage/project.ts:58-64` at `57af7135`). A failed or read-only load returns `docs: null` plus the report text. There's no fallback to the demo.

```ts
export function openProject(files: ProjectFiles): { docs: (PlayOut & { readonly looks: typeof DEMO_LOOKS }) | null; error: string } {
  const load = readProject(files), error = load.report.map((r) => [r.code, r.path, r.detail].filter((part) => part !== undefined).join(" ")).join("\n");
  if (!load.ok || load.readOnly || load.project === null) return { docs: null, error };
  return { docs: { ...playDocsOf(load.project), looks: DEMO_LOOKS }, error };
}
export const openBundled = (): ReturnType<typeof openProject> => openProject(bundledFiles());
export const bundledDocs = (): NonNullable<ReturnType<typeof openBundled>["docs"]> => { const got = openBundled(); if (got.docs === null) throw new Error(got.error === "" ? "play: project" : got.error); return got.docs; };
```

**`playDocsOf(store, stageId?)`** (`project.ts:29-57`) is an adapter only; documents are already read. It picks the stage and map, takes the army `unit_hp`/`unit_atk` from the `unit-roster` setup (throws if missing), per-unit stats with the army as default, reach from `basic-attack`, abilities from `line-shot` (throws if a number is missing), `chosen` from the loadout, talk lines from the neutrals' `talk` setups, and tiles from the `TERRAIN` behaviour. Line 54 aliases each fixture unit id onto the starter recipe with the same name: `RECIPES[id] = hit` (see (d) 4).

**`docsToInput`** (`tools/play-stage/load.ts` at `57af7135`): seed comes from `docs.hostSeed`, else `stage.seed`, else it throws `play: seed`. It never invents 24301.

**Build emit** (`tools/play-stage/build.ts:16`, `:35`): a `.json` import is rewritten to `<spec>.js` and the attribute stripped; the walk writes `bag.set(\`${rel}.js\`, \`export default ${raw}\`)`. There's no parse and no shape read.

**P2 at the merge** (`tests/project/load/one-parser.test.ts:5-6`):

```ts
const RE = /JSON\.parse|formatVersion|(?<!action\??\.)kind === (?!"(?:spell|talk)")/;
const ALLOW: readonly string[] = [];
```

**Page boot** (`page.ts`): `const opened = openBundled(); if (opened.docs === null) document.body.textContent = opened.error; else { const match = createMatch(opened.docs); … }`.

## (d) What went wrong, in order, and the fix

1. **Stale line numbers in the brief** (V:112, :159; brief at `aa158fda` lines 75 and 148). The brief said the villager fallback was at `match.ts:84` and the `docsToInput` seam at `load.ts:36-38`. `:84` was the pre-S0 line (`1b834c31:tools/play-stage/match.ts:84`); on the base it's `:93`. Fix: find code by content, not line number. The current brief says line numbers are hints only (line 92).
2. **Villager fallback deleted** (V:110-116, QA:32). Base `match.ts:93`: `Object.hasOwn(lines, "talk-villager") ? lines["talk-villager"] ?? "" : ""`. After: talk text is only `lines["talk-" + unitId]`, else `""` (`match.ts:93-94` at `57af7135`).
3. **The `kind ===` scan would trip on game code** (QA s1a carry; V:140-146). An empty allowlist with the 1a regex fails on `action.kind ===` in `match.ts`/`board.ts` and on `choose(kind)` checking `"spell"`/`"talk"`. Fix: the lookbehind `(?<!action\??\.)` and the exception `(?!"(?:spell|talk)")`. Document-kind checks like `kind === "map"` or `doc.kind === "stage"` still fail (QA:29). Known gap, not a must-fix: a bare `kind === "spell"` passes (V:158).
4. **`RECIPES` aliasing** (QA:33, flag). `playDocsOf` writes fixture ULIDs into the module-level `RECIPES` map so `recipeOf(ulid)` still finds the starter row. It leaks between tests in one process, and a second project with a unit named "Knight" would silently alias onto the starter. Accepted for 1b (demo only). **QA carry into step 2:** a per-load recipe map, with `RECIPES` frozen.
5. **U+2028/U+2029 in the `.json.js` emit** (QA:30). Raw `export default <json>` is fine in current Node and Chrome (ES2019), but an un-updated WebView at minSdk 26 might reject those two characters. No fixture contains them today. **QA carry into step 2:** escape or reject them in `.json.js`. Separately, loading `.json.js` in the real WebView is a CEO phone-test item; headless Chrome passed (QA:30, "BROWSER LOAD PASS").
6. **QA must-fix: the S0 touch smoke failed on 1b** (QA:9-17). Unit ids became fixture ULIDs (`unit_01JDAN00000000000000000001` for the knight), but the frozen smoke did `window.__play.world.units.all().find((u) => u.unitId === "knight").id` at `touch-smoke.mjs:32` → `TypeError … reading 'id'`, exit 1, no ok lines. The S0 unit tests had been updated; the smoke couldn't be, because 1b must not edit `handoff/steps/tests/`. The HANDBACK didn't mention the smoke (QA:35).
7. **Fix: refreeze the smoke on sprite id** (SM:5-32, commit `9fc49890`). World units have no class field, but `scene().units[].sprite` is `recipeOf(u.unitId).id`, the starter class id, the same on both trees. The four lookups changed:

   | Role | sprite | old `unitId` | 1b `unitId` |
   |---|---|---|---|
   | knight | `starter:hero-sword` | `knight` | `unit_01JDAN…0001` |
   | archer | `starter:hero-staff` | `archer` | `unit_01JDAN…0002` |
   | wolf | `starter:enemy-wolf` | `wolf` | `unit_01JDAN…0004` |
   | villager | `starter:npc-villager` | `villager` | `unit_01JDAN…0005` |

   The new smoke passed 7/7 at 390 and 360 on both the 1b tip and the pre-1b main `67615ad4` (SM:82-85). QA's rule: renaming a starter sprite must update the smoke in the same push. The CEO typed SEND and it was pushed as `9fc49890`.
8. **Plan overruns, recorded not rejected** (HB:21-22, QA:26). The load/board/match/looks/build/tsconfig group was 59 changed lines against a planned 45; the five play-stage test edits 83 against 45. Only the 400 total is a gate.
9. **Review helper didn't finish** (HB:29). The builder did the checks itself and said so.
10. **Cosmetic, left open** (V:160): looks test titles still say "rock" though the tile is `wall-block`.

## (e) Do it right first time

- Base on `aa158fda`, floor 1034, land at 1036 (N=2).
- The play stage reads the demo only through `readProject` → `playDocsOf`. No `DEMO_*` constant left except `DEMO_LOOKS` in `looks.ts`.
- `createMatch()` and `createPlay()` with no docs must still work (`docs ?? bundledDocs()`), so S0's tests keep passing.
- A rejected project shows the report text and starts no match. It never falls back to the bundled demo.
- `docsToInput` throws without a seed; it never invents 24301.
- `build.ts` emits `export default ` + raw JSON text. No `JSON.parse`, no `catch { return false; }`, no import attributes in the output. Refuse any path containing `editor`.
- P2: `ALLOW` is `[]` and the regex is exactly the one in (c).
- **Before handing back, run the S0 touch smoke unchanged and paste the result.** Any play-stage change keeps that gate. If you change unit ids, the smoke must still find units, by scene sprite id.
- Delete the villager fallback by finding its text, not its line number.
- Step 2 carries: a per-load recipe map (don't mutate `RECIPES`), and escape or reject U+2028/U+2029 in `.json.js`, each with a test.

## (f) Rebuild check

Run on the merge plus the smoke refreeze (or on `main`, which today is `772f7aa2`: docs-only commits on top of `9fc49890`). Re-run on 2026-11-19 at `772f7aa2`: `npm run green` exit 0 with 1036 pass / 0 fail, and the smoke printed every ok line at 390 and 360 and `TOUCH SMOKE PASS`.

```
git worktree add --detach /tmp/s1b 9fc49890 && cd /tmp/s1b
npm ci && npm run green           # exit 0; tests 1036, fail 0
node --test tests/tools/play-stage-parity.test.ts   # 2 pass: parity golden + rejected project
sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs   # d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797
#   ok 1-7 @390, ok 1-7 @360, then TOUCH SMOKE PASS
rg -n 'DEMO_' tools/play-stage     # only DEMO_LOOKS (looks.ts, and its uses in project.ts)
```

Parity golden (`tests/tools/golden/demo-parity.json`, unchanged since 1a): outcome `win`, snapshot `dc959c318ea82b78e37e6cfbefcc2904be17b9640ea95982d9a92d8968b75177`, log `3278b95a57fe08751cec91ecc220ed99d8ef75053148c52a5a7358e7f33a650b`, bus `30f1d9006882e8ba9edc55d2a47cdb0dc8dbd6202dd5cfab2ba236862f90fd80`.

Against the merge tree: `git diff 57af7135 HEAD -- tools tests tsconfig.json` must be empty (and `git diff 9fc49890 HEAD -- handoff/steps/tests` after the refreeze). The blob table below lists the exact git blob id each file must have.

## Blob check

Each file must have exactly this git blob id at `57af7135`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tests/project/load/one-parser.test.ts` | `bdf6dfbe62d6dded9202f8feb0e8e04d8ecf1d7a` | 15 |
| `tests/tools/demo-fixture.ts` | `e253ed01277e469dee915fbe7dbf416f01732b48` | 17 |
| `tests/tools/play-stage-looks.test.ts` | `7bdaca16b648b4fe4156315d25de1a11fa725f68` | 81 |
| `tests/tools/play-stage-p17.test.ts` | `8c29277543d28c5c1a29b609c9201a4e1cd202f1` | 86 |
| `tests/tools/play-stage-p18.test.ts` | `b935c07671c54688f706beb9fe704ed3163e390c` | 85 |
| `tests/tools/play-stage-p19.test.ts` | `73540d98493a188b6fb73fa86a2240c3347783cc` | 58 |
| `tests/tools/play-stage-parity.test.ts` | `df245091b3c5aec6f62ab873ed07799ca7f269d4` | 32 |
| `tests/tools/play-stage.test.ts` | `2d71147839454db7e73831bae47b620018cf1817` | 121 |
| `tests/tools/touch-play.test.ts` | `556458cce51aadb6b17b8f7f3b80d9775e501ca8` | 78 |
| `tools/play-stage/board.ts` | `c2ceed617864e5f83055a0b993a039732fa593bd` | 136 |
| `tools/play-stage/build.ts` | `0c3aaf7ac4aba2d607199c419747a75d3a06e8ef` | 50 |
| `tools/play-stage/load.ts` | `8fe3eaaca665070069efda3aed1645e8fe17f976` | 25 |
| `tools/play-stage/looks.ts` | `6e2b6cc54634eab17bd4a1edab82c95179aa0643` | 61 |
| `tools/play-stage/match.ts` | `a05b60955a78ff5001b4a6f8a0c04967c54f1d9b` | 173 |
| `tools/play-stage/page.ts` | `426456c47cba7ea04fb6736e562fbe0171628d47` | 59 |
| `tools/play-stage/project.ts` | `e7e189e0751dddae6dfc1cfc3c7916b0081679cd` | 64 |
| `tsconfig.json` | `2e13322b035f47d2581995ddf257d01758190b20` | 24 |
| `handoff/steps/tests/s0-play-input/touch-smoke.mjs` (at `9fc49890`) | `1f50845ab70d1b9067698a3c9ca33ccfb03c6f1b` | 107 |

## Appendix: full code as merged (S1b, PR #78)
New files are given in full. Edited files are given as the exact diff from `aa158fda` to `57af7135`, then in full as merged. Copy them byte for byte; the blob table checks you did.

### `tests/project/load/one-parser.test.ts` (edited)
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tests/project/load/one-parser.test.ts b/tests/project/load/one-parser.test.ts
index a907b66..bdf6dfb 100644
--- a/tests/project/load/one-parser.test.ts
+++ b/tests/project/load/one-parser.test.ts
@@ -2,8 +2,8 @@ import assert from "node:assert/strict";
 import { readdirSync, readFileSync } from "node:fs";
 import { join } from "node:path";
 import { test } from "node:test";
-const RE = /JSON\.parse|formatVersion|kind ===/;
-const PLAY = new Set(["board.ts\t    if (stepped.action?.kind === \"move\" && stepped.path !== undefined && selected !== null) {","build.ts\texport const ours = (text: string): boolean => { try { const v = JSON.parse(text) as Record<string, unknown>; return Object.keys(v).join() === \"commit,node,entry,files\" && typeof v[\"commit\"] === \"string\" && /^[0-9a-f]{40}$/.test(v[\"commit\"]) && typeof v[\"node\"] === \"string\" && v[\"entry\"] === \"index.html\" && typeof v[\"files\"] === \"object\" && v[\"files\"] !== null && !Array.isArray(v[\"files\"]); } catch { return false; } };","build.ts\texport const onlyBuild = (out: string, text: string): boolean => { const files = (JSON.parse(text) as { files: Record<string, unknown> }).files; return readdirSync(out, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).every((e) => { const name = relative(out, join(e.parentPath, e.name)).replaceAll(\"\\\\\", \"/\"); return name === \"build.json\" || Object.hasOwn(files, name); }); };","load.ts\texport const DEMO_MANIFEST = { kind: \"tile-project\", formatVersion: 6, project: { id: \"demo\", rev: 1, catalogueRev: 1, settings: { wrapEdges: false }, stages: [\"stage-demo\"], rules: [] as string[], loadout: { roster: [\"knight\", \"archer\", \"cleric\"], size: 3, required: [\"knight\"] } } };","load.ts\texport const DEMO_MAP = { kind: \"map\", formatVersion: 5, id: \"map-6x9\", rev: 1, cols: 6, rows: 9, logic: { terrain: \"000000000000020000100000110000100000000022000000000000\".split(\"\").map(Number), palette: { \"0\": \"floor\", \"1\": \"water\", \"2\": \"rock\" }, edges: [] as const } };","load.ts\t  kind: \"stage\", formatVersion: 2, id: \"stage-demo\", rev: 1, mapRef: \"map-6x9\", seed: DEMO_SEED, setupIds: [\"talk-villager\"],","match.ts\t      if (action.kind === \"move\" && landMove(action)) return;","match.ts\t      if (typeof step === \"object\" && step !== null && \"action\" in step && step.action?.kind === \"interact\") {","match.ts\t      } else if (typeof step === \"object\" && step !== null && \"action\" in step && step.action?.kind === \"ability\") settle();","match.ts\t      const list = kind === \"spell\" ? spellList(id) : targetsFor(play.world.grid, play.world.units, id, kind === \"talk\" ? \"interact\" : \"basic\", rules);","match.ts\t      const step = baseIntend({ type: \"ChooseAction\", actionId: kind === \"talk\" ? \"interact\" : kind, unitId: id });","match.ts\t      play.aims = cells(list); play.aimKind = kind === \"spell\" ? \"spell\" : \"basic\"; return null;"]);
+const RE = /JSON\.parse|formatVersion|(?<!action\??\.)kind === (?!"(?:spell|talk)")/;
+const ALLOW: readonly string[] = [];
 function hits(dir: string, skip: (name: string) => boolean): string[] {
   const out: string[] = [];
   for (const name of readdirSync(dir)) if (name.endsWith(".ts") && !skip(name)) for (const line of readFileSync(join(dir, name), "utf8").split("\n")) if (RE.test(line)) out.push(name + "\t" + line);
@@ -11,5 +11,5 @@ function hits(dir: string, skip: (name: string) => boolean): string[] {
 }
 test("P2: load has one parser, and play-stage grows no JSON.parse, formatVersion or kind ===", () => {
   assert.deepEqual(hits("src/project/load", (name) => name === "migrate.ts"), []);
-  assert.deepEqual(hits("tools/play-stage", () => false).filter((hit) => !PLAY.has(hit)), []);
+  assert.deepEqual(hits("tools/play-stage", () => false).filter((hit) => !ALLOW.includes(hit)), []);
 });
`````

Full file at `57af7135`:

`````ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
const RE = /JSON\.parse|formatVersion|(?<!action\??\.)kind === (?!"(?:spell|talk)")/;
const ALLOW: readonly string[] = [];
function hits(dir: string, skip: (name: string) => boolean): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) if (name.endsWith(".ts") && !skip(name)) for (const line of readFileSync(join(dir, name), "utf8").split("\n")) if (RE.test(line)) out.push(name + "\t" + line);
  return out;
}
test("P2: load has one parser, and play-stage grows no JSON.parse, formatVersion or kind ===", () => {
  assert.deepEqual(hits("src/project/load", (name) => name === "migrate.ts"), []);
  assert.deepEqual(hits("tools/play-stage", () => false).filter((hit) => !ALLOW.includes(hit)), []);
});
`````

### `tests/tools/demo-fixture.ts` (new)

`````ts
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { readProject, type ProjectFiles } from "../../src/project/load/index.ts";
import { playDocsOf } from "../../tools/play-stage/project.ts";
import { DEMO_LOOKS } from "../../tools/play-stage/looks.ts";
export const U = { knight: "unit_01JDAN00000000000000000001", archer: "unit_01JDAN00000000000000000002", cleric: "unit_01JDAN00000000000000000003", wolf: "unit_01JDAN00000000000000000004", villager: "unit_01JDAN00000000000000000005", crate: "unit_01JDAN00000000000000000006", merchant: "unit_01JDAN00000000000000000007" } as const;
const ROOT = fileURLToPath(new URL("../../fixtures/demo.tileproj/", import.meta.url));
export function loadFixture(): ProjectFiles {
  const files: Record<string, unknown> = {}, walk = (at: string, rel: string): void => { for (const name of readdirSync(at)) { const p = join(at, name), next = rel === "" ? name : `${rel}/${name}`; if (statSync(p).isDirectory()) walk(p, next); else files[next] = JSON.parse(readFileSync(p, "utf8")) as unknown; } };
  walk(ROOT, ""); return files;
}
export function demoDocs() {
  const load = readProject(loadFixture());
  if (!load.ok || load.readOnly || load.project === null) throw new Error(load.report.map((r) => `${r.code} ${r.path}`).join("\n"));
  return { ...playDocsOf(load.project), looks: DEMO_LOOKS };
}
`````

### `tests/tools/play-stage-looks.test.ts` (edited)
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tests/tools/play-stage-looks.test.ts b/tests/tools/play-stage-looks.test.ts
index 09d8417..7bdaca1 100644
--- a/tests/tools/play-stage-looks.test.ts
+++ b/tests/tools/play-stage-looks.test.ts
@@ -5,6 +5,7 @@ import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
 import { TILE } from "../../tools/play-stage/board.ts";
 import { animId, litPlan, picturesOf, sourceOf } from "../../tools/play-stage/looks.ts";
 import { createMatch } from "../../tools/play-stage/match.ts";
+import { U } from "./demo-fixture.ts";
 
 type Match = ReturnType<typeof createMatch>;
 
@@ -14,7 +15,7 @@ const fit = fitView(390 * 3, 600 * 3, 9, TILE, TILE), cam = snapCamera(0, 0, fit
 /** Every picture the page's draw list names (chunks and plain fills aside) must load through the page's lookup. */
 const unloaded = (rs: RenderScene, pixels: ReturnType<typeof hook>["pixels"], t: number): string[] => chunkedList(rs, fit, cam, t, 10).cmds.map((c) => c.sheet).filter((id) => id !== "" && !id.startsWith("chunk:") && pixels(id) === undefined);
 function cast(kind: "basic" | "spell"): { m: Match; t0: number } {
-  const m = createMatch(undefined, 40), me = unitOf(m, kind === "basic" ? "knight" : "archer"), wolf = unitOf(m, "wolf");
+  const m = createMatch(undefined, 40), me = unitOf(m, kind === "basic" ? U.knight : U.archer), wolf = unitOf(m, U.wolf);
   m.world.units.moveTo(me.id, { c: wolf.at.c, r: wolf.at.r + (kind === "basic" ? 1 : 2) }, "move");
   m.intend({ type: "SelectUnit", unitId: me.id }); assert.equal(m.choose(kind), null);
   const at = m.aims[0] ?? wolf.at; m.intend({ type: "TargetCell", at }); m.intend({ type: "TargetCell", at }); m.sync();
@@ -37,7 +38,7 @@ test("canopy sways above units and turns see-through over a unit; braziers flick
   const m = createMatch(), { link } = hook(m), before = link.scene(m.scene()), canopy = before.above[0];
   assert.ok(canopy !== undefined && canopy.tiles.filter((t) => t !== null).length === 3 && canopy.motion?.[0] !== undefined);
   const braziers = before.standing.filter((s) => s.kind === "object"); assert.equal(braziers.length, 2); assert.ok(braziers.every((s) => s.motion !== undefined));
-  m.world.units.moveTo(unitOf(m, "wolf").id, { c: 5, r: 2 }, "move");
+  m.world.units.moveTo(unitOf(m, U.wolf).id, { c: 5, r: 2 }, "move");
   const after = link.scene(m.scene()).above[0]; assert.ok(after !== undefined);
   assert.equal(after.tiles[2 * 6 + 5], null); assert.equal(after.tiles[1 * 6 + 5], null); assert.equal(after.tiles[1 * 6 + 4], 0);
 });
`````

Full file at `57af7135`:

`````ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { chunkedList, createLighting, fitView, snapCamera, type RenderScene } from "../../src/runtime/render/index.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { TILE } from "../../tools/play-stage/board.ts";
import { animId, litPlan, picturesOf, sourceOf } from "../../tools/play-stage/looks.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { U } from "./demo-fixture.ts";

type Match = ReturnType<typeof createMatch>;

const hook = (m: Match) => { const link = createSceneLink(sourceOf((id) => m.pixels(id))); return { link, pixels: picturesOf((id) => m.pixels(id), link) }; };
const unitOf = (m: Match, unitId: string) => { const u = m.world.units.all().find((x) => x.unitId === unitId && x.alive); if (u === undefined) throw new Error(unitId); return u; };
const fit = fitView(390 * 3, 600 * 3, 9, TILE, TILE), cam = snapCamera(0, 0, fit.s);
/** Every picture the page's draw list names (chunks and plain fills aside) must load through the page's lookup. */
const unloaded = (rs: RenderScene, pixels: ReturnType<typeof hook>["pixels"], t: number): string[] => chunkedList(rs, fit, cam, t, 10).cmds.map((c) => c.sheet).filter((id) => id !== "" && !id.startsWith("chunk:") && pixels(id) === undefined);
function cast(kind: "basic" | "spell"): { m: Match; t0: number } {
  const m = createMatch(undefined, 40), me = unitOf(m, kind === "basic" ? U.knight : U.archer), wolf = unitOf(m, U.wolf);
  m.world.units.moveTo(me.id, { c: wolf.at.c, r: wolf.at.r + (kind === "basic" ? 1 : 2) }, "move");
  m.intend({ type: "SelectUnit", unitId: me.id }); assert.equal(m.choose(kind), null);
  const at = m.aims[0] ?? wolf.at; m.intend({ type: "TargetCell", at }); m.intend({ type: "TargetCell", at }); m.sync();
  return { m, t0: m.world.clock.now() };
}

test("the bundled stage has water that blocks walking, moving water tiles with shore foam, rock, and chunked ground", () => {
  const m = createMatch(), { link, pixels } = hook(m), sc = m.scene(), rs = link.scene(sc, { tMs: 0, stepMs: 10 }), ground = rs.ground[0];
  assert.ok(ground !== undefined && ground.tiles.includes(1) && ground.tiles.includes(2) && ground.tiles.includes(0));
  assert.equal(m.world.grid.isOpen({ c: 0, r: 3 }), false); assert.equal(m.world.grid.isOpen({ c: 4, r: 6 }), false);
  assert.ok(ground.motion?.[1] !== undefined, "water tiles cycle");
  const shore = rs.overlays.filter((o) => o.sheet.id.startsWith("shore~")); assert.ok(shore.length >= 1);
  for (const o of shore) assert.ok(pixels(o.sheet.id) !== undefined, "shore foam bakes");
  const cmds = chunkedList(rs, fit, cam, 0, 10).cmds;
  assert.ok(cmds.some((c) => c.sheet.startsWith("chunk:g0:")) && cmds.some((c) => c.sheet.startsWith("play:ground~m1~")), "static ground is chunked; water draws per tile");
  assert.deepEqual(unloaded(rs, pixels, 0), []); assert.deepEqual(link.notices, []);
});

test("canopy sways above units and turns see-through over a unit; braziers flicker", () => {
  const m = createMatch(), { link } = hook(m), before = link.scene(m.scene()), canopy = before.above[0];
  assert.ok(canopy !== undefined && canopy.tiles.filter((t) => t !== null).length === 3 && canopy.motion?.[0] !== undefined);
  const braziers = before.standing.filter((s) => s.kind === "object"); assert.equal(braziers.length, 2); assert.ok(braziers.every((s) => s.motion !== undefined));
  m.world.units.moveTo(unitOf(m, U.wolf).id, { c: 5, r: 2 }, "move");
  const after = link.scene(m.scene()).above[0]; assert.ok(after !== undefined);
  assert.equal(after.tiles[2 * 6 + 5], null); assert.equal(after.tiles[1 * 6 + 5], null); assert.equal(after.tiles[1 * 6 + 4], 0);
});

test("braziers light the dusk board; rock casts a shadow (sight lines); a constructor id is not a picture", () => {
  const m = createMatch(), { link, pixels } = hook(m), lighting = createLighting();
  link.scene(m.scene(), { tMs: 0, stepMs: 10 });
  const plan = litPlan(lighting, m.looks, link.lit), lit = plan.level.filter((v) => v > 0).length;
  assert.ok(m.looks.lights.length === 2 && lit > 0 && Math.max(...plan.dark) > 0, "dusk with two torches");
  const open = litPlan(createLighting(), { ...m.looks, light: { ...m.looks.light, blocks: new Uint8Array(m.looks.light.blocks.length) } }, link.lit);
  assert.ok(open.level.filter((v) => v > 0).length > lit, "rock blocks some torch light");
  assert.equal(pixels("constructor"), undefined); assert.equal(pixels("play:anim:constructor"), undefined);
});

test("units idle on a two-frame clip; a basic hit plays hit-stop, squash, hit-white and shake", () => {
  const { m, t0 } = cast("basic"), { link, pixels } = hook(m), idle = pixels(animId("starter:hero-sword"));
  assert.ok(idle !== undefined && idle.w === 2 * TILE);
  let shake = 0, white = 0, squash = 0, lag = 0, clips = 0;
  for (let t = t0; t < t0 + 600; t += 10) {
    const rs = link.scene({ ...m.scene(), effects: m.fx.engine.effects(t) }, { tMs: t, stepMs: m.world.clock.stepMs });
    if (link.shake.x !== 0 || link.shake.y !== 0) shake += 1;
    for (const s of rs.standing) { if (s.look?.startsWith("hw:") === true) white += 1; if (s.squash === true) squash += 1; if ((s.lagMs ?? 0) > 0) lag += 1; if (s.clip?.name === "idle") clips += 1; }
    assert.deepEqual(unloaded(rs, pixels, t), []);
  }
  assert.ok(shake > 0 && white > 0 && squash > 0 && lag > 0 && clips > 0, JSON.stringify({ shake, white, squash, lag, clips }));
});

test("a spell lights the board, throws particles, animates outlined frames, flashes the target and shakes; every picture loads", () => {
  const { m, t0 } = cast("spell"), { link, pixels } = hook(m), lighting = createLighting(), quiet = litPlan(lighting, m.looks, { lights: [] });
  let lights = 0, dots = 0, white = 0, shake = 0, brighter = 0; const frames = new Set<number>(); let outlined = 0, added = 0;
  for (let t = t0; t < t0 + 900; t += 10) {
    const rs = link.scene({ ...m.scene(), effects: m.fx.engine.effects(t) }, { tMs: t, stepMs: m.world.clock.stepMs });
    if (link.lit.lights.length > 0) { lights += 1; if (litPlan(lighting, m.looks, link.lit).level.filter((v) => v > 0).length > quiet.level.filter((v) => v > 0).length) brighter += 1; }
    for (const c of chunkedList(rs, fit, cam, t, 10).cmds) if (c.sheet.startsWith("play:fx")) { frames.add(c.sheet === "play:fx" ? c.sx / TILE : Number(/~fx(\d+)~/.exec(c.sheet)?.[1])); if (/[~|]ol#/.test(c.sheet)) outlined += 1; if (c.op === "add") added += 1; }
    dots += rs.dots?.length ?? 0; if (rs.standing.some((s) => s.look !== undefined)) white += 1; if (link.shake.x !== 0 || link.shake.y !== 0) shake += 1;
    assert.deepEqual(unloaded(rs, pixels, t), []);
  }
  assert.ok(lights > 0 && brighter > 0 && dots > 0 && white > 0 && shake > 0 && frames.size > 1 && outlined > 0 && added > 0, JSON.stringify({ lights, brighter, dots, white, shake, frames: [...frames], outlined, added }));
  assert.deepEqual(m.fx.engine.notes, []);
});
`````

### `tests/tools/play-stage-p17.test.ts` (edited)
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tests/tools/play-stage-p17.test.ts b/tests/tools/play-stage-p17.test.ts
index 1efaed4..8c29277 100644
--- a/tests/tools/play-stage-p17.test.ts
+++ b/tests/tools/play-stage-p17.test.ts
@@ -4,8 +4,8 @@ import { test } from "node:test";
 import { fitView } from "../../src/runtime/render/index.ts";
 import { fit, MIN_CELL_CSS, spellRef, TILE } from "../../tools/play-stage/board.ts";
 import { centreOn, clamp, createCam, follow, pan, seatCam, tickCam, zoomAt } from "../../tools/play-stage/camera-touch.ts";
-import { DEMO_SETUP } from "../../tools/play-stage/load.ts";
 import { createMatch } from "../../tools/play-stage/match.ts";
+import { demoDocs, U } from "./demo-fixture.ts";
 
 const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => { const id = m.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id; if (id === undefined) throw new Error(unitId); return id; };
 
@@ -27,12 +27,12 @@ test("camera keeps a 44 CSS px floor at 360 and 390 @3x after init and after zoo
   const cam = createCam(12); zoomAt(cam, 12, 1170, 2004, 96, 144, 200, 200, 3); check(cam.s, "repro");
 });
 test("spellRef uses Object.hasOwn, so constructor is not a spell row", () => {
-  const bag = Object.assign(Object.create({ constructor: [{ effectRef: "fake" }] }), DEMO_SETUP.abilities ?? {});
-  assert.equal(spellRef({ ...DEMO_SETUP, abilities: bag }, "constructor"), undefined);
-  assert.equal(spellRef(DEMO_SETUP, "archer"), "line-shot");
+  const rules = demoDocs().rules, bag = Object.assign(Object.create({ constructor: [{ effectRef: "fake" }] }), rules.abilities ?? {});
+  assert.equal(spellRef({ ...rules, abilities: bag }, "constructor"), undefined);
+  assert.equal(spellRef(rules, U.archer), "line-shot");
 });
 test("after a walk the action row is at actMenu; Wait returns to idle; Spell two-tap fires line-shot", () => {
-  const m = createMatch(undefined, 40), knight = idOf(m, "knight"), archer = idOf(m, "archer");
+  const m = createMatch(undefined, 40), knight = idOf(m, U.knight), archer = idOf(m, U.archer);
   m.intend({ type: "SelectUnit", unitId: knight });
   const dest = m.reach[0]; assert.ok(dest !== undefined);
   m.intend({ type: "TargetCell", at: dest }); m.intend({ type: "TargetCell", at: dest });
@@ -41,7 +41,7 @@ test("after a walk the action row is at actMenu; Wait returns to idle; Spell two
   assert.equal(m.view().actions.wait.on, true);
   m.wait();
   assert.equal(m.world.phases.battle, "idle");
-  const wolf = m.world.units.all().find((u) => u.unitId === "wolf" && u.alive); assert.ok(wolf !== undefined);
+  const wolf = m.world.units.all().find((u) => u.unitId === U.wolf && u.alive); assert.ok(wolf !== undefined);
   m.world.units.moveTo(archer, { c: wolf.at.c, r: wolf.at.r + 2 }, "move");
   m.intend({ type: "SelectUnit", unitId: archer });
   assert.equal(m.choose("spell"), null);
@@ -51,7 +51,7 @@ test("after a walk the action row is at actMenu; Wait returns to idle; Spell two
   assert.ok("action" in shot && shot.action?.kind === "ability" && shot.action.effects[0] === "line-shot");
 });
 test("Talk appears only when a villager is in reach and shows the bundled text", () => {
-  const m = createMatch(), knight = idOf(m, "knight"), villager = idOf(m, "villager"), at = m.world.units.get(knight)?.at;
+  const m = createMatch(), knight = idOf(m, U.knight), villager = idOf(m, U.villager), at = m.world.units.get(knight)?.at;
   m.intend({ type: "SelectUnit", unitId: knight });
   assert.equal(m.view().actions.talk.show, false);
   m.world.units.moveTo(villager, { c: at?.c ?? 0, r: (at?.r ?? 1) - 1 }, "move");
@@ -67,7 +67,7 @@ test("End turn runs the bot; Restart restores the demo; wiping the wolves is a w
   const m = createMatch(undefined, 20), start = m.world.units.all().map((u) => `${u.id}:${u.at.c},${u.at.r}`).join();
   const acts = m.view().actions; assert.ok(acts.end.show && !acts.basic.show && !acts.wait.show);
   assert.match(readFileSync(new URL("../../tools/play-stage/board.ts", import.meta.url), "utf8"), /botAbilityPriority\(\{ setup: body\.rules, stepReach: step\.reach, actionsPerTurn: budget\.actionsPerTurn \}\)/);
-  const knight = idOf(m, "knight");
+  const knight = idOf(m, U.knight);
   m.intend({ type: "SelectUnit", unitId: knight });
   const dest = m.reach[0]; assert.ok(dest !== undefined);
   m.intend({ type: "TargetCell", at: dest }); m.intend({ type: "TargetCell", at: dest });
`````

Full file at `57af7135`:

`````ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fitView } from "../../src/runtime/render/index.ts";
import { fit, MIN_CELL_CSS, spellRef, TILE } from "../../tools/play-stage/board.ts";
import { centreOn, clamp, createCam, follow, pan, seatCam, tickCam, zoomAt } from "../../tools/play-stage/camera-touch.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { demoDocs, U } from "./demo-fixture.ts";

const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => { const id = m.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id; if (id === undefined) throw new Error(unitId); return id; };

test("camera pans, zooms, centres, follows and stays clamped", () => {
  const cam = createCam(4), fit = fitView(390, 500, 4, TILE, TILE);
  pan(cam, 40, 10); assert.ok(cam.x !== 0);
  zoomAt(cam, 8, 1170, 1500, 96, 144, 200, 200); assert.ok(cam.s > 4 && cam.s <= 6);
  centreOn(cam, { c: 2, r: 6 }, fit, 0, TILE, 0); clamp(cam, fit, 6, 9);
  assert.ok(Number.isFinite(cam.x));
  follow(cam, "knight#1"); tickCam(cam, 10, { c: 2, r: 6 }, fit); assert.equal(cam.follow, "knight#1");
});
test("camera keeps a 44 CSS px floor at 360 and 390 @3x after init and after zoomAt", () => {
  const dpr = 3, css = (s: number): number => (TILE * s) / dpr, check = (s: number, why: string): void => { assert.ok(css(s) >= MIN_CELL_CSS, `${why}: ${css(s)}`); };
  for (const w of [360, 390]) {
    const devW = w * dpr, devH = (844 - 176) * dpr, box = fit(devW, devH, 6, 9, dpr), cam = createCam(1);
    seatCam(cam, box.s, dpr); check(cam.s, `init ${w}`);
    zoomAt(cam, cam.s, devW, devH, 96, 144, 200, 200, dpr); check(cam.s, `identity ${w}`); zoomAt(cam, 1, devW, devH, 96, 144, 200, 200, dpr); check(cam.s, `out ${w}`);
  }
  const cam = createCam(12); zoomAt(cam, 12, 1170, 2004, 96, 144, 200, 200, 3); check(cam.s, "repro");
});
test("spellRef uses Object.hasOwn, so constructor is not a spell row", () => {
  const rules = demoDocs().rules, bag = Object.assign(Object.create({ constructor: [{ effectRef: "fake" }] }), rules.abilities ?? {});
  assert.equal(spellRef({ ...rules, abilities: bag }, "constructor"), undefined);
  assert.equal(spellRef(rules, U.archer), "line-shot");
});
test("after a walk the action row is at actMenu; Wait returns to idle; Spell two-tap fires line-shot", () => {
  const m = createMatch(undefined, 40), knight = idOf(m, U.knight), archer = idOf(m, U.archer);
  m.intend({ type: "SelectUnit", unitId: knight });
  const dest = m.reach[0]; assert.ok(dest !== undefined);
  m.intend({ type: "TargetCell", at: dest }); m.intend({ type: "TargetCell", at: dest });
  m.world.clock.advance(80); m.sync();
  assert.equal(m.world.phases.battle, "actMenu");
  assert.equal(m.view().actions.wait.on, true);
  m.wait();
  assert.equal(m.world.phases.battle, "idle");
  const wolf = m.world.units.all().find((u) => u.unitId === U.wolf && u.alive); assert.ok(wolf !== undefined);
  m.world.units.moveTo(archer, { c: wolf.at.c, r: wolf.at.r + 2 }, "move");
  m.intend({ type: "SelectUnit", unitId: archer });
  assert.equal(m.choose("spell"), null);
  const at = m.aims[0] ?? wolf.at;
  m.intend({ type: "TargetCell", at });
  const shot = m.intend({ type: "TargetCell", at });
  assert.ok("action" in shot && shot.action?.kind === "ability" && shot.action.effects[0] === "line-shot");
});
test("Talk appears only when a villager is in reach and shows the bundled text", () => {
  const m = createMatch(), knight = idOf(m, U.knight), villager = idOf(m, U.villager), at = m.world.units.get(knight)?.at;
  m.intend({ type: "SelectUnit", unitId: knight });
  assert.equal(m.view().actions.talk.show, false);
  m.world.units.moveTo(villager, { c: at?.c ?? 0, r: (at?.r ?? 1) - 1 }, "move");
  m.intend({ type: "SelectUnit", unitId: knight });
  assert.equal(m.view().actions.talk.show, true);
  assert.equal(m.choose("talk"), null);
  const aim = m.aims[0]; assert.ok(aim !== undefined);
  m.intend({ type: "TargetCell", at: aim }); m.intend({ type: "TargetCell", at: aim }); m.sync();
  assert.ok(m.talk !== null && m.talk.text === "Hello, traveler." && m.talk.name === "Villager");
  assert.equal(m.world.phases.battle, "actMenu");
});
test("End turn runs the bot; Restart restores the demo; wiping the wolves is a win", () => {
  const m = createMatch(undefined, 20), start = m.world.units.all().map((u) => `${u.id}:${u.at.c},${u.at.r}`).join();
  const acts = m.view().actions; assert.ok(acts.end.show && !acts.basic.show && !acts.wait.show);
  assert.match(readFileSync(new URL("../../tools/play-stage/board.ts", import.meta.url), "utf8"), /botAbilityPriority\(\{ setup: body\.rules, stepReach: step\.reach, actionsPerTurn: budget\.actionsPerTurn \}\)/);
  const knight = idOf(m, U.knight);
  m.intend({ type: "SelectUnit", unitId: knight });
  const dest = m.reach[0]; assert.ok(dest !== undefined);
  m.intend({ type: "TargetCell", at: dest }); m.intend({ type: "TargetCell", at: dest });
  m.world.clock.advance(80); m.sync();
  assert.equal(m.world.phases.battle, "actMenu");
  m.endTurn();
  for (let i = 0; i < 8 && m.walk !== null; i += 1) { m.world.clock.advance(40); m.sync(); }
  assert.ok(m.outcome !== null || (m.side === "player" && String(m.world.phases.battle) === "idle"));
  const again = m.restart();
  assert.equal(again.world.phases.battle, "idle");
  assert.equal(again.autoWait, false);
  assert.equal(again.world.units.all().map((u) => `${u.id}:${u.at.c},${u.at.r}`).join(), start);
  again.world.units.all().filter((u) => u.side === "wolves").forEach((u) => again.world.units.remove(u.id));
  again.endTurn();
  assert.equal(again.outcome, "win");
});
`````

### `tests/tools/play-stage-p18.test.ts` (edited)
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tests/tools/play-stage-p18.test.ts b/tests/tools/play-stage-p18.test.ts
index 57a0c79..b935c07 100644
--- a/tests/tools/play-stage-p18.test.ts
+++ b/tests/tools/play-stage-p18.test.ts
@@ -3,9 +3,9 @@ import { test } from "node:test";
 import type { Action } from "../../src/core/log/index.ts";
 import { stepTimes } from "../../src/runtime/render/fx-doc.ts";
 import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
-import { DEMO_SETUP, DEMO_MANIFEST, DEMO_MAP, DEMO_STAGE, DEMO_TALK } from "../../tools/play-stage/load.ts";
 import { createPlayFx, HOUSE_ATTACK, HOUSE_DOC, LINE_SHOT_DOC, refOf } from "../../tools/play-stage/fx.ts";
 import { createMatch } from "../../tools/play-stage/match.ts";
+import { demoDocs, U } from "./demo-fixture.ts";
 
 const SAVED_ID = "setup_01J0P18F17TEST000000000000";
 const SAVED = {
@@ -15,7 +15,7 @@ const SAVED = {
 const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => {
   const id = m.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id; if (id === undefined) throw new Error(unitId); return id;
 };
-const ability = (effects: readonly string[]): Action => ({ id: "a1", kind: "ability", actor: "archer#2", target: { pipe: "unit", unitId: "wolf#1", fallbackAt: { c: 4, r: 1 } }, durationMs: null, turns: null, effects });
+const ability = (effects: readonly string[]): Action => ({ id: "a1", kind: "ability", actor: `${U.archer}#2`, target: { pipe: "unit", unitId: `${U.wolf}#1`, fallbackAt: { c: 4, r: 1 } }, durationMs: null, turns: null, effects });
 
 test("refOf is exactly one effect; a constructor id does not throw; empty effects get the house default", () => {
   assert.equal(refOf(ability(["line-shot"])), "line-shot");
@@ -26,7 +26,7 @@ test("refOf is exactly one effect; a constructor id does not throw; empty effect
   assert.equal(fx.values(HOUSE_ATTACK)?.rev, 1);
   const log = { entries: () => [{ seq: 1, tick: 0, action: ability([]) }] };
   const live = fx.ingest(log, 10, 0);
-  assert.ok(live.length === 1 && live[0]?.caster === "archer#2");
+  assert.ok(live.length === 1 && live[0]?.caster === `${U.archer}#2`);
   assert.equal(stepTimes(HOUSE_DOC).endMs, 250);
   assert.equal(fx.ingest(log, 10, 251).length, 0);
   const two = createPlayFx();
@@ -43,14 +43,14 @@ test("F17: an editor-saved effect setup is what the match uses", () => {
   const log = { entries: () => [{ seq: 1, tick: 0, action: ability([SAVED_ID]) }] };
   assert.equal(fx.ingest(log, 10, 0).length, 1);
   assert.equal(fx.ingest(log, 10, end + 1).length, 0);
-  const m = createMatch({ manifest: DEMO_MANIFEST, map: DEMO_MAP, stage: DEMO_STAGE, talk: DEMO_TALK, rules: { ...DEMO_SETUP, abilities: { archer: [{ reach: 3, damage: 2, effectRef: SAVED_ID }] } }, effects: [SAVED] });
+  const docs = demoDocs(), m = createMatch({ ...docs, rules: { ...docs.rules, abilities: { [U.archer]: [{ reach: 3, damage: 2, effectRef: SAVED_ID }] } }, effects: [SAVED] });
   assert.equal(m.fx.values(SAVED_ID)?.rev, 4);
   assert.deepEqual(m.fx.values(SAVED_ID)?.values, got.values);
 });
 
 test("a Spell two-tap cues line-shot; the scene is live, then fx:hit, then retired", () => {
-  const m = createMatch(undefined, 40), archer = idOf(m, "archer");
-  const wolf = m.world.units.all().find((u) => u.unitId === "wolf" && u.alive); assert.ok(wolf !== undefined);
+  const m = createMatch(undefined, 40), archer = idOf(m, U.archer);
+  const wolf = m.world.units.all().find((u) => u.unitId === U.wolf && u.alive); assert.ok(wolf !== undefined);
   m.world.units.moveTo(archer, { c: wolf.at.c, r: wolf.at.r + 2 }, "move");
   m.intend({ type: "SelectUnit", unitId: archer });
   assert.equal(m.choose("spell"), null);
@@ -72,8 +72,8 @@ test("a Spell two-tap cues line-shot; the scene is live, then fx:hit, then retir
 });
 
 test("a basic attack with empty effects plays the house default", () => {
-  const m = createMatch(undefined, 40), knight = idOf(m, "knight");
-  const wolf = m.world.units.all().find((u) => u.unitId === "wolf" && u.alive); assert.ok(wolf !== undefined);
+  const m = createMatch(undefined, 40), knight = idOf(m, U.knight);
+  const wolf = m.world.units.all().find((u) => u.unitId === U.wolf && u.alive); assert.ok(wolf !== undefined);
   m.world.units.moveTo(knight, { c: wolf.at.c, r: wolf.at.r + 1 }, "move");
   m.intend({ type: "SelectUnit", unitId: knight });
   assert.equal(m.choose("basic"), null);
`````

Full file at `57af7135`:

`````ts
import assert from "node:assert/strict";
import { test } from "node:test";
import type { Action } from "../../src/core/log/index.ts";
import { stepTimes } from "../../src/runtime/render/fx-doc.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { createPlayFx, HOUSE_ATTACK, HOUSE_DOC, LINE_SHOT_DOC, refOf } from "../../tools/play-stage/fx.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { demoDocs, U } from "./demo-fixture.ts";

const SAVED_ID = "setup_01J0P18F17TEST000000000000";
const SAVED = {
  kind: "behaviour-setup", formatVersion: 3, id: SAVED_ID, rev: 4, behaviourId: "effect",
  answers: { steps: { source: "user", value: [{ kind: "stamp", seconds: 0.05 }] } },
};
const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => {
  const id = m.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id; if (id === undefined) throw new Error(unitId); return id;
};
const ability = (effects: readonly string[]): Action => ({ id: "a1", kind: "ability", actor: `${U.archer}#2`, target: { pipe: "unit", unitId: `${U.wolf}#1`, fallbackAt: { c: 4, r: 1 } }, durationMs: null, turns: null, effects });

test("refOf is exactly one effect; a constructor id does not throw; empty effects get the house default", () => {
  assert.equal(refOf(ability(["line-shot"])), "line-shot");
  assert.equal(refOf(ability([])), undefined);
  assert.equal(refOf(ability(["a", "b"])), undefined);
  const fx = createPlayFx();
  assert.equal(fx.values("constructor"), null);
  assert.equal(fx.values(HOUSE_ATTACK)?.rev, 1);
  const log = { entries: () => [{ seq: 1, tick: 0, action: ability([]) }] };
  const live = fx.ingest(log, 10, 0);
  assert.ok(live.length === 1 && live[0]?.caster === `${U.archer}#2`);
  assert.equal(stepTimes(HOUSE_DOC).endMs, 250);
  assert.equal(fx.ingest(log, 10, 251).length, 0);
  const two = createPlayFx();
  assert.equal(two.ingest({ entries: () => [{ seq: 1, tick: 0, action: ability(["a", "b"]) }] }, 10, 0).length, 0);
});

test("F17: an editor-saved effect setup is what the match uses", () => {
  const fx = createPlayFx([SAVED]);
  const got = fx.values(SAVED_ID); assert.ok(got !== null && got.rev === 4);
  assert.deepEqual(got.values, { steps: [{ kind: "stamp", seconds: 0.05 }] });
  const end = stepTimes(got.values).endMs;
  assert.equal(end, stepTimes({ steps: [{ kind: "stamp", seconds: 0.05 }] }).endMs);
  assert.ok(end < stepTimes(HOUSE_DOC).endMs && end < stepTimes(LINE_SHOT_DOC).endMs);
  const log = { entries: () => [{ seq: 1, tick: 0, action: ability([SAVED_ID]) }] };
  assert.equal(fx.ingest(log, 10, 0).length, 1);
  assert.equal(fx.ingest(log, 10, end + 1).length, 0);
  const docs = demoDocs(), m = createMatch({ ...docs, rules: { ...docs.rules, abilities: { [U.archer]: [{ reach: 3, damage: 2, effectRef: SAVED_ID }] } }, effects: [SAVED] });
  assert.equal(m.fx.values(SAVED_ID)?.rev, 4);
  assert.deepEqual(m.fx.values(SAVED_ID)?.values, got.values);
});

test("a Spell two-tap cues line-shot; the scene is live, then fx:hit, then retired", () => {
  const m = createMatch(undefined, 40), archer = idOf(m, U.archer);
  const wolf = m.world.units.all().find((u) => u.unitId === U.wolf && u.alive); assert.ok(wolf !== undefined);
  m.world.units.moveTo(archer, { c: wolf.at.c, r: wolf.at.r + 2 }, "move");
  m.intend({ type: "SelectUnit", unitId: archer });
  assert.equal(m.choose("spell"), null);
  const at = m.aims[0] ?? wolf.at;
  m.intend({ type: "TargetCell", at });
  const shot = m.intend({ type: "TargetCell", at });
  assert.ok("action" in shot && shot.action?.kind === "ability" && shot.action.effects[0] === "line-shot");
  const now = m.world.clock.now(), list = m.scene().effects ?? [];
  assert.ok(list.length >= 1, "effect is live after the cue");
  const link = createSceneLink();
  let hits = 0;
  for (let t = now; t <= now + 800; t += 10) {
    link.scene({ ...m.scene(), effects: m.fx.engine.effects(t) }, { tMs: t, stepMs: m.world.clock.stepMs });
    hits += link.fired.filter((e) => e.type === "fx:hit").length;
  }
  assert.ok(hits >= 1, "fx:hit fired");
  assert.equal(m.fx.engine.effects(now + 800).length, 0, "effect retired");
  assert.ok(stepTimes(LINE_SHOT_DOC).endMs > 50);
});

test("a basic attack with empty effects plays the house default", () => {
  const m = createMatch(undefined, 40), knight = idOf(m, U.knight);
  const wolf = m.world.units.all().find((u) => u.unitId === U.wolf && u.alive); assert.ok(wolf !== undefined);
  m.world.units.moveTo(knight, { c: wolf.at.c, r: wolf.at.r + 1 }, "move");
  m.intend({ type: "SelectUnit", unitId: knight });
  assert.equal(m.choose("basic"), null);
  const at = m.aims[0] ?? wolf.at;
  m.intend({ type: "TargetCell", at }); m.intend({ type: "TargetCell", at }); m.sync();
  const list = m.scene().effects ?? [];
  assert.ok(list.length >= 1);
  assert.ok(list.some((e) => e.id.startsWith("cast:")));
});
`````

### `tests/tools/play-stage-p19.test.ts` (edited)
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tests/tools/play-stage-p19.test.ts b/tests/tools/play-stage-p19.test.ts
index 6364ed4..73540d9 100644
--- a/tests/tools/play-stage-p19.test.ts
+++ b/tests/tools/play-stage-p19.test.ts
@@ -7,7 +7,8 @@ import { buildWeb, debugGlobals, listFiles } from "../../tools/apk/build.ts";
 import { boardBox, fit, HUD_FOOT, HUD_TOP, PLATE_H, ROW_FOOT, TILE } from "../../tools/play-stage/board.ts";
 import { DEV_ONLY, release } from "../../tools/play-stage/build.ts";
 import { createCam, seatCam } from "../../tools/play-stage/camera-touch.ts";
-import { DEMO_LOAD, DEMO_MAP, DEMO_SEED, DEMO_STAGE, docsToInput } from "../../tools/play-stage/load.ts";
+import { docsToInput } from "../../tools/play-stage/load.ts";
+import { demoDocs } from "./demo-fixture.ts";
 
 const hudSrc = readFileSync(new URL("../../tools/play-stage/hud.ts", import.meta.url), "utf8");
 
@@ -47,10 +48,11 @@ test("export audit: a release www drops every DEV path (define + dead-code remov
   } finally { rmSync(rel, { recursive: true, force: true }); rmSync(dev, { recursive: true, force: true }); }
 });
 
-test("DEMO_SEED is the stage seed, the demo host seed and the host seed when docs give none", () => {
-  assert.equal(DEMO_STAGE.seed, DEMO_SEED);
-  assert.equal(DEMO_LOAD.hostSeed, DEMO_SEED);
-  const { manifest, rules, talk } = DEMO_LOAD;
-  assert.equal(docsToInput({ manifest, map: DEMO_MAP, stage: DEMO_STAGE, rules, talk }).input.hostSeed, DEMO_SEED);
-  assert.equal(docsToInput({ manifest, map: DEMO_MAP, stage: DEMO_STAGE, rules, talk, hostSeed: 7 }).input.hostSeed, 7);
+test("stage seed 24301 is the host seed when docs give none", () => {
+  const docs = demoDocs(), stage = docs.stage, { hostSeed: _host, ...rest } = docs;
+  assert.equal(typeof stage === "object" && stage !== null && "seed" in stage && stage.seed, 24301);
+  assert.equal(docs.hostSeed, 24301);
+  assert.equal(docsToInput(rest).input.hostSeed, 24301);
+  assert.equal(docsToInput({ ...rest, hostSeed: 7 }).input.hostSeed, 7);
+  void _host;
 });
`````

Full file at `57af7135`:

`````ts
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildWeb, debugGlobals, listFiles } from "../../tools/apk/build.ts";
import { boardBox, fit, HUD_FOOT, HUD_TOP, PLATE_H, ROW_FOOT, TILE } from "../../tools/play-stage/board.ts";
import { DEV_ONLY, release } from "../../tools/play-stage/build.ts";
import { createCam, seatCam } from "../../tools/play-stage/camera-touch.ts";
import { docsToInput } from "../../tools/play-stage/load.ts";
import { demoDocs } from "./demo-fixture.ts";

const hudSrc = readFileSync(new URL("../../tools/play-stage/hud.ts", import.meta.url), "utf8");

test("the board canvas sits between the HUD bands: row 0 is whole and below the top bar at 390 and 360 @3x; the banner is in the top band and click-through", () => {
  assert.equal(HUD_FOOT, ROW_FOOT + PLATE_H);
  for (const w of [390, 360]) {
    const dpr = 3, box = boardBox(844), devW = w * dpr, devH = box.height * dpr, cam = createCam(1);
    assert.deepEqual(box, { top: HUD_TOP, height: 844 - HUD_TOP - HUD_FOOT });
    seatCam(cam, fit(devW, devH, 6, 9, dpr).s, dpr);
    const padY = Math.floor((devH - Math.floor(devH / cam.s) * cam.s) / 2), top = box.top + padY / dpr, bottom = top + (TILE * cam.s) / dpr;
    assert.ok(top >= HUD_TOP, `${w}: row 0 top ${top} is under the top bar`);
    assert.ok(bottom <= box.top + box.height, `${w}: row 0 bottom ${bottom} runs past the board`);
  }
  assert.match(hudSrc, /#top\{[^}]*top:0;height:\$\{HUD_TOP\}px;/);
  assert.match(hudSrc, /#banner\{[^}]*top:0;height:\$\{HUD_TOP\}px;/);
  assert.match(hudSrc, /#plate\{[^}]*bottom:\$\{ROW_FOOT\}px;height:\$\{PLATE_H\}px;/);
  assert.match(hudSrc, /#hud #banner\{pointer-events:none\}/);
  assert.match(hudSrc, /#row\{[^}]*bottom:24px;height:64px;/);
  assert.equal(24 + 64, ROW_FOOT);
});

test("export audit: a release www drops every DEV path (define + dead-code removal); the dev build keeps the hooks for the smokes", () => {
  assert.equal(release(`a\nimport { DEV } from "./dev.ts"; ${DEV_ONLY}\nif (DEV) go(); ${DEV_ONLY}  \nc`), "a\nc");
  assert.throws(() => release(`window.__x = 1; ${DEV_ONLY}`), /must be an if \(DEV\) statement/);
  assert.throws(() => release("if (DEV) go();"), /DEV is used outside a dev-only line/);
  const rel = mkdtempSync(join(tmpdir(), "p19r5-")), dev = mkdtempSync(join(tmpdir(), "p19r5-"));
  try {
    buildWeb(rel, "0".repeat(40)); buildWeb(dev, "0".repeat(40), undefined, true);
    assert.deepEqual(debugGlobals(rel), []);
    assert.ok(!listFiles(rel).includes("tools/play-stage/dev.js") && listFiles(dev).includes("tools/play-stage/dev.js"));
    for (const name of listFiles(rel)) assert.ok(!readFileSync(join(rel, name), "utf8").includes("Object.assign(window"), name);
    assert.deepEqual(debugGlobals(dev), ["tools/play-stage/dev.js", "tools/play-stage/page.js"]);
    const page = readFileSync(join(dev, "tools/play-stage/page.js"), "utf8");
    for (const g of ["__play", "__driver", "__cam", "__hud", "__fx", "__link"]) assert.ok(page.includes(g), g);
    writeFileSync(join(rel, "planted.js"), "globalThis.__link = 1;\n");
    assert.deepEqual(debugGlobals(rel), ["planted.js"]);
  } finally { rmSync(rel, { recursive: true, force: true }); rmSync(dev, { recursive: true, force: true }); }
});

test("stage seed 24301 is the host seed when docs give none", () => {
  const docs = demoDocs(), stage = docs.stage, { hostSeed: _host, ...rest } = docs;
  assert.equal(typeof stage === "object" && stage !== null && "seed" in stage && stage.seed, 24301);
  assert.equal(docs.hostSeed, 24301);
  assert.equal(docsToInput(rest).input.hostSeed, 24301);
  assert.equal(docsToInput({ ...rest, hostSeed: 7 }).input.hostSeed, 7);
  void _host;
});
`````

### `tests/tools/play-stage-parity.test.ts` (new)

`````ts
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { WIN_CONDITION, wipeRule } from "../../src/rules/battle/index.ts";
import { installOne } from "../../src/rules/behaviours/index.ts";
import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.ts";
import { botAbilityPriority } from "../../src/rules/turns/bot-ability-priority.ts";
import { createWorld, runMatch, snapshot } from "../../src/sim/index.ts";
import { docsToInput } from "../../tools/play-stage/load.ts";
import { openProject } from "../../tools/play-stage/project.ts";
import { demoDocs, loadFixture, U } from "./demo-fixture.ts";

const sha = (v: unknown): string => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const slug = (text: string): string => Object.entries(U).reduce((out, [name, id]) => out.replaceAll(id, name), text);
test("(a) parity: seed 24301 bot versus bot equals the 1a golden", () => {
  const docs = demoDocs(), input = docsToInput(docs).input, win = installOne(WIN_CONDITION, {}).out, budget = installOne(ACTION_BUDGET, {}).out;
  if (win === null || budget === null) throw new Error("parity: rules");
  assert.equal(input.hostSeed, 24301); assert.equal(input.projectHash, "demo");
  const world = createWorld(input);
  const result = runMatch(world, { sides: ["player", "wolves"], ai: botAbilityPriority({ actionsPerTurn: budget.actionsPerTurn, setup: docs.rules }), victory: wipeRule(win, ["player", "wolves"]), fuse: "off", maxRounds: 80, maxSimMs: 100000 });
  const got = { outcome: result.outcome, snapshot: sha(JSON.parse(slug(JSON.stringify(snapshot(world))))), log: sha(slug(world.log.toJSON())), bus: sha(JSON.parse(slug(JSON.stringify(world.bus.history())))) };
  assert.deepEqual(got, JSON.parse(readFileSync(new URL("./golden/demo-parity.json", import.meta.url), "utf8")) as unknown);
});
test("a rejected project shows the error text and does not fall back to the demo", () => {
  const files = loadFixture(), manifest = files["project.json"];
  if (typeof manifest !== "object" || manifest === null) throw new Error("project");
  const got = openProject({ ...files, "project.json": { ...manifest, formatVersion: 7 } });
  assert.equal(got.docs, null);
  assert.match(got.error, /formatNewer/); assert.match(got.error, /project\.json/);
  assert.equal(got.error.includes("knight"), false);
});
`````

### `tests/tools/play-stage.test.ts` (edited)
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tests/tools/play-stage.test.ts b/tests/tools/play-stage.test.ts
index f902d24..2d71147 100644
--- a/tests/tools/play-stage.test.ts
+++ b/tests/tools/play-stage.test.ts
@@ -5,7 +5,8 @@ import { join } from "node:path";
 import { test } from "node:test";
 import { build } from "../../tools/play-stage/build.ts";
 import { createPlay, fit, MIN_CELL_CSS, recipeOf, TILE } from "../../tools/play-stage/board.ts";
-import { DEMO_LOAD, DEMO_MANIFEST, DEMO_MAP, DEMO_STAGE, DEMO_SETUP, docsToInput } from "../../tools/play-stage/load.ts";
+import { docsToInput } from "../../tools/play-stage/load.ts";
+import { demoDocs, U } from "./demo-fixture.ts";
 
 const idOf = (unitId: string, play: ReturnType<typeof createPlay>): string => {
   const id = play.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id;
@@ -17,17 +18,22 @@ const atOf = (play: ReturnType<typeof createPlay>, id: string): { c: number; r:
 };
 
 test("boot seats a rules world on the bundled demo and ends in idle; docsToInput is the r73 hook", () => {
-  const play = createPlay(), load = docsToInput({ manifest: DEMO_MANIFEST, map: DEMO_MAP, stage: DEMO_STAGE, rules: DEMO_SETUP, talk: DEMO_LOAD.talk, hostSeed: 11 });
+  const play = createPlay(), docs = demoDocs(), load = docsToInput({ ...docs, hostSeed: 11 });
   assert.equal(play.world.phases.battle, "idle");
-  assert.ok(play.world.rules !== null && play.world.units.all().some((u) => u.unitId === "knight") && play.world.units.all().some((u) => u.unitId === "wolf"));
+  assert.ok(play.world.rules !== null && play.world.units.all().some((u) => u.unitId === U.knight) && play.world.units.all().some((u) => u.unitId === U.wolf));
   assert.equal(play.step.reach, 1);
   assert.equal(load.input.hostSeed, 11);
-  assert.equal(load.talk["talk-villager"], "Hello, traveler.");
-  assert.equal(createPlay({ manifest: DEMO_MANIFEST, map: DEMO_MAP, stage: DEMO_STAGE, rules: DEMO_SETUP, hostSeed: 11 }).world.phases.battle, "idle");
+  assert.equal(load.talk[`talk-${U.villager}`], "Hello, traveler.");
+  assert.equal(createPlay({ ...docs, hostSeed: 11 }).world.phases.battle, "idle");
+  const want: Readonly<Record<string, { hp: number; atk: number }>> = { [U.knight]: { hp: 9, atk: 1 }, [U.archer]: { hp: 6, atk: 2 }, [U.cleric]: { hp: 7, atk: 1 }, [U.wolf]: { hp: 4, atk: 1 }, [U.villager]: { hp: 4, atk: 0 }, [U.crate]: { hp: 3, atk: 0 }, [U.merchant]: { hp: 5, atk: 0 } };
+  for (const id of Object.keys(want)) assert.deepEqual(docs.rules.stats[id], want[id]);
+  assert.deepEqual(docs.chosen, [U.knight, U.archer]);
+  const water = docs.tiles.find((t) => t.id === "water"), wall = docs.tiles.find((t) => t.id === "wall-block");
+  assert.equal(water?.open === false && water.push_can_enter === false && wall?.open === false && wall.push_can_enter === false, true);
 });
 
 test("selecting a knight highlights its orthogonal walk tiles; a constructor unit id does not throw", () => {
-  const play = createPlay(), id = idOf("knight", play), unit = play.world.units.get(id);
+  const play = createPlay(), id = idOf(U.knight, play), unit = play.world.units.get(id);
   assert.ok(unit !== undefined);
   const step = play.intend({ type: "SelectUnit", unitId: id });
   assert.ok("reject" in step && step.reject === null && play.selected === id);
@@ -38,12 +44,12 @@ test("selecting a knight highlights its orthogonal walk tiles; a constructor uni
   assert.equal(recipeOf("constructor").id, "starter:unknown-constructor");
   const px = play.pixels("starter:hero-sword");
   assert.ok(px !== undefined && px.w === TILE && px.data.length === TILE * TILE * 4);
-  const play2 = createPlay(), id2 = idOf("knight", play2), tap = atOf(play2, id2);
+  const play2 = createPlay(), id2 = idOf(U.knight, play2), tap = atOf(play2, id2);
   play2.pointer({ kind: "down", id: 1, pointer: "touch", x: tap.c * TILE + 8, y: tap.r * TILE + 8, ms: 100 }); play2.pointer({ kind: "up", id: 1, pointer: "touch", x: tap.c * TILE + 8, y: tap.r * TILE + 8, ms: 120 }); assert.equal(play2.selected, id2);
 });
 
 test("first tap on a reachable tile shows the path and does not walk; the second tap walks, then MOVE_DONE returns to idle", () => {
-  const play = createPlay(undefined, 50), id = idOf("knight", play), start = atOf(play, id);
+  const play = createPlay(undefined, 50), id = idOf(U.knight, play), start = atOf(play, id);
   play.intend({ type: "SelectUnit", unitId: id });
   const dest = play.reach[0];
   assert.ok(dest !== undefined);
@@ -74,6 +80,12 @@ test("static build writes index.html, the import tree as .js, and a build.json t
     assert.ok(Object.hasOwn(json.files, "index.html") && Object.hasOwn(json.files, "tools/play-stage/page.js") && Object.hasOwn(json.files, "tools/play-stage/board.js"));
     assert.match(readFileSync(join(out, "index.html"), "utf8"), /tools\/play-stage\/page\.js/);
     assert.equal(JSON.parse(body).commit, sha);
+    const raw = readFileSync(new URL("../../fixtures/demo.tileproj/project.json", import.meta.url), "utf8");
+    assert.equal(readFileSync(join(out, "fixtures/demo.tileproj/project.json.js"), "utf8"), `export default ${raw}`);
+    const built = readFileSync(join(out, "tools/play-stage/project.js"), "utf8");
+    assert.match(built, /fixtures\/demo\.tileproj\/project\.json\.js/);
+    assert.equal(built.includes("type: \"json\""), false);
+    assert.equal(built.includes("with {"), false);
   } finally { rmSync(out, { recursive: true, force: true }); }
 });
 
@@ -86,7 +98,7 @@ test("fit keeps a 44 CSS px floor per cell; a 12-wide map at 360 CSS @3x does no
 });
 
 test("a foreign-side tap does not select; a walk beyond reach and a second tap on a non-reach tile do not walk and clear the preview", () => {
-  const play = createPlay(), knight = idOf("knight", play), wolf = play.world.units.all().find((u) => u.unitId === "wolf" && u.alive);
+  const play = createPlay(), knight = idOf(U.knight, play), wolf = play.world.units.all().find((u) => u.unitId === U.wolf && u.alive);
   assert.ok(wolf !== undefined);
   const foreign = play.intend({ type: "SelectUnit", unitId: wolf.id });
   assert.ok("reject" in foreign && foreign.reject === "notOwn");
`````

Full file at `57af7135`:

`````ts
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { build } from "../../tools/play-stage/build.ts";
import { createPlay, fit, MIN_CELL_CSS, recipeOf, TILE } from "../../tools/play-stage/board.ts";
import { docsToInput } from "../../tools/play-stage/load.ts";
import { demoDocs, U } from "./demo-fixture.ts";

const idOf = (unitId: string, play: ReturnType<typeof createPlay>): string => {
  const id = play.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id;
  if (id === undefined) throw new Error(unitId);
  return id;
};
const atOf = (play: ReturnType<typeof createPlay>, id: string): { c: number; r: number } => {
  const u = play.world.units.get(id); if (u === undefined) throw new Error(id); return { c: u.at.c, r: u.at.r };
};

test("boot seats a rules world on the bundled demo and ends in idle; docsToInput is the r73 hook", () => {
  const play = createPlay(), docs = demoDocs(), load = docsToInput({ ...docs, hostSeed: 11 });
  assert.equal(play.world.phases.battle, "idle");
  assert.ok(play.world.rules !== null && play.world.units.all().some((u) => u.unitId === U.knight) && play.world.units.all().some((u) => u.unitId === U.wolf));
  assert.equal(play.step.reach, 1);
  assert.equal(load.input.hostSeed, 11);
  assert.equal(load.talk[`talk-${U.villager}`], "Hello, traveler.");
  assert.equal(createPlay({ ...docs, hostSeed: 11 }).world.phases.battle, "idle");
  const want: Readonly<Record<string, { hp: number; atk: number }>> = { [U.knight]: { hp: 9, atk: 1 }, [U.archer]: { hp: 6, atk: 2 }, [U.cleric]: { hp: 7, atk: 1 }, [U.wolf]: { hp: 4, atk: 1 }, [U.villager]: { hp: 4, atk: 0 }, [U.crate]: { hp: 3, atk: 0 }, [U.merchant]: { hp: 5, atk: 0 } };
  for (const id of Object.keys(want)) assert.deepEqual(docs.rules.stats[id], want[id]);
  assert.deepEqual(docs.chosen, [U.knight, U.archer]);
  const water = docs.tiles.find((t) => t.id === "water"), wall = docs.tiles.find((t) => t.id === "wall-block");
  assert.equal(water?.open === false && water.push_can_enter === false && wall?.open === false && wall.push_can_enter === false, true);
});

test("selecting a knight highlights its orthogonal walk tiles; a constructor unit id does not throw", () => {
  const play = createPlay(), id = idOf(U.knight, play), unit = play.world.units.get(id);
  assert.ok(unit !== undefined);
  const step = play.intend({ type: "SelectUnit", unitId: id });
  assert.ok("reject" in step && step.reject === null && play.selected === id);
  assert.ok(play.reach.length >= 1 && play.reach.every((c) => Math.abs(c.c - unit.at.c) + Math.abs(c.r - unit.at.r) === 1));
  const scene = play.scene();
  assert.equal(scene.overlays.length, play.reach.length);
  assert.ok(scene.overlays.every((o) => o.band === "fxGround" && o.sheet.id === "play:reach-player"));
  assert.equal(recipeOf("constructor").id, "starter:unknown-constructor");
  const px = play.pixels("starter:hero-sword");
  assert.ok(px !== undefined && px.w === TILE && px.data.length === TILE * TILE * 4);
  const play2 = createPlay(), id2 = idOf(U.knight, play2), tap = atOf(play2, id2);
  play2.pointer({ kind: "down", id: 1, pointer: "touch", x: tap.c * TILE + 8, y: tap.r * TILE + 8, ms: 100 }); play2.pointer({ kind: "up", id: 1, pointer: "touch", x: tap.c * TILE + 8, y: tap.r * TILE + 8, ms: 120 }); assert.equal(play2.selected, id2);
});

test("first tap on a reachable tile shows the path and does not walk; the second tap walks, then MOVE_DONE returns to idle", () => {
  const play = createPlay(undefined, 50), id = idOf(U.knight, play), start = atOf(play, id);
  play.intend({ type: "SelectUnit", unitId: id });
  const dest = play.reach[0];
  assert.ok(dest !== undefined);
  const preview = play.intend({ type: "TargetCell", at: dest });
  assert.ok("preview" in preview && preview.preview.length >= 1 && play.pending?.c === dest.c);
  assert.deepEqual(atOf(play, id), start);
  const walked = play.intend({ type: "TargetCell", at: dest });
  assert.ok("action" in walked && walked.action?.kind === "move" && walked.path !== undefined);
  assert.equal(play.world.phases.battle, "moving");
  play.sync();
  assert.ok(play.world.units.get(id)?.offset !== null && play.walk !== null);
  play.world.clock.advance(walked.action?.durationMs ?? 50);
  play.sync();
  assert.equal(play.walk, null);
  assert.deepEqual(atOf(play, id), dest);
  assert.equal(play.world.units.get(id)?.offset, null);
  assert.equal(play.world.phases.battle, "idle");
});


test("static build writes index.html, the import tree as .js, and a build.json this builder wrote", () => {
  const out = mkdtempSync(join(tmpdir(), "play-stage-"));
  try {
    const sha = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", body = build(out, sha);
    const json = JSON.parse(readFileSync(join(out, "build.json"), "utf8")) as { commit: string; entry: string; files: Record<string, string> };
    assert.equal(json.commit, sha);
    assert.equal(json.entry, "index.html");
    assert.ok(Object.hasOwn(json.files, "index.html") && Object.hasOwn(json.files, "tools/play-stage/page.js") && Object.hasOwn(json.files, "tools/play-stage/board.js"));
    assert.match(readFileSync(join(out, "index.html"), "utf8"), /tools\/play-stage\/page\.js/);
    assert.equal(JSON.parse(body).commit, sha);
    const raw = readFileSync(new URL("../../fixtures/demo.tileproj/project.json", import.meta.url), "utf8");
    assert.equal(readFileSync(join(out, "fixtures/demo.tileproj/project.json.js"), "utf8"), `export default ${raw}`);
    const built = readFileSync(join(out, "tools/play-stage/project.js"), "utf8");
    assert.match(built, /fixtures\/demo\.tileproj\/project\.json\.js/);
    assert.equal(built.includes("type: \"json\""), false);
    assert.equal(built.includes("with {"), false);
  } finally { rmSync(out, { recursive: true, force: true }); }
});

test("fit keeps a 44 CSS px floor per cell; a 12-wide map at 360 CSS @3x does not shrink below it", () => {
  const dpr = 3, cssW = 360, devW = cssW * dpr, devH = 844 * dpr, { s } = fit(devW, devH, 12, 9, dpr);
  assert.ok((TILE * s) / dpr >= MIN_CELL_CSS, `cell CSS ${(TILE * s) / dpr} < ${MIN_CELL_CSS} (s=${s})`);
  const shrunk = Math.floor(Math.min(devW / (12 * TILE), devH / (9 * TILE)));
  assert.ok(shrunk * TILE / dpr < MIN_CELL_CSS);
  assert.ok(s >= Math.ceil((MIN_CELL_CSS * dpr) / TILE));
});

test("a foreign-side tap does not select; a walk beyond reach and a second tap on a non-reach tile do not walk and clear the preview", () => {
  const play = createPlay(), knight = idOf(U.knight, play), wolf = play.world.units.all().find((u) => u.unitId === U.wolf && u.alive);
  assert.ok(wolf !== undefined);
  const foreign = play.intend({ type: "SelectUnit", unitId: wolf.id });
  assert.ok("reject" in foreign && foreign.reject === "notOwn");
  assert.equal(play.selected, null);
  play.intend({ type: "SelectUnit", unitId: knight });
  const start = atOf(play, knight), far = { c: start.c + 3, r: start.r };
  const beyond = play.intend({ type: "TargetCell", at: far });
  assert.ok("reject" in beyond && beyond.reject === "notReachable");
  assert.equal(play.pending, null);
  assert.deepEqual(atOf(play, knight), start);
  const dest = play.reach[0];
  assert.ok(dest !== undefined);
  const preview = play.intend({ type: "TargetCell", at: dest });
  assert.ok("preview" in preview && play.pending !== null);
  const miss = play.intend({ type: "TargetCell", at: far });
  assert.ok("reject" in miss && miss.reject === "notReachable");
  assert.equal(play.pending, null);
  assert.deepEqual(atOf(play, knight), start);
  assert.notEqual(play.world.phases.battle, "moving");
});
`````

### `tests/tools/touch-play.test.ts` (edited)
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tests/tools/touch-play.test.ts b/tests/tools/touch-play.test.ts
index 72d0d62..556458c 100644
--- a/tests/tools/touch-play.test.ts
+++ b/tests/tools/touch-play.test.ts
@@ -1,14 +1,14 @@
 import assert from "node:assert/strict";
 import { test } from "node:test";
 import { fitView } from "../../src/runtime/render/index.ts";
-import { TILE } from "../../tools/play-stage/board.ts";
+import { recipeOf, TILE } from "../../tools/play-stage/board.ts";
 import { createCam } from "../../tools/play-stage/camera-touch.ts";
 import { createMatch } from "../../tools/play-stage/match.ts";
 import { createTouch, type TouchEv } from "../../tools/play-stage/touch.ts";
-const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => { const id = m.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id; if (id === undefined) throw new Error(unitId); return id; };
+const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => { const id = m.world.units.all().find((u) => u.alive && recipeOf(u.unitId).name.toLowerCase() === unitId)?.id; if (id === undefined) throw new Error(unitId); return id; };
 const hpOf = (m: ReturnType<typeof createMatch>, id: string): number => m.world.rules?.state().units.find((u) => u.id === id)?.hp ?? 0;
 const logs = (m: ReturnType<typeof createMatch>): number => m.world.log.entries().filter((e) => e.action.kind === "ability").length;
-const wolfTo = (m: ReturnType<typeof createMatch>, c: number, r: number): string => { const w = m.world.units.all().find((u) => u.unitId === "wolf" && u.alive); if (w === undefined) throw new Error("wolf"); if (!m.world.units.moveTo(w.id, { c, r }, "move").ok) throw new Error("wolf move"); return w.id; };
+const wolfTo = (m: ReturnType<typeof createMatch>, c: number, r: number): string => { const w = m.world.units.all().find((u) => u.alive && recipeOf(u.unitId).name.toLowerCase() === "wolf"); if (w === undefined) throw new Error("wolf"); if (!m.world.units.moveTo(w.id, { c, r }, "move").ok) throw new Error("wolf move"); return w.id; };
 function rig(moveMs = 40) {
   const m = createMatch(undefined, moveMs), cam = createCam(12), box = () => ({ devW: 1170, devH: 1992, kx: 3, ky: 3, cols: m.world.grid.cols, rows: m.world.grid.rows }), touch = createTouch({ match: m, cam, box });
   let t = 1000, n = 1;
`````

Full file at `57af7135`:

`````ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { fitView } from "../../src/runtime/render/index.ts";
import { recipeOf, TILE } from "../../tools/play-stage/board.ts";
import { createCam } from "../../tools/play-stage/camera-touch.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { createTouch, type TouchEv } from "../../tools/play-stage/touch.ts";
const idOf = (m: ReturnType<typeof createMatch>, unitId: string): string => { const id = m.world.units.all().find((u) => u.alive && recipeOf(u.unitId).name.toLowerCase() === unitId)?.id; if (id === undefined) throw new Error(unitId); return id; };
const hpOf = (m: ReturnType<typeof createMatch>, id: string): number => m.world.rules?.state().units.find((u) => u.id === id)?.hp ?? 0;
const logs = (m: ReturnType<typeof createMatch>): number => m.world.log.entries().filter((e) => e.action.kind === "ability").length;
const wolfTo = (m: ReturnType<typeof createMatch>, c: number, r: number): string => { const w = m.world.units.all().find((u) => u.alive && recipeOf(u.unitId).name.toLowerCase() === "wolf"); if (w === undefined) throw new Error("wolf"); if (!m.world.units.moveTo(w.id, { c, r }, "move").ok) throw new Error("wolf move"); return w.id; };
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
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tools/play-stage/board.ts b/tools/play-stage/board.ts
index 5debfad..c2ceed6 100644
--- a/tools/play-stage/board.ts
+++ b/tools/play-stage/board.ts
@@ -13,7 +13,8 @@ import type { DoorIntent } from "../../src/sim/types.ts";
 import { createWorld } from "../../src/sim/world.ts";
 import { xGo, type Event } from "../../src/state/index.ts";
 import type { Sq } from "../../src/types/core-types.ts";
-import { DEMO_LOAD, DEMO_TALK, RECIPES, TEAM, TILE, docsToInput, recipeOf, type PlayDocs } from "./load.ts";
+import { RECIPES, TEAM, TILE, docsToInput, recipeOf, type PlayDocs } from "./load.ts";
+import { bundledDocs } from "./project.ts";
 import { createPlayFx, fxPx } from "./fx.ts";
 import { dress, dressPx, unitAsset } from "./looks.ts";
 
@@ -58,9 +59,8 @@ export function spellRef(setup: { readonly abilities?: Readonly<Record<string, r
 }
 type Walk = { path: readonly Sq[]; from: Sq; t0: number; dur: number };
 export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
-  const talk = docs?.talk ?? DEMO_TALK;
-  const body = docs === undefined ? DEMO_LOAD : { ...docs, talk };
-  const world = createWorld(docsToInput(body).input);
+  const body = docs ?? bundledDocs(), talk = body.talk ?? {}, chosen = body.chosen ?? [], tiles = body.tiles ?? [];
+  const world = createWorld(docsToInput({ ...body, talk, chosen, tiles }).input);
   const go = (e: Event): void => { const from = world.phases.battle; if (from === undefined) throw new Error("play: phase"); world.phases = { ...world.phases, battle: xGo(from, e) }; };
   go({ type: "BATTLE_READY" }); go({ type: "DEPLOY_DONE" }); go({ type: "ROUND_BEGIN" }); go({ type: "SIDE_BEGIN" });
   const installed = installOne(STEP_PATTERN, {});
`````

Full file at `57af7135`:

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
import { RECIPES, TEAM, TILE, docsToInput, recipeOf, type PlayDocs } from "./load.ts";
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
      const units = world.units.all().map((u) => { const id = recipeOf(u.unitId).id; const asset = worn.get(id) ?? unitAsset(id); worn.set(id, asset); assets[id] = asset; return { id: u.id, sprite: id, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
      return { cols: world.grid.cols, rows: world.grid.rows, tileW: TILE, tileH: TILE, mapSeed: world.seed, assets, layers: looks.layers, units, objects: looks.objects, overlays, effects: fx.ingest(world.log, world.clock.stepMs, world.clock.now()), style: looks.style, waterTiles: looks.waterTiles, seeThroughCanopy: true as const };
    },
  };
}
`````

### `tools/play-stage/build.ts` (edited)
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tools/play-stage/build.ts b/tools/play-stage/build.ts
index c24acbf..0c3aaf7 100644
--- a/tools/play-stage/build.ts
+++ b/tools/play-stage/build.ts
@@ -10,11 +10,11 @@ export const ENTRY = "tools/play-stage/page.ts", PAGE = "tools/play-stage/index.
 export const toHtml = (html: string): string => html.replace(SCRIPT[0], SCRIPT[1]).replace("</title>", '</title><link rel="icon" href="data:,">');
 export const sha = (text: string): string => createHash("sha256").update(text).digest("hex");
 export const strip = (src: string): string => stripTypeScriptTypes(src, { mode: "strip" });
-export const ours = (text: string): boolean => { try { const v = JSON.parse(text) as Record<string, unknown>; return Object.keys(v).join() === "commit,node,entry,files" && typeof v["commit"] === "string" && /^[0-9a-f]{40}$/.test(v["commit"]) && typeof v["node"] === "string" && v["entry"] === "index.html" && typeof v["files"] === "object" && v["files"] !== null && !Array.isArray(v["files"]); } catch { return false; } };
-export const onlyBuild = (out: string, text: string): boolean => { const files = (JSON.parse(text) as { files: Record<string, unknown> }).files; return readdirSync(out, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).every((e) => { const name = relative(out, join(e.parentPath, e.name)).replaceAll("\\", "/"); return name === "build.json" || Object.hasOwn(files, name); }); };
+export const ours = (text: string): boolean => { const keys = [...text.matchAll(/\n {2}"([^"\\]+)":/g)].map((m) => m[1] ?? ""); return keys.join() === "commit,node,entry,files" && /\n {2}"commit": "[0-9a-f]{40}",\n/.test(text) && /\n {2}"node": "[^"\\]*",\n/.test(text) && /\n {2}"entry": "index.html",\n/.test(text) && /\n {2}"files": \{/.test(text); };
+export const onlyBuild = (out: string, text: string): boolean => { const files = new Set([...text.matchAll(/\n {4}"([^"\\]+)":/g)].map((m) => m[1] ?? "")); return readdirSync(out, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).every((e) => { const name = relative(out, join(e.parentPath, e.name)).replaceAll("\\", "/"); return name === "build.json" || files.has(name); }); };
 const RENAME = /(from\s+|import\s+)"(\.[^"]*)"/g;
 export function toJs(rel: string, src: string, dep: (rel: string) => void): string {
-  const out = strip(src).replace(RENAME, (all, pre: string, spec: string) => { const next = spec.replace(/\.ts$/, ".js"); const target = posix.normalize(posix.join(posix.dirname(rel), spec)).replace(/\.js$/, ".ts"); dep(target.endsWith(".ts") ? target : `${target}.ts`); return `${pre}"${next}"`; });
+  const out = strip(src).replace(RENAME, (all, pre: string, spec: string) => { const json = spec.endsWith(".json"), next = json ? `${spec}.js` : spec.replace(/\.ts$/, ".js"), base = posix.normalize(posix.join(posix.dirname(rel), spec)), file = json ? base : base.replace(/\.js$/, ".ts"); dep(json || file.endsWith(".ts") ? file : `${file}.ts`); return `${pre}"${next}"`; }).replace(/\s+with\s*\{\s*type:\s*"json"\s*\}/g, "");
   const bad = /(?:from\s+|import\s+)"([^."][^"]*)"/.exec(out); if (bad !== null) throw new Error(`build: non-relative import ${bad[1] ?? ""} in ${rel}`); return out;
 }
 export const refuse = (head: string, asked: string | undefined, dirty: string): string | null => dirty !== "" ? "build: the checkout has uncommitted changes; build.json must name a real commit" : asked !== undefined && asked !== head ? `build: ${asked} is not the checked-out commit ${head}; check it out first` : null;
@@ -32,7 +32,7 @@ export function build(out: string, commit: string, root: string = ROOT, dev = fa
   const bj = join(out, "build.json"), prior = existsSync(out) && readdirSync(out).length > 0, text = prior && existsSync(bj) ? readFileSync(bj, "utf8") : "";
   if (prior && (text === "" || !ours(text) || !onlyBuild(out, text))) throw new Error(text === "" ? `build: ${out} is not empty; give an empty folder` : `build: ${out}/build.json is not one this builder wrote (commit, node, entry, files) or the folder holds other files; give an empty folder`);
   const bag = new Map<string, string>(), seen = new Set<string>();
-  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); const raw = readFileSync(join(root, rel), "utf8"); bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, dev ? raw : release(raw, rel), walk)); };
+  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); if (rel.includes("editor")) throw new Error(`build: ${rel}`); const raw = readFileSync(join(root, rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, dev ? raw : release(raw, rel), walk)); };
   walk(ENTRY); bag.set("index.html", toHtml(readFileSync(join(root, PAGE), "utf8")));
   const files = Object.fromEntries([...bag].sort(([a], [b]) => (a < b ? -1 : 1))), sums = Object.fromEntries(Object.keys(files).map((k) => [k, sha(files[k] ?? "")]));
   const body = `${JSON.stringify({ commit, node: process.versions.node, entry: "index.html", files: sums }, null, 2)}\n`;
`````

Full file at `57af7135`:

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
  const walk = (rel: string): void => { if (seen.has(rel)) return; seen.add(rel); if (rel.includes("editor")) throw new Error(`build: ${rel}`); const raw = readFileSync(join(root, rel), "utf8"); if (rel.endsWith(".json")) bag.set(`${rel}.js`, `export default ${raw}`); else bag.set(rel.replace(/\.ts$/, ".js"), toJs(rel, dev ? raw : release(raw, rel), walk)); };
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
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tools/play-stage/load.ts b/tools/play-stage/load.ts
index 5e6b75c..8fe3eaa 100644
--- a/tools/play-stage/load.ts
+++ b/tools/play-stage/load.ts
@@ -1,12 +1,12 @@
 import type { BattleSetup } from "../../src/rules/battle/battle.ts";
 import type { SimInput } from "../../src/sim/types.ts";
+import type { CoreTileType } from "../../src/types/core-types.ts";
 
 export const TILE = 16;
-export const DEMO_SEED = 24301;
 export const TEAM = { player: 0x2f6fad, wolves: 0xb23b32, neutral: 0xc6a15a } as const;
 export type Recipe = { readonly id: string; readonly name: string; readonly team: keyof typeof TEAM };
 const fallback = (id: string): Recipe => ({ id: `starter:unknown-${id}`, name: "Unknown", team: "neutral" });
-export const RECIPES: Readonly<Record<string, Recipe>> = {
+export const RECIPES: Record<string, Recipe> = {
   knight: { id: "starter:hero-sword", name: "Knight", team: "player" },
   archer: { id: "starter:hero-staff", name: "Archer", team: "player" },
   cleric: { id: "starter:hero-cleric", name: "Cleric", team: "player" },
@@ -16,23 +16,10 @@ export const RECIPES: Readonly<Record<string, Recipe>> = {
   wolf: { id: "starter:enemy-wolf", name: "Wolf", team: "wolves" },
 };
 export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
-export const DEMO_TALK: Readonly<Record<string, string>> = { "talk-villager": "Hello, traveler." };
-export const DEMO_MANIFEST = { kind: "tile-project", formatVersion: 6, project: { id: "demo", rev: 1, catalogueRev: 1, settings: { wrapEdges: false }, stages: ["stage-demo"], rules: [] as string[], loadout: { roster: ["knight", "archer", "cleric"], size: 3, required: ["knight"] } } };
-export const DEMO_MAP = { kind: "map", formatVersion: 5, id: "map-6x9", rev: 1, cols: 6, rows: 9, logic: { terrain: "000000000000020000100000110000100000000022000000000000".split("").map(Number), palette: { "0": "floor", "1": "water", "2": "rock" }, edges: [] as const } };
-export const DEMO_STAGE = {
-  kind: "stage", formatVersion: 2, id: "stage-demo", rev: 1, mapRef: "map-6x9", seed: DEMO_SEED, setupIds: ["talk-villager"],
-  playerSpawns: [{ c: 0, r: 8, facing: "N" }, { c: 1, r: 8 }],
-  neutrals: [{ unitId: "crate", at: { c: 3, r: 4 } }, { unitId: "merchant", at: { c: 4, r: 4 }, facing: "W", side: "player" }, { unitId: "villager", at: { c: 5, r: 4 }, facing: "S" }],
-  sides: { enemyPool: "wolves" },
-  enemyPool: { mode: "fixed" as const, entries: [{ unitId: "wolf", at: { c: 2, r: 0 }, facing: "S" }, { unitId: "wolf", at: { c: 3, r: 0 } }] },
-  loadout: { roster: ["knight", "archer", "cleric"], size: 3, required: ["knight"] }, rules: [] as string[],
-};
-export const DEMO_SETUP: BattleSetup = { base: { hp: 9, atk: 1 }, stats: { knight: { hp: 9, atk: 1 }, archer: { hp: 6, atk: 2 }, wolf: { hp: 4, atk: 1 }, cleric: { hp: 7, atk: 1 }, villager: { hp: 4, atk: 0 }, crate: { hp: 3, atk: 0 }, merchant: { hp: 5, atk: 0 } }, hitClass: "basic", reach: { archer: 3 }, abilities: { archer: [{ reach: 3, damage: 2, effectRef: "line-shot" }] } };
 export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
-export const DEMO_LOOKS: Looks = { canopy: [[4, 1], [5, 1], [5, 2]], braziers: [[1, 2], [5, 6]] };
-export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks };
-export const DEMO_LOAD: PlayDocs & { readonly talk: Readonly<Record<string, string>> } = { manifest: DEMO_MANIFEST, map: DEMO_MAP, stage: DEMO_STAGE, rules: DEMO_SETUP, talk: DEMO_TALK, hostSeed: DEMO_SEED, looks: DEMO_LOOKS };
-const TILES = [{ id: "floor", open: true, push_can_enter: true }, { id: "water", open: false, push_can_enter: false }, { id: "rock", open: false, push_can_enter: false }] as const;
-export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>> }): { input: SimInput; talk: Readonly<Record<string, string>> } {
-  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: TILES, chosen: ["knight", "archer"], stageLimits: { picks: 0, waveUnits: 0 }, hostSeed: docs.hostSeed ?? DEMO_SEED, engineVersion: "0.0.0", projectHash: "demo" }, talk: docs.talk };
+export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>> };
+export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
+  const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
+  if (hostSeed === undefined) throw new Error("play: seed");
+  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: { picks: 0, waveUnits: 0 }, hostSeed, engineVersion: "0.0.0", projectHash: "demo" }, talk: docs.talk };
 }
`````

Full file at `57af7135`:

`````ts
import type { BattleSetup } from "../../src/rules/battle/battle.ts";
import type { SimInput } from "../../src/sim/types.ts";
import type { CoreTileType } from "../../src/types/core-types.ts";

export const TILE = 16;
export const TEAM = { player: 0x2f6fad, wolves: 0xb23b32, neutral: 0xc6a15a } as const;
export type Recipe = { readonly id: string; readonly name: string; readonly team: keyof typeof TEAM };
const fallback = (id: string): Recipe => ({ id: `starter:unknown-${id}`, name: "Unknown", team: "neutral" });
export const RECIPES: Record<string, Recipe> = {
  knight: { id: "starter:hero-sword", name: "Knight", team: "player" },
  archer: { id: "starter:hero-staff", name: "Archer", team: "player" },
  cleric: { id: "starter:hero-cleric", name: "Cleric", team: "player" },
  crate: { id: "starter:prop-crate", name: "Crate", team: "neutral" },
  merchant: { id: "starter:npc-merchant", name: "Merchant", team: "player" },
  villager: { id: "starter:npc-villager", name: "Villager", team: "neutral" },
  wolf: { id: "starter:enemy-wolf", name: "Wolf", team: "wolves" },
};
export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>> };
export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
  const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
  if (hostSeed === undefined) throw new Error("play: seed");
  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: { picks: 0, waveUnits: 0 }, hostSeed, engineVersion: "0.0.0", projectHash: "demo" }, talk: docs.talk };
}
`````

### `tools/play-stage/looks.ts` (edited)
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tools/play-stage/looks.ts b/tools/play-stage/looks.ts
index f5104a7..6e2b6cc 100644
--- a/tools/play-stage/looks.ts
+++ b/tools/play-stage/looks.ts
@@ -4,6 +4,8 @@ import type { FrameSource } from "../../src/runtime/render/world-motion.ts";
 import type { SceneAsset } from "../../src/runtime/scene/world-scene.ts";
 import { RECIPES, TEAM, TILE, type Looks } from "./load.ts";
 
+export const DEMO_LOOKS: Looks = { canopy: [[4, 1], [5, 1], [5, 2]], braziers: [[1, 2], [5, 6]] };
+
 export const WATER_RAMP = ["#1b3a5c", "#2a5d8a", "#4f8fc0", "#cfe8f5"] as const;
 export const FLAME_RAMP = ["#b8401c", "#e8762a", "#f6c04a"] as const;
 export const WASH = 0.5, LIGHT_RES = 4;
@@ -41,7 +43,7 @@ type Grid = { readonly cols: number; readonly rows: number; tileTypeAt(at: { rea
 const cycle = (name: string, n: number) => ({ cycle: { ramp: { name, steps: Array.from({ length: n }, (_, i) => i) } } });
 export function dress(grid: Grid, looks?: Looks) {
   const n = grid.cols * grid.rows, tiles: number[] = [], blocks = new Uint8Array(n);
-  for (let i = 0; i < n; i += 1) { const id = grid.tileTypeAt({ c: i % grid.cols, r: (i / grid.cols) | 0 }).id, tile = id === "water" ? 1 : id === "rock" ? 2 : 0; tiles.push(tile); if (tile === 2) blocks[i] = 1; }
+  for (let i = 0; i < n; i += 1) { const id = grid.tileTypeAt({ c: i % grid.cols, r: (i / grid.cols) | 0 }).id, tile = id === "water" ? 1 : id === "wall-block" ? 2 : 0; tiles.push(tile); if (tile === 2) blocks[i] = 1; }
   const canopy = looks === undefined ? undefined : Array.from({ length: n }, () => null as number | null);
   if (looks !== undefined && canopy !== undefined) for (const [c, r] of looks.canopy) canopy[r * grid.cols + c] = 0;
   const assets: Record<string, SceneAsset> = { "play:ground": { sheet: { id: "play:ground", columns: 3, fw: TILE, fh: TILE }, styled: true, tileProps: { "1": { motion: cycle("water", 3) } } } };
`````

Full file at `57af7135`:

`````ts
import type { Pixels } from "../../src/runtime/render/bakes.ts";
import type { FxLit, Light, LightPlan, LightWorld } from "../../src/runtime/render/light.ts";
import type { FrameSource } from "../../src/runtime/render/world-motion.ts";
import type { SceneAsset } from "../../src/runtime/scene/world-scene.ts";
import { RECIPES, TEAM, TILE, type Looks } from "./load.ts";

export const DEMO_LOOKS: Looks = { canopy: [[4, 1], [5, 1], [5, 2]], braziers: [[1, 2], [5, 6]] };

export const WATER_RAMP = ["#1b3a5c", "#2a5d8a", "#4f8fc0", "#cfe8f5"] as const;
export const FLAME_RAMP = ["#b8401c", "#e8762a", "#f6c04a"] as const;
export const WASH = 0.5, LIGHT_RES = 4;
export const animId = (id: string): string => `play:anim:${id}`;
const hex = (s: string): number => Number.parseInt(s.slice(1), 16);
const put = (data: Uint8ClampedArray, o: number, n: number): void => { data[o] = (n >>> 16) & 255; data[o + 1] = (n >>> 8) & 255; data[o + 2] = n & 255; data[o + 3] = 255; };
const strip = (frames: readonly number[]): Pixels => {
  const data = new Uint8ClampedArray(TILE * frames.length * TILE * 4);
  for (let f = 0; f < frames.length; f += 1) for (let y = 0; y < TILE; y += 1) for (let x = 0; x < TILE; x += 1) put(data, (y * TILE * frames.length + f * TILE + x) * 4, frames[f] ?? 0);
  return { w: TILE * frames.length, h: TILE, data };
};
export function frameOf(px: Pixels, f: number, fw: number, fh: number): Pixels {
  const data = new Uint8ClampedArray(fw * fh * 4);
  for (let y = 0; y < fh; y += 1) data.set(px.data.subarray((y * px.w + f * fw) * 4, (y * px.w + (f + 1) * fw) * 4), y * fw * 4);
  return { w: fw, h: fh, data };
}
export const sourceOf = (own: (id: string) => Pixels | undefined): FrameSource => (id, f, fw, fh) => { const px = own(id); return px === undefined ? undefined : frameOf(px, f, fw, fh); };
export const picturesOf = (own: (id: string) => Pixels | undefined, link: { pixels(id: string): Pixels | undefined }): ((id: string) => Pixels | undefined) => (id) => own(id) ?? link.pixels(id);
export const litPlan = (lighting: { plan(world: LightWorld, lights: readonly Light[], wash: number, dim: number, res: number, fx?: FxLit): LightPlan }, looks: { readonly light: LightWorld; readonly lights: readonly Light[] }, lit: FxLit): LightPlan => lighting.plan(looks.light, looks.lights, WASH, 0, LIGHT_RES, lit);
export const unitAsset = (id: string): SceneAsset => ({ sheet: { id: animId(id), columns: 2, fw: TILE, fh: TILE }, clips: [{ name: "idle", frames: [0, 1] }] });
const animPx = (rgb: number): Pixels => {
  const one = strip([rgb]), data = new Uint8ClampedArray(TILE * 2 * TILE * 4);
  for (let y = 0; y < TILE; y += 1) { data.set(one.data.subarray(y * TILE * 4, (y + 1) * TILE * 4), (y * TILE * 2) * 4); if (y > 0) data.set(one.data.subarray((y - 1) * TILE * 4, y * TILE * 4), (y * TILE * 2 + TILE) * 4); }
  return { w: TILE * 2, h: TILE, data };
};
export function dressPx(id: string): Pixels | undefined {
  if (id === "play:ground") return strip([0x243044, hex(WATER_RAMP[0]), 0x6b6256]);
  if (id === "play:canopy") return strip([0x1e6b3a]);
  if (id === "play:brazier") return strip([hex(FLAME_RAMP[0])]);
  if (!id.startsWith("play:anim:")) return undefined;
  const recipe = Object.values(RECIPES).find((row) => animId(row.id) === id);
  return recipe === undefined ? undefined : animPx(TEAM[recipe.team]);
}
type Grid = { readonly cols: number; readonly rows: number; tileTypeAt(at: { readonly c: number; readonly r: number }): { readonly id: string } };
const cycle = (name: string, n: number) => ({ cycle: { ramp: { name, steps: Array.from({ length: n }, (_, i) => i) } } });
export function dress(grid: Grid, looks?: Looks) {
  const n = grid.cols * grid.rows, tiles: number[] = [], blocks = new Uint8Array(n);
  for (let i = 0; i < n; i += 1) { const id = grid.tileTypeAt({ c: i % grid.cols, r: (i / grid.cols) | 0 }).id, tile = id === "water" ? 1 : id === "wall-block" ? 2 : 0; tiles.push(tile); if (tile === 2) blocks[i] = 1; }
  const canopy = looks === undefined ? undefined : Array.from({ length: n }, () => null as number | null);
  if (looks !== undefined && canopy !== undefined) for (const [c, r] of looks.canopy) canopy[r * grid.cols + c] = 0;
  const assets: Record<string, SceneAsset> = { "play:ground": { sheet: { id: "play:ground", columns: 3, fw: TILE, fh: TILE }, styled: true, tileProps: { "1": { motion: cycle("water", 3) } } } };
  if (canopy !== undefined) { assets["play:canopy"] = { sheet: { id: "play:canopy", columns: 1, fw: TILE, fh: TILE }, motion: { sway: { trunkFrom: 8 } } }; assets["play:brazier"] = { sheet: { id: "play:brazier", columns: 1, fw: TILE, fh: TILE }, styled: true, motion: cycle("fire", 3) }; }
  const braziers = looks?.braziers ?? [];
  return {
    assets,
    layers: [{ tileset: "play:ground", aboveUnits: false, visible: true, tiles }, ...(canopy === undefined ? [] : [{ tileset: "play:canopy", aboveUnits: true, visible: true, tiles: canopy }])],
    objects: braziers.map(([c, r]) => ({ assetId: "play:brazier", at: { c, r } })),
    style: { ramps: { water: [...WATER_RAMP], fire: [...FLAME_RAMP] } },
    waterTiles: { "play:ground": [1] as const },
    light: { cols: grid.cols, rows: grid.rows, tileW: TILE, tileH: TILE, blocks },
    lights: braziers.map(([c, r]) => ({ x: (c + 0.5) * TILE, y: (r + 0.5) * TILE, radius: 3 * TILE, colour: FLAME_RAMP[2] })),
  };
}
`````

### `tools/play-stage/match.ts` (edited)
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tools/play-stage/match.ts b/tools/play-stage/match.ts
index 46af828..a05b609 100644
--- a/tools/play-stage/match.ts
+++ b/tools/play-stage/match.ts
@@ -7,7 +7,8 @@ import type { DoorIntent } from "../../src/sim/types.ts";
 import type { Outcome } from "../../src/state/index.ts";
 import type { Sq } from "../../src/types/core-types.ts";
 import { createPlay, spellRef } from "./board.ts";
-import { DEMO_SETUP, DEMO_TALK, recipeOf, type PlayDocs } from "./load.ts";
+import { recipeOf, type PlayDocs } from "./load.ts";
+import { bundledDocs } from "./project.ts";
 
 /** Orthogonal reach of the demo line-shot when a row omits reach. Not an engine rule. */
 export const DEFAULT_SPELL_REACH = 3;
@@ -17,7 +18,7 @@ type Talk = { readonly name: string; readonly text: string };
 type Btn = { readonly show: boolean; readonly on: boolean };
 
 export function createMatch(docs?: PlayDocs, moveMs = 200) {
-  const play = createPlay(docs, moveMs, false), rules = docs?.rules ?? DEMO_SETUP, lines = docs?.talk ?? DEMO_TALK;
+  const body = docs ?? bundledDocs(), play = createPlay(body, moveMs, false), rules = body.rules, lines = body.talk ?? {}, names = body.names ?? {};
   const baseIntend = play.intend, baseSync = play.sync;
   const win = installOne(WIN_CONDITION, {});
   if (win.out === null) throw new Error("play: win-condition");
@@ -90,8 +91,8 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
       if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "interact") {
         const target = step.action.target, id = target !== null && target.pipe === "unit" ? target.unitId : undefined, u = id === undefined ? undefined : play.world.units.get(id);
         const key = u === undefined ? "" : `talk-${u.unitId}`;
-        const text = Object.hasOwn(lines, key) ? lines[key] ?? "" : Object.hasOwn(lines, "talk-villager") ? lines["talk-villager"] ?? "" : "";
-        talk = { name: u === undefined ? "" : recipeOf(u.unitId).name, text };
+        const text = key !== "" && Object.hasOwn(lines, key) ? lines[key] ?? "" : "";
+        talk = { name: u === undefined ? "" : names[u.unitId] ?? recipeOf(u.unitId).name, text };
         play.world.phases = { ...play.world.phases, battle: "actMenu" };
       } else if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "ability") settle();
       return step;
@@ -132,7 +133,7 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
       const btn = (show: boolean, hot: boolean): Btn => ({ show, on: hot });
       const spellOn = on && spellRef(rules, unit.unitId) !== undefined;
       return {
-        turn: side === "player" ? "YOUR TURN" : "ENEMY TURN", side, name: on ? recipeOf(unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
+        turn: side === "player" ? "YOUR TURN" : "ENEMY TURN", side, name: on ? names[unit.unitId] ?? recipeOf(unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
         actions: { basic: btn(menu, basic.length > 0), spell: btn(menu && spellOn, spells.length > 0), talk: btn(on && interact.length > 0, interact.length > 0), wait: btn(phase === "actMenu", phase === "actMenu"), end: btn(true, true) },
       };
     },
`````

Full file at `57af7135`:

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
import { recipeOf, type PlayDocs } from "./load.ts";
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
        talk = { name: u === undefined ? "" : names[u.unitId] ?? recipeOf(u.unitId).name, text };
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
        turn: side === "player" ? "YOUR TURN" : "ENEMY TURN", side, name: on ? names[unit.unitId] ?? recipeOf(unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
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
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tools/play-stage/page.ts b/tools/play-stage/page.ts
index 5dfee4c..426456c 100644
--- a/tools/play-stage/page.ts
+++ b/tools/play-stage/page.ts
@@ -6,12 +6,16 @@ import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./ca
 import { createHud } from "./hud.ts";
 import { litPlan, picturesOf, sourceOf } from "./looks.ts";
 import { createMatch } from "./match.ts";
+import { openBundled } from "./project.ts";
 import { createTouch } from "./touch.ts";
 import { DEV } from "./dev.ts"; // dev-only
 
 const canvas = document.querySelector("#board");
 if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
-const match = createMatch();
+const opened = openBundled();
+if (opened.docs === null) document.body.textContent = opened.error;
+else {
+const match = createMatch(opened.docs);
 const link = createSceneLink(sourceOf((id) => match.pixels(id))), lighting = createLighting(), pixels = picturesOf((id) => match.pixels(id), link);
 const cam: PlayCam = createCam(1);
 let seated = false;
@@ -52,3 +56,4 @@ place(); addEventListener("resize", () => { place(); seated = false; });
 seat();
 if (DEV) Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud, __fx: match.fx, __link: link }); // dev-only
 driver.start();
+}
`````

Full file at `57af7135`:

`````ts
import { createDriver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
import { createLighting, fitView } from "../../src/runtime/render/index.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { boardBox, fit, TILE } from "./board.ts";
import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
import { createHud } from "./hud.ts";
import { litPlan, picturesOf, sourceOf } from "./looks.ts";
import { createMatch } from "./match.ts";
import { openBundled } from "./project.ts";
import { createTouch } from "./touch.ts";
import { DEV } from "./dev.ts"; // dev-only

const canvas = document.querySelector("#board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
const opened = openBundled();
if (opened.docs === null) document.body.textContent = opened.error;
else {
const match = createMatch(opened.docs);
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
}
`````

### `tools/play-stage/project.ts` (new)

`````ts
import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
import { installOne } from "../../src/rules/behaviours/registry.ts";
import { TERRAIN } from "../../src/rules/behaviours/terrain.ts";
import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
import type { CoreTileType } from "../../src/types/core-types.ts";
import { RECIPES, type PlayDocs } from "./load.ts";
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
  for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) RECIPES[id] = hit; }
  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length);
  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names };
}
export function openProject(files: ProjectFiles): { docs: (PlayOut & { readonly looks: typeof DEMO_LOOKS }) | null; error: string } {
  const load = readProject(files), error = load.report.map((r) => [r.code, r.path, r.detail].filter((part) => part !== undefined).join(" ")).join("\n");
  if (!load.ok || load.readOnly || load.project === null) return { docs: null, error };
  return { docs: { ...playDocsOf(load.project), looks: DEMO_LOOKS }, error };
}
export const openBundled = (): ReturnType<typeof openProject> => openProject(bundledFiles());
export const bundledDocs = (): NonNullable<ReturnType<typeof openBundled>["docs"]> => { const got = openBundled(); if (got.docs === null) throw new Error(got.error === "" ? "play: project" : got.error); return got.docs; };
`````

### `tsconfig.json` (edited)
Diff `aa158fda..57af7135`:

`````diff
diff --git a/tsconfig.json b/tsconfig.json
index 4c184f7..2e13322 100644
--- a/tsconfig.json
+++ b/tsconfig.json
@@ -15,6 +15,7 @@
     "noEmit": true,
     "isolatedModules": true,
     "forceConsistentCasingInFileNames": true,
+    "resolveJsonModule": true,
     "skipLibCheck": false,
     "types": ["node"]
   },
`````

Full file at `57af7135`:

`````json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "verbatimModuleSyntax": true,
    "erasableSyntaxOnly": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": false,
    "types": ["node"]
  },
  "include": ["src/**/*.ts", "tests/**/*.ts", "tools/host-example/*.ts"],
  "exclude": ["tests/fixtures/**"]
}
`````

### `handoff/steps/tests/s0-play-input/touch-smoke.mjs` (refrozen after the merge in `9fc49890`)

The commit:

`````diff
commit 9fc498903ac615e75014f597e54af49fab547e27
Author: G-TileEngine <G-TileEngine@users.noreply.github.com>
Date:   Wed Nov 18 23:55:26 2026 +0000

    test(s0): touch smoke finds units by starter sprite id (post-1b refreeze, QA OK)

diff --git a/handoff/steps/tests/s0-play-input/touch-smoke.mjs b/handoff/steps/tests/s0-play-input/touch-smoke.mjs
index 101f87e..1f50845 100644
--- a/handoff/steps/tests/s0-play-input/touch-smoke.mjs
+++ b/handoff/steps/tests/s0-play-input/touch-smoke.mjs
@@ -29,7 +29,7 @@ try {
     await page.waitForFunction(() => window.__play !== undefined && window.__hud !== undefined && window.__driver.stats.draws > 0, null, { timeout: 15000 });
     await page.evaluate(() => { const c = document.querySelector("#board"); window.__up = null; c.addEventListener("pointerup", (e) => { const cam = window.__cam, b = c.getBoundingClientRect(); window.__up = { trust: e.isTrusted, x: e.offsetX, y: e.offsetY, cam: { w: c.width, h: c.height, rw: b.width, rh: b.height, x: cam.x, y: cam.y, s: cam.s } }; }, true); window.__hud.hideBanner(); window.__play.followId = null; const s = Math.max(1, Math.floor(Math.min(c.width / 96, c.height / 144))); Object.assign(window.__cam, { x: 0, y: 0, follow: null, s }); });
     await page.waitForTimeout(80);
-    const knight = await page.evaluate(() => window.__play.world.units.all().find((u) => u.unitId === "knight").id);
+    const knight = await page.evaluate(() => window.__play.scene().units.find((u) => u.sprite === "starter:hero-sword").id);
     const turns0 = await page.evaluate(() => window.__play.view().turns);
     const step = async (name, ms, fn) => { try { await Promise.race([fn(), new Promise((_, no) => setTimeout(() => no(new Error("timeout")), ms))]); check(`${name} @${width}`, true, "ok"); } catch (e) { check(`${name} @${width}`, false, String(e && e.message ? e.message : e)); } };
     await step("1 select", 5000, async () => { const at = await page.evaluate((id) => window.__play.world.units.get(id).at, knight); await tapCell(page, at.c, at.r); const sel = await page.evaluate(() => window.__play.selected); if (sel !== knight) throw new Error(`selected ${sel}`); });
@@ -41,7 +41,7 @@ try {
       const moved = await page.evaluate((p) => { const u = window.__play.world.units.get(p.id); return u.at.c !== p.c || u.at.r !== p.r; }, { id: knight, c: from.c, r: from.r }); if (!moved) throw new Error("still at start");
     });
     await step("3 attack", 5000, async () => {
-      const placed = await page.evaluate((id) => { const play = window.__play, me = play.world.units.get(id), occ = (c, r) => play.world.units.all().some((u) => u.alive && u.at.c === c && u.at.r === r); const spots = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dc, dr]) => ({ c: me.at.c + dc, r: me.at.r + dr })).filter((p) => play.world.grid.inBounds(p) && play.world.grid.isOpen(p) && !occ(p.c, p.r)); const wolf = play.world.units.all().find((u) => u.unitId === "wolf" && u.alive); if (spots[0] === undefined || wolf === undefined || !play.world.units.moveTo(wolf.id, spots[0], "move").ok) return null; return { id: wolf.id, c: spots[0].c, r: spots[0].r, before: play.world.log.entries().filter((e) => e.action.kind === "ability").length }; }, knight);
+      const placed = await page.evaluate((id) => { const play = window.__play, me = play.world.units.get(id), occ = (c, r) => play.world.units.all().some((u) => u.alive && u.at.c === c && u.at.r === r); const spots = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dc, dr]) => ({ c: me.at.c + dc, r: me.at.r + dr })).filter((p) => play.world.grid.inBounds(p) && play.world.grid.isOpen(p) && !occ(p.c, p.r)); const wolf = play.scene().units.find((u) => u.sprite === "starter:enemy-wolf" && u.alive); if (spots[0] === undefined || wolf === undefined || !play.world.units.moveTo(wolf.id, spots[0], "move").ok) return null; return { id: wolf.id, c: spots[0].c, r: spots[0].r, before: play.world.log.entries().filter((e) => e.action.kind === "ability").length }; }, knight);
       if (placed === null) throw new Error("no neighbour");
       const btn = await page.locator("#attack").boundingBox(); if (btn === null) throw new Error("no attack");
       await page.touchscreen.tap(btn.x + btn.width / 2, btn.y + btn.height / 2); await page.waitForTimeout(40); await tapCell(page, placed.c, placed.r);
@@ -61,7 +61,7 @@ try {
         let ar = null, vi = null;
         for (let r = 0; r < play.world.grid.rows && ar === null; r += 1) for (let col = 0; col < play.world.grid.cols; col += 1) { if (!on(col, r) || !open(col, r)) continue; const nb = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dc, dr]) => ({ c: col + dc, r: r + dr })).find((p) => on(p.c, p.r) && open(p.c, p.r)); if (nb !== undefined) { ar = { c: col, r }; vi = nb; break; } }
         if (ar === null || vi === null) return null;
-        const archer = play.world.units.all().find((u) => u.unitId === "archer" && u.alive), villager = play.world.units.all().find((u) => u.unitId === "villager" && u.alive);
+        const archer = play.scene().units.find((u) => u.sprite === "starter:hero-staff" && u.alive), villager = play.scene().units.find((u) => u.sprite === "starter:npc-villager" && u.alive);
         if (archer === undefined || villager === undefined || !play.world.units.moveTo(archer.id, ar, "move").ok || !play.world.units.moveTo(villager.id, vi, "move").ok) return null;
         return { archer: archer.id, ac: ar.c, ar: ar.r, vc: vi.c, vr: vi.r };
       });
`````

Full file at `9fc49890` (sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941`):

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
    const knight = await page.evaluate(() => window.__play.scene().units.find((u) => u.sprite === "starter:hero-sword").id);
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
      const placed = await page.evaluate((id) => { const play = window.__play, me = play.world.units.get(id), occ = (c, r) => play.world.units.all().some((u) => u.alive && u.at.c === c && u.at.r === r); const spots = [[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dc, dr]) => ({ c: me.at.c + dc, r: me.at.r + dr })).filter((p) => play.world.grid.inBounds(p) && play.world.grid.isOpen(p) && !occ(p.c, p.r)); const wolf = play.scene().units.find((u) => u.sprite === "starter:enemy-wolf" && u.alive); if (spots[0] === undefined || wolf === undefined || !play.world.units.moveTo(wolf.id, spots[0], "move").ok) return null; return { id: wolf.id, c: spots[0].c, r: spots[0].r, before: play.world.log.entries().filter((e) => e.action.kind === "ability").length }; }, knight);
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
        const archer = play.scene().units.find((u) => u.sprite === "starter:hero-staff" && u.alive), villager = play.scene().units.find((u) => u.sprite === "starter:npc-villager" && u.alive);
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
