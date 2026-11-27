# QA review: step F0c carries r1 (PR #113, ChatA)

Reviewer: QA & Build Guard. Date: 2026-11-27.
PR: [#113](https://github.com/G-TileEngine/tileengine/pull/113), branch `step/step-f0c-carries-r1-chatA`.
Verdict: **OK TO MERGE.** The expected merge tree onto main `664f8303` is `f93056ea345b0918dbf53009f9c612b32ae7867b`. There is no pin and no rework.

## Refs

- **Tip:** `c3468f44…`, tree `80ea9fd6…`. This is the docs-only handback commit: 5 files, `handback/step-f0c-carries/r1/` only.
- **Code head:** `97dab703…`, tree `4a212c4d…`. It is labelled separately in the handback.
- **Base:** `49db9f47`. Main `664f8303` is docs and handoff only on top of it.
- **Merge:** `git merge-tree --write-tree origin/main` with the PR gives `f93056ea…`, the same tree CoS reported.

## Checks (my own run, Node 24.22.1)

- **Green:** exit 0, 1180 pass, 0 fail. That meets floor 1180.
- **tsc:** only the 3 base errors.
- **Smokes:** all 25 PASS. **Export audit:** 136 / 150 / 150, AUDIT PASS.
- **Plants:** `plants-f0c.py` (byte-identical to main's `39f67d7b…`) catches **13/13** on the code head.
- **Shipped test:** `tests/project/f0c-carries.test.ts` is byte-identical to the shipped `87097007…`.
- **Size:** 12 files, +167 −19 (186). The file list is exactly the guide's Files table, and each file is inside its cap.
- **No-screen pairs:** the base and step shots are byte-equal for map and for test.
- **Rule 8:** no new one-line bodies, no new unbraced if-bodies, and no new multi-bindings. The only dense lines touched are the named edits: `test-launch.ts`, `export.ts`, `project.ts` L66 and L113.
- **Handback:** § Helpers lists two helpers. The code head is labelled, and there are no raw logs.

## Diff against the kit trial (`2475f873`)

The only differences are in `test-gate.ts` and `read-project.ts`.

- `poolLines` creates `lines` first and calls `stageNames` after the early return. The behaviour is the same, which the plants and tests confirm.
- The `poolLines` doc comment was dropped, and the `PLAY_LIMITS` comment was shortened to "Play places fixed enemy lists only." The shortened comment still meets Ruling 3.

## Notes (not blocking)

1. The `poolLines` doc comment drop isn't listed in § Decisions. That's minor handback drift.
2. `names[id] ?? id` is redundant, because `stageNames` already falls back to the id. Leave it.
3. ChatA ran on Node 22 against `.nvmrc` 24. My Node 24 run gives the same result.
4. The paste and guide cite only the r1 kit review. The r2 review is on main.

## Carries

The 11c1 carries to 11c2 still stand, as listed in the handback's § Next step.
