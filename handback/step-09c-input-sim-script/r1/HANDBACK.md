# Hand-back step-09c-input-sim-script r1
Step file: handoff/steps/step-09c-input-sim-script.md
Base commit: 7944f792967d8fe59860958f3c02e667e6dce1f8     Head commit: 1840e7d935586cc08a3356c10973c27b551ae41c     Branch: step/step-09c-input-sim-script-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	.dependency-cruiser.cjs
M	package.json
A	scripts/sim.ts
A	src/runtime/input/gestures.ts
A	src/runtime/input/index.ts
A	src/runtime/input/types.ts
M	src/sim/driver-phase.ts
M	src/sim/index.ts
A	src/sim/intents.ts
A	tests/runtime/input/gestures.test.ts
A	tests/sim/intents.test.ts
A	tests/sim/script.test.ts

## Green
npm test: 132/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- RangeError text: createGestureMapper throws "createGestureMapper: cellPx must be > 0", "createGestureMapper: tapMaxPx must be >= 0", and "createGestureMapper: holdMs must be an integer > 0". A sample whose ms is not an integer, is negative, or is below the previous sample throws "createGestureMapper: ms must be an integer >= 0 and must not go back". report throws "report: n must be an integer >= 1".
- The open gesture keeps the first pointer id, the down point (x, y, ms), and a mode that starts as press. While it is still press, a later sample of that id becomes box when ms minus downMs is at least holdMs, otherwise drag when the squared distance from the down point is greater than tapMaxPx squared. The mode is not reconsidered after that. move never emits. cancel of the owner drops the gesture with no intent. A second down from the owner, and any sample before the first down, are ignored. Any other pointer id is ignored until the gesture ends.
- feedIntent's aim defaults to null when the caller omits it. Cells copied into events are fresh { c, r }. runMatch throws "runMatch: battle phase missing" and feedIntent throws "feedIntent: battle phase missing" when phases.battle is absent. There is no play.loading fallback.
- The sim script names the BTF preset turn timer btfPresetTurnFuseMs = 60000 and passes it only when the file is the program (process.argv[1] resolves to this module). report hashes the sha256 hex of JSON.stringify of each seed's bus.history(), in seed order, as utf-8.
- Diff is 235 insertions and 1 deletion (236 changed lines): the twelve named files, eight added and four modified. Under 300. No extra file. CN-006 is the one new line in each of .dependency-cruiser.cjs and package.json; both sha256 match the notice. package-lock.json is unchanged. BUILD_GUIDE.md was not edited.
- Drive names step-09c-input-sim-script-r1.bundle and HAND-BACK-step-09c-input-sim-script-r1.md were free, so this chat uploads those. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- A player driver can turn TAP_MOVE_CELL and CONFIRM_TARGET into submitted actions beside the AI, with the same events. Not built here.

## Kit files used
- handoff/steps/step-09c-input-sim-script.md (latest main) be91142578ed1a56c9ee5946282c652a4c1d157b1c63b09b4e968c8b37fcfbd3
- handoff/change-notices/CN-006-input-layer-sim-script.md (latest main) 06ebd17ea1143660b2af815085a0a943fbbc93ccc87e51e00c6be2f83b9aa99b
- BUILD_GUIDE.md (latest main; §3 is the CN-006 text; not edited) d374d06c97483dcadb0c590fd9bb1cc0d57c9918c1664e773dc4429871fd070a
- handoff/HAND-BACK.md (base 7944f79) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
