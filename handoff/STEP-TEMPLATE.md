# Step template (kit-2)

Copy this for every step file `steps/<step-id>.md`. All headed sections are required; QA rejects a step file without them. Size: the step file is 150–400 lines; the work it asks for is ≤ 400 changed code lines (src + tests; lockfile, vendored files, fixtures and `handback/` excluded).

~~~~markdown
# <step-id>: <title>

Step id: <step-id>          Revision: r<N> (r1 first)
Repo: https://github.com/G-TileEngine/tileengine (private; never push to `main`)
Base commit: <base: main's SHA after <previous step-id> was accepted>   (step-00: main @ the commit Chief Of Staff pushes with the kit)
Branch: step/<step-id>-r<N>, from the base; finish with a PR to main
Hand-back location: in the repo, on that branch: handback/<step-id>/r<N>/   (see HAND-BACK.md)
Depends on: <step ids that must be accepted first>
Read first: BUILD_GUIDE.md §<n>, docs/STATES.md §<n> (only what this step needs)

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

## Goal
<2–5 sentences: what exists after this step that didn't before, and why.>

## Files to create or change
- create `<path>` — <one line>
- change `<path>` — <one line>
(Nothing else. An extra file must be named and justified in the Decisions note, or it is a REJECT.)

## Interfaces to match (quoted exactly)
```ts
<exact exported signatures and types; QA diffs these against the code after whitespace normalisation>
```
<Which types come from src/types/core-types.ts (import, don't redefine).>

## Tests that prove it is done
- `tests/<area>/<name>.test.ts` — "<test name>": <what it asserts>
(Each by file and test name; each must exist and run.)

## Do not touch
- <paths/globs>, plus BUILD_GUIDE §7's never-edit list.

## Acceptance
- [ ] `npm run green` exits 0 (green = BUILD_GUIDE §6).
- [ ] <each line a checkable fact, never "works well">
- [ ] Hand-back complete per HAND-BACK.md at the hand-back location above.

## Out of scope
- <what not to build yet>
~~~~
