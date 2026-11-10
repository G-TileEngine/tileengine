# step-02-clock: the one clock (integer sim ms) and the turn fuse

Step id: step-02-clock          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `<base: main's SHA after step-01-state-tables was accepted>` (the Architect writes the hash here at publish; the diff is always `<base>..<head>`)
Branch: `step/step-02-clock-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-02-clock-r<N>.bundle <base>..step/step-02-clock-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`.
Hand-back location: in the repo, on that branch: `handback/step-02-clock/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-00-skeleton, step-01-state-tables (the fuse emits the `FUSE_EXPIRE` event type)
Read first: BUILD_GUIDE.md §2 law 1, M1; `handoff/change-notices/CN-001-sim-time-ms.md` (attached; binding)
Kit: kit-2, 2026-11-09. Engine Architect. The interfaces below were prototyped and run green (`npm run green`) on Node 24.22.1 against `src/types/core-types.ts` sha256 `055a182cee1b5b674388c63d0a316b3df5cb97626d383f9c9e86a65debd402a3`. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Build `src/core/clock`, the engine's only time source, as a pure scheduler with no frame loop of its own. The host (later `src/runtime/host/raf-driver.ts`, the single file allowed to use `requestAnimationFrame`) and tests feed it with `advance(dtMs)`. It runs whole fixed sim ticks, keeps sim time as **integer milliseconds** (`now() = tick() × stepMs`, CN-001), serves both tick-driven logic (`onTick`) and drawing (`onRender` with an interpolation `alpha`), supports pause / single-step / game speed, and runs sim-time timers. Then `src/rules/turns/fuse.ts`: the turn fuse option (an integer ms length such as 30000 ms / 60000 ms, or off) that emits `FUSE_EXPIRE` from a sim timer. Turn-based logic advances on events and tick-based logic on ticks, both on this one clock (M1). The same clock will later serve idle-RPG auto-combat and tower-defence waves, and offline catch-up, where the host passes the elapsed ms (capped) and the sim fast-forwards. None of that is built here, but nothing here may block it.

**CN-001 (binding):** sim time is integer milliseconds everywhere, never seconds or floats. `advance(dtMs)` takes an integer ≥ 0; timers take integer ms. A non-integer or negative argument is a programming error and throws `RangeError` (the host driver rounds its frame delta and carries the remainder; that is the driver's job, not the clock's).

**Game speed (ruling 2026-11-09):** speed x1 / x2 / x3 is the clock's `timeScale`. It makes more fixed steps run per host frame. It **never** changes `stepMs`. Every timer, including the fuse and later `BUILD_TIMER_EXPIRE` (tower defence), runs on engine sim ms, so it scales with game speed and stops while paused.

## Files to create or change
- delete `src/core/.gitkeep`
- create `src/core/clock/types.ts` — the quoted types (≤ 40 lines)
- create `src/core/clock/clock.ts` — `createClock` (≤ 120 lines)
- create `src/core/clock/index.ts` — re-exports (≤ 5 lines)
- create `src/rules/turns/fuse.ts` — `FuseMs`, `FuseSetting`, `startFuse` (≤ 20 lines)
- create `tests/core/clock.test.ts` (≤ 200 lines), `tests/rules/fuse.test.ts` (≤ 80 lines)

Size: ≤ 400 changed lines in total (prototype: 100 src).

## Interfaces to match (quoted exactly)
No core-types are needed by the clock (it has no format data). The fuse imports `Event` from `src/state/types.ts` (step 01).
```ts
// src/core/clock/types.ts
/** The one engine clock (BUILD_GUIDE §2 law 1, MODES-v1 M1, CN-001). Sim time is integer milliseconds: ticks × stepMs. */
export type ClockOptions = {
  readonly stepMs?: number;      // integer ≥ 1; fixed sim step; default 10
  readonly maxFrameMs?: number;  // integer ≥ 1; a host delta above this is clamped; default 100
  readonly timeScale?: number;   // default 1; see setTimeScale
};
export type TickInfo = { readonly tick: number; readonly simMs: number; readonly stepMs: number };
export type RenderInfo = { readonly simMs: number; readonly alpha: number; readonly dtMs: number };
export type SimTimer = { readonly id: number; readonly dueMs: number; cancel(): void };
export type Unsubscribe = () => void;

export interface Clock {
  advance(dtMs: number): void;
  step(): void;
  pause(): void;
  resume(): void;
  readonly paused: boolean;
  setTimeScale(x: number): void;
  readonly timeScale: number;
  now(): number;
  tick(): number;
  readonly stepMs: number;
  onTick(cb: (t: TickInfo) => void): Unsubscribe;
  onRender(cb: (r: RenderInfo) => void): Unsubscribe;
  after(ms: number, cb: () => void): SimTimer;
  onError(cb: (err: unknown) => void): Unsubscribe;
}
```
```ts
// src/core/clock/clock.ts
export function createClock(opts?: ClockOptions): Clock;

