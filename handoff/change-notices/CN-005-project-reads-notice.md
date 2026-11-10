# CN-005: src/project may import the Notice type from src/core/notice.ts (one depcruise line)
Date: 2026-11-10   Raised by: Engine Architect (step-08-project-reader; core-spine-slices step-08 outline left the Notice edge to the step)
Old: `.dependency-cruiser.cjs` (sha256 `4fa53572021ec36a6550367f42ca4359c18f4b0af94e88210de9ea3aa9e42833`) line 8:
`    { name: "project-imports-only-types", severity: "error", from: { path: "^src/project" }, to: { path: "^src/(?!project|types)" } },`
BUILD_GUIDE §3 layer table: `src/project/read/       read-only project reader (current-version docs only)  → may import: src/types`
New: `.dependency-cruiser.cjs` (sha256 `9037bacef0aa7ff33abff96d308fe137ef1c7d4baa6795af070c3b68d7bd3e81`) line 8:
`    { name: "project-imports-only-types", severity: "error", from: { path: "^src/project" }, to: { path: "^src/(?!project|types|core/notice\\.ts$)" } },`
Every other line is byte-identical. `src/project/**` may import `src/types/**` and exactly one core file, `src/core/notice.ts` (type-only `Notice` from step 03, which itself imports only `Sq` from `src/types`). Any other `src/core` path (grid, unit, rng, …) still fails `npm run deps`. BUILD_GUIDE §3 reads: `… → may import: src/types, src/core/notice.ts (Notice type only; CN-005)`.
Why: law 10 (warn, don't block) needs one `Notice` shape across core and reader. Moving `Notice` to `src/types` would edit DSK's `core-types.ts` or add a second types file; one narrow allow is smaller and keeps `Notice` where step 03 put it.
Affected steps already done: none (`src/project` does not exist on `main` `12ae906`).
Action: carried by `steps/step-08-project-reader.md` (Files: change the one line above; Do not touch: `.dependency-cruiser.cjs` except that line; Acceptance: the sha256 above, plus `rg -n "from ['\"].*core/(?!notice)" --pcre2 src/project` prints nothing). Checked by the Architect on a prototype over `main` 12ae906: `npm run deps` passes with `src/project/read` importing `core/notice.ts`, and fails on a planted `src/project/read` import of `core/grid/index.ts`; `npm run green` 108/0.
Kit files updated: steps/step-08-project-reader.md (new). BUILD_GUIDE §3 line above: Chief Of Staff pushes the updated BUILD_GUIDE.md (root and handoff/) with this CN before step 08 is sent.
