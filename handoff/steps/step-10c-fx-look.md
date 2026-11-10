# step-10c-fx-look: drawing-side look ramps, release, and seeded copies for the FX painter

Step id: step-10c-fx-look          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `1565a0f40722ef9fe8d181d5641bee2acb682e70` on `main` (docs-only fast-forward on `d9ca13b`, the step-10b merge; the code matches `d9ca13b`); the diff is always `1565a0f..<head>`
Branch: `step/step-10c-fx-look-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-10c-fx-look-r<N>.bundle 1565a0f40722ef9fe8d181d5641bee2acb682e70..step/step-10c-fx-look-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-10c-fx-look/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-10b-fx-timeline (`src/fx/order/**`, `readFxOrder`, `planFx`, `planEffect`, `BTF_FX_PRESET`, `BTF_FX_READ_LIMITS`, `BTF_FX_FLIGHT`), `Notice` (`src/core/notice.ts`)
Read first: BUILD_GUIDE.md §2 laws 1, 4, 7, 10, 12; §3 (the `src/fx/` and `src/btf-adapters/` rows, CN-007); §5; `docs/effect-order-from-docs.md` §A rules 9, 11 and 12 (attached; sha256 `f9312b8369aea1cd8df498a800f6db9397dd26c00d94cba4d69a83da420788e5`); `handoff/change-notices/CN-007-fx-layer.md` (binding; unchanged)
Kit: kit-2, 2026-11-10. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 161/0) on Node 24.22.1 on top of `main` `1565a0f`, against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004): every type quoted here is new or is `FxOrder` with two added fields; `FxStep` is unchanged. `main` `1565a0f` is green with it (Architect check, 157/0; `npm run sim` 48/2 and 22/28, unchanged by this step).
Carries: no Change Notice. `src/fx` still imports only `src/types` and `src/core` (CN-007), `.dependency-cruiser.cjs` and BUILD_GUIDE are unchanged. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Give the FX painter the rest of one ability's drawing data, as cue data and pure functions on the one clock. `readFxOrder` fills a parallel `styles` array (look, release, spread, whether the step is a volley or can carry copies). `planLook(order, tune)` walks the playing steps and returns per-step looks, the effective release, and per-copy offsets; `lookAt` and `copyAt` evaluate a fraction through a step. Tunable clamps, the copy hash and the ease-in-out coefficient are the caller's `FxLookTune` (like `FxFlight`); the BTF values live in `BTF_FX_LOOK` in `src/btf-adapters`, never as literals in `src/fx`. No new `FxOptions` keys. Cues stay engine sequencing data, **not game rules** (no HP, mana, cost or damage numbers in `src/`). The painter itself is a later rewrite.

This step covers `effect-order-from-docs.md` §A rules 9, 11 and 12. Step 10b's `planEffect`, landing tile and options are unchanged.

Rulings in this step (CEO 2026-11-09 and 2026-11-10, via Chief Of Staff; Engine Architect 2026-11-10):
- **No frozen BTF copy; current play is the default; every alternative is a project option, one order everywhere** (as in steps 10 and 10b). Do not open or read `/workspace/g-tile-engine`. The four 10b CEO rulings (`landing_neighbours`, `landing_across_seam`, `pierce_flight`, `impact_burst`) stay CEO-ruled; this step adds no option key. Look ease, release and copy spreads are fields of the effect-order document, not project options.
- **JSON wins** when the paragraph and the JSON disagree (§A1). Copy start spread in the JSON is `spread.delay`, a fraction of the step (SKILLRIG.md:176); copies still arrive together. The paragraph's "how far apart they begin" (a spatial gap) is not implemented; see "Not in this step".
- **Layer (CN-007, unchanged):** `src/fx/**` imports only `src/types/**` and `src/core/**`; `src/btf-adapters` imports `src/fx` types only; rules may import fx, never btf-adapters.
- **Time:** integer sim ms (CN-001), one clock. Every fraction of a step becomes whole ms with `Math.round` (round half up, RaiKynn 2026-11-10). `src/fx` never creates, advances or steps a clock.
- **Numbers:** no new numeric literal in `src/fx`. `FX_FORMAT` stays the five numeric lines from step 10b. Comments elsewhere in `src/fx` carry no digits. Tunables are `FxLookTune`.
- **`planLook` never reads `order.raw`.** Loop and speed stay preview-only (§A18). `planEffect` and `planFx` are unchanged and still never read `styles`.

## Files to create or change
- change `src/fx/order/types.ts`: insert the quoted `FxRelease`…`FxStyle` block before `FxOrder`, add `styles` and `inactiveStyles` to `FxOrder`, append the quoted `FxLookTune`…`FxCopySample` types (≤ 63 changed lines)
- change `src/fx/order/read.ts`: parse `styles` / `inactiveStyles` and read `kind` from `motion.kind` when `row.kind` is absent, as specified below (≤ 58 changed lines)
- create `src/fx/order/look.ts`: `easeAt`, `lookAt`, `copyAt`, `planLook` (≤ 118 lines)
- change `src/fx/order/index.ts`: the quoted exports (≤ 7 changed lines)
- change `src/btf-adapters/src/fx-preset.ts`: add `FxLookTune` to the type import; append the quoted `BTF_FX_LOOK` (≤ 14 changed lines)
- change `src/btf-adapters/src/index.ts`: the quoted file (≤ 6 changed lines)
- create `tests/fx/look.test.ts` (≤ 116 lines)

Size: ≤ 382 changed lines in total, counting insertions + deletions; the per-file caps above add up to 382 (prototype: 343 insertions, 11 deletions = 354). No new fixtures. If you pass ~360, say so in Decisions.

## Interfaces to match (quoted exactly)
From step 10b: `FxOrder` (now with `styles` / `inactiveStyles`), `FxStep`, `FxRead`, `readFxOrder`, `FX_FORMAT`, `planFx`, `planEffect`. `Notice` from `src/core/notice.ts`. Import these; never retype them. `FxStep` stays `{ kind, ms }`.
```ts
// src/fx/order/types.ts — insert this block immediately before `export type FxOrder`
export type FxRelease = "together" | "split";
export type FxEase = "linear" | "out" | "in-out";
export type FxRamp = { readonly from: number; readonly to: number };
export type FxLook = {
  readonly ease: FxEase;
  readonly tint: { readonly from: string; readonly to: string } | null;
  readonly scale: FxRamp | null;
  readonly glow: FxRamp | null;
  readonly fade: FxRamp | null;
};
export type FxSpread = { readonly jitter: number; readonly delay: number; readonly scale: number };
export type FxStyle = {
  readonly release: FxRelease;
  readonly look: FxLook;
  readonly spread: FxSpread;
  readonly volley: boolean;                    // a row, a spin, or a free-fire: copies may spread
  readonly carry: boolean;                     // a straight, a swerve, or a bounce: a later step may keep copies
  readonly lock: "target" | "free" | null;
  readonly count: number | null;
};
```
`FxOrder` gains two fields, still directly after `inactive` and before `connect`:
```ts
  readonly styles: readonly FxStyle[];        // drawing data, one per playing step (look, release, copies)
  readonly inactiveStyles: readonly FxStyle[]; // styles past the cap: kept, never played
```
```ts
// src/fx/order/types.ts — append after `FxEffectPlan`
/** Painter-facing look, release and copy data. Tunable clamps and the copy hash live in the caller's FxLookTune. */
export type FxLookTune = {
  readonly jitterMax: number;
  readonly delayMax: number;
  readonly spreadScaleMax: number;
  readonly lookScaleMin: number;
  readonly lookScaleMax: number;
  readonly lookGlowMax: number;
  readonly copyScaleMin: number;
  readonly copyScaleMax: number;
  readonly fillCount: number;
  readonly unitA: number;
  readonly unitB: number;
  readonly unitC: number;
  readonly scaleLane: number;
  readonly inOut: number;
};
export type FxCopy = {
  readonly index: number;
  readonly dc: number;
  readonly dr: number;
  readonly scale: number;
  readonly lag: number;
  readonly startMs: number;
};
export type FxStepLook = {
  readonly index: number;
  readonly at: number;
  readonly ms: number;
  readonly look: FxLook;
  readonly release: FxRelease;
  readonly copies: readonly FxCopy[];
};
export type FxLookPlan = { readonly steps: readonly FxStepLook[]; readonly endMs: number; readonly notices: readonly Notice[] };
export type FxLookSample = { readonly k: number; readonly tint: FxLook["tint"]; readonly scale: number | null; readonly glow: number | null; readonly fade: number | null };
export type FxCopySample = { readonly u: number; readonly hidden: boolean; readonly scale: number; readonly dc: number; readonly dr: number };
```
```ts
// src/btf-adapters/src/fx-preset.ts — add FxLookTune to the existing type import; append this const after BTF_FX_READ_LIMITS
/** BTF look and copy tunables (SKILLRIG normalize/paint): spread and look clamps, the copy hash, and ease-in-out. */
export const BTF_FX_LOOK: FxLookTune = {
  jitterMax: 0.8, delayMax: 0.75, spreadScaleMax: 0.6,
  lookScaleMin: 0.35, lookScaleMax: 2.6, lookGlowMax: 48,
  copyScaleMin: 0.35, copyScaleMax: 1.8, fillCount: 6,
  unitA: 127.1, unitB: 311.7, unitC: 43758.5453, scaleLane: 3, inOut: 3,
};
```
```ts
// src/fx/order/index.ts — the whole file
export type { FxBody, FxCopy, FxCopySample, FxCue, FxEase, FxEffectPlan, FxFlight, FxLook, FxLookPlan, FxLookSample, FxLookTune, FxOptions, FxOptionsRead, FxOrder, FxPlan, FxRamp, FxReact, FxRead, FxReadLimits, FxRelease, FxShot, FxSpawn, FxSpread, FxStep, FxStepLook, FxStyle } from "./types.ts";
export { FX_DOC_DIFFERS, FX_OPTION_VALUES, readFxOptions } from "./options.ts";
export { FX_FORMAT, readFxOrder } from "./read.ts";
export { planFx, playFx } from "./timeline.ts";
export { planEffect } from "./effect.ts";
export { pickLanding } from "./landing.ts";
export { copyAt, easeAt, lookAt, planLook } from "./look.ts";
```
```ts
// src/btf-adapters/src/index.ts — the whole file
export { BTF_FX_FLIGHT, BTF_FX_LOOK, BTF_FX_PRESET, BTF_FX_READ_LIMITS } from "./fx-preset.ts";
export { laneIdToSq, sqToLaneId } from "./lane-labels.ts";
```
```ts
// exported functions (new), in src/fx/order/look.ts
export function easeAt(u: number, ease: FxEase, tune: FxLookTune): number;
export function lookAt(look: FxLook, u: number, tune: FxLookTune): FxLookSample;
export function copyAt(spread: FxSpread, index: number, raw: number, tune: FxLookTune): FxCopySample;
export function planLook(order: FxOrder, tune: FxLookTune): FxLookPlan;
```
`planFx`, `playFx`, `planEffect`, `pickLanding`, `readFxOptions` and `timeline.ts` / `effect.ts` / `landing.ts` / `options.ts` are unchanged. `readFxOrder`'s signature and limits are unchanged.

Reader (exact). For each frame, `kind` is `row.kind` when that is a string, else `motion.kind` when `motion` is a plain object with a string `kind`, else `null` (so a SkillRig paste whose kind lives under `motion` still fills a missing connect at `FX_FORMAT.reelConnect` when the last playing step is a reel). A missing look, release or spread is filled with no notice: ease `"linear"`, every look channel `null`, release `"together"`, spread `{ jitter: 0, delay: 0, scale: 0 }` (those are the document defaults, not repairs). `release` is `"split"` only when the field is the string `"split"`. `look.ease` is `"out"`, `"in-out"` or `"linear"` (any other value, including a present but bad ease, becomes `"linear"`). `tint` is `{ from, to }` only when both are strings; otherwise `null`. A ramp is `{ from, to }` when at least one of `from`/`to` is a finite number (a missing side copies the one that is present); otherwise `null`. A spread field that is not a finite number is `0`. `lock` is `"free"` or `"target"` from `motion.lock`, else `null`. `count` is `motion.count` when that is a finite number, else `null`. `volley` is true when `kind` is `"row"` or `"orbit"`, or when `kind` is `"straight"` and `lock` is `"free"`. `carry` is true when `kind` is `"straight"`, `"swerve"` or `"bounce"`. `styles` lines up with `steps`, `inactiveStyles` with `inactive`.

Behaviour (exact; each line has a test). Below, `unit(i, lane)` is `x % 1`, plus one when that is negative, where `x = Math.sin(i × tune.unitA + lane × tune.unitB) × tune.unitC` (current play: a hash of the copy index, not the match RNG). Lane `0` is `dc`, `1` is `dr`, `2` is lag, `tune.scaleLane` is size. `planLook` throws `RangeError("planLook: tune out of range")` when any tune field is not a finite number, when `jitterMax < 0`, `delayMax` is outside `0…1`, `spreadScaleMax < 0`, a min is above its max, `lookGlowMax < 0`, or `fillCount` is not an integer in `2…FX_FORMAT.maxTaps`.
1. **Look ramps (§A9, SKILLRIG.md:176, :110):** `easeAt` clamps `u` to `0…1`; `"linear"` returns `t`; `"out"` returns `1 - (1 - t) × (1 - t)`; `"in-out"` returns `t × t × (tune.inOut - 2 × t)` (BTF `inOut` is 3). `lookAt` uses `k = easeAt(u, look.ease, tune)`. A null channel stays `null` (the painter holds the saved blade; the trail stays the saved blade and is not a look channel). A present ramp becomes `from + (to - from) × k`; `tint` is passed through as `{ from, to }` (the painter mixes colour). `look.ease` is not the motion ease.
2. **Release (§A11, SKILLRIG.md:101-106):** on a playing step with index `≥ 1` whose style `carry` is true, `release` is the stored value (`"together"` or `"split"`). On the first step, and on a step that does not carry (a spin, a row, a reel, a cone, a scratch, a trace), effective `release` is `"together"` even if the frame said `"split"`. Copies on a split (or together) carry leave at the same `startMs` (they leave together in time). The split curve itself is the painter's job.
3. **Copies (§A12, SKILLRIG.md:116, :176):** a `volley` style (row, spin, free-fire) applies spread. A row or spin (`volley` and `lock` is not `"free"`) has `n` copies: `count` when it is an integer, else `tune.fillCount` with one `fxFilled` notice; then clamp to `2…FX_FORMAT.maxTaps` with one `fxClamped` if it changed; that `n` is carried forward. A free-fire (`lock === "free"`) on the first step is one copy with spread; a later straight, swerve or bounce keeps the carried `n`. A lock-on, swerve, bounce, reel or other non-volley does not apply spread (`dc`/`dr` `0`, `scale` `1`, `lag` `0`); a non-carry step resets the carried count to 1. Zero jitter, delay and size keep the copies identical. The same inputs give the same `planLook` and `copyAt` every time.
4. **`copyAt` and arrival:** lag is `unit(index, 2) × clamp(delay, 0, delayMax)`. Local time is `raw` when delay is 0, else `(raw - lag) / (1 - delay)` clamped to `0…1`, so every copy reaches `u === 1` at `raw === 1` (they arrive together). The copy is `hidden` while `raw < lag`. Size is `1 + (unit(index, scaleLane) × 2 - 1) × size`, clamped to `[copyScaleMin, copyScaleMax]`. `dc`/`dr` are `(unit(index, lane) × 2 - 1) × jitter` (lanes 0 and 1), or `0` when jitter is 0 (not minus-zero). `startMs` is the step start plus `Math.round(lag × step.ms)`.
5. **Clamps and raw:** `planLook` clamps look scale to `[lookScaleMin, lookScaleMax]`, glow to `[0, lookGlowMax]`, fade to `[0, 1]`, and spread fields to their maxima, each changed group one `fxClamped` notice. `endMs` is the sum of the playing steps' `ms`. `planLook` does not move the hit and does not read `order.raw`.

## Tests that prove it is done
Run: `npm test`, or `node --test tests/fx/*.test.ts`. Each new fx test name starts with the §A rule(s) and the doc line(s) it proves. In `tests/fx/look.test.ts`, orders are read with `BTF_FX_READ_LIMITS` from blocks `` `SKILLRIG v1\n\n${JSON.stringify({ frames, connect: 0.5, ...extra })}\n` ``; the tune is `BTF_FX_LOOK` unless a throw case overrides it. Existing fx tests stay green without edits (`FxStep` is unchanged; a missing look/release/spread adds no notice).
- `tests/fx/look.test.ts`
  - "§A9 SKILLRIG.md:176, :110 — look channels ramp across the step with look.ease; a null channel holds the blade": at `u` 0.5, `easeAt` linear is 0.5, out is 0.75, in-out is 0.5, and out ≠ linear. A flat look (all channels null, ease linear) samples `{ k: 0.5, tint: null, scale: null, glow: null, fade: null }`. A look with ease `"out"`, tint `#111111`→`#eeeeee`, scale 1→2, glow 0→10, fade 0→1 samples `k` 0.75, the same tint pair, scale 1.75, glow 7.5, fade 0.75. A frame `{ kind: "straight", seconds: 0.5, look: { ease: "out", scale: { from: 1, to: 2 } } }` reads that look (other channels null) and release `"together"`. A frame with no look reads the flat look; `planLook` notices `[]`.
  - "§A11 SKILLRIG.md:101-106 — release is together or split on a later straight, swerve or bounce; they leave together in time": an orbit of count 4 (release `"split"`) then a lock-on straight (release `"split"`, 0.5 s) → step 0 release `"together"`, 4 copies; step 1 release `"split"`, 4 copies, every `startMs` 400. A first-step split lock-on → release `"together"`, 1 copy. The same orbit then a swerve `"together"` keeps 4 copies and release `"together"`; then a bounce `"split"` → `"split"`; then a reel `"split"` → `"together"` and 1 copy.
  - "§A12 SKILLRIG.md:116, :176 — copies on a row, spin or free-fire may jitter, start late and vary in size, yet arrive together; the same numbers every play": a row of 3, 0.5 s, spread `{ jitter: 0.4, delay: 0.5, scale: 0.2 }` plans identically twice, 3 distinct copies; at `raw` 1, every `copyAt` has `u` 1 and is not hidden; each `dc`/`dr` matches `(unit(i, lane) × 2 - 1) × 0.4`; `startMs` is `Math.round(lag × 500)`. A lock-on with that spread → one copy `{ index: 0, dc: 0, dr: 0, scale: 1, lag: 0, startMs: 0 }`. A free-fire with a zero spread → the same one flat copy. A free-fire of 0.5 s with `delay = 0.001 / unit(0, 2)` (jitter and size 0) has copy 0 `startMs` 1 (`0.001 / unit(0, 2) × unit(0, 2) × 500 = 0.5` rounds half up; floor would be 0). A row with no count → 6 copies and codes `["fxFilled"]`. A row of count 9, spread `{ 2, 1, 2 }` and look scale `{ from: 9, to: 9 }` → 8 copies, look scale from 2.6, codes `["fxClamped", "fxClamped", "fxClamped"]`.
  - "§A12 + §A6 — a later free-fire keeps the spin's copies and spread; motion.kind is read; loop and speed change nothing; bad tune throws": orbit count 4 (0.4 s) then a free-fire (0.5 s, spread `{ 0.2, 0.25, 0.1 }`) with extra `{ speed: 2, loop: true }` → step 1 has 4 copies, release `"together"`, `endMs` 900, at least one copy with `lag > 0`. A lone `{ motion: { kind: "reel" }, seconds: 0.3 }` (no connect) reads `kind` `"reel"` and connect 0.42. `delayMax: 2` and `fillCount: 1` each throw `RangeError`.

## Example
```ts
const read = readFxOrder(paste, BTF_FX_READ_LIMITS);
const look = planLook(read.order, BTF_FX_LOOK);          // tunables from the project or the BTF preset
for (const n of look.notices) devOverlay.warn(n);        // warn, don't block
for (const step of look.steps) {
  const sample = lookAt(step.look, u, BTF_FX_LOOK);      // null channels: hold the saved blade; trail stays the blade
  const spread = read.order.styles[step.index]!.spread;  // copyAt clamps again
  for (const copy of step.copies) {
    if (clock.now() < copy.startMs) continue;
    const pose = copyAt(spread, copy.index, raw, BTF_FX_LOOK);
    if (!pose.hidden) vfx.drawCopy(copy, pose, sample, step.release);
  }
}
```

## How later steps use this (context only; do not build)
- The FX painter (`paint.ts` rewrite, runtime/view) draws from `planLook` / `lookAt` / `copyAt` on the render phase of the same clock, including the split curve and colour mix.
- A mapping step still fills `FxShot` from an effect document (`fromSkillSpec`); it can also pass styles through from `readFxOrder`.
- Rules steps are unchanged: they still act on `planEffect` cues and the 10b options.

## Decisions note: what to name
- The exact `fxFilled` / `fxClamped` messages for copy count, look channels and spread (the codes are fixed).
- How you compute the fractional part of the copy hash without `Math.floor`.
- Anything you chose that the file doesn't state (law 12).

## BTF intent (read-only)
None from BTF code (CEO 2026-11-09: no frozen copy). The order is `effect-order-from-docs.md` §A rules 9, 11 and 12. Current-play numbers in `BTF_FX_LOOK` (spread and look clamps, the copy-hash coefficients, ease-in-out 3) are what SkillRig's normalize/paint use, cited from the design doc's implementer notes (SKILLRIG.md:176, :110, :101-106, :116) and recorded here as caller data, not copied source.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `src/fx/order/timeline.ts`, `src/fx/order/effect.ts`, `src/fx/order/landing.ts`, `src/fx/order/options.ts`, `src/btf-adapters/src/lane-labels.ts`; in `src/btf-adapters/src/fx-preset.ts`, everything but the type-import addition and the appended `BTF_FX_LOOK`.
- `tests/fx/read.test.ts`, `tests/fx/timeline.test.ts`, `tests/fx/effect.test.ts`, `tests/fx/landing.test.ts`, `tests/fx/options.test.ts`, `tests/btf-adapters/**`, `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`, `tests/sim/**`, `tests/runtime/**`, and every existing test.
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.
- Every earlier step's other files: `src/core/**`, `src/state/**`, `src/rules/**`, `src/project/**`, `src/runtime/**`, `src/sim/**`, `src/index.ts`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 161. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and `npm run check:law` prints `check:law OK (src)`; `npm run deps` reports no violations; `sha256sum .dependency-cruiser.cjs` prints `dcf61c61fef3d0fce8a6a14c98b1cc5f6ea9c0298c843236fa6fca9c8f798628` (unchanged).
- [ ] `npm run sim` prints exactly the base's two lines: `stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75` and `stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`.
- [ ] `rg -n --pcre2 '\bMath\.random\b|\bDate\b|\bperformance\.now\b|\b(setTimeout|setInterval|queueMicrotask|requestAnimationFrame)\b' src/fx src/btf-adapters` prints nothing.
- [ ] `rg -n --pcre2 '(?<![\w.])(?!(?:0|1|2)(?:\.0)?\b(?![.\d]))(?:\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|0[xX][0-9A-Fa-f]+)\b' src/fx` prints exactly five lines, all in `src/fx/order/read.ts`, and they are the five numeric lines of `FX_FORMAT` (comments elsewhere in `src/fx`: no digits).
- [ ] `rg -n --pcre2 'Math\.(floor|ceil|trunc)\b|toFixed' src/fx` prints nothing (whole ms only through `Math.round`; the copy hash's fractional part is not `Math.floor`).
- [ ] `rg -n --pcre2 '\b400\b|\b0\.40?\b' src/fx` prints nothing, and `rg -n '\b400\b' src/btf-adapters` prints exactly one line, the existing `BTF_FX_FLIGHT`.
- [ ] `rg -n --pcre2 "from ['\"](?!\./|\.\./\.\./(types|core)/)" src/fx` prints nothing, and `rg -n --pcre2 "from ['\"][^'\"]*/(rules|state|sim|runtime|project|btf-adapters)/" src/fx` prints nothing.
- [ ] `rg -n --pcre2 "from ['\"][^'\"]*/fx/" src/core src/state src/project src/types` prints nothing.
- [ ] `rg -n --pcre2 "from ['\"](?!\./|\.\./\.\./(types|fx)/)" src/btf-adapters` prints nothing, `rg -n --pcre2 "^(import|export) (?!type ).*from ['\"][^'\"]*/fx/" src/btf-adapters` prints nothing, and `rg -n 'btf-adapters' src --glob '!src/btf-adapters/**'` prints nothing.
- [ ] `rg -n -i 'btf' src/fx` prints nothing, and `rg -n -i --pcre2 '\b(lucifer|holy|sword|blade|earth|seam)\b' src/fx/order/effect.ts src/fx/order/landing.ts src/fx/order/look.ts` prints nothing (no game piece names in the engine functions).
- [ ] `rg -n -i 'g-tile-engine|towerchess|/tower/|skillrig/spec' src` prints nothing, and `find src/btf-adapters -path '*vendor*'` prints nothing.
- [ ] `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|damage|deck|cards?|stats?)\b\s*[:=]\s*-?\d' src/fx src/btf-adapters` prints nothing, and `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|deck|cards?|stats?)\b' src/fx src/btf-adapters` prints nothing.
- [ ] `rg -n --pcre2 '\bcreateClock\b|clock\.(advance|step|pause|resume|setTimeScale)\(' src/fx` prints nothing; `rg -n --pcre2 "from ['\"]node:|\bfetch\b|readFile|writeFile|localStorage" src/fx src/btf-adapters` prints nothing; `rg -n --pcre2 '\?\?' src/fx` prints nothing.
- [ ] `rg -n 'export function (easeAt|lookAt|copyAt|planLook)' src/fx/order/look.ts` prints exactly four lines, and `rg -n 'BTF_FX_LOOK' src/btf-adapters` prints exactly two lines (the quoted const and the index re-export).
- [ ] `git diff --name-only <base>..<head> -- src/core src/types src/state src/rules src/project src/runtime src/sim src/index.ts src/fx/order/timeline.ts src/fx/order/effect.ts src/fx/order/landing.ts src/fx/order/options.ts src/btf-adapters/src/lane-labels.ts scripts package.json package-lock.json eslint.config.mjs tsconfig.json .dependency-cruiser.cjs tests/fixtures tests/sim tests/runtime tests/btf-adapters tests/fx/read.test.ts tests/fx/timeline.test.ts tests/fx/effect.test.ts tests/fx/landing.test.ts tests/fx/options.test.ts tests/smoke.test.ts tests/gates.test.ts` prints nothing.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 382 changed lines (insertions + deletions); each file within its limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the seven files in "Files to create or change" (`A` for `look.ts` and `look.test.ts`; `M` for the other five; anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-10c-fx-look/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (silent in the docs or pending: flagged to the user, do not invent)
- The paragraph's "start spread is how far apart they begin" (a spatial gap). Default and only reading is the JSON: `spread.delay` is a fraction of the step, and copies still arrive together (SKILLRIG.md:176). Listed as a CEO question; no option key.
- No new `FxOptions` keys. The ten 10b PROPOSED silent-spot keys, and the four 10b CEO-ruled keys, are unchanged. Unread 10b keys that do not yet change the match (`trap_trigger`, `modifier_stacking`, `turn_end_effects`, `stun_count`, `last_stand_release`, `fuse_pause_during`, and the single-value cue keys 10b already implements as their only legal value) are **deferred**: 10c's drawing-side work does not consume them; a rules step should wire the rules keys; see also 10b Behaviour 12.
- A cap on the event-bus history for long phone sessions is **deferred**, proposed as a later `src/core/events` (or runtime) step: the bus is step 07, history is used by replay tests, and a cap needs a replay-vs-session policy, not look ramps.
- `BTF_FX_READ_LIMITS.minStepMs` (0.20 s) stays PROVISIONAL (step 10); no question pending.

## Out of scope
- The FX painter (`paint.ts` rewrite, runtime/view), the split/fan curve, colour lerp, `scale_snap`, blade art and `bladeKey`, the editor's Effect Designer and booth.
- Reading effect documents or SkillRig fields into `FxShot` (`fromSkillSpec`); any rule that acts on a cue or an option.
- One source for `obstacles_block_leap` and the catalogue knob (parked by RaiKynn 2026-11-10, step 10).