// src/rules/turns/fuse.ts
import type { Clock, SimTimer } from "../../core/clock/index.ts";
import type { Event } from "../../state/types.ts";
/** Turn fuse length in integer sim ms (CN-001), > 0. Any value is legal (user-adjustable, CEO);
 *  30000 and 60000 are suggestions only. The BTF preset's 60000 default is preset/project data, never core. */
export type FuseMs = number;
export type FuseSetting = "off" | FuseMs;
export function startFuse(clock: Clock, setting: FuseSetting, emit: (e: Event) => void): SimTimer | null;
```
Behaviour (exact; each line has a test):
1. **Options.** `stepMs` default 10, `maxFrameMs` default 100; a value that is not an integer ≥ 1 falls back to the default. Name both values in the Decisions note.
2. **advance(dtMs).** Throws `RangeError` unless `dtMs` is an integer ≥ 0. Clamp: `dt = min(dtMs, maxFrameMs)` (a long stall never runs a burst of more than `maxFrameMs × timeScale` sim ms). If not paused, add `dt × timeScale` to an accumulator and run one tick per whole `stepMs`. Keep the accumulator an **integer** (store it in quarter-milliseconds; see 5). Then call render subscribers once, paused or not.
3. **A tick.** `tick += 1`; `simMs = tick × stepMs`; first fire every live timer with `dueMs ≤ simMs` in `(dueMs, id)` order; then call tick subscribers in subscription order with `{ tick, simMs, stepMs }`.
4. **Render.** `{ simMs, alpha, dtMs }`: `alpha` = accumulator ÷ one step, in `[0, 1)`, and `0` while paused; `dtMs` = the clamped delta (0 for `step()`). `alpha` is for drawing only and is never sim time.
5. **Game speed.** `setTimeScale(x)` rounds to the nearest 0.25 and clamps to `[0, 8]` (non-finite → 0); `timeScale` reads it back (`setTimeScale(0.3)` → `0.25`). `0` freezes sim time while render keeps pumping. x1/x2/x3 are `1`, `2`, `3`.
6. **pause/resume/step.** `pause()` sets `paused` and drops the accumulator; `advance` then adds no ticks; `step()` runs exactly one tick (even while paused) and one render; `resume()` clears `paused`.
7. **Timers.** `after(ms, cb)` throws `RangeError` unless `ms` is an integer ≥ 0; `dueMs = now() + max(ms, stepMs)` (a 0 ms timer fires on the next tick, never re-entrantly). `cancel()` is idempotent. Timer ids start at 1 and increase.
8. **Errors.** A subscriber or timer that throws is reported to every `onError` listener with the thrown value; the remaining subscribers and timers in that tick still run. Every `on*` returns an unsubscribe function; unsubscribing during a callback is safe (iterate over a copy).
9. **Fuse (integer ms, CN-001; QA 2026-11-09).** The setting is already in ms; there is **no unit conversion** (no `* 1000`) anywhere. `startFuse(clock, ms, emit)` → `clock.after(ms, () => emit({ type: "FUSE_EXPIRE" }))` for any positive integer `ms` (30000 and 60000 are suggested values; the timer is user-adjustable, CEO). `ms` not an integer or `<= 0` → `RangeError` whose message starts `invalidValue:`. `"off"` → returns `null` and schedules nothing. The core has **no default**: the BTF preset's 60000 (CEO 2026-11-09) is preset/project data, passed in by the caller. Restarting or stopping a fuse is the caller's job (`timer.cancel()`).

## Worked example (stepMs 10, maxFrameMs 100)
| call | dt used | accumulator before → after (ms) | ticks run | `now()` after | render `alpha` |
|---|---|---|---|---|---|
| `advance(17)` | 17 | 0 → 7 | 1 | 10 | 0.7 |
| `advance(16)` | 16 | 7 → 3 | 2 | 30 | 0.3 |
| `setTimeScale(2)`; `advance(16)` | 32 | 3 → 5 | 3 | 60 | 0.5 |
| `pause()`; `advance(50)` | — | 0 (dropped) | 0 | 60 | 0 |
| `step()` | — | 0 | 1 | 70 | 0 |
| `resume()`; `setTimeScale(1)`; `advance(5000)` | 100 | 0 → 0 | 10 | 170 | 0 |
(The accumulator is shown in ms for reading; store it as an integer in quarter-ms.)

## Decisions note: what to name
- The two defaults (10, 100) and why you kept them; the game-speed rounding (nearest 0.25, range 0–8).
- Timer order `(dueMs, id)` and "timers before tick subscribers" inside one tick.
- That `advance` and `after` throw on non-integers (CN-001), and that the host driver owns rounding.
- Anything else you chose that this file doesn't state (BUILD_GUIDE law 12).

## Tests that prove it is done
Run: `npm test`, or `node --test tests/core/clock.test.ts tests/rules/fuse.test.ts`.
- `tests/core/clock.test.ts`
  - "same deltas give the same ticks": two clocks fed `[17, 16, 17, 33, 1, 250, 0]` give identical tick logs; `now()` is `180` (84 ms + 100 ms clamp = 184 → 18 ticks).
  - "1000 frames of 16 ms": `tick()` is 1600 and `now()` is 16000.
  - "a long stall is clamped": `advance(5000)` adds exactly 10 ticks.
  - "integer ms only": `advance(16.6)`, `advance(-1)`, `advance(NaN)` and `after(0.5, cb)` each throw `RangeError`; the clock state is unchanged after each.
  - "game speed runs more steps, same step size": with `setTimeScale(2)`, `advance(20)` adds 4 ticks and every `TickInfo.stepMs` is 10; `setTimeScale(3)`, `advance(10)` adds 3; `setTimeScale(0.3)` reads back `0.25`; `setTimeScale(0)` adds no ticks while render still fires.
  - "pause, step, resume": paused → 100 × `advance(100)` adds 0 ticks and render still fires 100 times with `alpha` 0; `step()` adds exactly 1; after `resume()` ticks continue.
  - "timers fire on sim time in due order": timers at 30, 10, 10 (created in that order) fire as `[b, c, a]`; a timer due at 30000 has not fired at `now() === 29990` and has fired at 30000; `cancel()` prevents firing and a second `cancel()` is harmless; `after(0)` fires on the next tick.
  - "a throwing subscriber is isolated": a throwing tick subscriber and a throwing timer are both reported via `onError`, and the next subscriber still runs on every tick.
  - "unsubscribe during a callback is safe".
  - "render alpha is in [0, 1)": after `advance(15)` with `stepMs` 10, `alpha === 0.5`.
- `tests/rules/fuse.test.ts`
  - "a 30000 ms fuse fires once at 30000 sim ms": fed 100 ms frames, `FUSE_EXPIRE` is emitted exactly once, on the frame where `now()` reaches 30000; a 45000 ms fuse (any value is legal) fires at 45000.
  - "60000 ms fuse at 60000; off never; bad values are invalidValue": `"off"` returns `null` and nothing is emitted after 120000 ms; `0`, `-1`, `1.5` and `NaN` each throw `RangeError` matching `/^invalidValue:/`.
  - "a paused clock stops the fuse": pause at 10000 ms, 1000 × `advance(100)`, resume: the fuse fires when sim time reaches 30000, not wall time.
  - "game speed x2 halves the frames needed": at `timeScale` 2, the 30000 ms fuse fires after 150 frames of 100 ms.

## BTF intent (read-only; a rewrite, nothing copied)
Keep the rules of `src/engine/clock.ts`: one loop (`:1`), a delta clamp (`:15`, 0.1 s there → `maxFrameMs` 100 here), error isolation (`:25-31`), `subscribe` returns an unsubscribe (`:51-56`). Dropped on purpose: the game import `frameRate` (`:3`), rAF inside the engine (`:20`, `:40`), `performance.now` (`:38`), a variable float `dt` in seconds (CN-001).

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/check-state.sh`, `scripts/check-law.sh`, `eslint.config.mjs`, `.dependency-cruiser.cjs`, `tsconfig.json` (change only by Change Notice).
- `package.json` and `package-lock.json`: no new dependency, no script change.
- `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`. Read BTF intent only from the file:line notes quoted here; never open or copy BTF code.
- `src/state/**` (read `Event` only).
- Any file of step 01 other than the deletion above.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 32. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and exits 0.
- [ ] `npm run check:law` prints `check:law OK (src)` and exits 0.
- [ ] `rg -n 'requestAnimationFrame|setTimeout|setInterval|Date|performance' src` prints nothing.
- [ ] `rg -n -i 'seconds|dtSeconds|\bsec\b' src/core/clock` prints nothing (CN-001).
- [ ] `rg -n 'phase' src/core` prints nothing (M2).
- [ ] `node --test tests/rules/fuse.test.ts` passes (FUSE_EXPIRE from sim time only).
- [ ] `rg -n '\* ?1000|1000 ?\*' src/rules/turns src/core/clock` prints nothing (no seconds-to-ms conversion; CN-001).
- [ ] Decisions note names `stepMs` 10, `maxFrameMs` 100, the quarter-step game-speed rounding and the `(dueMs, id)` timer order.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 400 changed lines (src + tests); each file within its size limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the files in "Files to create or change" (anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-02-clock/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Out of scope
- The host frame driver `src/runtime/host/raf-driver.ts` (runtime, later); frame-rate caps; UI for game speed.
- Persisting clock state (step 09's `SimSnapshot` will read `now()`, `tick()` and the accumulator through a later Change Notice; do not add a serialiser now).
- A second clock, a wall-clock fallback, or any "real time" helper.
- Turn and side bookkeeping, the match clock (`match_minutes`), restarting the fuse on each side.
- Offline catch-up (`SimSnapshot`, `replayTicks`, capped elapsed ms): step 09 and later. Idle auto-combat and TD waves: future modes.
