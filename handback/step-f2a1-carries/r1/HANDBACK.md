# Hand-back step-f2a1-carries r1
Step file: docs/maker/steps/step-f2a1-carries.md (r1, sha256 3a0fbc4e628bf85136669fe84c517086600cbab52ed4bc381c3b048894ba155f)
Base commit: 77a64648db3595d3205ee47b4bf53fe4c89734a7     Head commit: 10a0ca8aad7acb1ad63319572dd9d7e274ddcff3     Tree: 81ddf7ee8206a0f3e6ec43d8ed474abfaade102a     Branch: step/step-f2a1-carries-r1-chatA     PR: opened by Chief Of Staff from the branch
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	handoff/steps/tests/s6a-win-rules/smoke.mjs
M	handoff/steps/tests/s6c-checkpoint/smoke.mjs
M	tests/project/budgets-11c1.test.ts
M	tests/tools/f1-look-kit.test.ts
A	tests/tools/f2a1-carries.test.ts
M	tools/maker/app.css
M	tools/maker/budgets.ts
M	tools/maker/icons.ts
M	tools/maker/levels.ts
M	tools/maker/stage.ts
M	tools/maker/units.ts
M	tools/maker/widgets.ts

## Green
npm test: 1198/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
Code head: 10a0ca8aad7acb1ad63319572dd9d7e274ddcff3
Code tree: 81ddf7ee8206a0f3e6ec43d8ed474abfaade102a
Tip: this hand-back commit. A commit cannot store its own sha; the hand-back message quotes the full tip sha. Check: `git rev-parse HEAD^` is the code head above.
`npm ci && npm run green` exited 0 (1198 pass, 0 fail; floor 1194 + 4 = 1198).
tools tsc (`npx tsc --noEmit -p tools/tsconfig.json`): only the 3 base errors, exit 2 from tsc itself:
- tools/effect-designer/page.ts(101,28) TS18047
- tools/maker/home.ts(93,221) TS7053
- tools/maker/home.ts(93,266) TS7053

## Plants
handoff/steps/tests/step-f2a1-carries/plants-f2a1.py on the clean code head: 12/12 caught. The tree was clean afterwards (only this untracked hand-back folder remained). Kit `sha256sum -c SHA256SUMS` passed.

## Smoke
All 25 smokes PASS solo at 390 and 360, first run, no flake re-run. Only s6a and s6c are edited, and only in the 7 Ruling 2 selectors. After each smoke, tracked handback files were restored (`git checkout -- handback` and `git clean -fd -- handback`) so s6c's rewrite of the checkpoint project did not fail later smokes. s11b on 8820 (the port was free). PLAYWRIGHT_CORE=/workspace/node_modules/playwright-core/ and CHROME=/opt/pw-browsers/chromium_headless_shell-1248/chrome-headless-shell-linux64/chrome-headless-shell. Export audit not run (no play, export or build file changes).

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
The diff adds no new statement and no chained control header. Each of Rulings 1 and 3–7 is a quoted substitution inside an existing line. Ruling 2 changes only the selector string on the seven existing smoke lines. The new `icons.ts` budgets member is a type-literal, stroke only, not a statement. No line in the diff has two `for` / `if` / `while` headers.

## Size
`git diff --numstat 77a64648db3595d3205ee47b4bf53fe4c89734a7 -- . ':!handback/**' ':!package-lock.json'` is 107 additions and 17 deletions, 124 counted lines, each file on its trial count.

| File | Lines | Cap |
|---|---|---|
| tools/maker/widgets.ts | 2 | 2 |
| tools/maker/app.css | 2 | 2 |
| tools/maker/icons.ts | 1 | 1 |
| tools/maker/budgets.ts | 3 | 3 |
| tools/maker/stage.ts | 2 | 2 |
| tools/maker/units.ts | 2 | 2 |
| tools/maker/levels.ts | 2 | 2 |
| handoff/steps/tests/s6a-win-rules/smoke.mjs | 6 | 6 |
| handoff/steps/tests/s6c-checkpoint/smoke.mjs | 8 | 8 |
| tests/project/budgets-11c1.test.ts | 4 | 4 |
| tests/tools/f1-look-kit.test.ts | 4 | 4 |
| tests/tools/f2a1-carries.test.ts | 88 | 88 |
| Total | 124 | 124 |

