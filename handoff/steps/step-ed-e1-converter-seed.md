# step-ed-e1-converter-seed: Effect Designer E1. The effect-doc converter (R1: one effect document's effective values become one LiveFx), the `variant_seed` fold into the particle hash (R2, CN-021), and the editor-only model for parts provenance, flatten and Fit (CN-020, scope §4.2 merge rule 4). No UI.

Step id: step-ed-e1-converter-seed          Revision: r<N> (start at r1; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`3c969024`** (`3c969024bf5096fd8d78787c3f3c1446564d12e8`, main, the S0 kit commit on top of `71b1a990`; it adds only `handoff/steps/` files; test floor 742/0). The proto started on `d982155b`, was rebased onto `71b1a990`, took QA's fix `e50e98a0` as a fast-forward, and was **rebased onto `3c969024`** with no conflicts (trees `870aae97` and `4106c8a0`, as QA's merge-tree). No E1 file changed. Branch: `step/step-ed-e1-converter-seed-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-ed-e1-converter-seed-r<N>.bundle 3c969024..step/step-ed-e1-converter-seed-r<N>`, then `git bundle verify`. Upload the bundle and a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`.
Hand-back location: `handback/step-ed-e1-converter-seed/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: G2b (merged) and main `3c969024` (the S0 kit). Independent of the S0 build (`step-ed-s0-flag-page`): no file overlap (S0 is `tools/`, `tests/tools/` and `docs/qa/` only); QA's merge-tree with S0 build A + QA fix is clean. If S0 merges first, rebase onto it; no conflict is expected.
Read first: BUILD_GUIDE.md §0, §2 (engine law), §6 (green), §7; the scope `/workspace/share/effect-designer/scope.md` §4, §7, §8 (sha256 `cb3cba1e…`); DSK's PROPOSED notices `handoff/change-notices/CN-020-effect-parts-format.md` (`9a73b99c…`) and `CN-021-effect-variant-seed.md` (`d63ea816…`); `data/setup-format.md` r29 §2.4, §2.10.1.2, §2.10.1.5, §2.10.2.1; `behaviour-library/behaviours.json` rev 24 (`effect`: connect 0.92, steps seconds 0.48).
Kit: kit-1 r2, 2026-11-16 (r2 = QA's E1 review `docs/qa/step-ed-e1-review.md` `9f5f1c69…`: OK TO SEND with the G6 test, ruling 12). Engine Architect. Proto `/tmp/ede1` branch `ede1`, head `5db8cea9` (`5db8cea9a2649327ef524b927d1ee054053ff3d0`, tree `4106c8a0`, parent `0e84efcc` = the E1 commit, tree `870aae97`, parent `3c969024`; G-TileEngine noreply author and committer). 8 files, +279/−5 = **284 changed lines** (src 154, tests 130). Green 753/0 (742 + 11). EA plants 27/27 (`/workspace/scratch-ea/effect-designer/ede1-plants.py`); QA plants 20/20 (12/20 without QA's test). Bundle backup `/workspace/scratch-ea/effect-designer/step-ed-e1-proto-r2.bundle` (`3c969024..ede1`, sha256 `b9126839…`); r1 bundle `step-ed-e1-proto.bundle` (`0e27ac93…`) is superseded.
Carries: see § Carries (QA E1 review). `package.json` (`1e5dd82c…`), the lock (`d7f64a09…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and `src/types/core-types.ts` (`d6d08696…`) are unchanged. **No core-types change** (`LiveFx` lives in `src/runtime/render/fx-live.ts`, not core-types).

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review). Without it the hand-back is a REJECT.

## Goal
Today the runtime plays a `LiveFx` that hosts build by hand. The editor stores effect documents (behaviour-setup of `effect`). After this step:
1. **R1, converter.** `docToLiveFx(doc, host)` turns one effect document's effective values into one `LiveFx`, following the r29 timing rules.
2. **R2, seed.** `variant_seed` folds into the particle hash. Absent means 0, which gives today's bytes exactly.
3. **Editor model.** Pure editor functions cover:
   - checking `parts[]` and step `part` (CN-020);
   - provenance info and "Export clean";
   - the CN-021 writer and the blend seed;
   - `flatten` of two effects into one ordinary document;
   - `fit` to the budgets, with a one-line message for every trim.

Play never reads `parts`, `part`, `from` or `nudge_ms`. There is no UI in E1.

## Rulings
1. **Effective values in.** The converter reads already-resolved values (`effective()`, §2.4). It does not read the catalogue. Absent keys get the r29 defaults (seconds 0.48, connect 0.92), and an absent field means today's behaviour.
2. **Timing (r29 §2.10.1.2).**
   - `len = round(seconds × 1000)`; seconds are clamped to 0.15–3, out of range gives `outOfRange`.
   - A first `after-last` or `with-last` step starts at 0. A first `at-time` step starts at `start_at_ms` (r29; ruling 13 R-a). A first `at-hit` step is at or before the hit, so it falls back to after-last and starts at 0.
   - `after-last` starts at the previous start + len + `hold_ms`.
   - `with-last` starts at the previous start. `at-time` starts at `start_at_ms`. `at-hit` starts at hit + `start_at_ms`.
   - An `at-hit` step at or before the hit step falls back to `after-last` and warns `atHitBeforeHit`.
   - An unknown `start_mode` gives `outOfRange` and is treated as after-last.
   - `fade_out_ms` counts for `dim` and `stamp` only. It extends the piece but never delays the chain.
   - `hold_ms` clamps to 0–20000. **A piece lasts len + `hold_ms` + `fade_out_ms`** (= `ends − starts`; ruling 13 M1).
   - A disabled step keeps its slot in the chain but draws nothing.
   - Steps 13+ give `overCap` "Steps 13+ are saved but won't play".
3. **Hit (§2.10.1.5).**
   - `connect_step` absent or `""` means the last of the first 12 steps. An unknown id gives `unknownRef` and that default.
   - `hit = ceil(start + max(50, len) × connect)`, with connect in 0.02–1.
   - The result is passed as `LiveFx.hitOffsetMs`.
4. **Pieces.**
   - Pictures map to sheets through `host.sheetOf`. A `null` sheet gives `noPicture` and the step is skipped (stock picture sheets are not in the engine yet).
   - Only the listed step keys pass through (`STEP_KEYS`). `id`, `part`, `from` and `nudge_ms` are never copied.
   - The Feel knobs pass through via `KNOBS`, `variant_seed` included.
5. **Seed (CN-021).**
   - `variantSeed(v)`: absent gives 0; an integer 0…2147483647 is used as is; any other number gives 0 with `outOfRange`; a wrong JS type gives 0 with `invalidValue`. Each is noted once per effect, as `{code, message: "variant_seed"}`.
   - The particle hash becomes `hash32(mapSeed, e.id, i, seed)`. The old fourth argument was `0`, so an absent seed is byte-identical.
   - The writer stores absent for 0 (`writeSeed`).
6. **Parts (CN-020, DSK choices).**
   - A wrong JS type gives `invalidValue`. That covers parts not being an array, a part without a string id, a duplicate id, a non-string kind, empty or non-string beats, a bad `from`, and a non-string label.
   - An unknown kind or beat gives `outOfRange`.
   - `nudge_ms` that is not an integer gives `outOfRange`; one off the 30 ms grid gives `offStep`.
   - More than 6 parts gives `overCap`.
   - A step `part` with no matching part id gives `unknownRef` and **is kept**.
   - `label` is optional.
   - All of these warn and never throw or drop anything.
7. **Provenance is info only.** `from.rev` is the source document's envelope rev. `fromInfo` returns `current`, `changed`, `removed` or `cycle` (cycles are found by a walk through the sources' `from`s). A dangling or cyclic `from` never warns. "Export clean" strips `from` from every part and changes nothing else.
8. **Blend seed.** `blendSeed(A.seed, B.seed, mix, base) = hash32(A, "blend:<snap>:<base>", B, 0) & 0x7fffffff`, with mix snapped to 0/25/50/75/100. `flatten` stores it once through `writeSeed`, so a seed of 0 is stored absent.
9. **Flatten (E1 = "Both" on every beat).**
   - The base keeps its knobs and its hit, with `connect_step` pinned to the base hit step id.
   - The other side's first 12 steps become `at-time` steps re-timed so its hit lands on the base hit: `start_at_ms = baseHit + (otherStart − otherHit)`, clamped to 0…20000. A start below 0 gives a message.
   - Moved steps get fresh step ids (`mint("s-")`). The other side's parts get fresh ids (`mint("p-")`) and `from: {effect: other.id, rev: other.rev}`, and each step `part` is remapped to the new id.
   - Mix feeds only the seed in E1.
   - **`flatten` runs Fit and honours `preset`** (scope §4 rule 4: budgets are enforced while you merge). It ends with `fit(doc, sides, {preset})` (base steps `base`, moved steps `other`; preset → 32 sparks) and returns Fit's lines after the retime lines (ruling 13 R-b). The signature keeps `preset?`.
10. **Fit (merge rule 4).**
    - Particles scale pro rata (floored) to ≤ 48, or ≤ 32 for presets.
    - The 2 largest lights (by `light_radius`, default 2) stay lit. On ties the base side wins, then list order. The others get `light_mode: "off"`, and the `light` alias is removed.
    - The hit (`connect_step`) is pinned before any drop.
    - Over 12 steps, steps are dropped by class in this order: **Linger**, then **trail** (part kind `trail`), then **spread** (`jitter`, `start_spread` or `size_spread` > 0).
    - Within a class, the lowest weight goes first, where weight = len × (particle count / 12 for particle steps, else 1). On a weight tie the **non-base side** goes first, then the later index.
    - Fit never drops the hit step or **a side's last remaining step in a beat**.
    - The beat is the part's beat when the part names exactly one. Otherwise it comes from **list position**, not start times: a step listed before the hit step = cast, the hit step = hit, a step listed after it = linger. So an `at-hit` step listed after the hit counts as linger here (carry (d) → E4).
    - Every trim returns one line: `Scaled sparks X → Y to fit C`, `Kept the 2 largest lights; turned off n`, `Trimmed n <class> step(s) to fit`, `Still N steps: steps 13+ are saved but won't play`.
11. **Layering.** `fx-doc.ts` lives in `src/runtime/render/`, because the scene folder fence (step 31) allows only `world-scene.ts` and the render fence (step 27) allows same-folder imports only. It uses `FxNote`, not `core/notice.ts`. `variantSeed` lives in `fx-particles.ts`, so `fx-live` does not import `fx-doc` (no cycle). The editor model is in `src/editor/effect/` and imports render and `core/notice.ts` type only. No game rules.
12. **G6 (QA E1 review `9f5f1c69…`).** QA's `tests/editor/effect-e1-qa2.test.ts` (fix ref `refs/cmp/sede1-qa2-fix-a` `e50e98a0`, parent `927df645`, noreply; 35 lines, cap 37; 2 tests) is adopted verbatim and shipped. It pins: seed 0 clean and NaN/Infinity `outOfRange`; the seed reaching every particle piece; one seed note per effect; every `noPicture` noted and skipped; the converter leaving its input untouched; spread needing a value above 0; a multi-beat part using list position. QA plants went 12/20 → 20/20 with it (misses were Q1, Q2, Q8, Q9, Q12, Q13c, Q15, Q16); EA plants stay 27/27. Floor raised 751 → 753. QA agreed rulings (a)–(g); the nits and carries are in § Carries.

## Rulings (added at merge, QA builds A/B `docs/qa/step-ed-e1-builds.md` e4d015f6)
13. **Pick and G6 adopt (merge time).** QA picks **ChatA-2** (tip `0853f228`, `0853f22841ec9316a019976f88e9eecbfde172cc`, tree `85779ba3`, on Base `3c969024`; 3 commits `dbb5ed1`, `eaa7656` the shared-source cycle fix, handback) with must-fixes. The PR head is the EA fix commit **`d60e12a7`** (`d60e12a7fc39efae27d9e8191d64ed0c6ef11725`, tree `263c67d2`, parent QA's fix ref `refs/cmp/ede1b-qa3-fix-a` `c5287120`, `c5287120987ab87e161f4776f1d95b576cab1b89`, which is `0853f228` + QA's test; all G-TileEngine noreply).
    - **G6:** QA's `tests/editor/effect-e1-qa3.test.ts` (33 lines, sha256 `97673196…`, 3 tests) is adopted with **one EA line** pinning R-a (an `at-time` first step at 250 gives starts `[250, 550]`) and that clause added to test 13's title: 34 lines, cap 37, sha256 `445dddd29f43d874774166139b77de76bbe16a0414e1cf9893e7493b54c2e8b3`. It pins: a shared or diamond acyclic source is `current`, a loop back and a self-loop are `cycle`; a piece lasts len + hold + fade; an out-of-range `connect` is noted; `hold_ms` clamps to 0; an `at-time` first step starts at `start_at_ms`; `blendSeed` reads seeds through `variantSeed`; `flatten` runs Fit (12 steps, sparks 320 → 48 with both lines; preset 20+20 → 16/16). **Floor raised 753 → 756.**
    - **Fix commit `d60e12a7`** (3 files, +7/−6, no line growth in src): QA's patch `a2-src-proposal.diff` (sha256 `7cb02e84…`) as is: M1 piece `ms = ends − starts` (len + hold + fade), `hold_ms` clamped 0–20000, M2 `flatten` ends with `fit()` and passes `preset`. Plus R-a: `fx-doc.ts` starts a first step at 0 unless it is `at-time`. `fx-doc.ts` 56/60, `fit.ts` 65/65.
    - **R-a (EA, final):** an `at-time` first step starts at `start_at_ms`, as r29 and the proto do. Ruling 2's old line "The first step starts at 0" was a wording error; A2 followed it literally. Ruling 2 is reworded above.
    - **R-b (EA, final):** `flatten` runs Fit and honours `preset`. Ruling 9 and the signature stay; ruling 9 now says so.
    - **Build B rejected** (tip `05939021`): a **false provenance cycle** on a shared acyclic source (and a deep-shared one); its pieces **drop both `hold_ms` and `fade_out_ms`** (ruling 2); its `blendSeed` uses **raw seeds** (−1 and 2.5 not read as 0, ruling 5) and it does not note an out-of-range `connect`. Its tests also miss Q11 and Q21.
    - **HANDBACK §0.6 thin** (flagged, not a reject): A2 has 1 of 3 helpers silent (the "editor" helper was stopped after about 12 minutes; the builder's probe stands in); B has 2 of 3 silent.
    - Evidence: A2 + fix + QA3 green **756/0** (typecheck, lint, deps 110/352, check:state, check:law exit 0); smoke 0 failed; sim `afc89d56…` / `b8007292…`; stress unchanged; 5 pins unchanged; EA plants 28/28 and QA plants 27/27 (`qa-ede1b-plants.py` A2s); QA3 3/3 (the R-a line fails on the unfixed start, passes on the proto `5db8cea9`). **348 changed lines** excluding `handback/` (A2 314 + QA3 34). Merge-tree of `d60e12a7` onto main `649fbc89` is clean (tree `b23d08e3`).
    - Ruling 7 does not order `changed` vs `cycle` when both hold (A2 and proto say cycle, B says changed). Not pinned → E3 badge carry.

## CN ambiguities resolved (for DSK; report-only)
- CN-020/021 cite scope r4 `e77b396e`, but the brief names `cb3cba1e`. E1 follows the CNs plus the DSK choices in the brief. No conflict was found in §4/§7/§8.
- A wrong JS type in `variant_seed` at play time plays 0 with `invalidValue`, not `outOfRange` (H2 style).
- "Spread" in rule 4 = any of `jitter`, `start_spread` or `size_spread` > 0. Step weight = len × particles/12. Beat inference is described in ruling 10.
- Dropping a base `after-last` step moves the base steps after it earlier. Moved steps are `at-time`, so the other side's steps don't move. The base hit is pinned by id, so the hit step stays; its time can move only if a Linger step before it were dropped, and a Linger step is after the hit by definition.
- `minHitLen` 50 can't apply today, because seconds ≥ 0.15 means len ≥ 150. It is kept per r29, and no plant targets it.

## Files to create or change (and nothing else)
| File | Change | Cap (lines changed) | Proto |
|---|---|---|---|
| `src/runtime/render/fx-doc.ts` | new: `DOC`, `stepsOf`, `stepTimes`, `docToLiveFx` | 60 | 48 |
| `src/runtime/render/fx-particles.ts` | add `variantSeed` | 4 | +2 |
| `src/runtime/render/fx-live.ts` | `LiveFx.variant_seed?`, note, fold into the hash | 12 | +5/−5 |
| `src/editor/effect/parts.ts` | new: `PARTS`, `checkParts`, `fromInfo`, `exportClean`, `writeSeed`, `snapMix`, `blendSeed` | 55 | 42 |
| `src/editor/effect/fit.ts` | new: `FIT`, `beatOf`, `fit`, `flatten` | 65 | 52 |
| `tests/runtime/render/fx-doc.test.ts` | new, shipped (3 tests) | 40 | 33 |
| `tests/editor/effect-e1.test.ts` | new, shipped (6 tests) | 70 | 62 |
| `tests/editor/effect-e1-qa2.test.ts` | new, shipped (2 tests; QA, G6, verbatim) | 37 | 35 |
| `tests/editor/effect-e1-qa3.test.ts` | 0 → 34 / 37 (G6-adopted from QA builds A/B + the EA R-a line, sha256 `445dddd29f43d874774166139b77de76bbe16a0414e1cf9893e7493b54c2e8b3`; 3 tests) | 13 |
Total ≤ 400 changed lines (proto 284). Merged A2 + fix + QA3 (ruling 13): 348.

## Interfaces to match (quoted exactly; bodies elided)
```ts
// src/runtime/render/fx-doc.ts
export type DocStep = Readonly<Record<string, unknown>>;
export type FxDocValues = Readonly<Record<string, unknown>>;
export type DocHost = { readonly id: string; readonly castMs: number; readonly caster: string; readonly target?: string; readonly at?: { readonly c: number; readonly r: number }; readonly loopMs?: number; readonly sheetOf: (step: DocStep, i: number) => Sheet | null; readonly clipOf?: (step: DocStep, i: number) => Clip | undefined };
export const DOC = { steps: 12, secMin: 0.15, secMax: 3, secDefault: 0.48, msMax: 20000, fadeMax: 5000, minHitLen: 50, connect: 0.92 } as const;
export const stepsOf = (doc: FxDocValues): DocStep[] => …;
export type Timing = { readonly starts: readonly number[]; readonly lens: readonly number[]; readonly ends: readonly number[]; readonly hitIndex: number; readonly hitMs: number; readonly endMs: number; readonly notes: readonly FxNote[] };
export function stepTimes(doc: FxDocValues): Timing;
export function docToLiveFx(doc: FxDocValues, host: DocHost): { fx: LiveFx; notes: FxNote[] };
// src/runtime/render/fx-particles.ts
export const variantSeed = (v: unknown): { seed: number; bad: "outOfRange" | "invalidValue" | null } => …;
// src/runtime/render/fx-live.ts: LiveFx gains `readonly variant_seed?: unknown`
// src/editor/effect/parts.ts
export const PARTS = { max: 6, kinds: ["shape", "colour", "sparks", "light", "punch", "trail"], beats: ["cast", "travel", "hit", "linger"], gridMs: 30, snaps: [0, 25, 50, 75, 100] } as const;
export type From = { readonly effect: string; readonly rev: number };
export type Part = { readonly id: string; readonly kind: string; readonly beats: readonly string[]; readonly from?: From; readonly nudge_ms?: number; readonly label?: string };
export const partsOf = (doc: FxDocValues): Part[] => …;
export function checkParts(doc: FxDocValues): Notice[];
export type Source = { readonly rev: number; readonly doc: FxDocValues } | null;
export type FromState = "current" | "changed" | "removed" | "cycle";
export function fromInfo(selfId: string, doc: FxDocValues, look: (effect: string) => Source): { part: string; state: FromState }[];
export function exportClean(doc: FxDocValues): FxDocValues;
export const writeSeed = (seed: number): number | undefined => …;
export const snapMix = (mix: number): number => …;
export const blendSeed = (a: unknown, b: unknown, mix: number, base: "a" | "b"): number => …;
// src/editor/effect/fit.ts
export type Side = "base" | "other";
export const FIT = { particles: PARTICLES.perEffect, preset: 32, lights: 2, steps: DOC.steps } as const;
export function beatOf(doc: FxDocValues, i: number): string;
export function fit(doc: FxDocValues, sides: readonly Side[], o?: { preset?: boolean }): { doc: FxDocValues; messages: string[] };
export type Source = { readonly id: string; readonly rev: number; readonly doc: FxDocValues };
export function flatten(a: Source, b: Source, o: { base: "a" | "b"; mix: number; mint: (prefix: string) => string; preset?: boolean }): { doc: FxDocValues; messages: string[] };
```

## Tests that prove it is done (11 new; ship all three files byte-identical)
`tests/runtime/render/fx-doc.test.ts`:
1. R1 timing: after-last with hold, a stamp fade that does not delay the chain, a disabled slot, with-last, at-time, at-hit after the hit, at-hit before the hit (falls back), an unknown mode, an unknown connect_step, overCap 13+, the hit formula (742 = 300 + ceil(480 × 0.92)).
2. R1 compiler: absolute piece times, knob pass-through, `hitOffsetMs`, disabled and `noPicture` steps skipped. A doc with parts, step `part`, `from` and `nudge_ms` gives a **deep-equal LiveFx** and a **byte-identical scene** over 5 frames.
3. R2 seed through `createSceneLink`: absent = 0 (identical scene); 5 changes the dots and is deterministic; −1, 2.5 and 2³¹ play 0 with `outOfRange`; `true`, `"5"` and `[5]` play 0 with `invalidValue`.

`tests/editor/effect-e1.test.ts`:
4. CN-020 checks: every code above, with exact messages in order.
5. Provenance current/changed/removed/cycle, no warnings; Export clean strips only `from`.
6. writeSeed, snapMix, and blendSeed: deterministic, sensitive to A, B, snap, base and order, and in range.
7. Fit particles 72 → 48 (preset → 30 of 32); lights top 2 with the base winning the tie; the alias removed; silent when under budget.
8. Fit steps: linger → trail order; a side's last step in a beat kept; the hit kept; a weight tie drops the non-base side; the spread class; the hit pinned to the default last-of-12; the "Still N steps" message.
9. Flatten: base knobs and hit; retime to the base hit (−126 → 0 with a message, 174); fresh ids; `from {effect, rev}`; seed stored; the base hit pinned even when the base doc has no connect_step; base a vs base b give different seeds.

`tests/editor/effect-e1-qa2.test.ts` (QA, G6, ruling 12):
10. Seed 0 is clean, NaN/Infinity are `outOfRange`; the seed reaches every particle piece; one note per bad effect.
11. Every missing picture is noted and skipped; the converter leaves its input untouched; spread needs a value above 0; a multi-beat part uses timing (that is, list position; ruling 10).

`tests/editor/effect-e1-qa3.test.ts` (QA builds A/B, G6 at merge, ruling 13):
12. Provenance: shared and diamond sources are `current`; a loop back to self and a self-loop are `cycle`.
13. Converter: piece `ms` = len + hold + fade (fade on dim/stamp only); out-of-range `connect` is noted; `hold_ms` clamps to 0; an `at-time` first step starts at `start_at_ms`.
14. Merge: `blendSeed` reads seeds through `variantSeed`; `flatten` runs Fit, including the preset cap and its lines.

## How a planted bug is caught (EA plants 27/27, `ede1-plants.py`; QA plants 20/20 with tests 10–11, review `9f5f1c69…`)
| # | Plant | Caught by |
|---|---|---|
| 1 | seed fold ignored (hash arg 0) | test 3 |
| 2 | absent seed ≠ 0 | test 3 |
| 3 | out-of-range seed not noticed | test 3 |
| 4 | out-of-range seed plays as is | test 3 |
| 5 | dangling step part not warned | test 4 |
| 6 | part/id leak into pieces | test 2 |
| 7 | `from` warned | tests 4, 5 |
| 8 | cycle not found | test 5 |
| 9 | Export clean keeps `from` | test 5 |
| 10 | writer writes 0 | test 6 |
| 11 | blend seed ignores the snap | test 6 |
| 12 | blend seed ignores the base | tests 6, 9 |
| 13 | particles not scaled | test 7 |
| 14 | preset cap ignored | test 7 |
| 15 | three lights kept | test 7 |
| 16 | light tie keeps the other side | test 7 |
| 17 | trail dropped before linger | test 8 |
| 18 | drops a side's last step in a beat | test 8 |
| 19 | drops the hit step | test 8 |
| 20 | silent trim | test 8 |
| 21 | weight tie drops the base side | test 8 |
| 22 | at-hit before the hit not falling back | test 1 |
| 23 | fade delays the chain | test 1 |
| 24 | disabled step plays | test 2 |
| 25 | flatten not retimed to the base hit | test 9 |
| 26 | `from.rev` not the source rev | test 9 |
| 27 | base hit not pinned | test 9 |

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 756 passing** (742 + 11 + QA3's 3, ruling 13) and none failing, cancelled, skipped or todo. Typecheck, lint, deps, check:state and check:law each exit 0. (Proto: 753/0; A2 + fix + QA3: 756/0; deps 110 modules / 352 deps; `check:law OK (src)`.)
- [ ] `node tools/pixel-suite/smoke.ts` prints `smoke: 0 failed`.
- [ ] `npm run -s sim` prints stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`.
- [ ] `node tests/perf/stress-budget.ts` counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0. Effects without `variant_seed` are byte-identical.
- [ ] `git diff 3c969024 --stat -- package.json package-lock.json .dependency-cruiser.cjs scripts/check-law.sh src/types/core-types.ts` is empty. Pins: `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696`. If a core-types change seems needed, **stop and report**.
- [ ] All three shipped test files are byte-identical to the sha256s below.
- [ ] Each file within its cap; ≤ 400 changed lines in total.
- [ ] No `Math.random`, `Date`, timers or `Card`/`Deck` identifiers; no hp/mana/cost in `src/`. No UI files.
- [ ] Hand-back complete per `handoff/HAND-BACK.md`, with § Helpers & self-review.

## Not in this step (carries, with their target step)
- Mix scaling per beat, punch max-per-knob, and the Replace/Off choices of rule 2 → **E4**.
- Travel-beat handling and the projectile path → **E2**.
- Stock picture sheets (`sheetOf` returns null today and gives `noPicture`) → engine data step (open).
- Any editor UI (Fit messages panel, provenance badges, Export button) → E3+.
- A G2b N2 named worst-case fixture stays open.

## Carries (QA E1 review `9f5f1c69…`; QA agreed rulings (a)–(g))
- (a) nit: the `variant_seed` notice is deduped across effects and does not name the effect. Open (report-only).
- (c) nit: disabled steps are still weighted in Fit. Open (report-only).
- (d) → **E4**: `beatOf` goes by list position, not time (ruling 10), and counts `at-hit` steps listed after the hit as linger, while the scope says `at-hit` is Hit.
- (e) S1 should-fix → **E4**: `fit()` pins `connect_step` only when it is absent or empty. With an id that names no step, dropping a trail step moves the hit from t11 to t12. `flatten` can't produce that today; about a 2-line fix (pin when the id names no step too).
- (f) → **E4**: max-per-knob (punch) and Mix scaling.
- (g) **X7** (pictures on particles) is an explicit carry (open; no target step yet).
- deps: an explicit dependency-config rule for "no runtime imports from `src/editor`" (today the render and scene fence tests catch it, QA Q17/Q18). Later; `.dependency-cruiser.cjs` is pinned in this step.

## Out of scope
Game rules (HP, mana, cost) and any sim or core change. CN acceptance is DSK's; both CNs stay PROPOSED.

## Do not touch
`src/types/core-types.ts`, `src/core/**`, `src/sim/**`, `package.json`, the lock, `.dependency-cruiser.cjs`, `scripts/**`, `tools/painter-proto/**`, `tools/ui-shell/**`, the scene fence test, the render fence test.

## Kit files to push
All of these are staged under `/workspace/tileengine` (QA OK TO SEND with G6, review `9f5f1c69…`): `handoff/steps/step-ed-e1-converter-seed.md` (this file), and the shipped tests under `handoff/steps/tests/step-ed-e1-converter-seed/`. sha256 (also in `step-ed-e1-push-sha256.txt`; the src files are the proto's, for reference):
```
033ccb7ab8dbacf3cb171ff765ee5ce6161a8f335707db667ab215b1dfbebd8b  src/editor/effect/fit.ts
8bf1714debff247a8375210848f541757c62d2464d4a58c3f6474c9cf45cbf17  src/editor/effect/parts.ts
766dcdee8d87d3887d53e2503136aadcd4373a4e935ae0c4ddd5900bf2e29ba6  src/runtime/render/fx-doc.ts
472754fbd192b4f5f4fdbb8545050a092b3465b6a0cb29be20286198bc62e98f  src/runtime/render/fx-live.ts
46c4de57b1c07b0234993a55120d2c936ab816ad0516cafc653ec40a31da1877  src/runtime/render/fx-particles.ts
fe03968e117398ed6bb87b9a1e554b669e8be056f9b2d878f00318dbc3a879d6  tests/editor/effect-e1-qa2.test.ts
9f54691bb4d2f20dab25a501d17af016208f7af0887d92e761b9dd6734c49885  tests/editor/effect-e1.test.ts
197a8733a8ec03a8d9928b3a062740cf2d3f57892695f904fd5bea37b8ca397a  tests/runtime/render/fx-doc.test.ts
```

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 756 passing and 0 failing** (ruling 13). Paste the summary line, the smoke line, and the sim and stress lines into HANDBACK.md.
- All three shipped test files are **byte-identical** to the sha256s above.
- The bundle is `3c969024..step/step-ed-e1-converter-seed-r<N>` and passes `git bundle verify`. Total changed lines ≤ 400. Every pin unchanged. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
On branch `step/step-ed-e1-converter-seed-r<N>` (base `3c969024`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer). Run `git bundle create step-ed-e1-converter-seed-r<N>.bundle 3c969024..step/step-ed-e1-converter-seed-r<N>`, then `git bundle verify`. Upload the bundle and HANDBACK.md to the CEO's Drive. Push nothing to GitHub.
