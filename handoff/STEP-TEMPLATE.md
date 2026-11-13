# Step template (guide-3, 2026-11-13, CN-016)

Copy this for every step file `steps/<step-id>.md`. All headed sections are required (write "None" where a section is empty); QA rejects a step file without them. The step **file** is 150–400 lines. The **work** follows BUILD_GUIDE §7's one size rule: 150–400 changed lines (400–500 needs a written reason; over 500 is rejected); each file's cap is the proto's line count plus 4; a re-based cap gives its reason here.

~~~~markdown
# <step-id>: <title> (<plan or slice reference; approvals>)

Step id: <step-id>          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: <base: main's SHA after <previous step-id> was merged, with PR and verify result>
Branch: step/<step-id>-r<N>, from the base. Never commit to main. Chief Of Staff pushes your branch and opens the PR to main.
Delivery (CN-003): git bundle create <step-id>-r<N>.bundle <base>..step/<step-id>-r<N>; git bundle verify; upload the bundle + a copy of your HANDBACK.md to the CEO's Drive. HANDBACK.md PR line: "PR: opened by Chief Of Staff from the bundle".
Hand-back location: in the repo, on that branch: handback/<step-id>/r<N>/HANDBACK.md   (shape: handoff/HAND-BACK.md)
Depends on: <step ids, formats and CNs this step reads, with sha256 prefixes>
Read first: BUILD_GUIDE.md §<n>; <QA reviews and format sections this step needs>
Kit: r<N>, <date>. <Proto branch and head, tree, test count, plants result, bundle sha.>
Carries: <CNs filed or none; pins unchanged or the CN that moves them>

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

## Goal
<2–5 sentences: what exists after this step that didn't before, and why.>

## Rulings
1. **<rule name>** (<source: CEO <date/time> | DSK <format rN (n)> | QA <finding>>): <the exact value: colour string, number, range, message text, default>. Pinned by: "<test title>".
(Every CEO or DSK ruling this step depends on, numbered, with its exact value and the test that pins it. A ruling with no pinning test is not done. Rulings that arrive after QA's first review go to the next step unless the CEO marks them blocking.)

## Files to create or change
- create `<path>` (≤ <cap>)
- change `<path>` (≤ <cap>; <one line on what changes>)
(Nothing else. An extra file must be named and justified in the Decisions note, or it is a REJECT. Change existing files in place; don't rewrite one unless this list says "rewrite".)

Size: 150–400 changed lines. The proto changes <n> lines (+<a>/−<d>) in <k> files:

| File | Base → proto / cap |
|---|---|
| `<path>` | <base> → <proto>/<cap> (<"re-based: reason" if not proto + 4>) |

## Interfaces to match (quoted exactly)
```ts
<exact exported signatures and types; QA diffs these against the code after whitespace normalisation>
```
<Which types come from src/types/core-types.ts (import, don't redefine).>

## Smoke lines
<The sim and smoke lines that must not move, or the exact new lines.>

## Existing tests changed by ruling (and only these)
<file: test title: what changes and which Ruling, or "None".>

## Tests that prove it is done
Shipped tests (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a weakened, renamed or deleted one is a REJECT unless "Existing tests changed by ruling" names it; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/<step-id>/`) | Copy to | sha256 |
|---|---|---|
| `tests/<area>/<name>.test.ts` | `tests/<area>/<name>.test.ts` | `<sha256>` |
Titles they hold (exact):
- `tests/<area>/<name>.test.ts` — "<test title>": <what it asserts>
(You may add tests. The hand-back lists each shipped file's sha256, unchanged.)

## How a planted bug is caught (for QA)
<Plant script path and expected result, e.g. "s<NN>-plants.py: N/N caught, all fail on the base". Plants run against the shipped tests, so they apply to every build.>

## Example
<One worked example in plain words.>

## Decisions note: what to name
<Constants, defaults and orderings the builder must name in Decisions, and every runtime bound (BUILD_GUIDE law 13: each cache or memo's cap; nothing retained grows with frames or edits); reserved words to avoid.>

## Do not touch
- <paths/globs>, plus BUILD_GUIDE §7's never-edit list.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least <n> tests passing (green = BUILD_GUIDE §6).
- [ ] Every shipped test file is byte-identical to its listed sha256.
- [ ] Sims, smoke lines and pins unchanged (or as Smoke lines says).
- [ ] Each file within its cap; 150–400 changed lines in total (400–500 only with a written reason; over 500 is rejected).
- [ ] <each line a checkable fact, never "works well">
- [ ] Hand-back complete per handoff/HAND-BACK.md at the hand-back location above.

## Not in this step (carries, with their target step)
- <carry>: <target step or owner>

## Out of scope
- <what not to build yet>

## Open questions
<Plain-words questions for the CEO, DSK or QA, or "None".>
~~~~