## Shipped tests (sha256, unchanged)
a86157f71502edef041511d399aa96c77099e199dbf6823e3f46889eaea93eff  tests/tools/f2a1-carries.test.ts

Ruling 7 edits tests/tools/f1-look-kit.test.ts L94 and L105, so that file's F1 sha is no longer the one F1 shipped. The F1 kit folder was not edited.

## Helpers & self-review (required)
- Helper cca941e6-c7c0-41a0-aa85-bcfbfdcbb764: read-only review of the uncommitted diff against the guide rulings, caps, plant anchors and Rule 8 → PASS. 12 files, 124 lines, quoted edits only, shipped-test sha match, each plant anchor once, s6a and s6c selector-only.
- Helper a26e0e36-30cc-47ca-a43e-dda1d840e336: the same review, re-checked after plants had restored the tree → OK. Numstat matches every cap. No extra bytes. Rule 8 clean. cmp of the shipped test equal.
- Helper c5b94b6c-e99d-436c-8845-9546b3b937c3: read the shipped test against widgets, app.css, icons, budgets, stage, units, levels and the two re-pinned tests, then ran the four tests → OK, 4/4. icon("budgets") matches the BUDGETS constant. icon() is aria-hidden. The meter regex matches rowHtml. 5 hidden nodes when open (4 meters plus the icon).
- Kit script handoff/steps/tests/step-f2a1-carries/plants-f2a1.py: 12/12 caught, twice (before the code commit and again on the clean code head).
- Script /tmp/f2a1-smokes.sh: all 25 smokes solo, restore handback after each, s11b on 8820. SMOKES_ALL_PASS. Ok counts in § Smoke.
- Self-review: Acceptance done. `npm ci && npm run green` 1198/0. Tools tsc only the 3 base errors. Shipped test byte-identical to a86157f7…. Plants 12/12, tree clean. All 25 smokes PASS with only the 7 selector edits. `git diff --name-only` of the code head is the 12 Files-list paths; this commit adds handback/** only. Each file is on its cap; 124 counted lines. Rule 8 scan clean. Kit checksum passed. QA checklist: the diff is the 12 quoted edits; green ≥ 1198, 0 fail; tsc base errors only; plants 12/12; smokes solo with the ok counts above; s6a and s6c differ only in the 7 selectors; no play, export, build or format file touched; no new dependency.

## Decisions & deviations (5–10 lines)
- No deviation from the quoted edits. No extra code file, no new dependency, no cache. icon() still returns a new string on each call and keeps nothing.
- Base is 77a64648db3595d3205ee47b4bf53fe4c89734a7, not the guide text's 8791cecc. CoS confirmed the move since 8791cecc is docs and handoff only, and the trial patch applies on 77a64648.
- Counted lines are 124 (+107/−17), each file at its trial count. No line was wrapped, split or joined.
- Smokes: 25 solo at 390 and 360, first pass, no re-run. s3 step 9 and s8c steps 1–3 did not flake. s11b used 8820 because that port was free. Ok counts are the table in § Smoke.
- s6a (L54, L60, L62) and s6c (L57, L62, L63, L69) change only `[aria-label="On your team"]` to `[aria-label="On your team: On"]`.
- tests/project/budgets-11c1.test.ts L124 and L127 now count hidden meters by the Ruling 5 regex. The shipped test pins the fifth aria-hidden node (the icon).
- Export audit was not run. The step says it is not required.

## Next step (optional proposal)
- F2a2: ☰ and the stage switcher, the project page deleted, Budgets and Build moved, eyebrows, and the ☰ / switcher / close / chevron / check icons. F2b is the plus icon on + Add ability. Not this step.
