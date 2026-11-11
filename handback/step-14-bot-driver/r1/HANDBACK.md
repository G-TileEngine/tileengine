# Hand-back step-14-bot-driver r1
Step file: handoff/steps/step-14-bot-driver.md
Base commit: dbbc5f4142887c9e64e09db6ae228a60cf4b02cd     Head commit: cf495c1207f959bfb086e4cdc4920d66d9dc06a4     Branch: step/step-14-bot-driver-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	scripts/sim.ts
M	src/sim/driver-phase.ts
M	src/sim/types.ts
M	tests/sim/ai.ts
A	tests/sim/bot.test.ts
M	tests/sim/chaos-gen.test.ts
M	tests/sim/chaos.test.ts
M	tests/sim/seats.ts

## Green
npm test: 181/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- The deprecated hook is reached as `(opts.ai ?? noAi)`. `noAi` throws `Error("runMatch: ai was asked with no hook")`. That call is unreachable: the RangeError is thrown first when `ai` is missing and any side in `sides` has no seat. There is no non-null assertion. A seated turn never calls the hook. `TickOptions.ai` stays required.
- `picker(seed)` is the old `forward` body, so the two faces cannot drift: stream `"ai"`, no draw when the unit is missing, otherwise exactly two `rng.next()` draws, then ahead then sideways, first in-bounds open empty cell. `forward` still maps a cell to `move(\`m${n}\`, id, c, r, durationMs)`. `bot` maps the same cell, in budget order, to `SelectUnit` then `TargetCell` with a fresh `{ c, r }` and no aim, and skips a unit with no cell. One `bot(seed)` is the intents function for every seat.
- The reject-reasons test copies the world and replaces `units.get` so `knight#1` can read back `{ alive: false }` or `{ side: "wolves" }`. The overlay returns a new object and writes no unit field. The real world's snapshot is unchanged afterwards. `log.lastSeq()` is 0 and there are ten history entries.
- `botMoveMs` is 200, a named test value in `scripts/sim.ts`, the same kind of value as `btfPresetTurnFuseMs`. `seatAll` uses one `counter("m")` for the match, one seat per side in `sides` order, and no `onStep`. The online test's `history` is the bus history plus each seat's player history.
- The two chaos files only replace `asIntents(forward(n))` with `bot(n)` and the imports. No Change Notice. `src/sim/player.ts`, the chaos sources, `BUILD_GUIDE.md`, `.dependency-cruiser.cjs`, and `src/types/core-types.ts` were not edited. Diff is 146 insertions and 23 deletions (169 changed lines) on the eight named files, under 200.
- Drive already had step-14-bot-driver-r1.bundle and HAND-BACK-step-14-bot-driver-r1.md, which this chat did not upload. This chat uploads step-14-bot-driver-r1-chatB.bundle and HAND-BACK-step-14-bot-driver-r1-chatB.md. No other Drive file was moved, renamed, overwritten or deleted.

## Next step (optional proposal)
- After tick-mode tables give `runTicks` seats, one step with a Change Notice can remove `MatchOptions.ai`, `AiHook`, `forward`, `asIntents`, and both parity tests. Not built here.

## Kit files used
- handoff/steps/step-14-bot-driver.md (user-supplied sha256) 2e2b14d9f7593909cb22f76e9a46be4ba36566fbbbdf2f2ff793eb96e56a3a44
- BUILD_GUIDE.md (base dbbc5f4; unchanged, not edited) c27e12920a6fa340beddac1fb010ebcb05d12bf37221d7319cca17b10570e583
- handoff/HAND-BACK.md (base dbbc5f4) e0cae736e2e7eed455d790eb9d241833690a015a78edc5efe489a010b8085777
