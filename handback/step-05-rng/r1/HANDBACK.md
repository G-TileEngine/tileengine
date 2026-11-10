# Hand-back step-05-rng r1
Step file: handoff/steps/step-05-rng.md
Base commit: ea1a9000ee9145e559ed2adfd101aa75adbda065     Head commit: 236443a8721f0710453b4b0d0c48043950280906     Branch: step/step-05-rng-r1     PR: opened by Chief Of Staff from the bundle
Node: v24.22.1     npm: 11.19.1     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
A	src/core/rng/index.ts
A	src/core/rng/rng.ts
A	tests/core/rng.test.ts

## Green
npm test: 72/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

## Decisions & deviations (5–10 lines)
- The golden next(), int(6), streamSeed and weighted counts (7528 and 2472) matched the first implementation. The vectors were not changed.
- A weight that is not a finite number greater than 0 counts as 0 and is skipped. If the roll never falls inside a weight, weighted returns the last positive index. -1 means there was no positive weight, and next() was not called.
- state() returns a fresh { a }. createRng(seed) is restoreRng({ a: seed >>> 0 }), so negatives, fractions and NaN are normalised and not rejected.
- int throws RangeError "int: maxExclusive must be an integer >= 1" before it draws. pick throws RangeError "pick: empty list" before it draws.
- streamSeed mixes UTF-16 code units and keeps the hash a uint32 with >>> 0 after each multiply. There is no module-level mutable state.

## Kit files used
- handoff/steps/step-05-rng.md (origin/main) 2b9cd31a0512b6dca07ecfede4077b3902e55429f12963c1c1f2ba024151712f
- BUILD_GUIDE.md (base ea1a900, §2 law 5 and law 10) 9f024be957ce41eabb06441ed4a3027ef007e5b8645c6791c3e6606d94ca1e20
- src/types/core-types.ts (base, pin confirmed, not imported) f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23

## Next step (optional proposal)
- step-06-pipes. The rng is not wired to a match or a log here.
