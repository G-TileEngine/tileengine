# CN-004: core-types adds audio:1, CORE_EVENT_KEYS, UiEventMap/UiEvent, UI_EVENT_KEYS (additive)
Date: 2026-11-10   Raised by: Data & Save Keeper (audio-format r1 §8); ruled by Engine Architect (lands after step 01 merged, carried by step 02)
Old: `src/types/core-types.ts` sha256 `055a182cee1b5b674388c63d0a316b3df5cb97626d383f9c9e86a65debd402a3`; `tests/smoke.test.ts` pins that hash.
New: `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (attached, DSK; byte-identical copy). Add-only, 20 lines, 0 removed:
- `CurrentFormatVersions` gains `readonly "audio": 1` (MAY-MOVE).
- `CORE_EVENT_KEYS` — a runtime const the compiler holds equal to `keyof CoreEventMap` (`landedOn`, `pushBlocked`, `enteredLane`, `actionLogged`) (MAY-MOVE).
- `UiEventMap` — augmentable, `ui.*` prefixed, placeholder `"ui.none"?: never`, plus `"ui.click": { control: string }` (PROPOSED); `UiEvent = EventUnion<UiEventMap>`; `UI_EVENT_KEYS` (MAY-MOVE). UI events are **not** in `AnyEvent`: they never enter the command log or the sim.
Every type quoted by steps 01–07 is unchanged. `tests/smoke.test.ts` changes its pinned hash only (one line).
Affected steps already done: step-00-skeleton (smoke pin), step-01-state-tables (none; uses `Sq` only).
Action: refactor, do not patch. Carried by `steps/step-02-clock.md` (Files: replace `src/types/core-types.ts` with the attached copy; change the one hash line in `tests/smoke.test.ts`). Checked by the Architect on `main` 1166ff7: `npm run green` exits 0 with both changes.
Kit files updated: steps/step-02-clock.md (Base, Carries, Files, Do not touch, Acceptance); steps/step-03 … step-07 (Kit pin line).
