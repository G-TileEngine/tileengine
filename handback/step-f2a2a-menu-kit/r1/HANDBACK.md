# Hand-back step-f2a2a-menu-kit r1
Step file: docs/maker/steps/step-f2a2a-menu-kit.md (r1, sha256 c8d29a8317f454a974eff38f57105bfc948735bbbfb42ddd7e3ae62f586be8e2)
Base commit: fa401c886f494265460d1fd313fb8d22264369b4     Head commit: 8458307cfb59e95f6bd261d295fbd738f3f5ad8a     Tree: 663551775f1a48beab73be237f248404e457bfb4     Branch: step/step-f2a2a-menu-kit-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	tests/tools/f2a2-menu-kit.test.ts
M	tools/maker/app.css
A	tools/maker/game-menu.ts
M	tools/maker/icons.ts

## Green
npm test: 1203/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
Code head: 8458307cfb59e95f6bd261d295fbd738f3f5ad8a
Code tree: 663551775f1a48beab73be237f248404e457bfb4
Tip: this hand-back commit. A commit cannot store its own sha; the hand-back message quotes the full tip sha. Check: `git rev-parse HEAD^` is the code head above.
`npm ci && npm run green` exited 0 (1203 pass, 0 fail; floor 1198 + 5 = 1203).
tools tsc (`npx tsc --noEmit -p tools/tsconfig.json`): only the 3 base errors, exit 2 from tsc itself:
- tools/effect-designer/page.ts(101,28) TS18047
- tools/maker/home.ts(93,221) TS7053
- tools/maker/home.ts(93,266) TS7053

## Plants
handoff/steps/tests/step-f2a2a-menu-kit/plants-f2a2a.py on the code head: 16/16 caught. The tree was clean afterwards (only this hand-back folder was untracked at the time of the second run; the first 16/16 was on the same bytes before the code commit).

## Smoke
No smoke file changed. All 25 smokes PASS solo at 390 and 360, first pass, no flake re-run. After each smoke, tracked handback files were restored (`git checkout -- handback` and `git clean -fd -- handback`) so s6c's rewrite of the checkpoint project did not fail later smokes. s11b on 8820 (the port was free).

| Smoke | Ok lines |
|---|---|
| s0 | 14 |
| s3 | 18 |
| s4a | 16 |
| s4b | 16 |
| s4c | 16 |
| s5a | 16 |
| s5b | 16 |
| s5c | 16 |
| s6a | 18 |
| s6b | 16 |
| s6c | 18 |
| s6d | 14 |
| s7 | 20 |
| s8 | 16 |
| s9 | 12 |
| s8c | 8 |
| s9b | 14 |
| s9c | 6 |
| s10b | 8 |
| s10c | 8 |
| s10d | 8 |
| s11a | 6 |
| s11a2 | 6 |
| s11b | 6 |
| s11c1 | 6 |

## Rule 8 scan
The new module has one control header: `game-menu.ts` L12 `if (found === undefined) {`, throw on L13, close on L14. No `for` or `while`. No chained headers. The map callback (L34–L39) puts each `const` and the `return` on its own line. Ternaries (`esc`, `count`, `save`, `cont`, `tail`, `lead`, `more`) are one statement each. The six icon lines are type-literal members, not statements. The CSS append is fourteen rules, no statements. No existing line gained a new statement.

## Size
`git diff --numstat fa401c886f494265460d1fd313fb8d22264369b4 -- . ':!handback/**' ':!package-lock.json'` is 129 additions, 0 deletions, 4 files.

| File | + | − | Counted | Cap |
|---|---|---|---|---|
| tests/tools/f2a2-menu-kit.test.ts | 65 | 0 | 65 | 65 |
| tools/maker/app.css | 14 | 0 | 14 | 14 |
| tools/maker/game-menu.ts | 44 | 0 | 44 | 44 |
| tools/maker/icons.ts | 6 | 0 | 6 | 6 |
| Total | 129 | 0 | 129 | 129 |

Under the 400 gate. Nothing was wrapped or joined to fit.

## Shipped tests (sha256, unchanged)
22bb52ea63b29cd37fb10b3a0a31e949c3c66478684200541b1d0c1e72514077  tests/tools/f2a2-menu-kit.test.ts

## Helpers & self-review (required)
- Helper 9a09b23b-c4b2-41f7-b8c1-718d4ad4ccf7: reviewed the uncommitted diff against the three guide fences, the kit test sha, Rule 8, the single eyebrow, imports, and the 16 plant strings → OK. Four files, +129/−0, byte-identical to the fences, test sha matches, kit `sha256sum -c` OK, each plant old-string once, only the new test imports `game-menu.ts`.
- Helper 54d651be-1bc7-4eec-8a54-09733b98ff53: cross-checked `game-menu.ts` output against the shipped test pins (six drawings, row order, chevrons, eyebrow, grabber, Law 12 throw) and scanned Rule 8 → OK.
- Script /tmp/f2a2a-smokes.sh: all 25 smokes solo, restore handback after each. SMOKES_ALL_PASS. Ok counts in § Smoke. s11b on 8820.
- Kit script handoff/steps/tests/step-f2a2a-menu-kit/plants-f2a2a.py: 16/16 caught, twice (before the code commit and on the code head).
- One-off command files besides that smoke script: none. The guide fences were copied with an inline shell python, not a saved file.
- Self-review: Acceptance done. `npm ci && npm run green` 1203/0. Tools tsc only the 3 base errors. Shipped test sha unchanged. Plants 16/16, tree clean. No smoke file edited; all 25 PASS with main's ok counts. Rule 8 scan clean (section above). Counted lines 129, each file on its cap. Nothing outside the Files list. QA checklist: G1 done (shipped sha, plants 16/16); G2 done (root typecheck exit 0; tools tsc still only the 3 base errors); G3 done (src untouched); G4 done (quoted signatures unchanged); G5 done (do-not-touch paths absent from the diff); G6 done (only the 4 Files-list paths plus this handback); G7 done (129, under 400, each cap held); G8 done (lint, deps, check:state, check:law exit 0); G9 done (decisions below); G10 done.

## Decisions & deviations (5–10 lines)
- No deviation from the quoted edits. The six icon lines, the fourteen CSS lines and `game-menu.ts` are the guide fences. The shipped test is the kit file, byte for byte.
- Base is fa401c886f494265460d1fd313fb8d22264369b4, not the guide's ce848f57. CoS said the move is docs and handoff only and the trial patch applies. Counted lines are against this base (129). The guide's count command names ce848f57; from this branch that range also contains CoS's guide, kit and QA review, which this step did not edit. Base tree is 4097b30d16fcb8fb03bf8e63407345f3a07ab153. Code tree is 663551775f1a48beab73be237f248404e457bfb4.
- Nothing imports `game-menu.ts` except the shipped test, so no screen, handler, saved data, format, play or export change. The module holds one `MenuView`, not a cache that grows.
- `menuSet` throws `maker: no menu view ${next}` on any view outside the six names. `sectionSheet` stays typed as `MenuView`, as quoted. QA's note that it also accepts "none", "menu" and "switch" is left for a later touch.
- Smokes were not edited. 25 solo, first pass, no re-run of s3 step 9 or s8c steps 1–3. s11b on 8820. F1 plants P20 and P24 stay dead, as the guide says is expected.
- No new dependency. No other eyebrow text. No header converted.

## Next step (optional proposal)
- F2a2b (land on the map) wires this module, deletes the project page, and moves Budgets and Build game into the menu. It should branch from this step's merge.
