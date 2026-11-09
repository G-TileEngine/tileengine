# step-05-rng: seeded randomness: mulberry32, named streams, save and restore

Step id: step-05-rng          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (private; never push to `main`)
Base commit: `<base: main's SHA after step-04-units-occupancy was accepted>` (the Architect writes the hash here at publish; the diff is always `<base>..<head>`)
Branch: `step/step-05-rng-r<N>`, created from the base. Never commit to `main`. Finish with a PR to `main`.
Hand-back location: in the repo, on that branch: `handback/step-05-rng/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-00-skeleton (independent in code; ordered after 04)
Read first: BUILD_GUIDE.md §2 law 5, law 10
Kit: kit-2, 2026-11-09. Engine Architect. The interfaces below were prototyped and run green (`npm run green`) on Node 24.22.1 against `src/types/core-types.ts` sha256 `055a182cee1b5b674388c63d0a316b3df5cb97626d383f9c9e86a65debd402a3`. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Build `src/core/rng`: the engine's only source of randomness. mulberry32 with a single 32-bit integer state, plus `int`, `pick` and a weighted pick; named sub-streams so pool picks, AI and effects never disturb each other's sequences; and save/restore of the state so replay, saves and (later) offline catch-up continue the exact sequence. The seed is an input: the core never chooses one (a fresh seed at play start comes from the host; `stage.seed` from core-types is MAY-MOVE and read by the reader in step 08). The seed is written to the command-log header in step 07.

## Files to create or change
- create `src/core/rng/rng.ts` — everything below (≤ 80 lines)
- create `src/core/rng/index.ts` — `export * from "./rng.ts";` (1 line)
- create `tests/core/rng.test.ts` (≤ 160 lines)

Size: ≤ 250 changed lines in total (prototype: 60 src).

## Interfaces to match (quoted exactly)
No core-types are needed (`stage.seed` is read in step 08 and passed in as a number).
```ts
// src/core/rng/rng.ts — exported declarations
export type RngState = { readonly a: number };

export interface Rng {
  next(): number;
  int(maxExclusive: number): number;
  pick<T>(xs: readonly T[]): T;
  weighted(weights: readonly number[]): number;
  state(): RngState;
}

export function restoreRng(state: RngState): Rng;
export function createRng(seed: number): Rng;
export function streamSeed(seed: number, name: string): number;
```
Algorithm (exact; this is the public mulberry32, written fresh, not copied):
```ts
// state a is a uint32. One draw:
a = (a + 0x6d2b79f5) >>> 0;
let t = Math.imul(a ^ (a >>> 15), 1 | a);
t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;   // in [0, 1)
```
Behaviour (exact; each line has a test):
1. `createRng(seed)` = `restoreRng({ a: seed >>> 0 })`. Any number is accepted (`>>> 0` normalises it); the same seed always gives the same sequence.
2. `state()` returns `{ a }` after the last draw; `restoreRng(r.state())` continues the identical sequence. The state object is a plain JSON value.
3. `int(max)`: `max` must be an integer ≥ 1, else `RangeError` (a programming error). Returns `Math.floor(next() × max)`. Exactly one draw.
4. `pick(xs)`: empty list → `RangeError`; else `xs[int(xs.length)]`. Exactly one draw.
5. `weighted(weights)`: weights that are negative, `NaN` or infinite count as 0 (warn-not-block: no throw). All zero (or empty) → returns `-1` and makes **no** draw. Otherwise one draw: `roll = next() × total`; walk the positive weights in order, return the first index where `roll < w`, subtracting `w` as you go; if float residue leaves nothing, return the last positive index. A zero-weight index is never returned.
6. `streamSeed(seed, name)`: FNV-1a 32-bit over the UTF-16 code units of `name`, starting from `0x811c9dc5 ^ (seed >>> 0)`, multiplying with `Math.imul(h ^ code, 0x01000193)`; returns `h >>> 0`. Use: `createRng(streamSeed(matchSeed, "pool"))`. Stable across runs and platforms.
7. No module-level state, no global patching (never assign `Math.random`), no other randomness source.

## Golden vectors (commit these in the test; computed with the algorithm above)
- `createRng(0x5eed)`: first five `next()` =
  `0.7100320369936526, 0.286336648510769, 0.9519026265479624, 0.10175976227037609, 0.3784139291383326`;
  `state()` after them = `{ a: 567918774 }`.
- `createRng(0x5eed)`: first eight `int(6)` = `[4, 1, 5, 0, 2, 3, 1, 1]`.
- `streamSeed(0x5eed, "pool") = 605237462`, `streamSeed(0x5eed, "ai") = 2641247654`, `streamSeed(0, "") = 2166136261`.
If your implementation differs from any of these, your implementation is wrong; do not change the vectors.

## Tests that prove it is done
Run: `npm test`, or `node --test tests/core/rng.test.ts`.
- `tests/core/rng.test.ts`
  - "golden next() vector for seed 0x5eed": the five values and the state above, compared with `assert.equal` (exact floats).
  - "golden int(6) vector": the eight values above.
  - "same seed, same sequence": two `createRng(42)` agree on 1000 draws; `createRng(43)` differs within the first 3.
  - "restore continues identically": draw 17, save `state()`, draw 100 more; `restoreRng(saved)` reproduces those 100; `JSON.parse(JSON.stringify(saved))` works the same.
  - "int stays in range": 10,000 draws of `int(7)` are integers in `[0, 6]` and every value appears.
  - "int and pick reject bad input": `int(0)`, `int(2.5)`, `int(NaN)`, `pick([])` throw `RangeError`.
  - "weighted never picks a zero weight": with `createRng(1)`, 10,000 draws of `weighted([0, 3, 0, 1, -2, NaN])` return index 1 exactly 7528 times and index 3 exactly 2472 times, and nothing else.
  - "weighted with no positive weight returns -1 and draws nothing": `weighted([0, -1])` and `weighted([])` return `-1`; `state()` is unchanged.
  - "streams are stable and independent": the three `streamSeed` values above; drawing from the `"ai"` stream does not change the next value of the `"pool"` stream.
  - "no global patching": after creating and using several rngs, `Math.random` is still the original function.

## Test skeleton (start of `tests/core/rng.test.ts`; keep these two tests verbatim, write the rest)
```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRng, restoreRng, streamSeed } from "../../src/core/rng/index.ts";

