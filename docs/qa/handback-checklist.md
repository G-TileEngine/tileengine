# Grok Build hand-back QA checklist (per step)

Owner: QA & Build Guard. Asked by: Chief Of Staff (CEO GO on handoff), 2026-11-09. Nothing public.
Applies to every step in `/workspace/tileengine/handoff/steps/`. Based on `handoff/00-grok-build-workflow-answer.md`; must be re-checked against BUILD_GUIDE.md, STATES.md and the step template once the Architect finishes them (see §5).

## 0. Inputs I need with every hand-back
1. Step id + the step file it answers.
2. Changed-file list (paths, added/modified/deleted).
3. Raw test output (`npm test`) and typecheck output (`npm run typecheck`).
4. The 5–10 line **Decisions & deviations** note.
5. Optional next step.
Missing any of 1–4: **REJECT (incomplete)**, no further review.

## 1. Gates (all must pass; any FAIL = REJECT)
Run from a fresh clone of https://github.com/G-TileEngine/tileengine, checked out at the step branch `step/<id>-r<N>` (the PR head), into `/workspace/qa-runs/<id>-r<N>/`. Never run on `main` or a working tree. Fresh `npm ci`. The diff base is `main` after the previous accepted step (for Step 00: `main @ CoS kit push`).

| # | Gate | How | Pass means |
|---|---|---|---|
| G1 | Tests green | `npm test` | exit 0, 0 failed, 0 skipped/`.only`/`.todo` added by this step, and the step's "Tests that prove it is done" exist by name, ran, **and each catches its rule: QA's behavioural plant set (step file "How a planted bug is caught", plus QA's review plants) is run against the build's own tests and every plant must be caught; any miss is a must-fix** (a test existing by name is not enough). Shipped tests are copied verbatim (sha256 equal to the step file's Tests table); a changed, weakened, renamed, skipped or deleted shipped test is a REJECT unless the step's "Existing tests changed by ruling" names it, and a failing one is a must-fix. Before a kit is sent, QA's plants run against the kit's shipped tests; a miss is a kit must-fix. *(CEO approved 2026-11-13 20:42 London, guide audit edit 2; applies from s33 onward)* |
| G2 | Typecheck clean | `npm run typecheck` (`tsc --noEmit`, strict, ES2022) | exit 0, 0 errors; no new `// @ts-ignore`, `@ts-expect-error`, `any` casts, or `skipLibCheck` / strictness loosened in tsconfig |
| G3 | xGo state rule | grep below | zero hits outside the xGo implementation |
| G4 | Interfaces match quotes exactly | normalise and diff each "Interfaces to match" block against the code's export | byte-equal after whitespace normalisation; names, param order, param types, return type, optionality, readonly, generics all identical |
| G5 | Do-not-touch respected | `git diff --name-only <base>..<handback>` vs the step's Do-not-touch list | no listed path (or glob) appears in the diff, incl. renames/deletes |
| G6 | Scope = step's file list | diff names vs "Files to create or change" | no file outside the list, except lockfile changes caused by declared deps; any extra file must be named and justified in the Decisions note, or REJECT |
| G7 | Step size cap | `git diff --numstat <base>..HEAD -- . ':!handback/' ':!package-lock.json'` (insertions + deletions; shipped tests copied in count; generated files, test fixtures and the hash-pinned verbatim `core-types.ts` excluded) | 150–400 changed lines is normal and every file is within its step cap (proto + 4, or the step's stated re-base). 400–500 = accept only with a written reason in Decisions; > 500 = REJECT (split the step). Over a file cap = must-fix (never trim a test to fit); under 150 = flag. *(BUILD_GUIDE §7 guide-3 eb3ccab0, CN-016)* |
| G8 | Build law | §3 | all pass |
| G9 | Decisions note sensible | §4 | all pass |
| G10 | Acceptance | step's "Acceptance" lines, run by me as repro steps | each line demonstrably true |

### G3: xGo grep (no direct phase writes)
State tables live only in `src/state/<mode>.table.ts`; the only transition is `xGo(from: Phase, event: Event): Phase` (exact signature from BUILD_GUIDE.md).
```
rg -n --pcre2 -g '*.ts' -g '*.tsx' \
  -e '(?<![=!<>])\bphase\s*(=(?!=)|\+=|-=|\|\|=|&&=|\?\?=)' \
  -e '\.phase\s*(=(?!=)|\+=|-=|\|\|=|&&=|\?\?=)' \
  -e '\[\s*["\x27`]phase["\x27`]\s*\]\s*=(?!=)' \
  -e 'Object\.assign\([^)]*\bphase\b' \
  -e '\bphase\s*(\+\+|--)' \
  -e 'Reflect\.set\([^)]*["\x27`]phase' \
  src
```
Allowed hits, and nothing else:
- inside the body of `xGo` itself (file named in BUILD_GUIDE.md);
- `const|let <name> = xGo(...)` / `<obj>.phase = xGo(...)` **only if** BUILD_GUIDE.md says that's the sanctioned way to store the result (confirm when the guide lands; until then, flag them);
- object literals use `phase:`, which the patterns don't match, so test fixtures are fine.
Also check: no `Phase` value is built from a string (`as Phase`), and no second transition function exists (`rg -n 'function\s+\w*[Gg]o\b|=>\s*Phase\b' src` and read the hits).

## 2. How I accept or reject
- **ACCEPT**: G1–G10 all pass. I write `docs/qa/steps/<step>.md` with the gate table, commands run and output hashes, then tell Chief Of Staff "ACCEPT <step>".
- **ACCEPT WITH NOTES**: all gates pass, but there are minor issues that don't break a rule (naming nits, a weak test, a doc typo). The notes go into the next step's brief and the step is not reopened.
- **REJECT**: any gate fails. The report lists each failure with file:line, the exact command to reproduce it, expected vs actual, and the smallest fix. Grok Build fixes it in the **same step** (re-hand-back as `<step> r2`). The fix may not touch anything beyond the failed items.
- **REJECT (incomplete)**: inputs missing (§0).
- **CHANGE NOTICE REQUIRED**: the hand-back is correct, but it shows that a quoted interface or the guide itself is wrong. I don't accept a silent deviation. The Architect issues a Change Notice (Old / New / Affected steps already done / Action "refactor, do not patch"), and the step is re-run against it.
- Three rejects on the same step: escalate to Chief Of Staff, and the step is probably too big or underspecified.
- Every 5–7 steps (the guide re-read cadence): I run a **drift sweep**, which is all gates on the whole tree, not just the diff, plus docs vs code (§3 D).

## 3. Build law checks (G8)
- **A. One clock.** `rg -n 'requestAnimationFrame|setInterval|setTimeout|performance\.now|Date\.now' src` gives exactly one frame-loop owner: the **host driver (platform layer)** named in the guide. The core clock is a pure scheduler with **no** rAF, timers or wall time. Nothing else drives frames or game time. Timers are allowed only where the guide allows them (none by default).
- **B. UNIT and TILE are the only pipes.** Game state moves between subsystems only through the UNIT and TILE interfaces defined in the guide or ARCHITECTURE. Flag any new global, singleton, event bus, or cross-module import of another subsystem's internals.
- **C. No copied chess trees.** Hash-compare and rg each new file against the BTF source `/workspace/g-tile-engine` (canonical) **and** `/workspace/towerchess*`, both banned by the kit, (identical files or functions, and chess/BTF names such as deck or hero names inside engine code). Engine code is generic.
- **D. Docs vs code.** Every file, interface and command the step or guide names exists as named, and nothing the code adds contradicts BUILD_GUIDE.md or STATES.md. Drift goes to the Architect, not into a silent fix.
- **E. Own entry and pack.** Engine code stays in the engine tree with its own entry. No imports from game or editor code into the runtime.
- **F. No scope creep.** Priority order (CEO, 2026-11-09) is tactics, then idle RPG, then tower defence. No code for a later mode, network, auth, analytics or other unasked features.
- **G. Mobile (from the first step that renders or reads input).** Pointer events, not mouse-only handlers. `touch-action` set on the play surface. No per-frame allocations in the loop (static scan plus a 10 s profile in Chromium mobile emulation once something renders).
- **H. Export (from the first step that builds a Render bundle).** The bundle has only runtime, used behaviours and project assets. No editor code, dev overlay, tests or unused files (END-GAME-REQUIREMENTS.md).

## 4. Decisions & deviations note (G9)
Pass when all of these hold:
- 5–10 lines, plain words.
- Every deviation from the step file is listed: an extra file, a changed signature, a skipped test, a new dependency or a default chosen.
- **No silent defaults.** Any value the step didn't specify (a constant, a timeout, a size, an ordering) is named with its value and a reason.
- No decision overrides the guide, a quoted interface or Do-not-touch. Those need a Change Notice, not a note.
- New dependencies are named with their version and why. A dependency the guide doesn't allow is a REJECT.
- What the note claims matches the diff. A claim the diff doesn't show, or a diff change the note leaves out, fails.

## 5. Kit review (before it reaches CoS): what I'll check
When BUILD_GUIDE.md, STATES.md, steps/ and the templates land:
1. BUILD_GUIDE.md has everything Grok Build asked for. That means the goal and priority order, folder layout and naming, the state-table rule with the **exact** xGo signature, the never-do list, the test commands and what "green" means, and pointers to the design docs. It must also include the build law (one clock, UNIT/TILE, no chess trees, own entry and pack, no scope creep). Grok Build forgets anything that isn't in the root guide.
2. Every step file has all six sections (Goal / Files / Interfaces quoted exactly / Tests / Do not touch / Acceptance). Each one is 150–400 lines of work, its tests are named and runnable, and its acceptance lines are testable (no "works well").
3. Quoted interfaces agree across STATES.md, the guide, the steps and ARCHITECTURE-v0.md, with no two versions of the same signature.
4. Step 0 matches Grok Build's example: package.json, a strict ES2022 tsconfig, src/, src/state/, tests/smoke.test.ts, BUILD_GUIDE.md and .gitignore, with `npm test` and `npm run typecheck` exiting 0. It also adds the xGo grep as an npm script (`npm run check:state`), so Grok Build runs the same check I do.
5. The kit says where hand-backs go, preferably `/workspace/artifacts/...` as Grok Build asked, and which base commit each diff is measured from.

## 6. Logistics (Engine Architect, 2026-11-09)
- Each step runs on branch `step/<id>-r<N>` in https://github.com/G-TileEngine/tileengine (visibility is the CEO's call). Delivery per CN-003: Grok Build makes a git bundle, runs `git bundle verify`, and uploads it with HAND-BACK.md to the CEO's Drive; Chief Of Staff pushes it and opens the PR to `main`. QA reviews the PR head. A REJECT means a new bundle (r<N+1>). The hand-back must record `node -v` (`.nvmrc` pins 24 from step 01).
- The hand-back goes in-repo at `handback/<step-id>/r<N>/`.
- The diff base is `main` after the previous accepted step.
- Sim time is integer milliseconds everywhere (CN-001), so any `dtSeconds` or float-seconds timer in a hand-back fails G4/G8.
- The only rAF owner is `src/runtime/host/raf-driver.ts`, which has a single-file ESLint exception.
- **No lint exemptions.** DSK's `core-types.ts` (pin `fd717d3f…`, 2026-11-09) no longer contains `eslint-disable`, so the temporary exemption is removed. Every file is linted, and any `eslint-disable` fails. The pinned file must still match its hash byte for byte.
