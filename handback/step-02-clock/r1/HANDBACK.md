# Hand-back step-02-clock r1
Step file: handoff/steps/step-02-clock.md
Base commit: 1166ff721ed9549bfd349d0a91c223ef98c208e1     Head commit: 83f0da133815dc7f17b9985745558b4a75b95c46     Branch: step/step-02-clock-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
D	src/core/.gitkeep
A	src/core/clock/clock.ts
A	src/core/clock/index.ts
A	src/core/clock/types.ts
A	src/rules/turns/fuse.ts
M	src/types/core-types.ts
A	tests/core/clock.test.ts
A	tests/rules/fuse.test.ts
M	tests/smoke.test.ts

## Green
npm test: 33/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- Defaults kept: stepMs 10 and maxFrameMs 100. A missing value, or one that is not an integer ≥ 1, falls back to that default. timeScale starts at 1.
- Game speed is Math.round(x * 4) / 4, then clamped to 0..8. A non-finite value becomes 0. Halves round away from zero, which is what Math.round does. The accumulator is an integer count of quarter-milliseconds.
- Timers fire before tick subscribers, ordered by (dueMs, id) ascending. Ids start at 1 and are not reused. advance throws RangeError "advance: dtMs must be an integer >= 0"; after throws "after: ms must be an integer >= 0". The host driver owns rounding.
- While paused, advance still renders once: dtMs is the clamped delta and alpha is 0. step() renders with dtMs 0 and does not clear a leftover accumulator when the clock is not paused. A listener removed during a pass is skipped. An onError listener that throws is swallowed and not reported again.
- The types comment says "integer ms", not "integer milliseconds". The acceptance grep matches the letters "seconds" inside "milliseconds". Every quoted type is otherwise unchanged. startFuse's bad-value message is "invalidValue: " plus the value. There is no fuse default in core.
- Diff excluding the lockfile, handback and core-types.ts is 388 insertions and 1 deletion, under 400 and above the ~360 lean note. The worked-example table was checked while writing and was not kept as an extra test.

## Kit files used
- handoff/steps/step-02-clock.md (origin/main) 3f4b18e5093f59c7271254d4e58b4107fbde0cbcc51300eb5c6d457935b3c871
- handoff/change-notices/CN-001-sim-time-ms.md (origin/main) bea47036eb351c37dc5d9e0809219bc2c6415cdc48e50dd2b13c99a4f4328798
- handoff/change-notices/CN-004-core-types-audio-ui-keys.md (origin/main) 1c1cc5b14d412baf816c532a01721ff9e721bb2b94a465b656e4e4315ec214c0
- handoff/staging/core-types.next.ts.txt (origin/main) f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23
- BUILD_GUIDE.md (base 1166ff7, §2 law 1) 9f024be957ce41eabb06441ed4a3027ef007e5b8645c6791c3e6606d94ca1e20

## Next step (optional proposal)
- step-03-grid-edges, from handoff/steps/step-03-grid-edges.md on main. The clock is not wired to a frame driver here.