test("golden next() vector for seed 0x5eed", () => {
  const r = createRng(0x5eed);
  const got = [r.next(), r.next(), r.next(), r.next(), r.next()];
  assert.deepEqual(got, [0.7100320369936526, 0.286336648510769, 0.9519026265479624, 0.10175976227037609, 0.3784139291383326]);
  assert.deepEqual(r.state(), { a: 567918774 });
});

test("golden int(6) vector", () => {
  const r = createRng(0x5eed);
  assert.deepEqual(Array.from({ length: 8 }, () => r.int(6)), [4, 1, 5, 0, 2, 3, 1, 1]);
});
```
(`restoreRng` and `streamSeed` are used by the later tests in the same file.)

## Worked example
`const r = createRng(0x5eed); r.weighted([0, 3, 0, 1])`
- positive total = 4; one draw: `next() = 0.7100320369936526`, `roll = 2.84012…`
- index 0: weight 0, skipped (never returned, no subtraction)
- index 1: weight 3, `2.84 < 3` → returns **1**
A second call draws again; `weighted([0, 0])` returns −1 and leaves `state()` untouched, so a caller can test for −1 without shifting the sequence.

## How later steps use this (context only; do not build)
- Step 07 writes the match seed into the command-log header `{seed, formatVersion, engineVersion, projectHash}`.
- Step 08 resolves weighted and waves enemy pools with the match rng (`streamSeed(seed, "pool")`), so the same seed gives the same placements.
- Step 09 stores `state()` in `SimSnapshot.rngState` and proves replay: same seed + same commands ⇒ identical state hash, headless.
- Idle catch-up (future) fast-forwards with the same rng: never a fresh seed on resume.

## Common mistakes QA rejects
- Returning `Math.floor(next() * max)` for a non-integer `max` instead of throwing.
- Drawing in `weighted` when every weight is zero (shifts every later value).
- Keeping the rng in a module-level variable, or exporting a shared default instance.
- Computing the FNV hash over UTF-8 bytes instead of UTF-16 code units (changes non-ASCII stream names).
- Changing the golden vectors to match the code.

## Decisions note: what to name
- That the vectors matched first time (or what you fixed).
- The residue rule in `weighted` and the `-1` sentinel.
- Anything you chose that the file doesn't state.

## BTF intent (read-only; a rewrite of a public 9-line algorithm)
Reference: `chess/game/towerTourney.ts:66-75` `mulberry32`. Not repeated: `:515` and `:643` `Math.random = mulberry32(...)` (patching the global); `towerLog.ts:4-8`, where `seed` is a counter, not a seed.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/check-state.sh`, `scripts/check-law.sh`, `eslint.config.mjs`, `.dependency-cruiser.cjs`, `tsconfig.json` (change only by Change Notice).
- `package.json` and `package-lock.json`: no new dependency, no script change.
- `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`. Read BTF intent only from the file:line notes quoted here; never open or copy BTF code.
- Every earlier step's files (`src/state/**`, `src/core/clock/**`, `src/core/grid/**`, `src/core/unit/**`, `src/core/notice.ts`, `src/rules/**`).

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 71. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and exits 0.
- [ ] `npm run check:law` prints `check:law OK (src)` and exits 0.
- [ ] `rg -n 'Math\.random|crypto' src` prints nothing.
- [ ] `rg -n '^(let|var) ' src/core/rng` prints nothing (no module-level mutable state).
- [ ] The golden vectors in `tests/core/rng.test.ts` equal the ones in this file, digit for digit.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 400 changed lines (src + tests); each file within its size limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the files in "Files to create or change" (anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-05-rng/r<N>/` complete per HAND-BACK.md; PR from `step/step-05-rng-r<N>` to `main` open; nothing committed to `main`.

## Out of scope
- Choosing a fresh seed (host / platform at play start), crypto-strength randomness, distributions beyond the four calls.
- Where streams are created and named for a match (the sim harness, step 09); logging the seed (step 07).
- Saving rng state into a save file or `SimSnapshot` (step 09 and later).
