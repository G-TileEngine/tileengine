# QA handback review: s1a-project-format r1

QA & Build Guard, 2026-11-18, Europe/London. Read-only. Fresh worktree `/tmp/q/s1a-qa` at tip `5cf1a0fef4a4fa9d955633498ded887600e9abc3` (tree `910dc3eb9d449a76eb281a070c6efea77c49a10e`). Base and merge-base are main `f137ca266400f68eaf93f1d49eb5c5986831ee96` (main is exactly this commit). Over `8a737c5f`, `f137ca26` only lands Step 1 FINAL r6: the status line, and the floor `1014 + N` → `1023 + N`. Spec on that base: `docs/maker/steps/step-01-project-format.md` §1a, sha256 `0e7d7618478cb0a111960d890318ab79168c92980af837cedbab87102cfd2be1` (the pushed form of the r6 text QA OK'd as `b9a2b54a`), and `docs/maker/data/s1-project-load.md` sha256 `f4e459c35de913c98a37dd1270dc83713699e9a1dba1dcc4fac91d02c9bf670b`. CoS report at `/workspace/share/s1a-verify/report.md` was read, then rechecked here. Prior reviews not edited. No GitHub writes and no edits to other bots' files.

## Verdict: NOT OK

One must-fix: the P2 allowlist is keyed by file plus line number only, not by exact line text. A different `JSON.parse` on an allowlisted line stays green. Fix the keying in `tests/project/load/one-parser.test.ts`, then this is OK to open the PR, with the named 1b carry below. No other must-fixes.

## Checks

| Check | Result |
|---|---|
| Tip, tree, merge-base | Match the claimed SHAs. Three linear commits, all `G-TileEngine <G-TileEngine@users.noreply.github.com>` as author and committer. Last commit is only `handback/s1a-project-format/r1/HANDBACK.md`. |
| `npm run green` | Exit 0. **1034 pass / 0 fail / 0 skip**. `tsc`, lint, deps, `check:state`, `check:law` all exit 0. Floor 1023 + N=11 (7 reader tests + P1×2 + P2 + P3). Node v24.22.1 (HANDBACK used v22.23.3); both green. |
| Line caps | Spec shortstat `git diff --shortstat <base>..<tip> -- . ':!fixtures/**' ':!data/templates/**'`: 13 files, 379 insertions / 8 deletions = **387** ≤ 400. That command includes `handback/` (23 insertions). Excluding `handback/` as well: 356 + 8 = **364**. Per-file caps all pass: types 30/30, read-project 110/115, migrate 40/40, index 3/5, unit.ts 11/15, slice-of 19/25, read-project.test.ts 83/115, unit-setup 6/10. Plant tests (27+17+17) are the only extras; they are required by Done-when. No play-stage, package, tsconfig, eslint or dep-cruiser changes. |
| Q9 | `git diff --name-only <base>..<tip> -- fixtures data/templates \| rg -v '\.json$'` is empty. 16 paths, all `fixtures/demo.tileproj/**/*.json`. No `data/templates/**` changes. The fixture is loaded through `readProject` in: `fixture clean, and slice-of is byte-equal to catalogue/slice.json`, `(b) v4 tile-project and map upgrade to the v6/v5 store`, `(c) v7 is refused read-only and does not throw`, `(d) H3 missing mapRef is a hard brokenRef and the project stays`, `(e) H5 terrain of length 53 is a hard terrainLength`, `(f) H2 archer stats.unit_hp.value string is a hard invalidValue`, `(g) unknown keys and an extra file are kept`. The clean-fixture test is the named `ok` / report `[]` case; (b)–(g) load the same folder and then mutate a copy. |
| Plants P1–P3 | Each is green on the clean tree. Bad code put back in this worktree, then restored (`git diff` empty afterwards): `note()` returning without a row fails P1 test 1 (`law12.test.ts:13`); `try { void 0; } catch {}` appended to `src/project/load/index.ts` fails P1 test 2 (`law12.test.ts:26`); `void JSON.parse("{}")` appended to `read-project.ts` fails P2 (`one-parser.test.ts:15`); the same appended to `tools/play-stage/build.ts` (new line 52, not in the allowlist) fails P2 (`one-parser.test.ts:16`, actual `['build.ts:52']`); `versionRows()` made to `return []` fails P3 (`version-reject.test.ts:13`). |
| Law 12 / scope | No empty `catch` and no silent `?? {}` document defaults in the diff. The `catch` around `migrateProject` returns a hard `invalidValue` row. No `DEV`, `window.__*` or `ui-shell` imports. `src/project/` does not import `tools/`. No demo names or `DEMO_*` in `src/`. `tools/play-stage/` tree is identical to the base (`010d1a21`). Q3 `unit.ts` / `unit-setup.test.ts` edits are present. Scope matches §1a. |
| Parity golden | Recaptured here from unchanged `DEMO_LOAD` (`docsToInput` → `createWorld` + `runMatch`, seed/hostSeed 24301, `projectHash` `"demo"`, bot vs bot, sides `player`/`wolves`). Byte-equal to `tests/tools/golden/demo-parity.json`: outcome `win`, snapshot `dc959c318ea82b78e37e6cfbefcc2904be17b9640ea95982d9a92d8968b75177`, log `3278b95a57fe08751cec91ecc220ed99d8ef75053148c52a5a7358e7f33a650b`, bus `30f1d9006882e8ba9edc55d2a47cdb0dc8dbd6202dd5cfab2ba236862f90fd80`. |
| HANDBACK | §§ Green / Plants / Helpers & self-review are present and match these counts (1034/0, N=11, caps, golden hashes). It already records the play-stage allowlist and that 1b removes the pre-existing `build.ts` parses. Header head/tree SHAs are the pre-HANDBACK commit, which is expected. “PR: opened by Chief Of Staff” is paperwork; no PR was opened. |

## Allowlist finding (must-fix)

`tests/project/load/one-parser.test.ts` allowlists 12 pre-existing play-stage hits as file plus line number only:

```
const PLAY = ["board.ts:109", "build.ts:13", "build.ts:14", "load.ts:20", "load.ts:21", "load.ts:23", "match.ts:63", "match.ts:90", "match.ts:96", "match.ts:102", "match.ts:105", "match.ts:108"];
// hits() pushes `${name}:${i + 1}` and filters with PLAY.includes(hit)
```

It does not pin the exact line text. Those twelve lines on the base are the existing `JSON.parse` of `build.json` metadata in `ours()` / `onlyBuild()`, `formatVersion` / `kind` on the still-present `DEMO_*` constants, and `action.kind ===` / similar in `match.ts` / `board.ts` — not project-document parsing. A **new** parse still fails (verified: `build.ts:52` and a parse in `read-project.ts` both go red).

§1a scope forbids play-stage edits, so 1a cannot clear those lines. Quote, L157: “1a — reader, about 355 lines (no play-stage change)”. Done-when P2 (L236) says “No exemptions: `tools/play-stage/build.ts` emits raw JSON text and never parses it, so it passes this scan too.” That emit, and “P2 gets no exemptions”, sit in the 1b file table (L193). The 1b section does not use the word “allowlist”; emptying it is implied by that “no exemptions” once `build.ts` emits raw text.

The allowlist would have been acceptable for 1a only if it were keyed by exact line text. It is not.

**Repro (must-fix):** in a scratch copy, replace the body of `tools/play-stage/build.ts` line 13 with a different parse, e.g. `export const ours = (text: string): boolean => { void JSON.parse(text); return true; };`. `node --test tests/project/load/one-parser.test.ts` still exits 0. Restore the file. The same test must fail on that swap once the allowlist is keyed by exact line text (for example a list of `${name}:${exactLine}` or file plus the full line, not the number alone). A new parse on any other play-stage or `src/project/load` line (except `migrate.ts`) must still fail.

**1b carry (named):** 1b Done-when: the allowlist is empty and `build.ts` emits raw text (`export default ` plus the file text, no `JSON.parse`). A naive `kind ===` scan will still hit `action.kind ===` in `match.ts` unless 1b tightens the regex or those lines also go. The WebView `.json.js` load at minSdk 26 is a 1b item, because the `build.ts` change is in 1b.

## Flags (not must-fixes)

- Done-when also says `check-law.sh` flags empty `catch` under `src/project/` and `tools/play-stage/`. The current script has no empty-catch gate and still prints `check:law OK (src)` with a planted `catch {}`. The P1 plant owns that scan, and `check-law.sh` is outside the 1a file table. Do not treat `check-law.sh` as an empty-catch scanner unless it is extended later.

Evidence: `/tmp/q/s1a-qa` (clean after plants), `/tmp/q/s1a-parity.mjs`, `/tmp/q/plant-*.log`.
