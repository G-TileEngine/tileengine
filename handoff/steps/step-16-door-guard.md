# step-16-door-guard: fix the four holes the step-15 exploit hunter found — a shape guard at the one door, a safe `wrong kind`, caller-set stage limits, finite weights

Step id: step-16-door-guard          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `adce77478e54ae4b38274e5f38f3ef3588e9c0c1` (`adce774`, the step-15-exploit-hunter merge on `main`, PR #20; verified by the Engine Architect 2026-11-11: green 191/0, sim unchanged). The diff is always `<base>..<head>`.
Branch: `step/step-16-door-guard-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-16-door-guard-r<N>.bundle <base>..step/step-16-door-guard-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-16-door-guard/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-15-exploit-hunter (`runExploit`, `huntDocs`, `checkDoc`, `DocCaps`, the six smoke lines), step-14-bot-driver (the every-reject test), step-11-player-driver (`createPlayer`, `PlayerReject`), step-09b (`runMatch` seats), step-08-project-reader (`readStage`, `checkVersion`, `readMap`), step-10 (`BTF_FX_READ_LIMITS`: the pattern for caller limits in `src/btf-adapters`)
Read first: BUILD_GUIDE.md §2 laws 1, 4, 10, 11, 12, M6, M7; §3 (the `src/project/read/`, `src/sim/`, `src/btf-adapters/` rows); `handoff/steps/step-15-exploit-hunter.md` Behaviour 8 and "How later steps use this"; `docs/qa/step-15-review.md` ruling (3) (QA's B1–B4 repros); `docs/qa/chaos-player-invariants.md` (a)9 and (e)
Kit: kit-2, 2026-11-11. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 198/0) on Node 24.22.1 on top of the step-15 merge `adce774` (prototype r2 `72b4e5f`; first built on the step-15 prototype `3099a16`, same printed lines), against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004). `npm run sim` 48/2 and 22/28 and the four game-side chaos smokes are unchanged by this step.
Carries: **no Change Notice.** `PlayerReject` lives only in `src/sim/types.ts`; no pinned file (BUILD_GUIDE, STATES, core-types) lists the reasons, so a seventh reason needs no CN (step 15 flagged this as the only possible CN; it is not one). `src/btf-adapters` gains one data file importing a `src/project/read` type (allowed: no rule forbids it, as `fx-preset.ts` imports `src/fx` types). `.dependency-cruiser.cjs` (`dcf61c61…`), `package.json`, BUILD_GUIDE and STATES are unchanged. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Close the four real engine bugs the step-15 hunter found and QA reproduced on `main` (CEO 2026-11-11: step 16 is the small fix step, card-free levelling waits). (1) **B1, the door:** a wire input that is `null` or not an object, a `null`, missing or array intent, or a `TargetCell` whose `at` is not an object throws `TypeError` out of `runMatch` today. After this step it is a **named reject, `malformed`**, decided before any field of the input is read, with no event, no action and no change (the reject list grows to seven). (2) **B2:** `checkVersion` builds `wrong kind …` without calling `String()` on an object, so a `kind` with hostile `toString` / `valueOf` cannot throw out of any reader or `createWorld`. (3) **B3:** weighted `picks` and the units one wave adds (its `count`s summed) are capped by **caller-set `StageLimits`** passed to `readStage` (no defaults, no number in `src/project` or `src/sim`); over a cap is the hard error `bad field enemyPool`. BTF's values live in `src/btf-adapters` as data, like `BTF_FX_READ_LIMITS`. (4) **B4:** a weighted `weight` must be a finite number (`1e400` arrives as `Infinity`); otherwise `bad field enemyPool`. Plus one cheap observation fix: a map palette key `__proto__` is dropped **with a notice**, not silently. Then the step-15 known-bug test and pins flip: the six exploit smoke lines are **pinned with `assert.equal`** (QA residual 1) and read `failed 0` / `findings 0` with empty buckets, so the CEO's 25-clean-runs count can start.

Rulings in this step (CEO 2026-11-11, via Chief Of Staff; Engine Architect 2026-11-11):
- **Online is just another driver (CEO standing rule).** The guard is a shape check at the one door (`createPlayer().feed`), the same for touch, bot, chaos, hunter or a later online peer. `driver-phase.ts` only stops reading fields off the input itself; neither file names a player kind. No rule, phase or event changes.
- **What "malformed" means (exact, nothing more):** the fed `intent` is not a non-array object; or the `aim` is present (not `undefined` / `null`) and not a non-array object; or `intent.type === "TargetCell"` and `intent.at` is not a non-array object. Anything that is readable keeps its old reason: a numeric or unknown `type` stays `noEvent`, an `at` object with non-integer or out-of-range fields stays `offGrid`, an array `unitId` stays `noUnit`. A malformed step records `intent ?? null` and `aim ?? null` (JSON-safe, so `runChaos` records and replays it), `event` and `action` `null`, and is kept in `history()`.
- **Limits are the caller's (law 11).** `readStage(json, limits)` has a required `StageLimits`; `SimInput.stageLimits` carries the host's choice into `createWorld`; `DocCaps.limits` carries it into `checkDoc`. `src/sim` never imports `src/btf-adapters` (layer rule); tests pass `BTF_STAGE_LIMITS`. A hostile document is refused, never clamped.
- **BTF values (PROPOSED, pending CEO):** `BTF_STAGE_LIMITS = { picks: 144, waveUnits: 144 }`: BTF's largest official board is 12×12 = 144 cells, so no BTF stage can place more units than that. Bad limits themselves (not integers ≥ 0) are a `RangeError` (programmer error, not a document error).
- **The refusal names the top-level key**, `bad field enemyPool`, as every nested stage error already does (step 08's tested promise; (e)7's check matches `bad field <top-level key>`).
- **The hunter is not changed** except `checkDoc`'s one `readStage` call (it now passes `caps.limits`). Its (e)9 check still reports any accepted count above `maxCount`, so a caller whose limits are looser than its caps still gets the finding (tested).

## Files to create or change
- change `src/sim/player.ts`: `isObj`, `malformed`, and the guard at the top of `feed` (≤ 16 changed lines)
- change `src/sim/driver-phase.ts`: feed through a shaped copy, never `input.intent` / `input.aim` (≤ 9)
- change `src/sim/types.ts`: `"malformed"` in `PlayerReject`, `SimInput.stageLimits`, `DocCaps.limits`, one type import (≤ 12)
- change `src/sim/world.ts` (≤ 6) and `src/sim/exploit-docs.ts` (≤ 6): pass the limits to `readStage`
- change `src/project/read/stage.ts`: `StageLimits`, the two caps, finite weights, the `RangeError` (≤ 20); `src/project/read/index.ts`: export the type (≤ 6); `src/project/read/guard.ts`: the safe kind text (≤ 7); `src/project/read/map.ts`: the palette notice (≤ 10)
- create `src/btf-adapters/src/stage-limits.ts` (≤ 8); change `src/btf-adapters/src/index.ts` (≤ 5)
- create `tests/project/door-guard.test.ts` (≤ 45) and `tests/sim/door-guard.test.ts` (≤ 48)
- change `tests/sim/exploit.test.ts` (≤ 33), `tests/sim/exploit-docs.test.ts` (≤ 34), `tests/sim/bot.test.ts` (≤ 9), `tests/sim/input.ts` (≤ 7), `tests/sim/world.test.ts` (≤ 6), `tests/project/stage.test.ts` (≤ 13), `tests/project/guard.test.ts` (≤ 9), `tests/project/placements.test.ts` (≤ 7): pass `BTF_STAGE_LIMITS`, flip the step-15 pins

Size: ≤ 235 changed lines in total, counting insertions + deletions; the per-file caps above add up to 316 (prototype r2 on `adce774`: 168 insertions, 56 deletions = 224). No new fixtures. If you pass ~230, say so in Decisions.

## Interfaces to match (quoted exactly)
From step 15: `DocCaps`, `checkDoc`, `huntDocs`, `runExploit`. From step 11/09b: `IntentInput`, `PlayerReject`, `PlayerStep`, `SimInput`. From step 08: `readStage`, `checkVersion`, `ReadResult`. Import these; never retype them.
```ts
// src/project/read/stage.ts
/** Caller caps on loop-driving counts (step 16), no defaults: weighted `picks`, and the units one wave adds (its counts summed). */
export type StageLimits = { readonly picks: number; readonly waveUnits: number };
export function readStage(json: unknown, limits: StageLimits): ReadResult<CoreStage>;
// src/project/read/index.ts — the stage line becomes
export { readStage, stageSeed, type StageLimits } from "./stage.ts";
// src/btf-adapters/src/stage-limits.ts
/** BTF stage caps (PROPOSED, pending CEO): a 12x12 board has 144 cells, so no BTF stage can place more units than that. */
export const BTF_STAGE_LIMITS: StageLimits = { picks: 144, waveUnits: 144 };
// src/btf-adapters/src/index.ts — appended
export { BTF_STAGE_LIMITS } from "./stage-limits.ts";
// src/sim/types.ts
export type PlayerReject = "noEvent" | "illegal" | "noUnit" | "notOwn" | "offGrid" | "noAction" | "malformed";
// SimInput gains, after `chosen`:
  /** The stage reader's caps (step 16), the host's choice; no defaults. */
  readonly stageLimits: StageLimits;
// DocCaps gains a last field:  readonly limits: StageLimits
// src/sim/player.ts (module-private)
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
/** The door's shape guard (step 16): a fed value is read only after its shape is known; anything else is `malformed`. */
function malformed(intent: unknown, aim: unknown): boolean;
```
`src/sim/{actions,intents,run,driver-tick,chaos,chaos-gen,shrink,exploit,index}.ts`, `src/project/read/{placements,manifest}.ts` and `tests/fixtures/**` are unchanged.

Behaviour (exact; each line has a test):
1. **The door (B1):** `feed(intent, aim)` checks `malformed(intent, aim)` first, after reading the phase and before `intentEvent`; when true it returns and records `{ intent: intent ?? null, aim: aim ?? null, tick, from, event: null, action: null, reject: "malformed" }` and changes nothing (no phase write, no `submit`, `selected` kept). `runMatch` feeds each seat input as `feed(shaped.intent, shaped.aim)` where `shaped` is the input when it is a non-null object, else `{}`; it never reads `input.intent` / `input.aim`.
2. **Safe kind (B2):** a wrong `kind` gives `wrong kind object` for any object or array, else `wrong kind ${String(kind)}` (so `7`, `null`, `"map"` read as before).
3. **Stage limits (B3):** `readStage` throws `RangeError("readStage: limits must be integers >= 0")` when either limit is not an integer ≥ 0 (checked first); a weighted pool with `picks > limits.picks`, or a wave whose `count`s sum above `limits.waveUnits` (every wave, any turn), is `bad field enemyPool`; at the cap is accepted. `createWorld` reads with `input.stageLimits`, so an over-cap stage is `Error("stage: bad field enemyPool")`.
4. **Finite weights (B4):** a weighted entry whose `weight` is not a finite number is `bad field enemyPool`; `0` and negative weights still read (placement already treats them as unpickable).
5. **Palette notice:** a map whose `logic.palette` has an own `__proto__` key reads OK, the key is still not copied, and `notices` is `[{ code: "droppedKey", message: "palette key __proto__ dropped" }]` (both return paths); otherwise `[]`.

## Tests that prove it is done
Run: `npm test`. Common: the step-15 test helpers as on `main` at the base (`tools`, `opts`, `gen`, `only`, `run`, `caps` now with `limits: BTF_STAGE_LIMITS`); `input()` in `tests/sim/input.ts` sets `stageLimits: BTF_STAGE_LIMITS`.
Draw order: this step adds no random draw. Every pinned line below comes from the step-15 hunter as merged (`exploit.ts` untouched; `exploit-docs.ts` only passes `caps.limits`) and the test settings already on `main`; the draw schedule is the base's: the same code makes the same draws in the same order, and runs that used to stop at a B1 throw now keep drawing in that order (a malformed reject changes nothing in the world). If a pin is off, look at the guard or the limits, not the draws.
Three edits on `main`'s step-15 tests are needed (they are not new behaviour): the kinds test's `tag` reads `step.intent.type`, but a malformed step records `intent: null`, so read it as `String((step.intent as { type?: unknown } | null)?.type)` (that is the `undefined:malformed` tag); the huntDocs test's `"exploit-b"` check compares `.findings`, which are now both `[]`, so compare the whole reports; each smoke prints its line through an `if`/`else` and prints no failure or finding, so make it one `t.diagnostic(line); assert.equal(…)` line and print each failure (with its run) or finding with `t.diagnostic(JSON.stringify(…))`, keeping two `t.diagnostic(` lines per file.
- `tests/sim/door-guard.test.ts`
  - "the door's shape guard (B1): …": stage-fixed, phase `idle`, own select first; then `undefined`, `null`, `7`, `"SelectUnit"`, `[]`, Confirm with aim `"x"` and `[0,7]`, `TargetCell` with no `at`, `at: null`, `at: [0,7]`, `at: "0,7"` each give `["malformed", null, null, "unitSelected", <intent ?? null>, <same fingerprint>]`; `at {c:"0",r:7}` is `offGrid`; `Hack` with an aim is `noEvent`; then a real tap moves `knight#1`; 11 malformed steps in history.
  - "runMatch never throws on a wire input of any shape (B1): …": nine JSON shapes after an own select (`null` … `{"intent":{"type":"TargetCell","at":null}}`) → rejects `[null, …nine "malformed"]`, units unchanged, no throw.
  - "createWorld reads the stage under the host's stageLimits: …": picks 145 → `/^Error: stage: bad field enemyPool$/`; hostile kind → `/^Error: stage: wrong kind object$/`; picks 144 at a cap of 144 loads.
- `tests/project/door-guard.test.ts`: "B2: …" (object, array and `{}` kinds → `wrong kind object` in all three readers; `7`, `null`, `"stage"` as before); "B3: …" (limits `{ picks: 4, waveUnits: 5 }`: picks 4 ok, 5 and 1e9 with repeats refused; wave sums 5 ok, 6 and 1e9 refused, a turn-1 wave at the cap reads; three bad limits → `RangeError`; `BTF_STAGE_LIMITS` value; both fixtures read); "B4: …" (±Infinity refused; 0, −1, 2.5 ok); "a map palette key __proto__ …" (no own key, `"0"` kept, the one notice; fixture `[]`).
- `tests/sim/bot.test.ts` "every reject reason is reached…": also feeds `{"type":"TargetCell","at":null}` → `malformed`; `listed` has seven reasons; history 11.
- `tests/sim/exploit.test.ts`: kinds test `cell` → `SelectUnit:ok TargetCell:malformed TargetCell:offGrid`, `phase` adds `Confirm:malformed`, `shape` → `SelectUnit:ok TargetCell:malformed undefined:malformed`, failure null for every kind; the known-bug test becomes "door guard (step 16, was B1): …" (seeds 1–30, `only("shape")`: failure null, replay gives the same hashes, the malformed intents seen are exactly `[]`, `null`, `{"type":"TargetCell","at":null}`, `{"type":"TargetCell"}`, all eight shapes sent). The smoke pins its four lines (`t.diagnostic(line); assert.equal(line, PINS[…])`):
  - `exploit smoke stage-fixed seeds 1-20 all kinds: runs 20 failed 0 steps 1604 rejects 309 buckets []`
  - `exploit smoke stage-fixed seeds 1-20 no shape: runs 20 failed 0 steps 1617 rejects 367 buckets []`
  - `exploit smoke stage-weighted seeds 1-20 all kinds: runs 20 failed 0 steps 2043 rejects 480 buckets []`
  - `exploit smoke stage-weighted seeds 1-20 no shape: runs 20 failed 0 steps 2299 rejects 592 buckets []`
- `tests/sim/exploit-docs.test.ts`: checkDoc — hostile kind `"refused"` for stage, map and manifest; picks 1e9 and weight 1e400 `"refused"`; with limits `{ picks: 2e9, waveUnits: 0 }` picks 1e9 still gives `(e)9 "key picks above 10000"`; bad limits give `(e)6 "RangeError: readStage: limits must be integers >= 0"`. huntDocs seed 1 × 500: accepted 157, refused 343, findings `[]`; with limits `2e9` the two `(e)9 stage enemyPool.picks` findings return and replay. The docs smoke pins (`assert.equal(line, DOC_PINS[name])`): `exploit docs smoke stage-fixed seeds 1-5: tries 2000 accepted 581 refused 1419 findings 0 buckets []` and `exploit docs smoke stage-weighted seeds 1-5: tries 2000 accepted 607 refused 1393 findings 0 buckets []`.
- Unchanged: `npm run sim` prints the base's two lines; the four chaos smoke lines are as at the base (`… runs 50 failed 0 steps 3120 rejects 0`, `… 5542 rejects 0`, `… runs 20 failed 0 steps 1730 rejects 278 shrunk 0->0`, `… 3154 rejects 563 shrunk 0->0`).
Pins are equality checks on report lines, not a gate on `failed`: a smoke may still print a failure and must replay it; a changed line fails green so a silent bucket change cannot hide (QA step-15 residual 1).

## How a planted bug is caught (for QA; prototype r2 `72b4e5f` on `adce774`; reverted after each; `/tmp/s16-plants-r2.sh` on the Architect's box)
| Plant (one edit) | Tests that fail (of 198), by name |
|---|---|
| B1: guard removed / `at` null or missing passes / malformed reported as `noEvent` | shape, runMatch, door-guard (was B1), kinds and every-reject tests (plus the intent smoke pin for the first two) |
| B1: driver reads `input.intent` again (a `null` input throws) | runMatch, door-guard, kinds, intent smoke pin |
| B1: array intent counts as an object / aim not checked / malformed step not in history | shape (+ runMatch, door-guard, kinds; kinds; every-reject) |
| B2: `String(found)` again / an array kind not named `object` | B2, createWorld, checkDoc, huntDocs, docs smoke pin / B2 |
| B3: no picks cap / `>=` off by one / no wave cap / per-entry wave cap / bad limits accepted / BTF value changed | B3 (+ createWorld, checkDoc, huntDocs for the first; createWorld for the second and last) |
| B3: `createWorld` ignores `stageLimits` / `checkDoc` ignores `caps.limits` | createWorld / checkDoc, huntDocs |
| B4: infinite weights accepted / negative weights refused too (over-fix) | B4, checkDoc, huntDocs, docs smoke pin / B4, docs smoke pin |
| palette notice dropped / palette `__proto__` kept as an own key | palette (+ checkDoc, docs smoke pin for the second) |
| a reader throw counted as refused (step 15 H12 kept live) / either smoke drops its last seed | checkDoc / the smoke's pin |

All 24 test plants fail at least one named test. Grep plants (12/12 caught by Acceptance): the driver reads a wire field; a field read before the guard; `String(json.kind)` back; a cap literal in `src/sim`; `src/sim` imports `btf-adapters`; a smoke pin removed; a smoke asserting `failed 0`; a hostile word in the door; an extra file; the hunter edited; `core-types.ts` touched; a rules word in the stage reader.

## Example
```ts
const world = createWorld({ ...input, stageLimits: BTF_STAGE_LIMITS });   // host passes the caps; a 10^9-pick stage is "stage: bad field enemyPool"
const step = player.feed(JSON.parse(peerText).intent, aim);             // null / non-object / at:null → step.reject === "malformed", nothing changed
```

## How later steps use this (context only; do not build)
- QA can start the CEO's 25-clean-runs count on the six pinned lines (report-only until then). QA adds `malformed` to the (a)9 reject list in `docs/qa/chaos-player-invariants.md` (QA-owned).
- Step 17 (memory guard, CEO 2026-11-11): clean dispose safe to call twice, an event-bus history cap with the match log kept for the whole match, a freed-world GC test that may block, and a report-only heap-growth smoke. Step 18: card-free levelling.
- Later exploit slices (saves, imports, rewards, online peers) read through limits the same way; raw-text size limits stay with the online add-on's parser.

## Decisions note: what to name
- Why `malformed` is exactly the three shapes (what would throw, plus a non-object aim) and why readable-but-wrong values keep their old reason.
- How the driver avoids reading the input (the shaped copy) and why the recorded intent is `intent ?? null`.
- Why limits are required (no default) and refused, not clamped; why the error names `enemyPool`.
- Anything you chose that the file doesn't state (law 12).

## BTF intent (read-only)
None (rewrite). BTF's online code trusts its own client and its stage loader has no caps. Values only: BTF's 12×12 board (`BTF_STAGE_LIMITS`, PROPOSED). Intent: BTF `BUILD_LAW.md` rule 10 (one door for every seat).

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/**`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `src/core/**`, `src/state/**`, `src/rules/**`, `src/fx/**`, `src/runtime/**`, `src/index.ts`, `src/btf-adapters/src/{fx-preset,lane-labels}.ts`, `src/project/read/{placements,manifest}.ts`, `src/sim/{actions,intents,run,driver-tick,chaos,chaos-gen,shrink,exploit,index}.ts`.
- `tests/fixtures/**` and every test and helper not in the file list (`tests/sim/{ai,seats}.ts` included).
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 198; `rg -n '\.(only|skip|todo)\(' tests` prints nothing.
- [ ] `npm run sim` prints exactly the base's two lines (`… win 48 lose 2 … afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `… win 22 lose 28 … b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`); the four chaos smoke lines are as at the base; the six exploit smoke lines are as in "Tests".
- [ ] `npm run check:state` / `check:law` print OK; `npm run deps` reports no violations; `sha256sum .dependency-cruiser.cjs src/types/core-types.ts package.json` prints `dcf61c61fef3d0fce8a6a14c98b1cc5f6ea9c0298c843236fa6fca9c8f798628`, `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23`, `1e5dd82cb52db7ffbff747b020ec550b383b9c7a1164f182a8b0e793a60088c5`.
- [ ] Door: `rg -n --pcre2 '\binput\.(intent|aim)\b' src/sim/driver-phase.ts` nothing; in `src/sim/player.ts` the guard line `if (malformed(intent, aim)) {` is one line and comes before the first `intentEvent(`; `PlayerReject` is exactly the quoted seven.
- [ ] Kind: `rg -n 'String\(' src/project/read` prints one line (the guarded kind text in `guard.ts`).
- [ ] Limits are inputs: `rg -n --pcre2 '\b(144|10000|1e4|1e9)\b|limits\s*(\?\?|=)\s*\{|(picks|waveUnits)\s*:\s*\d' src/project src/sim` nothing; `rg -l BTF_STAGE_LIMITS src` lists only the two `src/btf-adapters/src` files; `rg -n --pcre2 "from ['\"][^'\"]*/(fx|btf-adapters)/" src/sim src/project` nothing; `world.ts` reads `readStage(input.stage, input.stageLimits)` and `exploit-docs.ts` `readStage(doc, caps.limits)`.
- [ ] Report-only, now pinned: `rg -n --pcre2 '\bt\.diagnostic\(' tests/sim/exploit.test.ts` and `… tests/sim/exploit-docs.test.ts` two lines each; `rg -n --pcre2 'failed, 0|failed === 0|findings\.length(, | === )0|buckets\.size, 0' tests/sim/exploit*.test.ts` nothing; the six pinned strings appear once each; `rg -nF 'known engine bug' tests src` nothing.
- [ ] The door is still blind: `rg -n -i --pcre2 '\b(bot|online|peer|remote|human|touch|chaos|network|exploit|hostile|wire)\b' src/sim/driver-phase.ts src/sim/player.ts` nothing; the step 11–15 law greps still print nothing (one clock, no host crypto/process, no side literals in `src/sim`, phases written whole, nothing imports sim, no I/O, rules words incl. `gold|currency|reward` also over `src/project/read/stage.ts` and `src/btf-adapters/src/stage-limits.ts`); one `submit(` in `player.ts`.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the 21 files of the file list (`A` for the three created, `M` for the rest); `git diff --stat` ≤ 235 changed lines, each file within its cap.
- [ ] Hand-back `handback/step-16-door-guard/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (deferred; flagged, do not invent)
- The 25-clean-runs counter and the blocking switch (CEO gate; QA vets each block first). Editing `docs/qa/chaos-player-invariants.md` (QA) and `docs/chaos-player-outline.md` (its stale §9 line is proposed in the Architect's report, not edited here).
- Raw-text size and nesting limits on wire text and documents (the online add-on's parser; a map's `cols × rows` and array lengths are bounded only by document size today), a cap on the number of turn-0 waves, out-of-turn intents, dead-unit intents, exploit-record shrink, `chaos:replay`, nightly seeds.
- Checking `intent.type` is a string, or `at` fields are integers, at the door (readable values keep their reasons; `offGrid` / `noEvent` already cover them).

## Out of scope
- Any game rule (move range, once-per-turn, attacks, HP), networking, lobbies, memory or dispose work (step 17), levelling (step 18).
