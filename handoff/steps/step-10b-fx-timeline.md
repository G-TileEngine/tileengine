# step-10b-fx-timeline: the rest of the effect timeline as cue data (spawn, second motion, bounce, pierce, chain, yank, hit kinds) + the holy-sword landing tile + the silent-spot options

Step id: step-10b-fx-timeline          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `2052df8` on `main` (step-10-fx-order r1 merged, PR #13); the diff is always `2052df8..<head>`
Branch: `step/step-10b-fx-timeline-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-10b-fx-timeline-r<N>.bundle 2052df8..step/step-10b-fx-timeline-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-10b-fx-timeline/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-10-fx-order (`src/fx/order/**`, `src/btf-adapters/src/fx-preset.ts`, `readFxOrder`, `planFx`, `playFx`, `BTF_FX_PRESET`, `BTF_FX_READ_LIMITS`), step-02-clock (`createClock`, tests only), `Sq` (core-types)
Read first: BUILD_GUIDE.md §2 laws 1, 4, 7, 10, 12; §3 (the `src/fx/` and `src/btf-adapters/` rows, CN-007); §5; `docs/effect-order-from-docs.md` §A rules 3, 8, 10, 13–18 and "Silent spots" (attached; sha256 `f9312b8369aea1cd8df498a800f6db9397dd26c00d94cba4d69a83da420788e5`); `handoff/change-notices/CN-007-fx-layer.md` (binding; unchanged)
Kit: kit-2, 2026-11-10. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 157/0) on Node 24.22.1 on top of `main` `2052df8`, against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004): every type quoted here is unchanged. `main` `2052df8` is green with it (Architect check, 144/0; `npm run sim` 48/2 and 22/28, unchanged by this step).
Carries: no Change Notice. `src/fx` still imports only `src/types` and `src/core` (CN-007), `.dependency-cruiser.cjs` and BUILD_GUIDE are unchanged. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Turn one play of an ability into the full list of cues on the one clock. `planEffect` takes step 10's read `FxOrder`, a caller-built `FxShot` (where it is born, which path, which bodies, the hit kind), the project's `FxOptions` and the pierce flight lengths `FxFlight` (caller input, like `FxReadLimits`), and returns step 10's step and hit cues plus a `spawn` cue, `layer` cues (second motion), and per-body `strike`, `impact`, `pull` and `knock` cues, sorted by time; `playFx` (step 10, unchanged) plays it. `pickLanding` picks the free tile a landing piece (the holy sword) takes next to its target, or `null` when every neighbour is filled. Fourteen project options join `FxOptions`: the landing neighbourhood, landing across a seam, the pierce flight and the impact burst (CEO-ruled) and ten silent-spot answers, **PROPOSED** as what BTF's code does. Cues are engine sequencing data, **not game rules**: who is hit and when, never how much (no HP, mana, cost or damage numbers anywhere in `src/`). What a strike, pull or knock does to a unit is the rules' job (`hit_knock_order`, `landing_order`; rules steps).

This step covers `effect-order-from-docs.md` §A rules 3, 8, 10, 13, 14, 15, 16, 17 and 18, and `pierce_hit_timing`, `chain_order` and `reel_knock` acting on the cues. **Step 10c** (proposed) takes §A rules 9 (look-channel ramps), 11 (release) and 12 (copies: jitter, start spread, size, seeded): they are painter-facing shapes whose ease curves and spreads are not doc-fixed numbers, so they come with the FX painter rewrite and its tunables as inputs.

Rulings in this step (CEO 2026-11-09 and 2026-11-10, via Chief Of Staff; Engine Architect 2026-11-10):
- **No frozen BTF copy; current play is the default; every spot is a project option, one order everywhere** (as in step 10). Do not open or read `/workspace/g-tile-engine`. The holy-sword landing facts below come from TileEngine's behaviour catalogue (`behaviour-library/CATALOGUE.md` §47, "Built-in presets", L2862–2867), quoted here; you do not need that file.
- **Holy-sword landing (CEO 2026-11-10).** The sword needs a free tile next to its target because it lands on and occupies that tile. Default neighbour set = **all 8 tiles around the target** (sides and corners): `landing_neighbours: "eight"`; option `"four"` (the four sides, the engine `Grid`'s n/e/s/w). If every neighbour is filled by objects or units, the sword cannot reach that target (`pickLanding` returns `null`; the rules step leaves the target out). BTF's sword bends (swerves) in flight to land on a tile from which it can still basic-attack; the bend is drawing only, and only the landing tile matters. Among free neighbours, the one with the fewest row-and-column steps (Manhattan) from the sword wins; ties go to the first in the sweep order (column offset −1, 0, 1 outer; row offset −1, 0, 1 inner) — BTF code as recorded in the catalogue, **PROPOSED**. The leap's path is **not** this step's: `obstacles_block_leap` (step 10, default `false`) stays the only path option; `pickLanding` does not read it and nothing duplicates it. **Landing across a seam (CoS 2026-11-10, from CEO statements; CEO-ruled, not PROPOSED):** by default the sword may **not** land on a free neighbour that a seam object cuts off from the target. A seam cuts a candidate off only when that candidate is an orthogonal neighbour of the target and a seam object sits on their shared edge; a diagonal (corner) neighbour is never walled off (catalogue §47 L2862, `seamBlocks`). Seam objects are giant walls; the sword must land where it can still basic-attack: `landing_across_seam: "blocked"`; option `"allowed"` (may land). It replaces the catalogue knob's reading for this preset (`landing_needs_clear_line`, CATALOGUE.md not changed). The seam geometry stays out of `src/fx`: `pickLanding` does not read this option; callers honour it inside `canLand` (say no to a seam-cut tile when it is `"blocked"`).
- **Seam-based objects block rays** by default (`seam_object_vs_immaculate_ray: "blocks"`, step 10). Unchanged; the rules step that casts rays reads it.
- **Pierce** hits per tile as the shot passes (`per_tile_on_pass`; option `all_at_connect`). **Pierce flight (CEO 2026-11-10, via CoS; CEO-ruled):** the BTF flight is a fixed total time, 0.40 s, split evenly over the tiles it passes (4 tiles: 100 ms each; 2 tiles: 200 ms; 1 tile: the full 400 ms), and each body is struck when the flight reaches its tile: `pierce_flight: "fixed_total"`; option `"per_tile"` (a fixed ms per tile, so the total grows with the tiles). Both lengths are caller input (`FxFlight`); the BTF value is `BTF_FX_FLIGHT = { totalMs: 400, msPerTile: null }` in `src/btf-adapters/src/fx-preset.ts`, never a literal in `src/fx`; BTF has no per-tile speed, so a project that picks `"per_tile"` supplies `msPerTile`. **Impact burst (CEO 2026-11-10, via CoS; CEO-ruled):** every body hit gets its own impact (the burst, hit number and hit sound hook) when the shot reaches its tile, never one flash for the whole line: `impact_burst: "per_body"`; option `"once_at_contact"`. A shot that stops on the first body it reaches is a shot shape, not an fx rule: the caller passes only that body (BTF adapter note: the holy arrow is built that way). **Chain**: hit, then that body's one-tile pull, per body, near to far. **Reel**: pull only by default; `pull_then_knock1` is the doc's reading (`doc_differs`, step 10). Turn start player-side, meter after the reward, simultaneous wipe = draw: step 10's options, unchanged.
- **Silent spots (PROPOSED, effect-order-from-docs.md "Silent spots"):** each becomes an option key whose preset value is what BTF's code does, marked PROPOSED in `fx-preset.ts`, until the user decides: 2 `trap_trigger`, 4 `modifier_stacking`, 6 `turn_end_effects`, 8 `multi_hit_order`, 12 `rehit_same_body`, 14 `simultaneous_hits`, 17 `stun_count`, 18 `last_stand_release`, 19 `fuse_pause_during`, 20 `crossing_order`. Spots 8, 12, 14 and 20 act on this step's cues; the rest are keys only, for rules steps. Spot 3 (damage layers) and spot 16 (random-pick order) get **no** key (see "Not in this step").
- **Layer (CN-007, unchanged):** `src/fx/**` imports only `src/types/**` and `src/core/**`; `src/btf-adapters` imports `src/fx` types only; rules may import fx, never btf-adapters.
- **Time:** integer sim ms (CN-001), one clock. Every fraction of a step becomes whole ms with `Math.round` (round half up, RaiKynn 2026-11-10). `src/fx` never creates, advances or steps a clock.
- **Numbers:** the only new numeric literal in `src/fx` is `FX_FORMAT.maxTaps: 8` (SKILLRIG.md:94), so `FX_FORMAT` has five numeric lines. Comments elsewhere in `src/fx` carry no digits. Tunables are inputs (`FxShot`) or options.
- **The shot is the caller's input.** `FxShot` uses TileEngine's own names; mapping an effect document or SkillRig block onto it is a later step (`fromSkillSpec`). `planEffect` never reads `order.raw`.

## Files to create or change
- change `src/fx/order/types.ts`: becomes exactly the quoted file (≤ 47 changed lines)
- change `src/fx/order/options.ts`: append the fourteen quoted `FX_OPTION_VALUES` lines; nothing else changes (≤ 18 changed lines, insertions only)
- change `src/fx/order/read.ts`: add the one quoted `maxTaps` line to `FX_FORMAT` (exactly 1 insertion)
- create `src/fx/order/effect.ts`: `planEffect` (≤ 72 lines)
- create `src/fx/order/landing.ts`: `pickLanding` (≤ 22 lines)
- change `src/fx/order/index.ts`: the quoted exports (≤ 8 changed lines)
- change `src/btf-adapters/src/fx-preset.ts`: becomes exactly the quoted file (≤ 16 changed lines)
- change `src/btf-adapters/src/index.ts`: becomes exactly the quoted file (≤ 6 changed lines)
- create `tests/fx/effect.test.ts` (≤ 113 lines), `tests/fx/landing.test.ts` (≤ 34 lines)
- change `tests/fx/options.test.ts`: append one import line and one test (≤ 18 changed lines, insertions only)

Size: ≤ 355 changed lines in total, counting insertions + deletions; the per-file caps above add up to 355 (prototype: 311 insertions, 4 deletions = 315). No new fixtures. If you pass ~335, say so in Decisions.

## Interfaces to match (quoted exactly)
From core-types: `Sq`. From step 10: `FxOrder`, `FxPlan`, `FxOptions`, `planFx`, `playFx`, `FX_FORMAT`. `Notice` from `src/core/notice.ts`. Import these; never retype them.
```ts
// src/fx/order/types.ts — the whole file (step 10's file plus the Sq import, six cue kinds, fourteen option keys, the shot and flight types)
import type { Notice } from "../../core/notice.ts";
import type { Sq } from "../../types/core-types.ts";

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
  | { readonly kind: "hit"; readonly at: number }
  | { readonly kind: "spawn"; readonly at: number; readonly spawn: FxSpawn; readonly trail: boolean }
  | { readonly kind: "layer"; readonly at: number; readonly index: number }
  | { readonly kind: "strike"; readonly at: number; readonly body: string | null; readonly react: FxReact }
  | { readonly kind: "impact"; readonly at: number; readonly body: string | null }   // the burst, hit number and hit sound hook
  | { readonly kind: "pull"; readonly at: number; readonly body: string; readonly toward: Sq; readonly all: boolean }
  | { readonly kind: "knock"; readonly at: number; readonly body: string };
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
  readonly landing_neighbours: "eight" | "four";       // the free tile a landing piece needs next to its target
  readonly landing_across_seam: "blocked" | "allowed"; // a free tile a seam object cuts off from the target; callers apply it in canLand
  readonly multi_hit_order: "near_to_far";
  readonly rehit_same_body: "never";
  readonly simultaneous_hits: "sequential_list_order";
  readonly crossing_order: "by_due_time_then_seq";
  readonly trap_trigger: "any_move_end" | "voluntary_steps_only";
  readonly modifier_stacking: "additive_before_mitigation";
  readonly turn_end_effects: "at_next_side_start" | "side_end";
  readonly stun_count: "victim_turn_start";
  readonly last_stand_release: "before_held_deaths_and_ticks";
  readonly fuse_pause_during: "spells" | "all_resolution";
  readonly pierce_flight: "fixed_total" | "per_tile";   // how per-tile pierce strikes are timed (lengths come in FxFlight)
  readonly impact_burst: "per_body" | "once_at_contact";
};
export type FxOptionsRead = { readonly options: FxOptions; readonly notices: readonly Notice[] };

/** Read limits are the caller's input; their values live in presets, never in src/fx. Whole ms. */
export type FxReadLimits = {
  readonly minStepMs: number;   // shortest step; longer clamps come from FX_FORMAT
  readonly fillStepMs: number;  // a step with no seconds
  readonly minConnect: number;
  readonly maxConnect: number;
};

/** One play of an effect, built by the caller (rules, or a later mapping from the effect document). TileEngine names; no game numbers. */
export type FxSpawn = "drop" | "from_caster" | "beside_caster" | "in_front";
export type FxReact = "none" | "nudge" | "knock1" | "split";
export type FxBody = { readonly id: string; readonly at: Sq };
export type FxShot = {
  readonly spawn: FxSpawn;                          // chosen once for the whole ability, before any step
  readonly path: "single" | "pierce" | "bounce" | "chain" | "yank";
  readonly flightTiles: number | null;              // pierce: how many tiles the flight passes (whole, at least one); null on every other path
  readonly from: Sq;                                // the caster: distances count from here; the first chain pull goes toward it
  readonly bodies: readonly FxBody[];               // single and yank: the first only; bounce: tap order; pierce and chain: any order
  readonly land: Sq | null;                         // yank: where the pull ends (the caller picks it); null on every other path
  readonly react: FxReact;
  readonly impact: boolean;                         // the burst is drawn only when present
  readonly trail: boolean;                          // the trail is drawn only when true
  readonly layerDelay: readonly (number | null)[];  // per step: the second motion starts this fraction in; null or absent = none
};
/** Pierce flight lengths are the caller's input (presets hold the values). Whole ms; null when that mode is not used. */
export type FxFlight = { readonly totalMs: number | null; readonly msPerTile: number | null };
export type FxEffectPlan = FxPlan & { readonly notices: readonly Notice[] };
```
```ts
// src/fx/order/options.ts — append these fourteen lines to FX_OPTION_VALUES, right after `obstacles_block_leap: [false, true],` (values, order)
  landing_neighbours: ["eight", "four"],
  landing_across_seam: ["blocked", "allowed"],
  multi_hit_order: ["near_to_far"],
  rehit_same_body: ["never"],
  simultaneous_hits: ["sequential_list_order"],
  crossing_order: ["by_due_time_then_seq"],
  trap_trigger: ["any_move_end", "voluntary_steps_only"],
  modifier_stacking: ["additive_before_mitigation"],
  turn_end_effects: ["at_next_side_start", "side_end"],
  stun_count: ["victim_turn_start"],
  last_stand_release: ["before_held_deaths_and_ticks"],
  fuse_pause_during: ["spells", "all_resolution"],
  pierce_flight: ["fixed_total", "per_tile"],
  impact_burst: ["per_body", "once_at_contact"],
```
`FX_DOC_DIFFERS` is unchanged (`["reel_knock.pull_then_knock1"]`); `readFxOptions` is unchanged.
```ts
// src/fx/order/read.ts — FX_FORMAT becomes this block exactly (one inserted line: maxTaps)
/** Format limits and fill-ins the docs state, each cited. The only numbers in src/fx; the rest come in FxReadLimits. */
export const FX_FORMAT = {
  maxMs: 3000,                       // seconds up to 3.00 (SKILLRIG.md:86)
  maxSteps: 6,                       // six steps at most (SKILLRIG.md:36); 7+ kept inactive (project-format §6.7 K-4)
  connect: 0.92, reelConnect: 0.42,  // missing connect: 0.92, an old reel 0.42 (SKILLRIG.md:178, :165)
  msPerSecond: 1000,
  maxTaps: 8,                        // a bounce hits at most eight tapped squares (SKILLRIG.md:94)
} as const;
```
```ts
// src/btf-adapters/src/fx-preset.ts — the whole file (thin BTF data; imports only src/fx types)
import type { FxFlight, FxOptions, FxReadLimits } from "../../fx/order/index.ts";

/** The BTF preset: how BTF currently plays (CEO and CoS rulings 2026-11-09). Plain data the caller passes to src/fx. */
export const BTF_FX_PRESET: FxOptions = {
  hit_knock_order: "damage_then_knock_if_alive", turn_start_order: "player_side", death_order: "reward_then_meter",
  pierce_hit_timing: "per_tile_on_pass", chain_order: "hit_then_pull_per_body", reel_knock: "pull_only",
  landing_order: "hit_knock_trap_landing", simultaneous_wipe: "draw", seam_object_vs_immaculate_ray: "blocks",
  obstacles_block_leap: false,
  landing_neighbours: "eight", landing_across_seam: "blocked",  // CEO-ruled 2026-11-10 (the seam rule via CoS), not PROPOSED
  // PROPOSED (effect-order-from-docs.md silent spots 2, 4, 6, 8, 12, 14, 17-20: what BTF code does), until the user decides
  multi_hit_order: "near_to_far", rehit_same_body: "never", simultaneous_hits: "sequential_list_order",
  crossing_order: "by_due_time_then_seq", trap_trigger: "any_move_end", modifier_stacking: "additive_before_mitigation",
  turn_end_effects: "at_next_side_start", stun_count: "victim_turn_start", last_stand_release: "before_held_deaths_and_ticks",
  fuse_pause_during: "spells",
  pierce_flight: "fixed_total", impact_burst: "per_body",  // CEO-ruled 2026-11-10 (via CoS), not PROPOSED
};

/** BTF pierce flight: the whole flight takes 0.40 s, split evenly over the tiles it passes (CEO 2026-11-10). No BTF per-tile speed. */
export const BTF_FX_FLIGHT: FxFlight = { totalMs: 400, msPerTile: null };

/** BTF read limits: min step 0.20 s is PROVISIONAL pending CEO (SKILLRIG.md:86; the catalogue slider allows 0.15 s);
 *  fill-in 0.48 s and connect 0.02–1 are CEO-approved (2026-11-10; catalogue effect.steps default, effect.connect). */
export const BTF_FX_READ_LIMITS: FxReadLimits = { minStepMs: 200, fillStepMs: 480, minConnect: 0.02, maxConnect: 1 };
```
```ts
// src/fx/order/index.ts — the whole file
export type { FxBody, FxCue, FxEffectPlan, FxFlight, FxOptions, FxOptionsRead, FxOrder, FxPlan, FxReact, FxRead, FxReadLimits, FxShot, FxSpawn, FxStep } from "./types.ts";
export { FX_DOC_DIFFERS, FX_OPTION_VALUES, readFxOptions } from "./options.ts";
export { FX_FORMAT, readFxOrder } from "./read.ts";
export { planFx, playFx } from "./timeline.ts";
export { planEffect } from "./effect.ts";
export { pickLanding } from "./landing.ts";
```
```ts
// src/btf-adapters/src/index.ts — the whole file
export { BTF_FX_FLIGHT, BTF_FX_PRESET, BTF_FX_READ_LIMITS } from "./fx-preset.ts";
export { laneIdToSq, sqToLaneId } from "./lane-labels.ts";
```
```ts
// exported functions (new)
export function planEffect(order: FxOrder, shot: FxShot, options: FxOptions, flight: FxFlight): FxEffectPlan;               // effect.ts
export function pickLanding(target: Sq, from: Sq, neighbours: FxOptions["landing_neighbours"], canLand: (at: Sq) => boolean): Sq | null;  // landing.ts
```
`src/btf-adapters/src/index.ts` adds `BTF_FX_FLIGHT` to its re-exports (quoted above). `planFx`, `playFx`, `readFxOrder`, `readFxOptions` and `timeline.ts` are unchanged; `playFx` plays an `FxEffectPlan` as it is (it is an `FxPlan`).

Behaviour (exact; each line has a test). Below, `start(i)` is step `i`'s start (step 0 at 0, each next at the previous start + its `ms`), `last` is the last playing step, and `hitAt = start(last) + Math.round(order.connect × ms(last))` (step 10's hit cue).
1. **Bad shot (law 12):** `planEffect` throws `RangeError("planEffect: shot out of range")`, before anything else, when any `layerDelay` entry is neither `null`/absent nor a finite number in `0…1` (`NaN` fails); when `land` is `null` on a `"yank"` path or not `null` on any other path; when `flightTiles` is not `null` off the `"pierce"` path, or on `"pierce"` is not an integer ≥ 1, or a pierce body's tiles-from-caster is not in `1…flightTiles`; or when, on `"pierce"` with `pierce_hit_timing: "per_tile_on_pass"`, the length the chosen `pierce_flight` needs (`flight.totalMs` for `"fixed_total"`, `flight.msPerTile` for `"per_tile"`) is not an integer ≥ 1. The other length may be `null`.
2. **Spawn once (§A3, SKILLRIG.md:77-84, :177) and trail (§A8, :179, :139-140):** the first cue is `{ kind: "spawn", at: 0, spawn: shot.spawn, trail: shot.trail }`, then `planFx(order)`'s cues. `endMs` is the larger of `planFx(order).endMs` and the latest cue's `at` (a pierce flight may run past the last step).
3. **Second motion (§A10, SKILLRIG.md:112):** for each playing step `i` whose `layerDelay[i]` is a number, one `{ kind: "layer", at: start(i) + Math.round(layerDelay[i] × ms(i)), index: i }`. It adds no step cue and never moves the hit; entries past the playing steps are ignored.
4. **Which bodies, in what order:** `"single"` and `"yank"` use only `bodies[0]` (the rest: no cue, no notice). `"bounce"` keeps tap order (§A13, SKILLRIG.md:94); taps past `FX_FORMAT.maxTaps` are dropped with one `fxOverCap` notice, **before** repeats are removed. `"pierce"` and `"chain"` sort near to far (spot 8, `multi_hit_order: near_to_far`) by tiles from `shot.from` = `max(|Δc|, |Δr|)`, ties keep input order. Then, on every path, a body id already kept is dropped (spot 12, `rehit_same_body: never`: one strike per body per play).
5. **Strikes (§A17, SKILLRIG.md:134-137; §A8):** each kept body gets `{ kind: "strike", at, body: id, react }`. `react` is `shot.react`, except that on a reel path (`"chain"`, `"yank"`) `"knock1"` reads as `"none"` (the knock is a separate cue, Behaviour 8). A `"single"` shot with no body still gets one strike with `body: null` at `hitAt` (TILE pipe: the animation plays either way). Other paths with no bodies get no strike. `at` is `hitAt`, except Behaviour 6. **Impact (§A8, SKILLRIG.md:179; CEO 2026-11-10):** when `shot.impact` is true, `impact_burst: "per_body"` puts `{ kind: "impact", at, body }` (same `at` and `body`, `null` included) right after every strike; `"once_at_contact"` puts it only after the first strike in body order, which is the first to land (the nearest body on a pierce). One strike (a single body, or the `body: null` strike) gives the same one impact in both modes. `shot.impact` false: no impact cue.
6. **Pierce (§A14, SKILLRIG.md:91; spots 8, 9; CEO 2026-11-10):** the flight starts at `hitAt` (step 10's hit, the moment the shot connects) and passes tiles `1…N`, `N = shot.flightTiles`, counted from `shot.from`. With `pierce_hit_timing: "per_tile_on_pass"`, a body `i` tiles out strikes at `hitAt + Math.round(i × flight.totalMs / N)` for `"fixed_total"` (in code `Math.round(flight.totalMs * i / N)`), or `hitAt + i × flight.msPerTile` for `"per_tile"`. The rounding is of each **cumulative** time, never of a per-tile slice, so tile `N` lands at exactly `hitAt + totalMs` (400 over 3 tiles: +133, +267, +400, not +133, +266, +399). With `"all_at_connect"` the flight is ignored and every strike is at `hitAt`, still near to far. A pierce with no bodies gives no strike. (This replaces r2's spread over the last step; that formula is gone, not kept as a mode.)
7. **Chain (§A15, SKILLRIG.md:98; spot 10, `chain_order: hit_then_pull_per_body`):** after each body's strike, `{ kind: "pull", at: hitAt, body, toward, all: false }`: one tile closer to the body before it, where `toward` is `shot.from` for the first kept body and the previous kept body's `at` for the rest. Whether the tile is free is the rules' job (a blocked pull moves nothing).
8. **Yank and reel knock (§A15, §A16, SKILLRIG.md:98, :142; spot 11):** a `"yank"` body's strike (even with `react: "none"`) is followed by `{ kind: "pull", at: hitAt, body, toward: shot.land, all: true }`. On a reel path, when `shot.react` is `"knock1"` and `options.reel_knock` is `"pull_then_knock1"`, each pull is followed by `{ kind: "knock", at: hitAt, body }`; with `"pull_only"` there is no knock cue.
9. **Order (spots 14, 20: `simultaneous_hits: sequential_list_order`, `crossing_order: by_due_time_then_seq`):** cues are sorted by `at` ascending; ties keep this list order: spawn, `planFx`'s cues, layer cues by step, then the body cues in body order (strike, impact, pull, knock). `notices` holds only Behaviour 4's `fxOverCap`.
10. **Preview only (§A18, SKILLRIG.md:38):** `planEffect` never reads `order.raw` (`speed`, `loop` and the like change nothing); game speed is the clock's.
11. **pickLanding (CEO 2026-11-10; catalogue §47 L2862-2863):** the candidates are the 8 tiles around `target` for `"eight"`, or its 4 side tiles for `"four"`, in the sweep order (column offset −1, 0, 1; inside each, row offset −1, 0, 1; the target itself skipped). `canLand` is called once for every candidate, in sweep order (the caller says no for off-board, closed or occupied tiles, and, when `landing_across_seam` is `"blocked"`, for a tile a seam object cuts off from the target: only an orthogonal neighbour of the target with a seam object on their shared edge; a diagonal (corner) neighbour is never walled off, catalogue §47 L2862, `seamBlocks`). Among the candidates `canLand` accepts, the one with the smallest `|c − from.c| + |r − from.r|` wins; ties keep the first. None accepted → `null`.
12. **Options:** the fourteen new keys read through step 10's `readFxOptions` like the rest (unknown, invalid and doc-differs notices unchanged); `BTF_FX_PRESET` has every key of `FX_OPTION_VALUES`. `planEffect` reads `pierce_hit_timing`, `pierce_flight`, `impact_burst` and `reel_knock`; `pickLanding` reads none (it takes `landing_neighbours` as an argument; callers apply `landing_across_seam` in `canLand`). The single-value keys `multi_hit_order`, `rehit_same_body`, `simultaneous_hits` and `crossing_order` are not read: the code is their only legal value, and a later second value must add the read.

## Tests that prove it is done
Run: `npm test`, or `node --test tests/fx/*.test.ts`. Each fx test name starts with the §A rule(s) or ruling and the doc line(s) it proves. In `tests/fx/effect.test.ts`, orders are read with `BTF_FX_READ_LIMITS` from blocks `` `SKILLRIG v1\n\n${JSON.stringify({ frames: seconds.map((s) => ({ seconds: s })), connect, ...extra })}\n` ``; `two` = seconds `[0.3, 0.5]` at connect `0.5` (steps @0 and @300, `hitAt` 550, `endMs` 800); a shot's defaults are `spawn: "drop"`, `path: "single"`, `flightTiles: null`, `from: (0,0)`, `bodies: []`, `land: null`, `react: "none"`, `impact: false`, `trail: false`, `layerDelay: []`; options are `BTF_FX_PRESET` and the flight `BTF_FX_FLIGHT` unless stated. "Body cues" = the strike / impact / pull / knock cues in plan order.
- `tests/fx/effect.test.ts`
  - "§A3 + §A8 SKILLRIG.md:77-84, :177, :179, :139-140 — spawn is chosen once, before any step; impact and trail only when set": `two`, `spawn: "beside_caster"`, body `a` at (2,0), `react: "nudge"`, `impact: true` → cues exactly `spawn@0 {beside_caster, trail false}`, `step 0 @0`, `step 1 @300`, `hit @550`, `strike @550 {a, nudge}`, `impact @550 {a}`; `endMs` 800; notices `[]`. No bodies, `trail: true` → first cue `spawn@0 {drop, trail true}`, last cue `strike @550 {body null, none}` (no impact).
  - "§A10 SKILLRIG.md:112 — a second motion starts late by a fraction of its step, adds no step and does not move the hit": `layerDelay [0.5, 0.25]` → step/layer/hit cues exactly `step 0 @0`, `layer 0 @150`, `step 1 @300`, `layer 1 @425`, `hit @550`; `endMs` 800. `[null, 0.001]` → only `layer 1 @301` (`0.001 × 500 = 0.5` rounds half up to 1; floor and round-half-even give 300). `[1.5]`, `[-0.1]`, `[NaN]` each throw `RangeError`.
  - "§A13 SKILLRIG.md:94 + spot 12 — bounce hits the taps in tap order at connect, at most eight; a body is hit once": tap `i` is at (10 − i, 0) (taps get nearer, so a near-to-far sort fails). Taps `c, a, b, a` → strikes exactly `c, a, b`, all @550, react `none`. Taps `t1`…`t10` → strikes `t1`…`t8`, notice codes exactly `["fxOverCap"]`. Taps `t1, t1, t2, …, t8` (nine) → 7 strikes and 1 notice (cap first, then repeats).
  - "§A14 SKILLRIG.md:91 + spots 8, 9 — free fire passes through near to far; each body is struck when the flight reaches its tile (CEO 2026-11-10)": order seconds `[0.5]` at `0.5` (`hitAt` 250); a line of `N` tiles has body `d<k>` at (k, 0). Strike `[body, at]` exactly: `N` 4, bodies given `3, 1, 4, 2` → `d1 350, d2 450, d3 550, d4 650` (100 ms a tile); `N` 3, bodies 1–3 → `d1 383, d2 517, d3 650` (400/3: cumulative rounding; a per-slice build gives 516 and 649, floor gives 516); `N` 4, body 2 only → `d2 450` (the tile count is `flightTiles`, not the farthest body); `N` 1 → `d1 650`; `N` 4, body 4: `endMs` 650. Caller total `{ totalMs: 250, msPerTile: null }`, `N` 4, bodies 1, 4 → `d1 313, d4 500` (`62.5 → 63` half up; floor and round-half-even give 62; the old r2 fixture, now under the flight rule). `pierce_flight: "per_tile"`, `{ totalMs: 400, msPerTile: 90 }`, `N` 3, bodies 1–3 → `d1 340, d2 430, d3 520` (against 383, 517, 650 for `"fixed_total"` on the same line); `endMs` 520 for body 3 alone with `{ totalMs: null, msPerTile: 90 }`; a pierce with no bodies → no strike in both modes. `all_at_connect`, `N` 4, bodies given `2, 1` → `d1 250, d2 250`. Each throws `RangeError`: a body 5 tiles out on `N` 4; `"pierce"` with `flightTiles: null`; `"single"` with `flightTiles: 2`; `"per_tile"` with `BTF_FX_FLIGHT` (no `msPerTile`).
  - "§A8 SKILLRIG.md:179 — every body hit gets its own impact when the shot reaches it (CEO 2026-11-10); once_at_contact gives one": seconds `[0.5]` at `0.5`, pierce `N` 4, `impact: true`, bodies `x` (1,0), `y` (2,0), `z` (4,0) → impact cues exactly `x 350, y 450, z 650`; `impact_burst: "once_at_contact"` → exactly `x 350`; `impact: false` → none. In both modes: a single body `a` (1,0) → exactly `strike a @250`, `impact a @250`; no bodies → exactly `strike null @250`, `impact null @250`.
  - "§A15 SKILLRIG.md:98 + spot 10 — chain: hit, then that body's one-tile pull toward the one before it, near to far": `two`, `path: "chain"`, bodies `q` (3,0), `p` (1,1), `s` (2,2) → body cues exactly strike `p`, pull `p` toward (0,0), strike `s`, pull `s` toward (1,1), strike `q`, pull `q` toward (2,2); all @550, `all: false`, react `none` (the tiles-from-caster are 1, 2, 3; a row-plus-column distance would put `q` second).
  - "§A15 + §A16 SKILLRIG.md:98, :142 + spot 11 — yank pulls the one body all the way, even when the hit is None; Knock 1 only with pull_then_knock1": `two`, `path: "yank"`, bodies `e` (3,0), `f` (4,0), `land` (1,0). `react: "none"` → exactly strike `e` (none), pull `e` toward (1,0) `all: true`. `react: "knock1"` → the same two cues (react `none`, no knock). `react: "knock1"` with `reel_knock: "pull_then_knock1"` → strike `e` (none), pull `e`, knock `e`, all @550. Chain body `p` (1,0), `react: "knock1"`, `pull_then_knock1` → strike `p` (none), pull `p` toward (0,0), knock `p`. `path: "yank"` with `land: null`, and `"single"` with `land` (1,0), each throw `RangeError`.
  - "§A17 SKILLRIG.md:134-137 — the hit kind rides on each strike as given (visual; rules move bodies)": a single body `a` (1,0) with each `react` of `none`, `nudge`, `knock1`, `split` → exactly one strike @550 with that react.
  - "§A18 SKILLRIG.md:38 — loop and speed are preview only; the plan plays on the one clock": body `a` (1,0), `layerDelay [0.5]`; the order read with extra `{ speed: 2, loop: true }` plans `deepEqual` to `two`'s. Played with `playFx` on `createClock({ stepMs: 10 })` for 60 `clock.step()`s → `[kind, clock.now()]` exactly `[spawn,0] [step,0] [layer,150] [step,300] [hit,550] [strike,550]`.
- `tests/fx/landing.test.ts` (target (2,2), sword at (0,0); `canLand` says no to the listed tiles)
  - "holy-sword landing (CEO 2026-11-10): the free neighbour nearest the sword; 8 around by default, 4 sides as the option": all free, `"eight"` → (1,1); all free, `"four"` → (1,2); (1,1) taken, `"eight"` → (1,2); the four sides taken, `"eight"` → (1,1); sword at (0,5), (1,3) taken, `"eight"` → (1,2) (a tie at 4 steps; a max-gap or straight-line distance gives (2,3)); target (0,0), sword (3,3), `canLand` = on board (`c ≥ 0`, `r ≥ 0`) → (1,1) (a first-free pick gives (0,1)); a recording `canLand` sees exactly `1,1 1,2 1,3 2,1 2,3 3,1 3,2 3,3`.
  - "holy-sword landing (CEO 2026-11-10): every neighbour filled by objects or units means the sword cannot reach the target": all 8 taken, `"eight"` → `null`; the four sides taken, `"four"` → `null`.
  - "landing across a seam (CoS 2026-11-10): the caller's canLand decides; blocked rejects the seam-cut side tile": target (2,2), sword (0,2), `"eight"`: `canLand` accepting all (`"allowed"`) → (1,2); `canLand` rejecting only (1,2) (`"blocked"`, a seam on that shared edge) → (1,1). No seam geometry in `src/fx`.
- `tests/fx/options.test.ts` (appended; existing tests unchanged)
  - "10b options: holy-sword landing checks all 8 around by default (CEO 2026-11-10); PROPOSED silent-spot defaults are the user's": preset `landing_neighbours` `"eight"`, `landing_across_seam` `"blocked"`, `pierce_flight` `"fixed_total"`, `impact_burst` `"per_body"`, `BTF_FX_FLIGHT` exactly `{ totalMs: 400, msPerTile: null }`, `FX_OPTION_VALUES.pierce_flight` `["fixed_total", "per_tile"]` and `.impact_burst` `["per_body", "once_at_contact"]`, `multi_hit_order` `"near_to_far"`, `rehit_same_body` `"never"`, `trap_trigger` `"any_move_end"`, `turn_end_effects` `"at_next_side_start"`, `fuse_pause_during` `"spells"`; `{ landing_neighbours: "four", landing_across_seam: "allowed", trap_trigger: "voluntary_steps_only", fuse_pause_during: "all_resolution", stun_count: "never" }` over the preset → the preset with the first four changed, codes exactly `["fxOptionInvalid"]`; `{ pierce_flight: "per_tile", impact_burst: "once_at_contact" }` is taken with no notice.

## Example
```ts
const line = rules.pierceLine(caster.at, aim);         // the squares the flight passes, nearest first (rules)
const plan = planEffect(read.order, {
  spawn: "from_caster", path: "pierce", flightTiles: line.length, from: caster.at, bodies: bodiesOn(line), land: null,
  react: "nudge", impact: true, trail: true, layerDelay: [],
}, options, BTF_FX_FLIGHT);                             // options = readFxOptions(project.fxOrder, BTF_FX_PRESET).options
for (const n of plan.notices) devOverlay.warn(n);       // warn, don't block
const stop = playFx(clock, plan, (cue) => {
  if (cue.kind === "strike" && cue.body !== null) rules.strike(cue.body);   // the game decides what a strike does
  if (cue.kind === "impact") vfx.burst(cue.at, cue.body);                // burst, hit number, hit sound
  if (cue.kind === "pull") rules.pull(cue.body, cue.toward, cue.all);       // blocked pull = no move (rules)
});
const landing = pickLanding(foe.at, sword.at, options.landing_neighbours, (sq) => grid.inBounds(sq) && grid.isOpen(sq) && units.occupantAt(sq) === undefined
  && (options.landing_across_seam === "allowed" || !rules.seamBetween(sq, foe.at)));   // the caller honours the seam option
if (landing === null) { /* the sword can't reach this foe: leave it out of the targets */ }
```

## How later steps use this (context only; do not build)
- Step 10c (proposed): §A9 look ramps, §A11 release, §A12 copies (seeded spread) for the FX painter, with their tunables as inputs.
- A mapping step fills `FxShot` from an effect document or SkillRig block (`fromSkillSpec`), and the catalogue `effect` knobs; it fills `flightTiles` from the pierce range, and for a shot that stops on the first body it reaches it passes only that body on `"single"` (BTF adapter note: the holy arrow).
- Rules steps act on strikes, impacts, pulls and knocks through the UNIT/TILE pipes and step 04's moves (`hit_knock_order`, `landing_order`, `trap_trigger`, `stun_count`, `last_stand_release`, `turn_end_effects`, `fuse_pause_during`, `modifier_stacking`), and the holy-sword rules call `pickLanding` and read `obstacles_block_leap`.

## Decisions note: what to name
- The exact `fxOverCap` message for taps (the code is fixed).
- How you build, de-duplicate and sort the body list.
- Anything you chose that the file doesn't state (law 12).

## BTF intent (read-only)
None from BTF code (CEO 2026-11-09: no frozen copy). The order is `effect-order-from-docs.md` §A and its silent-spot answers; the holy-sword landing facts are the catalogue's record (quoted in Rulings and Behaviour 11). Not carried: the sword's flight curve (drawing only), the AI sword's landing order and the flask fallback (catalogue §47, a later rules step).

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/STATES.md`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `src/fx/order/timeline.ts`, `src/btf-adapters/src/lane-labels.ts`; in `src/fx/order/read.ts` and `options.ts`, everything but the quoted inserted lines.
- `tests/fx/read.test.ts`, `tests/fx/timeline.test.ts`, `tests/btf-adapters/**`, `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`, `tests/sim/**`, `tests/runtime/**`, and every existing test (in `tests/fx/options.test.ts` you only insert: one import line and the appended test).
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.
- Every earlier step's other files: `src/core/**`, `src/state/**`, `src/rules/**`, `src/project/**`, `src/runtime/**`, `src/sim/**`, `src/index.ts`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit (green = BUILD_GUIDE §6).
- [ ] `npm test` summary: fail 0, skipped 0, todo 0; pass ≥ 157. No `.only`, `.skip` or `.todo` (`rg -n '\.(only|skip|todo)\(' tests` prints nothing).
- [ ] `npm run check:state` prints `check:state OK (src)` and `npm run check:law` prints `check:law OK (src)`; `npm run deps` reports no violations; `sha256sum .dependency-cruiser.cjs` prints `dcf61c61fef3d0fce8a6a14c98b1cc5f6ea9c0298c843236fa6fca9c8f798628` (unchanged).
- [ ] `npm run sim` prints exactly the base's two lines: `stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75` and `stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`.
- [ ] `rg -n --pcre2 '\bMath\.random\b|\bDate\b|\bperformance\.now\b|\b(setTimeout|setInterval|queueMicrotask|requestAnimationFrame)\b' src/fx src/btf-adapters` prints nothing.
- [ ] `rg -n --pcre2 '(?<![\w.])(?!(?:0|1|2)(?:\.0)?\b(?![.\d]))(?:\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|0[xX][0-9A-Fa-f]+)\b' src/fx` prints exactly five lines, all in `src/fx/order/read.ts`, and they are the five numeric lines of the quoted `FX_FORMAT` block (comments elsewhere in `src/fx`: no digits).
- [ ] `rg -n --pcre2 'Math\.(floor|ceil|trunc)\b|toFixed' src/fx` prints nothing (whole ms only through `Math.round`).
- [ ] `rg -n --pcre2 '\b400\b|\b0\.40?\b' src/fx` prints nothing (the BTF flight lives in `src/btf-adapters`), and `rg -n '\b400\b' src/btf-adapters` prints exactly one line, the quoted `BTF_FX_FLIGHT`.
- [ ] `rg -n --pcre2 "from ['\"](?!\./|\.\./\.\./(types|core)/)" src/fx` prints nothing, and `rg -n --pcre2 "from ['\"][^'\"]*/(rules|state|sim|runtime|project|btf-adapters)/" src/fx` prints nothing.
- [ ] `rg -n --pcre2 "from ['\"][^'\"]*/fx/" src/core src/state src/project src/types` prints nothing.
- [ ] `rg -n --pcre2 "from ['\"](?!\./|\.\./\.\./(types|fx)/)" src/btf-adapters` prints nothing, `rg -n --pcre2 "^(import|export) (?!type ).*from ['\"][^'\"]*/fx/" src/btf-adapters` prints nothing, and `rg -n 'btf-adapters' src --glob '!src/btf-adapters/**'` prints nothing.
- [ ] `rg -n -i 'btf' src/fx` prints nothing, and `rg -n -i --pcre2 '\b(lucifer|holy|sword|blade|earth|seam)\b' src/fx/order/effect.ts src/fx/order/landing.ts` prints nothing (no game piece names in the engine functions).
- [ ] `rg -n -i 'g-tile-engine|towerchess|/tower/|skillrig/spec' src` prints nothing, and `find src/btf-adapters -path '*vendor*'` prints nothing.
- [ ] `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|damage|deck|cards?|stats?)\b\s*[:=]\s*-?\d' src/fx src/btf-adapters` prints nothing, and `rg -n -i --pcre2 '\b(hp|maxhp|mana|cost|deck|cards?|stats?)\b' src/fx src/btf-adapters` prints nothing.
- [ ] `rg -n --pcre2 '\bcreateClock\b|clock\.(advance|step|pause|resume|setTimeScale)\(' src/fx` prints nothing; `rg -n --pcre2 "from ['\"]node:|\bfetch\b|readFile|writeFile|localStorage" src/fx src/btf-adapters` prints nothing; `rg -n --pcre2 '\?\?' src/fx` prints nothing.
- [ ] `git diff --name-only <base>..<head> -- src/core src/types src/state src/rules src/project src/runtime src/sim src/index.ts src/fx/order/timeline.ts src/btf-adapters/src/lane-labels.ts scripts package.json package-lock.json eslint.config.mjs tsconfig.json .dependency-cruiser.cjs tests/fixtures tests/sim tests/runtime tests/btf-adapters tests/fx/read.test.ts tests/fx/timeline.test.ts tests/smoke.test.ts tests/gates.test.ts` prints nothing.
- [ ] `git diff --numstat <base>..<head> -- src/fx/order/read.ts src/fx/order/options.ts tests/fx/options.test.ts` shows `1 0` for `read.ts` and 0 deletions for the other two.
- [ ] `git diff --stat <base>..<head> -- . ':!package-lock.json' ':!handback'` shows ≤ 355 changed lines (insertions + deletions); each file within its limit above.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the eleven files in "Files to create or change" (`A` for `effect.ts`, `landing.ts`, `effect.test.ts`, `landing.test.ts`; `M` for the other seven; anything extra is named and justified in the Decisions note).
- [ ] Hand-back `handback/step-10b-fx-timeline/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (silent in the docs or pending: flagged to the user, do not invent)
- §A rules 9, 11, 12 (look ramps, release, copies): step 10c (proposed).
- Silent spot 3 (damage layers): no key. Its order (veil, guards, shields, then the loss and the Last Stand clamp) is a list of game-rule layers, so it belongs to a rules step's data, not `src/fx`. Silent spot 16 (random-pick order): no key; seeded `core/rng` streams drawn in the effect's pick order already hold (ARCH §9).
- PROPOSED until the user decides (BTF code, effect-order-from-docs.md silent spots): the ten keys marked in `fx-preset.ts`; `turn_end_effects: "side_end"` is an engine alternative (TileEngine has a real `sideEnd` phase, STATES §3), not a BTF path. Also PROPOSED, with no doc line: bounce strikes all at connect in tap order; the tap cap before repeats; tiles-from-caster as the larger gap; the landing tie order.
- Pierce flight (`fixed_total`, 0.40 s) and the impact burst (`per_body`) are CEO-ruled (2026-11-10, via CoS), not pending.
- `BTF_FX_READ_LIMITS.minStepMs` (0.20 s) stays PROVISIONAL (step 10); no question pending.

## Out of scope
- The FX painter (`paint.ts` rewrite, runtime/view), `scale_snap`, blade art and `bladeKey`, the editor's Effect Designer and booth.
- Reading effect documents or SkillRig fields into `FxShot` (`fromSkillSpec`); any rule that acts on a cue or an option; the holy sword's flight, fade-in, AI landing order and flask fallback.
- One source for `obstacles_block_leap` and the catalogue knob (parked by RaiKynn 2026-11-10, step 10).
