# CN-009 (r2): core-types adds SaveHeader and MatchSave (add-only; one pin moves)
Date: 2026-11-12   Raised by: Engine Architect (step-24-trusted-saves, H3)   Sign-off needed: **Data & Save Keeper** (owner of core-types.ts), before step 24 is sent. Status: SIGNED by the Data & Save Keeper 2026-11-12 21:26 (r2, after findings F1–F4; project-format r24 §6.9.1, sync-format r14). Kit `data/core-types.ts` = `61fad786`. r1 (f6c78db, afb69587, a flat `engineVersion` / `projectHash`) is superseded.

Old: `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (= kit `data/core-types.ts`), pinned by `tests/smoke.test.ts`.
New: `src/types/core-types.ts` sha256 `61fad786bfb838e37d2d37768fb3b62be24eaf392f2038eb4bcd4de5b9b5fe43`. The diff against `f00c722c` is **add-only**: five lines after the command-log header comment; nothing removed and nothing reworded.
```ts
/** The project-format §6.9 save `header`, one home for every save kind (CN-009). MAY-MOVE. */
export type SaveHeader = { readonly projectHash: string; readonly engineVersion: string; readonly projectId: string; readonly savedAt: string };
/** `match-save` v1 (project-format §6.9.1, CN-009): the log is the truth, the snapshot a check value. MAY-MOVE. */
export type MatchSave = { readonly kind: "match-save"; readonly formatVersion: 1; readonly header: SaveHeader; readonly log: string; readonly snapshot: unknown };

```
- `SaveHeader` is the §6.9 `header` exactly. core-types had no type for it before (the `save` v1 kind has no core-types type yet), so it gets one shared home here. `MatchSave.header` refers to it and does not redeclare it. A later `save` v1 type should use the same `SaveHeader`.
- `tests/smoke.test.ts` line 14 moves its pinned sha from the old value to the new one.
- Nothing else is pinned differently: `.dependency-cruiser.cjs` stays `45a3dbaa…`, `scripts/check-law.sh` `4d7bbf48…`, `package.json` `1e5dd82c…`, lock `d7f64a09…`.

Why: a match save leaves the engine and comes back, so its shape belongs with the saved-document shapes in DSK's file. `snapshot` is `unknown`, so core-types stays a leaf: it imports nothing, and `SimSnapshot` stays the engine's own type.

Not in this CN (unchanged from r1): `src/project` does not import `core/plain.ts`. The readers use the `guarded` wrapper instead, so there is no depcruise change. Copying documents first broke the step-22 refusals that name the cap, lost the `__proto__` notice, and moved the exploit-docs smoke.

Stays forbidden: `src/project` and `src/paint` import no core file except `core/notice.ts`. core-types imports nothing. No existing core-types line changes; removing or rewording one needs its own CN.

Affected steps already done: none. Nothing on `main` (`219959a`) names `SaveHeader` or `MatchSave`.
Action: carried by `handoff/steps/step-24-trusted-saves.md`. Files: `src/types/core-types.ts` (the five lines above only) and `tests/smoke.test.ts` (the pin). Acceptance: the new sha above, and `git diff <base>..<head> -- src/types/core-types.ts` has no removed line. Checked by the Architect on prototype `h3r3` `7aa021d` over `219959a` (r3, QA r2 must-fix; core-types unchanged from r2): green 513/0, depcruise unchanged.
Kit files updated: `data/core-types.ts` must become byte-identical to the new file. DSK makes this change at re-sign-off; the Architect does not edit DSK's copy. The step-24 file and the README and spine rows quote the new sha. BUILD_GUIDE is unchanged.
