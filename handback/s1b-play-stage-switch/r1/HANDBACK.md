# Hand-back s1b-play-stage-switch r1
Step file: docs/maker/steps/step-01-project-format.md §1b. Data: docs/maker/data/s1-project-load.md §9 (h). QA carry: docs/qa/step-s1a-handback-review.md (empty the P2 allowlist).
Base: aa158fda573aac196965139700e4e9b5fd1bebd5  Head: 8095ce71e84982a37d36a71239d36274adb1599b  Tree: 5f94c42349b744a384cc2ca22ea86133554a022b  Branch: step/step-s1b-play-stage-switch-r1-chatA  PR: opened by Chief Of Staff from the branch
Node: v22.23.3  npm: 10.9.9  rg: ripgrep 14.1.1 (rev 4649aa9700)

## Green
npm test: 1036/0/0/0  typecheck: 0  lint: 0  deps: 0  check:state: 0  check:law: 0  npm run green: 0. Floor 1034. N = 2 (the parity golden, and the rejected project). fail 0.
Code commit shortstat against the base, excluding fixtures and templates: 199 insertions + 75 deletions = 274. `git diff --name-only <base>..HEAD -- fixtures data/templates | rg -v '\.json$'` is empty. No fixture or template file changed. The demo fixture loads through `readProject` in `demoDocs()` and in `openBundled()` / the rejected-project test.

## Plants
P1. Appending `function plantP1(){ try { throw new Error("x"); } catch {} }` to `tools/play-stage/project.ts` made `tests/project/load/law12.test.ts` exit 1 (empty catch under `tools/play-stage`). Restored.
P2. The allowlist is `[]`. (1) `export const planted = (t: string): unknown => JSON.parse(t);` in `build.ts` made `one-parser.test.ts` exit 1. Restored. (2) `json.kind === "map"` in `project.ts` exit 1. Restored. (3) `kind === "tile-project"` exit 1. Restored. (4) `action.kind === "move"` and `action?.kind === "talk"` did not fail (exit 0). Clean P2 then exited 0. `migrate.ts` stays the only skip.
P3. (1) Treating formatVersion 7 as current in `migrate.ts` (`ver !== 7` so no `formatNewer` row) made `version-reject.test.ts` exit 1. Restored. (2) `openProject` returning the bundled docs on a failed load made the rejected-project test exit 1 (`docs` was not null). Restored. `cmp` against the pre-plant bytes matched for `project.ts`, `build.ts` and `migrate.ts`.

## WebView at minSdk 26
`tools/play-stage/build.ts` follows a relative `.json` import, strips `with { type: "json" }`, and writes `<file>.json.js` as `export default ` plus the raw file text. No `JSON.parse` and no shape read. The APK already loads `page.js` as a classic ES module (`script type=module`) on Capacitor's https scheme (`androidScheme: https`, minSdk 26). JSON module import attributes are not guaranteed on that WebView. `export default` of the JSON text is an ordinary module, the same kind as `page.js`. Nothing is fetched. No shipped path contains `editor`.

## Decisions
- The branch stays on `aa158fd`. `origin/main` later moved by two docs-only commits. The 400-line budget is against the named base, so those docs are not in this run.
- `project.ts` is 64 lines (cap 65). The sixteen static `with { type: "json" }` imports Q2 requires are packed onto four lines.
- The load/board/match/looks/build/tsconfig group is 25+/34− = 59 against a planned 45. Deleting the `DEMO_*` block is most of the deletions. `fx.ts` is unchanged.
- The five play-stage test edits are 49+/34− = 83 against a planned 45. Each slug call site is one deletion and one insertion, plus the required hp/atk, chosen, water/wall-block and `.json.js` asserts.
- Outside the table, because the step requires them: `page.ts` (show the report, start no match, never throw), `one-parser.test.ts` (empty allowlist), `tsconfig.json` (`resolveJsonModule`, `skipLibCheck` kept), and `touch-play.test.ts`. S0 still calls `createMatch()` with no docs. Unit ids are now fixture ULIDs, so those lookups resolve `recipeOf(unitId).name` after `playDocsOf` aliases the starter recipe onto the id.
- Parity uses `sha256(JSON.stringify(value))`. `log.toJSON()` returns a string, so the golden log hash is the hash of that quoted string. The bot is `botAbilityPriority` with step reach omitted (engine default 2), which is how the 1a golden was captured. `projectHash` stays `"demo"`. Fixture unit ids are rewritten to slugs before hashing.
- `docsToInput` takes the stage seed when `hostSeed` is omitted and throws `play: seed` if both are missing. It does not invent 24301.
- Army `unit_hp` / `unit_atk` are the catalogue defaults on the unit-roster setup (9 and 1). A missing army throws. Omitted unit stats use that army value. `basic-attack.damage` is never read. A missing army or line-shot number throws rather than guessing.

## Helpers & self-review
A review helper was started and did not finish; the checks below were run in this workspace.
Self-review: green is 1036/0. Parity equals the 1a golden (outcome win, snapshot `dc959c31…`, log `3278b95a…`, bus `30f1d900…`). A formatVersion 7 project shows `formatNewer` on `project.json` and `docs` stays null. `createMatch()` with no docs passes the S0 touch tests. The villager `talk-villager` fallback is gone. The only `DEMO_*` left under `tools/play-stage` is `DEMO_LOOKS` in `looks.ts`. `ours` has no `catch` and no `JSON.parse`. A second build of the same folder accepts `ours` / `onlyBuild`. `project.json.js` is `export default ` plus the raw file. The built `project.js` imports `.json.js` and has no import attribute. Plants were restored. No new framework. ui-shell was not copied. `handoff/steps/tests/` was not touched.
