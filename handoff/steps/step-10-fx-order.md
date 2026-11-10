# step-10-fx-order: the effect order rebuilt from the design docs (reader, timeline, project options) + the lane-label adapter

Step id: step-10-fx-order          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `a499d98` on `main` (step-09c-input-sim-script r1 merged, PR #12); the diff is always `a499d98..<head>`
Branch: `step/step-10-fx-order-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-10-fx-order-r<N>.bundle a499d98..step/step-10-fx-order-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-10-fx-order/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-02-clock (`Clock`, `createClock`, `SimTimer`), `Notice` (`src/core/notice.ts`), step-09c-input-sim-script (`tests/runtime/input/gestures.test.ts` and its helpers `run`, `p`)
Read first: BUILD_GUIDE.md §2 laws 1, 4, 7, 10, 12; §3 (the `src/fx/` and `src/btf-adapters/` rows, CN-007); §5; `docs/effect-order-from-docs.md` §A and "Silent spots" (attached; the design-doc rebuild this step implements); `handoff/change-notices/CN-007-fx-layer.md` (attached; binding)
Kit: kit-2, 2026-11-10. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 144/0) on Node 24.22.1 on top of `main` `a499d98`, against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004): every type quoted here is unchanged. `main` `a499d98` is green with it (Architect check, 132/0).
Carries: CN-007 (attached; `change-notices/CN-007-fx-layer.md`): one line in `.dependency-cruiser.cjs` and two BUILD_GUIDE §3 lines (Chief Of Staff publishes the GUIDE; you do not edit it). The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Give abilities a timeline. `src/fx/order` is a new pure layer that reads an `fx-order` asset (a SKILLRIG block: a line, a paragraph, then JSON), clamps what is out of range with a notice for every clamp or fill-in (warn, don't block), and turns it into cues on the one clock: the steps in list order, back to back, and the hit at `connect` through the last step. It also holds the **effect-order project options** (one order used everywhere) and reads a user's answers over a base the caller passes. The BTF preset (options and read limits) is plain data in `src/btf-adapters/src/fx-preset.ts`: `src/fx` exports no preset and names no BTF anything. `src/btf-adapters/src/lane-labels.ts` maps BTF's lane ticket ids 1–18 to `{c, r}` and back (editor labels only). The effect order is engine sequencing data, **not game rules**: no HP, mana, cost or damage numbers anywhere in `src/`.

This is the first half of the outline's step 10. It covers `effect-order-from-docs.md` §A rules 1, 2, 4, 5, 6 and 7, plus the options and lane labels. **Step 10b** covers §A rules 3 and 8–18 (spawn, impact/trail, look channels, second motion, release, copies, bounce order, free-fire pierce, hook and reel, hit kinds, preview-only loop/speed) and the pierce/chain option behaviour; doing both here would pass 400 lines.

Rulings in this step (CEO 2026-11-09, via Chief Of Staff; Engine Architect 2026-11-10):
- **No frozen BTF copy.** Nothing in this step is copied from BTF code. The order comes only from `effect-order-from-docs.md` (design docs) and TileEngine's own catalogue. Do not open or read `/workspace/g-tile-engine`. Any spot the docs are silent on is not guessed: it is listed under "Not in this step" below and goes to the user.
- **Current play is the default.** "How BTF currently plays" is the BTF preset; live gameplay beats docs and SkillRig previews. A doc reading that differs from current play is kept as an option value and gets the notice `fxDocDiffers` when picked.
- **Every effect-order spot is a project option (maximum user freedom), one order everywhere.** `FxOptions` (quoted) has the ten options; `BTF_FX_PRESET` (in `src/btf-adapters/src/fx-preset.ts`, not `src/fx`) holds current play; `readFxOptions` takes the caller's base, and `src/fx` never implies one (law 12). The BTF preset values: player-side turn start; meter after the kill rewards; pierce hits per tile as the shot passes; chain = hit then pull per body, near to far; reel = pull only (`pull_then_knock1` is the doc's reading, `doc_differs`); seam-based objects block Immaculate rays (option: `passes`; `seam_object_vs_immaculate_ray`). **Seam-based objects** (CEO 2026-11-10) are objects on tile seams/edges, such as a `logic.edges` wall (`CoreEdge`); they are drawn thin but meant as huge objects, like a giant wall in front of a piece; obstacles do not block the holy sword leap (`obstacles_block_leap: false`, catalogue `sword-lifecycle.obstacles_block_leap`; on/off option); damage then knock only if alive; hit → knock → trap → landing kill; both sides wiped = draw. This step defines and reads the options; the rules and FX steps that act on them come later.
- **Layer (CN-007):** `src/fx/**` may import `src/types/**` and `src/core/**` only (in practice `Notice` and the `Clock` / `SimTimer` types). `src/rules`, `src/runtime` and `src/sim` may import it; core, state, project and types may not. It may not import `src/btf-adapters`. `src/btf-adapters` may import `src/fx` **types only** (`import type`): no depcruise rule limits what btf-adapters imports and its BUILD_GUIDE §3 row sets no import limit, so this needs no rule change (CN-007).
- **Adapter rule (law 7):** `src/btf-adapters/src/` holds thin TileEngine-written wrappers only. `lane-labels.ts` is rewritten from the doc's numbering, not copied; `fx-preset.ts` is thin data (the BTF preset options and read limits) typed by `src/fx`; no `vendor/`. Only runtime and editor (later) import `src/btf-adapters`; this step adds no importer in `src/`.
- **Time:** integer sim ms (CN-001). Seconds become whole ms once, in the reader. Cues play through `clock.after` only; `src/fx` never creates, advances or steps a clock.
- **Numbers:** the only numeric literals in `src/fx` other than `0`, `1`, `2` are the four `FX_FORMAT` lines quoted below (what the docs state, each cited). Comments elsewhere in `src/fx` carry no digits.
- **Rounding (ruled by RaiKynn 2026-11-10):** seconds → ms and `connect × ms` round half up to whole ms (`Math.round`).
- **Read limits are inputs, not constants:** the shortest step, the fill-in for a step with no `seconds`, and the `connect` range come in `FxReadLimits`, which the caller passes to `readFxOrder`. The BTF values are `BTF_FX_READ_LIMITS`: min step 200 ms (SKILLRIG.md:86's 0.20 s; the catalogue slider allows 0.15 s) is **PROVISIONAL pending CEO**; fill-in 480 ms (catalogue `effect.steps` default 0.48 s) and connect 0.02–1 (catalogue `effect.connect`) are **CEO-approved defaults (2026-11-10)**, still inputs. The doc-stated values (max 3.00 s, six steps, the 0.92 / 0.42 connect fill-ins) stay in `FX_FORMAT`.
- **QA note from step 09c:** "a second down from the same pointer id with no up in between is ignored." Step 09c's mapper already does this (Behaviour 3: `down` starts a gesture only when none is open), so this step adds one spec line (Behaviour 11) and one test, with **no change to `src/runtime/input`**.

## Files to create or change
- change `.dependency-cruiser.cjs`: the one CN-007 line, exactly as in the CN (1 insertion)
- create `src/fx/order/types.ts`: exactly the quoted file (≤ 46 lines)
- create `src/fx/order/options.ts`: the two quoted constants and `readFxOptions` (≤ 42 lines)
- create `src/fx/order/read.ts`: the quoted `FX_FORMAT` and `readFxOrder` (≤ 62 lines)
- create `src/fx/order/timeline.ts`: `planFx`, `playFx` (≤ 31 lines)
- create `src/fx/order/index.ts`: re-exports (≤ 8 lines)
- create `src/btf-adapters/src/lane-labels.ts`: `laneIdToSq`, `sqToLaneId` (≤ 19 lines)
- create `src/btf-adapters/src/fx-preset.ts`: exactly the quoted file (≤ 17 lines)
- create `src/btf-adapters/src/index.ts`: re-exports (≤ 6 lines)
- create `tests/fx/read.test.ts` (≤ 61 lines), `tests/fx/timeline.test.ts` (≤ 39 lines), `tests/fx/options.test.ts` (≤ 27 lines), `tests/btf-adapters/lane-labels.test.ts` (≤ 20 lines)
- change `tests/runtime/input/gestures.test.ts`: append one test (≤ 7 changed lines, insertions only)

Size: ≤ 390 changed lines in total, counting insertions + deletions; the per-file caps above (with the CN line) add up to 386 (prototype: 334). No new fixtures. If you pass ~370, say so in Decisions.

## Interfaces to match (quoted exactly)
From core-types: `Sq`. From step 02: `Clock`, `SimTimer`, `createClock` (`src/core/clock/index.ts`). `Notice` from `src/core/notice.ts`. Import these; never retype them.
```ts
// src/fx/order/types.ts — the whole file
import type { Notice } from "../../core/notice.ts";

/** One step (`frames[i]`, effect-order §A). `ms` is whole sim ms (integer-ms law); `kind` is passed through, or null when absent. */
export type FxStep = { readonly kind: string | null; readonly ms: number };

/** A read `fx-order` asset: the timing part of a SKILLRIG v1 block. Engine sequencing data, never game rules. */
export type FxOrder = {
  readonly steps: readonly FxStep[];          // the steps that play, in list order (at most six)
  readonly inactive: readonly FxStep[];       // steps past the cap: kept, never played (see FX_FORMAT)
  readonly connect: number;                   // fraction through the last step where the hit applies
  readonly damage: number | null;             // passed through untouched; null = no hit amount (effect-order §A)
  readonly raw: Readonly<Record<string, unknown>>;  // the parsed JSON, kept for later steps
};
export type FxRead = { readonly order: FxOrder | null; readonly notices: readonly Notice[] };

export type FxCue =
  | { readonly kind: "step"; readonly at: number; readonly index: number }
  | { readonly kind: "hit"; readonly at: number };
export type FxPlan = { readonly cues: readonly FxCue[]; readonly endMs: number };

/** Effect-order project options (one order everywhere). Every value comes from the caller (a project or a preset). */
export type FxOptions = {
  readonly hit_knock_order: "damage_then_knock_if_alive" | "knock_then_damage" | "damage_then_knock_always";
  readonly turn_start_order: "player_side" | "rival_side";
  readonly death_order: "reward_then_meter" | "basic_attack_path" | "sword_path";
  readonly pierce_hit_timing: "per_tile_on_pass" | "all_at_connect";
  readonly chain_order: "hit_then_pull_per_body";
  readonly reel_knock: "pull_only" | "pull_then_knock1";
  readonly landing_order: "hit_knock_trap_landing";
  readonly simultaneous_wipe: "draw" | "attacker_wins" | "defender_wins";
  readonly seam_object_vs_immaculate_ray: "blocks" | "passes";  // objects on tile seams/edges: huge, though drawn thin
  readonly obstacles_block_leap: boolean;
};
export type FxOptionsRead = { readonly options: FxOptions; readonly notices: readonly Notice[] };

/** Read limits are the caller's input; their values live in presets, never in src/fx. Whole ms. */
export type FxReadLimits = {
  readonly minStepMs: number;   // shortest step; longer clamps come from FX_FORMAT
  readonly fillStepMs: number;  // a step with no seconds
  readonly minConnect: number;
  readonly maxConnect: number;
};
```
```ts
// src/fx/order/options.ts — these two constants exactly (values, order, comments)
/** Allowed values per option. Order is display order only; nothing here is a default. */
export const FX_OPTION_VALUES: { readonly [K in keyof FxOptions]: readonly FxOptions[K][] } = {
  hit_knock_order: ["damage_then_knock_if_alive", "knock_then_damage", "damage_then_knock_always"],
  turn_start_order: ["player_side", "rival_side"],
  death_order: ["reward_then_meter", "basic_attack_path", "sword_path"],
  pierce_hit_timing: ["per_tile_on_pass", "all_at_connect"],
  chain_order: ["hit_then_pull_per_body"],
  reel_knock: ["pull_only", "pull_then_knock1"],
  landing_order: ["hit_knock_trap_landing"],
  simultaneous_wipe: ["draw", "attacker_wins", "defender_wins"],
  seam_object_vs_immaculate_ray: ["blocks", "passes"],
  obstacles_block_leap: [false, true],
};

/** Values that follow a design doc, not current play (effect-order-from-docs.md, silent spots: reel and knock). */
export const FX_DOC_DIFFERS: readonly string[] = ["reel_knock.pull_then_knock1"];
```
```ts
// src/btf-adapters/src/fx-preset.ts — the whole file (thin BTF data; imports only src/fx types)
import type { FxOptions, FxReadLimits } from "../../fx/order/index.ts";

/** The BTF preset: how BTF currently plays (CEO and CoS rulings 2026-11-09). Plain data the caller passes to src/fx. */
export const BTF_FX_PRESET: FxOptions = {
  hit_knock_order: "damage_then_knock_if_alive", turn_start_order: "player_side", death_order: "reward_then_meter",
  pierce_hit_timing: "per_tile_on_pass", chain_order: "hit_then_pull_per_body", reel_knock: "pull_only",
  landing_order: "hit_knock_trap_landing", simultaneous_wipe: "draw", seam_object_vs_immaculate_ray: "blocks",
  obstacles_block_leap: false,
};

/** BTF read limits: min step 0.20 s is PROVISIONAL pending CEO (SKILLRIG.md:86; the catalogue slider allows 0.15 s);
 *  fill-in 0.48 s and connect 0.02–1 are CEO-approved (2026-11-10; catalogue effect.steps default, effect.connect). */
export const BTF_FX_READ_LIMITS: FxReadLimits = { minStepMs: 200, fillStepMs: 480, minConnect: 0.02, maxConnect: 1 };
```
```ts
// src/fx/order/read.ts — this block exactly
/** Format limits and fill-ins the docs state, each cited. The only numbers in src/fx; the rest come in FxReadLimits. */
export const FX_FORMAT = {
  maxMs: 3000,                       // seconds up to 3.00 (SKILLRIG.md:86)
  maxSteps: 6,                       // six steps at most (SKILLRIG.md:36); 7+ kept inactive (project-format §6.7 K-4)
  connect: 0.92, reelConnect: 0.42,  // missing connect: 0.92, an old reel 0.42 (SKILLRIG.md:178, :165)
  msPerSecond: 1000,
} as const;
```
```ts
// exported functions
export function readFxOptions(json: unknown, base: FxOptions): FxOptionsRead;                     // options.ts
export function readFxOrder(text: string, limits: FxReadLimits): FxRead;                           // read.ts
export function planFx(order: FxOrder): FxPlan;                                                     // timeline.ts
export function playFx(clock: Clock, plan: FxPlan, onCue: (cue: FxCue) => void): () => void;       // timeline.ts
export function laneIdToSq(id: number): Sq | null;                                                  // btf-adapters/src/lane-labels.ts
export function sqToLaneId(at: Sq): number | null;                                                  // btf-adapters/src/lane-labels.ts
```
`src/fx/order/index.ts` re-exports the eight types of `types.ts` and exactly the values `FX_DOC_DIFFERS`, `FX_OPTION_VALUES`, `readFxOptions`, `FX_FORMAT`, `readFxOrder`, `planFx`, `playFx` (no preset). `src/btf-adapters/src/index.ts` re-exports exactly `BTF_FX_PRESET`, `BTF_FX_READ_LIMITS`, `laneIdToSq` and `sqToLaneId`.

Behaviour (exact; each line has a test):
1. **Block (§A1–2, SKILLRIG.md:161, :163):** first the limits: `readFxOrder` throws `RangeError("readFxOrder: limits out of range")` unless `minStepMs` is an integer in `1…FX_FORMAT.maxMs`, `fillStepMs` is an integer in `minStepMs…FX_FORMAT.maxMs`, and `0 ≤ minConnect ≤ maxConnect ≤ 1` (`NaN` fails). Bad text never throws. It parses the text from the first `{` to the last `}`, so the JSON wins over the paragraph (a stray `{` in the paragraph breaks the slice; that block is bad). No `{`, a last `}` before the first `{`, JSON that does not parse, JSON that is not a plain object, or `frames` that is not a non-empty array → `{ order: null, notices }` whose only notice has the code `fxBadBlock`.
2. **Steps (§A2, §A4; SKILLRIG.md:176, :86):** each `frames[i]` that is not an object reads as `{}`. `kind` is the string or `null`. A finite `seconds` becomes `ms = Math.round(seconds × FX_FORMAT.msPerSecond)`, then is clamped to `[limits.minStepMs, FX_FORMAT.maxMs]`; a change gives `fxClamped`. A missing or non-finite `seconds` gives `ms = limits.fillStepMs` and `fxFilled`.
3. **Cap (§A4, SKILLRIG.md:36; project-format §6.7 K-4):** the first `maxSteps` steps play (`steps`); the rest are kept in `inactive`, in order, with one `fxOverCap` notice.
4. **Connect (§A6, SKILLRIG.md:178, :165):** a missing or non-finite `connect` is `reelConnect` when the last playing step's `kind` is `"reel"`, else `connect`, with `fxFilled`. A finite value outside `[limits.minConnect, limits.maxConnect]` is clamped, with `fxClamped`.
5. **Damage (§A7, SKILLRIG.md:178, :27):** a finite number passes through untouched; `null` or absent is `null` with no notice; anything else is `null` with `fxNotNumber`. No number is ever invented.
6. **Order and raw:** notices come in this order: the steps by index, then `fxOverCap`, then connect, then damage. `raw` is the parsed object; unknown fields (`look`, `spawn`, `speed`, …) stay in `raw`, untouched, for step 10b.
7. **planFx (§A4–6):** a `step` cue `{ kind: "step", at, index }` at each step's start (step 0 at 0, each next at the previous start + its `ms`), then one `{ kind: "hit", at: start(last) + Math.round(connect × ms(last)) }`. `cues` is sorted by `at` (ascending; ties keep list order). `endMs` = the sum of the steps' `ms`.
8. **playFx (law 1, CN-001):** cues with `at` 0 call `onCue` at once, in plan order; every other cue is `clock.after(at, …)` from the clock's now (so it fires on the clock's tick rule). The returned function cancels every pending cue. `playFx` reads nothing else.
9. **readFxOptions:** a `json` that is not a plain object (`null`, an array, a primitive) → `{ options: base, notices: [{ code: "fxOptionsNotObject", message: "Effect-order options are not an object; the base is used." }] }`. Otherwise, for each own key in order: unknown → `fxOptionUnknown`; a value not in `FX_OPTION_VALUES[key]` → `fxOptionInvalid` (the base value stays); else the value is taken, and if `` `${key}.${value}` `` is in `FX_DOC_DIFFERS` it also gives `fxDocDiffers`. It returns a new object and never changes `base`.
10. **Lane labels (TILE.md "count down, then east"; `core-spine-slices.md` §1.4, X12):** `laneIdToSq(id)` = `{ c: floor((id − 1) / 3), r: (id − 1) mod 3 }` for an integer id 1–18, else `null`. `sqToLaneId({c, r})` = `c × 3 + r + 1` for integers `0 ≤ c < 6`, `0 ≤ r < 3`, else `null`.
11. **Input (QA note, step 09c):** a second `down` from the same pointer id with no `up` in between is ignored; the gesture that the first `down` opened still ends normally on its `up`. (Already true on the base: no change to `src/runtime/input`.)

## Tests that prove it is done
Run: `npm test`, or `node --test tests/fx/*.test.ts tests/btf-adapters/*.test.ts tests/runtime/input/*.test.ts`. Each fx test name starts with the §A rule(s) and the doc line(s) it proves.
- `tests/fx/read.test.ts` (every read uses `BTF_FX_READ_LIMITS` from `src/btf-adapters/src/index.ts` unless stated; blocks built as `` `SKILLRIG v1\n${paragraph}\n${JSON.stringify(json)}\n` ``)
  - "§A1 SKILLRIG.md:161, :163 — the JSON wins over the paragraph; the read is first { to last }": a paragraph containing `{not json` → `order: null`; the same JSON under a plain paragraph `"Three steps of 2 s each."` → steps `[{ kind: "straight", ms: 500 }]` and no notices.
  - "§A2 SKILLRIG.md:163 — a bad block is ignored with a notice; every clamp and fill-in is a notice (X14)": `"no json here"`, `"{ nope }"`, `"SKILLRIG v1\n[1, 2]"`, a block with no `frames`, and `frames: []` each give `order: null` and notice codes exactly `["fxBadBlock"]`; `frames [{seconds: 0.05}, {seconds: 9}, {}]`, `connect: 4`, `damage: "x"` → ms `[200, 3000, 480]`, connect `1`, codes exactly `["fxClamped", "fxClamped", "fxFilled", "fxClamped", "fxNotNumber"]`; `connect: 0` → `0.02`.
  - "§A4 SKILLRIG.md:176, :36 — steps keep list order; six play, 7+ are kept inactive with a notice": eight frames `k1`…`k8` → steps `k1`…`k6`; inactive `[["k7", 900], ["k8", 1000]]`; codes `["fxOverCap"]`.
  - "§A6 SKILLRIG.md:178, :165 — a missing connect is 0.92, or 0.42 when the last step is a reel, each with a notice": `[reel, straight]` → `0.92`; `[straight, reel]` → `0.42`; codes `["fxFilled", "fxFilled"]`.
  - "§A7 SKILLRIG.md:178, :27 — damage null or absent stays null (no number invented); a number passes through": `null` → `null`; absent → `null`; `3` → `3`; `look: { ease: "linear" }` is in `raw` unchanged.
  - "read limits are the caller's input: other limits change clamps and fill-ins; bad limits throw": limits `{ minStepMs: 150, fillStepMs: 300, minConnect: 0.1, maxConnect: 0.9 }` on `frames [{seconds: 0.15}, {seconds: 0.05}, {}]`, `connect: 0.95` → ms `[150, 150, 300]`, connect `0.9`; `minStepMs: 0`, `fillStepMs: 100`, `fillStepMs: 3001`, `minConnect: 0.95`, `maxConnect: 2`, `minConnect: NaN` each throw `RangeError`.
- `tests/fx/timeline.test.ts` (reads with `BTF_FX_READ_LIMITS`)
  - "§A4 + §A5 + §A6 SKILLRIG.md:176, :126, :178 — steps back to back; the hit lands at start(last) + connect × ms(last)": seconds `[0.3, 0.5, 0.6]`, connect `0.92` → cues exactly step 0 @0, step 1 @300, step 2 @800, hit @1352; `endMs` 1400. `[0.48]` at `0.42` → hit @202 (201.6 rounds to 202). `[1]` at `1` → hit @1000. A one-step of `0.2505` s at connect `1` → step 0 @0, hit @251, `endMs` 251 (`0.2505 × 1000 = 250.5` rounds half up to 251; floor and round-half-even both give 250).
  - "CN-001 + law 1 — a plan plays on the one clock in sim ms, and cancel stops what is left": `createClock({ stepMs: 10 })`; `[0.3, 0.5]` at `0.5`; right after `playFx` only step 0 has fired; after 60 `clock.step()`s the cues seen are `[step, 0, now 0]`, `[step, 300, now 300]`, `[hit, 550, now 550]`. A second play cancelled after 20 steps has fired only the `at` 0 cue after 60 more.
- `tests/fx/options.test.ts` (`BTF_FX_PRESET` imported from `src/btf-adapters/src/index.ts`)
  - "the BTF preset is current play (CEO/CoS 2026-11-09) and every preset value is an allowed value": the seven ruled values (turn start, death order, pierce, chain, reel, rays, leap) are asserted one by one; every preset value is in `FX_OPTION_VALUES`; both have the same keys.
  - "every option is the user's: answers override the base; doc-differs, unknown and bad values warn and never block": `{ reel_knock: "pull_then_knock1", seam_object_vs_immaculate_ray: "passes", obstacles_block_leap: true, chain_order: "far_to_near", spin: 1 }` over the preset → the preset with the first three changed; codes exactly `["fxDocDiffers", "fxOptionInvalid", "fxOptionUnknown"]`; `[]` → the base and the exact Behaviour 9 notice; `{ turn_start_order: "rival_side" }` is taken.
- `tests/btf-adapters/lane-labels.test.ts`
  - "lane ids 1–18 map to {c, r} and back, column-major (TILE.md): id 2 = (0,1), id 11 = (3,1)": also 1 → (0,0), 18 → (5,2); all 18 round-trip; `0`, `19`, `2.5`, `NaN` → `null`; `(−1,0)`, `(6,0)`, `(0,3)`, `(0.5,0)` → `null`.
- `tests/runtime/input/gestures.test.ts` (appended; existing tests unchanged)
  - "a second down from the same pointer id with no up in between is ignored (QA 09c)": down (0,8) at 0, down (2,2) at 50 (same id 1), up (0,8) at 90 → exactly `[SelectUnit knight#1]`.

## Example
```ts
const read = readFxOrder(assetText, BTF_FX_READ_LIMITS); // asset kind "fx-order"; limits are the project's (here the BTF preset)
for (const n of read.notices) devOverlay.warn(n);     // warn, don't block
if (read.order) {
  const stop = playFx(clock, planFx(read.order), (cue) => {
    if (cue.kind === "hit") applyHit(read.order.damage); // the game decides what a hit does; null = no amount
  });
}
const { options, notices } = readFxOptions(project.fxOrder, BTF_FX_PRESET);  // the user's answers over the BTF preset
laneIdToSq(11);                                       // { c: 3, r: 1 } — an editor label, never a core address
```

## How later steps use this (context only; do not build)
- Step 10b: §A rules 3 and 8–18 as cue data (spawn, impact/trail, look ramps, second motion, release, copies, bounce, free-fire pierce, hook and reel, hit kinds), with `pierce_hit_timing`, `chain_order` and `reel_knock` acting on the cues.
- Rules steps read `turn_start_order`, `death_order`, `hit_knock_order`, `landing_order`, `simultaneous_wipe`, `seam_object_vs_immaculate_ray` and `obstacles_block_leap` from the project's options (`src/rules` may import `src/fx`, CN-007).
- The FX painter (runtime/view) draws on the render phase of the same clock from these cues; the editor shows lane ids through the adapter.

## Decisions note: what to name
- The exact notice messages (codes are fixed above; the one `fxOptionsNotObject` message is fixed too).
- How you hold the parsed JSON and walk the frames.
- Anything you chose that the file doesn't state (law 12).

## BTF intent (read-only)
None (rewrite from the design docs; CEO 2026-11-09: no frozen copy). Do not open BTF code. The lane numbering is the doc's formula (TILE.md, as summarised in `core-spine-slices.md` §1.4). Not repeated: SkillRig's silent clamps (TileEngine warns), root-absolute blade paths, localStorage looks, loop/speed preview controls.

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json` (change only by Change Notice).
- `.dependency-cruiser.cjs`, **except** the one CN-007 line; every other line stays byte-identical.
- `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`, `tests/sim/**`, and every existing test (in `tests/runtime/input/gestures.test.ts` you only append).
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.
- Every earlier step's files: `src/core/**`, `src/state/**`, `src/rules/**`, `src/project/**`, `src/runtime/**`, `src/sim/**`, `src/index.ts`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 143. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and `npm run check:law` prints `check:law OK (src)`; both exit 0.
- [ ] CN-007: `sha256sum .dependency-cruiser.cjs` prints `dcf61c61fef3d0fce8a6a14c98b1cc5f6ea9c0298c843236fa6fca9c8f798628`; `git diff --stat <base>..<head> -- .dependency-cruiser.cjs` shows 1 insertion and no deletion; `npm run deps` reports no violations.
- [ ] `rg -n --pcre2 '\bMath\.random\b|\bDate\b|\bperformance\.now\b|\b(setTimeout|setInterval|queueMicrotask|requestAnimationFrame)\b' src/fx src/btf-adapters` prints nothing.
- [ ] `rg -n --pcre2 '(?<![\w.])(?!(?:0|1|2)(?:\.0)?\b(?![.\d]))(?:\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|0[xX][0-9A-Fa-f]+)\b' src/fx` prints exactly four lines, all in `src/fx/order/read.ts`, and they are the four numeric lines of the quoted `FX_FORMAT` block (comments included elsewhere: no digits).
- [ ] `rg -n --pcre2 "from ['\"](?!\./|\.\./\.\./(types|core)/)" src/fx` prints nothing (only its own files, types and core; no `node:`).
- [ ] `rg -n --pcre2 "from ['\"][^'\"]*/fx/" src/core src/state src/project src/types` prints nothing.
- [ ] `rg -n --pcre2 "from ['\"](?!\./|\.\./\.\./(types|fx)/)" src/btf-adapters` prints nothing, `rg -n --pcre2 "^(import|export) (?!type ).*from ['\"][^'\"]*/fx/" src/btf-adapters` prints nothing (fx types only), and `rg -n 'btf-adapters' src --glob '!src/btf-adapters/**'` prints nothing (no importer yet).
- [ ] `rg -n -i 'btf' src/fx` prints nothing (no preset and no BTF names in the engine layer).
- [ ] `rg -n -i 'g-tile-engine|towerchess|/tower/|skillrig/spec' src` prints nothing, and `find src/btf-adapters -path '*vendor*'` prints nothing (no BTF path, no copy, no vendor).
- [ ] `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|damage|deck|cards?|stats?)\b\s*[:=]\s*-?\d' src/fx src/btf-adapters` prints nothing (no rule numbers), and `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|deck|cards?|stats?)\b' src/fx src/btf-adapters` prints nothing.
- [ ] `rg -n --pcre2 '\bcreateClock\b|clock\.(advance|step|pause|resume|setTimeScale)\(' src/fx` prints nothing (fx only schedules with `clock.after`).
- [ ] `rg -n --pcre2 "from ['\"]node:|\bfetch\b|readFile|writeFile|localStorage" src/fx src/btf-adapters` prints nothing.
- [ ] `rg -n --pcre2 '\?\?' src/fx` prints nothing (no silent fallback; every fill-in is a cited `FX_FORMAT` value with a notice).
- [ ] `git diff --name-only <base>..<head> -- src/core src/types src/state src/rules src/project src/runtime src/sim src/index.ts scripts package.json package-lock.json eslint.config.mjs tsconfig.json tests/fixtures tests/sim tests/smoke.test.ts tests/gates.test.ts` prints nothing.
- [ ] `git diff --numstat <base>..<head> -- tests/runtime/input/gestures.test.ts` shows 0 deletions.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 390 changed lines (insertions + deletions); each file within its limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the fourteen files in "Files to create or change" (`A` for the twelve created, `M` for `.dependency-cruiser.cjs` and `tests/runtime/input/gestures.test.ts`; anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-10-fx-order/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (silent in the docs or pending: flagged to the user, do not invent)
- `effect-order-from-docs.md` silent spots still PROPOSED (2 trap trigger, 3 damage layers, 4 modifier stacking, 6 end-of-turn effects, 8 multi-body order, 12 re-hits, 14 simultaneous hits, 16 random-pick order, 17 stun counting, 18 Last Stand release, 19 fuse pause, 20 crossing order): no option key, no test, until CoS/the user decides.
- §A rules 3 and 8–18: step 10b.
- PROVISIONAL pending CEO: only `BTF_FX_READ_LIMITS.minStepMs` (0.20 s per SKILLRIG.md:86 vs the catalogue's 0.15 s; the CEO doesn't recall). It is a caller input (`FxReadLimits`), so a ruling changes only that preset. `seam_object_vs_immaculate_ray` and `obstacles_block_leap` are CEO options with no doc line (the leap's `false` is the catalogue default). The holy sword's landing rule (a free tile next to the target is required) is step 10b's (CEO 2026-11-10).

## Out of scope
- The FX painter (`paint.ts` rewrite, runtime/view), `scale_snap`, blade art and `bladeKey`, the editor's Effect Designer and booth.
- Reading effect documents (`effects/<id>.json`, behaviour-setup v3) and the `fromSkillSpec` / `toSkillSpec` mapping; any rule that acts on an option.
- Moving or changing `src/runtime/input`; saves; networking.
- One source for `obstacles_block_leap` (parked by RaiKynn 2026-11-10): the same choice is also the catalogue knob `sword-lifecycle.obstacles_block_leap`; a later step fills the option from the knob. Here it is only an `FxOptions` key.
