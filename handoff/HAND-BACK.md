# HAND-BACK.md — what Grok Build returns after every step

Guide version guide-3 (2026-11-13, CN-016). Matches QA & Build Guard's `docs/qa/handback-checklist.md` §0–§2. A hand-back missing any of items 1–4 below is **REJECT (incomplete)** without review.

## Where
- **Repo:** https://github.com/G-TileEngine/tileengine (visibility is the CEO's call). Never push to `main`.
- **Branch:** `step/<step-id>-r<N>` — `<step-id>` is the step file's id (e.g. `step-00-skeleton`), `r1` for the first hand-back, `r2`, `r3`… for rework after a REJECT. **Delivery (CN-003):** you read the repo but do not push. Finish with `git bundle create <step-id>-r<N>.bundle <base>..step/<step-id>-r<N>`, check it with `git bundle verify`, and upload the bundle plus a copy of `HAND-BACK.md` to the CEO's Drive. Chief Of Staff pushes the branch and opens the PR to `main`. The Architect merges after ACCEPT and tags `accepted/<step-id>`.
- **Hand-back location (decided on purpose, CEO via CoS 2026-11-09):** in the repo, on that branch, at `handback/<step-id>/r<N>/`, committed as the branch's **last** commit. Never edit an earlier `rN` folder.
- **Base commit:** every step file states it. The diff is always `<base>..<head>`. For `step-00` the base is `main` @ the commit Chief Of Staff pushes with the kit (today `main` holds only `README.md`). For later steps it is `main`'s SHA after the previous step was accepted (the merge of its PR, tagged `accepted/<previous step-id>`), written in the step file as `<base: main's SHA after <previous step-id> was accepted>` until the Architect fills in the hash at publish.

## What (files in `handback/<step-id>/r<N>/`)
| # | File | Content | QA input |
|---|---|---|---|
| 1 | `HANDBACK.md` | Step id + step file path, revision `rN`, base commit, head commit (the commit **before** the hand-back commit), branch, PR link | §0.1 |
| 2 | `changed-files.txt` | `git diff --name-status <base>..<head> -- . ':!handback'` (A/M/D/R) | §0.2 |
| 3 | `test-output.txt` | raw `npm test` output, unedited | §0.3 |
| 3 | `typecheck-output.txt` | raw `npm run typecheck` output | §0.3 |
| 3b | `checks-output.txt` | raw `npm run lint`, `npm run deps`, `npm run check:state`, `npm run check:law` output | G3, G8 |
| 4 | `HANDBACK.md` § Decisions & deviations | 5–10 plain lines (rules below) | §0.4, G9 |
| 5 | `HANDBACK.md` § Next step (optional) | a proposal, never a change | §0.5 |
| 6 | `stat.txt` | `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` | G7 |
| 7 | `HANDBACK.md` § Shipped tests | `sha256sum` of every shipped test file as it sits in `tests/`; each must equal the sha256 in the step file (BUILD_GUIDE §8) | G1 |
The bundle is the patch; once Chief Of Staff has pushed it, QA clones the branch for the clean checkout (§1) and reviews `<base>..<head>`. No `diff.patch` is needed. The PR line in HANDBACK.md reads `PR: opened by Chief Of Staff from the bundle` (never a guessed PR state).

## `HANDBACK.md` shape
```
# Hand-back <step-id> r<N>
Step file: <path of the step file answered>
Base commit: <hash>     Head commit: <hash>     Branch: step/<step-id>-r<N>     PR: opened by Chief Of Staff from the bundle
Node: <node -v>     npm: <npm -v>     rg: <rg --version first line>

## Changed files
<same as changed-files.txt>

## Green
npm test: <pass>/<fail>/<skipped>/<todo>    typecheck: exit <n>    lint: exit <n>    deps: exit <n>    check:state: exit <n>    check:law: exit <n>

## Shipped tests (sha256, unchanged)
<sha256sum output for each shipped file, at its tests/ path>

## Decisions & deviations (5–10 lines)
- ...

## Next step (optional proposal)
- ...
```

## Decisions & deviations rules (QA G9)
- 5–10 lines, plain words.
- List **every** deviation from the step file: an extra file (named and justified), a changed signature, a skipped test, a new dependency (name, exact version, why — only those BUILD_GUIDE §6 allows), a default you chose.
- **No silent defaults:** every value the step didn't give (a constant, a size, an ordering, a tie-break) is named with its value and reason.
- **Bounds and size (BUILD_GUIDE law 13, §7):** state each runtime cache or memo's bound (nothing retained grows with frames or edits); a step over 400 changed lines gives its reason here (over 500 is rejected).
- A decision may not override BUILD_GUIDE, a quoted interface or Do-not-touch. If one of those is wrong, stop and say so; the Architect issues a Change Notice.
- The note must match the diff exactly.
- A shipped test is never a deviation you may choose: copy it unchanged. If one looks wrong, stop and say so; a weakened, renamed or deleted shipped test is a REJECT, and a failing shipped test is a must-fix.

## Outcomes and rework
- **ACCEPT** (QA writes `docs/qa/step-<NN>-review.md`, and `docs/qa/step-<NN>-ab.md` when two builds are compared) → RaiKynn accepts via Chief Of Staff → the PR is merged. No tags: the merge commit on `main` is the record and the next step's base.
- **ACCEPT WITH NOTES** → same, and the notes go into the next step's brief. The step is not reopened.
- **REJECT** → QA's report lists each failure (file:line, command, expected vs actual, smallest fix). Fix it in the **same step**: branch `step/<step-id>-r<N+1>` from the `r<N>` head, hand back in `handback/<step-id>/r<N+1>/`, deliver a new bundle (Chief Of Staff opens the new PR and closes the old one). Touch only the failed items. Base commit stays the same.
- **CHANGE NOTICE REQUIRED** → stop. The Architect issues a Change Notice; you re-run the step against it ("refactor, do not patch").
- Three REJECTs on one step → escalated to Chief Of Staff; the step is split or re-specified.
