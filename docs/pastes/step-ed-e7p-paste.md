Build step-ed-e7p-ability-play r3 (kit-1 **r3**, QA pin adopted; r2 doc wording plus the pin test) from the step file `handoff/steps/step-ed-e7p-ability-play.md` on main (sha256 `cfc4699559a63f2db2ea03fb038db97a2558d46dec49ed333af685396fd6173e`); it wins over this paste.

Base commit: **current `main` when you start**, which must contain the **ED-E7 merge**; quote its full sha. At kit time `origin/main` is `9ac26da821d8f5e71a108cdbc578c5c8a38f2037` (runnable count **922**, E6 already merged). If E1–E3's APIs on main differ from what the shipped tests import (step file § Interfaces to match), or `docToLiveFx` / `sceneFromMatch` is missing, stop and report. The code only needs E1–E3 (already on main). You still start from main with E7 merged; build order is after P1-6 (phone test 1 is dropped). Branch: **`step/step-ed-e7p-ability-play-r<N>-chatA`**, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Builds: one builder chat (ChatA), one QA review, and a rework round (r2, r3…) if QA finds must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff).
Delivery (CN-028, token issued 2026-11-17): commit `handback/step-ed-e7p-ability-play/r<N>/HANDBACK.md` as the branch's last commit (author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`), then push once, through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-ed-e7p-ability-play-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line). The CEO gives you the token in chat once, at the start: keep it as `GH_BUILDER_TOKEN`, set with `export GH_BUILDER_TOKEN=...` in the shell that runs git (without `export` the credential helper sees nothing; never write a real value); never print, echo, log or commit it, never store it in `.git/config` or a saved remote; if it ever appears in output, say so (the CEO revokes and reissues it). Never write the builder account's numeric id; never write a token value anywhere. Push that `step/**` branch only: never `main`, never a tag, never force-push (the rulesets block all three), no branch delete, no PR actions. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the branch`. Your hand-back message quotes the branch name, the full 40-character tip sha, its tree, the Base sha, the test counts (`pass N fail 0`, floor = main's count at the Base + 7) and the host-example lines.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

Shipped files (copy byte-identical from `handoff/steps/tests/step-ed-e7p-ability-play/` to the same paths at the repo root): `tests/project/read-effect.test.ts`, `tests/runtime/cast-fx.test.ts`, `tests/runtime/scene/scene-fence.test.ts` (replaces E3's, changed by ruling), `tests/project/read-effect-qa-e7p.test.ts` (QA pin). Floor: green at least main's count at the Base + 7 passing, 0 failing. At most 320 changed lines. Pins unchanged. Noreply author and committer. Push only your own step branch (CN-028).

## Goal
After this step a match can play a saved ability effect:
1. **`readEffect(json, defaults?)`** reads `effects/<id>.json` (`kind: "behaviour-setup"`, `formatVersion: 3`, `behaviourId: "effect"`, string `id`, int `rev` ≥ 0) and returns `{id, rev, values}`. `values` = effective(answer) per setup-format §2.4: the stored `value`, or `defaults[knob]` when `source:"default"` (an absent default leaves the key out, so the runtime default applies). `history`, `orphans`, `copiedFrom` and `parts` are ignored. Answers are capped at 64 keys; `steps` are kept as written (the compiler cuts at 12 with its own note). Own-key reads only (`Object.hasOwn`).
2. **`createCastFx({sheetOf, clipOf?, values})`** is the match hook: `prewarm(refs)`, `cast(cue)`, `effects(nowMs)` (the list the host puts on `world.effects`; a new array only when the list changes, seam 37), `reset(nowMs, logSeq)`, `notes`, `compiles`. A cue is `{id, atMs, caster, target?, at?, ref}`. `docToLiveFx` runs once per `ref@rev` for that `sheetOf` instance; each cast is a shallow copy with its own `id`, `castMs`, `caster`, `target` and `at`.
3. **`cueFromEntry(entry, stepMs, refOf)`** turns a plain `kind: "ability"` log entry into a cue: `id = "cast:"+seq`, `atMs = tick × stepMs`, `caster = actor`, a unit aim → `target` (and `fallbackAt` → `at`), a tile aim → `at`. `refOf` receives the **action**.
4. **Hit and retire.** `hitOffsetMs` comes from the doc and fires `fx:hit` through the existing live events (the host may time numbers or shake to it). The sim never waits. A cast stays on the list through `atMs + endMs` and leaves once that time has passed (one lap only; `loopMs` is not set). `reset` drops cues with `atMs` after the new time; seqs ≤ `logSeq` are never re-fired.
5. **Misses never throw.** `"none"` is silent; `unknownRef`, `invalidValue`, `noPicture` and `overCap` each give one note and skip or drop as specified. Caps: `CAST = {live: 8, cache: 64, notes: 64}`.
6. **Host example + guide.** `tools/host-example/match-fx.ts` plays three scripted ability entries (a stock effect, a saved doc, a missing ref) and prints casts, hits and notes. `docs/host-guide.md` gains "Playing ability effects".

## Rulings
1. **One step.** 315 changed lines ≤ 400 and ≤ the 320 cap (scope E7p plus QA pin). Base = current main with E7 merged; floor = main's count at the Base + 7. Independent of E6/E7 code (ruling 1 note in Prerequisites).
2. **Reader.** `readEffect` uses `checkVersion` (`kind: "behaviour-setup"`, `formatVersion: 3`; any other integer version is `needsMigration`), requires `behaviourId === "effect"`, a string `id`, an integer `rev` ≥ 0 and a record `answers`, and is wrapped in `guarded` (never throws). More than 64 own answers is `over cap answers`. Pinned by tests 1 and 3.
3. **Effective values (P2).** `source:"default"` uses `defaults[knob]` only when `Object.hasOwn(defaults, knob)`; otherwise the key is left out. The kit pins `connect: 0.5` (catalogue-style) against the runtime default `DOC.connect` 0.92. A `source:"default"` stray `value` is ignored. Pinned by test 2.
4. **Own-key / hostile names (E4 ruling 15, up front).** Answer keys and `defaults` use `Object.hasOwn`. In `cast-fx`, refs named `__proto__`, `constructor`, `toString` or `valueOf` are `unknownRef` without calling `values` (`BAD_REF`). Host `values` lookups must also use `Object.hasOwn` or a `Map`. Pinned by tests 3 and 5.
5. **`refOf` receives the action (DSK 22:00).** `refOf = (action) => action.effects.length === 1 ? action.effects[0] : undefined`; `undefined` = no cue. `via.ref` is never the owner (a `via.ref` of `"wrong"` does not win). The engine never reads `effects[]` or `via` itself. Pinned by test 5.
6. **Cache.** Key = `ref@rev`, LRU, cap 64 (oldest evicted). The cache is per `createCastFx` instance (tied to that `sheetOf` / `clipOf`). A rev bump recompiles; a new `sheetOf` means a new instance. `compiles` counts `docToLiveFx` calls. Pinned by test 4 (and the cache-eviction assertions in test 6).
7. **Retire and loops.** A cast is still present at exactly `atMs + endMs` (so `fx:end` and a `toTick`'d `fx:hit` can fire) and is gone at `atMs + endMs + 1`. A looped doc in a match is one lap: `loopMs` is never set on the live copy. Pinned by test 6.
8. **Reset and seq.** `reset(nowMs, logSeq)` drops live cues with `atMs` after `nowMs` and refuses later `cast` of seq ≤ `logSeq`. The same cue `id` is ignored the second time (including `"cast:"+seq`). Pinned by test 6.
9. **Caps (law 13).** At most 8 live casts: the 9th drops the oldest and notes `overCap` once until the next `effects()` call. The 9th-through-1000th of one tick still hold 8 live and 64 cache. Notes cap at 64 with a `noticesCapped` tail. Pinned by test 6.
10. **Never throws (law 10).** A non-plain cue (Proxy, getter), a non-finite `atMs` or an empty `caster` is `invalidValue` and no effect. A `values` lookup that returns a non-object is `invalidValue`. `"none"` is silent. A compile with no pieces is skipped (`noPicture` if the compiler did not already say so). An `at` off the map is left to `fx-live`. Pinned by tests 5 and 6.
11. **Scene fence (existing test changed).** The scene folder may hold `cast-fx.ts` as well as `match-link.ts` and `world-scene.ts`. `cast-fx.ts` may import only `core/log/types`, `core/notice`, `core/plain`, `render/fx-doc` and `render/fx-live` (still no `src/sim`, no game words, no DOM, no wall time). See § Existing tests changed by ruling. Pinned by the changed fence test.
12. **No test page in this slice.** There is no designer or match-fx HTML page and no kit-run browser smoke here. The device run of `match-fx` is batched with the APK showcase (P1-9). CEO phone test 1 after E7, and waiting for a gh-pages publish, are dropped (CEO 2026-11-17 05:26).

## CN / format questions (for DSK and the Librarian; report-only, nothing filed)
- None. No new CN. The catalogue is not read here.

## Files to create or change (and nothing else)
| File | What | Proto | Cap |
|---|---|---|---|
| `src/project/read/effect.ts` | new: `EFFECT_ANSWERS`, `EffectDoc`, `readEffect` | 32 | 36 |
| `src/project/read/index.ts` | change: export `readEffect`, `EFFECT_ANSWERS`, `EffectDoc` | 1 | 5 |
| `src/runtime/scene/cast-fx.ts` | new: `CAST`, `CastCue`, `EffectValues`, `CastFxHost`, `CastFx`, `cueFromEntry`, `createCastFx` (rulings 4–10) | 102 | 106 |
| `tools/host-example/match-fx.ts` | new: host recipe (stock, saved doc, missing ref) | 42 | 46 |
| `docs/host-guide.md` | change: "Playing ability effects" (§13–15) | 7 | 11 |
| `tests/project/read-effect.test.ts` | new, shipped (3 tests) | 33 | 33 |
| `tests/runtime/cast-fx.test.ts` | new, shipped (3 tests) | 72 | 72 |
| `tests/runtime/scene/scene-fence.test.ts` | change by ruling, shipped whole (§ Existing tests changed by ruling) | 9 | 13 |
| `tests/project/read-effect-qa-e7p.test.ts` | new, shipped (QA pin: `defineProperty` so an own `__proto__` answer cannot become the values prototype) | 17 | 17 |
Total ≤ 320 changed lines (proto **315**: +311/−4). Shipped new tests are byte-identical, so their cap is their proto.

## Interfaces to match (quoted exactly; bodies elided)
```ts
// src/project/read/effect.ts  (also re-exported from src/project/read/index.ts)
export const EFFECT_ANSWERS = 64;
export type EffectDoc = { readonly id: string; readonly rev: number; readonly values: Readonly<Record<string, unknown>> };
export function readEffect(json: unknown, defaults?: Readonly<Record<string, unknown>>): ReadResult<EffectDoc>;

// src/runtime/scene/cast-fx.ts  — P1-8 imports this file from tools/play-stage/fx.ts
export const CAST = { live: 8, cache: 64, notes: 64 } as const;
export type CastCue = { readonly id: string; readonly atMs: number; readonly caster: string; readonly target?: string; readonly at?: { readonly c: number; readonly r: number }; readonly ref: string };
export type EffectValues = { readonly rev: number; readonly values: FxDocValues };
export type CastFxHost = { readonly sheetOf: DocHost["sheetOf"]; readonly clipOf?: DocHost["clipOf"]; readonly values: (ref: string) => EffectValues | null };
export type CastFx = { prewarm(refs: readonly string[]): void; cast(cue: unknown): void; effects(nowMs: number): readonly LiveFx[]; reset(nowMs: number, logSeq: number): void; readonly notes: readonly Notice[]; readonly compiles: number };
export function cueFromEntry(entry: unknown, stepMs: number, refOf: (action: Action) => string | undefined): CastCue | null;
export function createCastFx(host: CastFxHost): CastFx;
```
`ReadResult` comes from `src/project/read/guard.ts`. `FxDocValues` / `DocHost` come from `src/runtime/render/fx-doc.ts`. `LiveFx` comes from `fx-live.ts`. `Action` is a type-only import from `src/core/log/types.ts`. `Notice` comes from `src/core/notice.ts`. Do not redefine them. `src/runtime/scene/cast-fx.ts` must not import `src/sim`. The host's `values(ref)` must use `Object.hasOwn` or a `Map`. When art changes, the host calls `createCastFx` again with the new `sheetOf`.

## Smoke lines
Unchanged: `smoke: 0 failed`; sim stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`; stress counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0. The host example still prints `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands`. The new host example prints `match-fx: 3 cues, 2 live at 50ms, 2 hits, notes: unknownRef missing` and exits 0.

## Existing tests changed by ruling (and only these)
- `tests/runtime/scene/scene-fence.test.ts` — title and body, ruling 11: the scene folder may also hold `cast-fx.ts`; its allowed imports are `core/log/types`, `core/notice`, `core/plain`, `render/fx-doc` and `render/fx-live`; a `src/sim` import or a game-rule word still fails. Ship the file whole, byte-identical to the sha256 below.

## Tests that prove it is done (7 new; ship all four files byte-identical)
| Shipped file (under `handoff/steps/tests/step-ed-e7p-ability-play/`) | Copy to | sha256 |
|---|---|---|
| `tests/project/read-effect.test.ts` | `tests/project/read-effect.test.ts` | `dc8a295b48585915831120b048129d8b724ad44f4bb918917ee2a6b6f22600fb` |
| `tests/runtime/cast-fx.test.ts` | `tests/runtime/cast-fx.test.ts` | `d6ab84c74637d8c50a1d17f0bc4a78a97b66f76d8f3f2c949d150e809d096d83` |
| `tests/runtime/scene/scene-fence.test.ts` | `tests/runtime/scene/scene-fence.test.ts` | `78e2e11f8f44887dd9e981f946396ba0131df9372f36e964b1b3fae9ca26b627` |
| `tests/project/read-effect-qa-e7p.test.ts` | `tests/project/read-effect-qa-e7p.test.ts` | `564069e948a1333c2d5e4884d23446cf87148227f727d2132a4fcdaf97ea003e` |
Titles they hold (exact):
- `tests/project/read-effect.test.ts` — "E7p readEffect: happy path keeps id, rev and effective values; history, orphans, copiedFrom and parts stay out of values": envelope fields stay out of `values`.
- `tests/project/read-effect.test.ts` — "E7p readEffect: source default uses defaults[knob] when present and leaves the key out when it is not (catalogue connect 0.5 ≠ runtime 0.92)": P2 pin.
- `tests/project/read-effect.test.ts` — "E7p readEffect: a unit doc, formatVersion 2, a missing answers record, a 65th answer and prototype keys are refused or skipped without a throw": plants 1–3, 5, 6.
- `tests/project/read-effect-qa-e7p.test.ts` — QA pin: `readEffect` assigns each answers key with `Object.defineProperty` so an own `"__proto__"` key cannot become the values prototype.
- `tests/runtime/cast-fx.test.ts` — "E7p compile cache: five casts of one ref@rev compile once; a rev bump compiles again; a new sheetOf does not reuse the cache": ruling 6.
- `tests/runtime/cast-fx.test.ts` — "E7p cueFromEntry: a unit aim sets target and fallbackAt; a tile aim sets at; missing, none and prototype refs do not throw": rulings 4, 5, 10, including `via.ref`.
- `tests/runtime/cast-fx.test.ts` — "E7p retire, reset, caps, loop, determinism and no sim import": rulings 7–10; same log in, same `world.effects` and same draw-list hash out; `cast-fx.ts` has no `src/sim` import.
- `tests/runtime/scene/scene-fence.test.ts` — "the scene folder holds cast-fx, match-link and world-scene; world-scene imports only the render index and the notice type, match-link only types from world-scene and the notice type, cast-fx only core log/notice/plain types and fx-doc/fx-live; no game words, DOM names or wall time (step 31; ED-E3; E7p)": ruling 11.

## How a planted bug is caught (EA plants 23/23, `/workspace/scratch-ea/ede7p/ede7p-plants-r1.py`; run by `proto-check.sh` / `qa-plants.sh --plants-file` against the two new files and the changed fence test)
The 23 plants cover: behaviourId / formatVersion 2 / 13 steps / default-source / answers cap / prototype keys / history leak; BAD_REF / NaN `atMs` / same id / watermark / reset / live cap / overCap note / cache evict / always-recompile / non-object values / `"none"` note / forced `loopMs` / `refOf` given the entry / early retire / Proxy throw / `via.ref` wins.

## Example
A scripted `kind: "ability"` entry at tick 0, `stepMs` 10, with `effects: ["stock"]` and a unit aim at `w1`, becomes cue `{id: "cast:1", atMs: 0, caster: "k1", ref: "stock", target: "w1", at?: fallbackAt}`. `values("stock")` returns `{rev, values}`; `docToLiveFx` runs once; `effects(50)` holds that live copy (`castMs` 0, `hitOffsetMs` from the doc). The scene link fires `fx:hit` at `toTick(castMs + hitOffsetMs, stepMs)`. A missing ref notes `unknownRef` and adds nothing. `tools/host-example/match-fx.ts` is this example (stock, a `readEffect` doc, and a missing ref).

## Decisions note: what to name
- Constants: `EFFECT_ANSWERS` (64), `CAST = {live: 8, cache: 64, notes: 64}`, `BAD_REF` (the four names in ruling 4).
- Cache: a `Map` keyed `ref@rev`, LRU by re-insert, oldest evicted first; per `createCastFx` instance. Nothing retained grows with frames (live ≤ 8, cache ≤ 64, notes ≤ 64).
- `cueFromEntry` names: `id` is `"cast:"+seq`; `refOf` is `(action) => string | undefined`.
- Retire is inclusive at `atMs + endMs`. Do not set `loopMs` on a match copy.
- Avoid using `via`, `effects[]`, or any sim module inside `src/`.

## Gates (Acceptance)
- [ ] `npm ci && npm run green` exits 0 with **at least 982 passing** (main's count at the Base + 7, once E7 and P1-6 are on that main; authoring floor **982**) and none failing, cancelled, skipped or todo. Typecheck, lint, deps, check:state and check:law each exit 0 (proto on the restacked stack: 982/0). Main's stress p95 > 4 ms test can flake under a shared-box load: re-run it alone before believing a failure.
- [ ] `node tools/pixel-suite/smoke.ts` prints `smoke: 0 failed`.
- [ ] `node tools/host-example/match-picture.ts` prints `match-picture: stage-fixed replay to tick 460: 6 units, 6 drawn standing, 60 draw commands` and exits 0.
- [ ] `node tools/host-example/match-fx.ts` prints `match-fx: 3 cues, 2 live at 50ms, 2 hits, notes: unknownRef missing` and exits 0.
- [ ] `npm run -s sim` prints stage-fixed 48/2 `afc89d56…` and stage-weighted 22/28 `b8007292…`.
- [ ] `node tests/perf/stress-budget.ts` counts 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0.
- [ ] `git diff <Base> --stat -- package.json package-lock.json .dependency-cruiser.cjs scripts/check-law.sh src/types/core-types.ts` is empty. Pins: `1e5dd82c`, `d7f64a09`, `45a3dbaa`, `4d7bbf48`, `d6d08696`. If a core-types or dependency-rule change seems needed, **stop and report**.
- [ ] `git diff <Base> --stat -- src/sim src/core src/fx src/editor tools/effect-designer tools/device-page tools/pixel-suite tools/painter-proto tools/ui-shell` is empty. (`src/project/read` and `src/runtime/scene` are in bounds, only as the Files table says.)
- [ ] The three shipped test files are byte-identical to the sha256s above; every other E1–E7, B1 and P1 test passes unchanged, except the one fence file named in § Existing tests changed by ruling.
- [ ] Each file within its cap; at most 320 changed lines.
- [ ] No `Math.random`, `Date`, timers, `localStorage`/`sessionStorage`/`indexedDB` or `Card`/`Deck` identifiers in the new `src/` files; no hp/mana/cost/damage in `cast-fx` or `readEffect`.
- [ ] Delivery per CN-028: the branch `step/step-ed-e7p-ability-play-r<N>-chatA` is pushed once with `GH_BUILDER_TOKEN` through the one-shot credential helper (that branch only; the token never printed, logged, committed or saved in `.git/config` or a remote), HANDBACK.md is its last commit, and the hand-back message quotes the branch, the full tip sha, the tree, the Base sha, `pass N fail 0` and the host-example lines.
- [ ] Hand-back complete per `handoff/HAND-BACK.md`, with § Helpers & self-review.

## Floor
Main's count at the Base + **7** = 3 (`read-effect`) + 3 (`cast-fx`) + 1 (QA pin); `scene-fence.test.ts` is replaced, not added (same 1 test). Authoring floor after P1-6 on main `{C}` is C + 7; on this stack 975 + 7 = **982**. If main's count at Base (with E7 and P1-6 already merged) is C, the floor is C + 7. Kit tests under `handoff/` are not run on main until merge.

## Perf (phone floor)
Compiling happens at `prewarm` / first cast, never per frame. Per-frame cost is `fx-live`'s, already measured in 34b and E1–E3. No new budget: existing per-effect and screen-wide caps stay as they are (`PARTICLES`, `FX_LIGHT`, `FX_BUDGET`). The G5b line is unchanged (p95 ≤ 18.3 ms, dropped ≤ 1%, no frame over 50 ms, canvas ≤ 160 MB). The cache, live list and notes are capped (Decisions note).

## Not in this step (carries, with their target step)
- **The play-page hookup** (`tools/play-stage/fx.ts`, F17 editor-saved setup → match, house default for attack): **P1-8**, which imports this step's API.
- **The match-fx device run** (4 simultaneous 48-particle casts plus a 20 s storm, G5b line, both phones): batched with the **APK showcase (P1-9)**. CEO phone test 1 and the gh-pages wait are dropped (CEO 2026-11-17 05:26; ruling 12).
- **A match-fx HTML page:** same publish; not in this slice (ruling 12).
- **Ability actions on main:** still none; this step's tests and host example use scripted entries (ability-play-scope §1.5, P1). Rules emit `kind: "ability"` in P1-4…P1-8.
- **Stage / project loader resolving the ability → effect table** (L2 overrides, BTF builtins): stays in the host. BTF refs work when `values` returns the preset; otherwise `unknownRef`.
- **M-B2** (the sim waiting for the picture / a camera driver): later. The host times numbers to `fx:hit`.
- **E8 carries** from the E7 review (S1 `hasOwn`/Map in mixer `chips`/`beatRow`, plus the H3 and H6 test lines): **E8**, not this step.

## Out of scope
Game rules (HP, mana, cost, damage) and any sim or core change. Any format change, any designer-page change, the house builder, Sprite Studio, a game exporter, combo fusion, and editing effects.

## Do not touch
`src/types/core-types.ts`, `src/core/**`, `src/sim/**`, `src/fx/**`, `src/editor/**`, `src/runtime/render/**`, `src/runtime/scene/world-scene.ts`, `src/runtime/scene/match-link.ts`, `src/project/read/guard.ts`, `limits.ts`, `map.ts`, `manifest.ts`, `placements.ts`, `stage.ts`, `package.json`, the lock, `.dependency-cruiser.cjs`, `scripts/**`, `tools/effect-designer/**`, `tools/device-page/**`, `tools/pixel-suite/**`, `tools/painter-proto/**` and `tools/ui-shell/**` above all, every shipped test other than `scene-fence.test.ts` (ruling 11).

## Open questions
- Settled in this kit: CEO-1 (ability-play-scope §10) defaults to no E7p page in this slice (ruling 12); DSK 22:00 on `effects[0]` / never `via.ref` (ruling 5); Base is main with E7 merged; build order is after P1-6 (ruling 1).

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 982 passing and 0 failing** (main's count at the Base + 7). Paste the summary line, the smoke line, both host-example lines, the sim and stress lines into HANDBACK.md.
- All three shipped test files are **byte-identical** to the sha256s above.
- Base = main with E7 merged; build order is after P1-6. At most 320 changed lines. Every pin unchanged. Commits are `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer).

## Delivery
One builder chat (ChatA), one QA review, a rework round on must-fixes (CEO 2026-11-17 ~01:33 London, via Chief Of Staff). CN-028 token issued 2026-11-17. On branch `step/step-ed-e7p-ability-play-r<N>-chatA` (base = main with E7 merged), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), with HANDBACK.md as the last commit. Push once, with the token the CEO gave you in chat as `GH_BUILDER_TOKEN` (set with `export GH_BUILDER_TOKEN=...` in the shell that runs git; without `export` the helper sees nothing; never write a real value), through a one-shot credential helper: `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/G-TileEngine/tileengine.git HEAD:refs/heads/step/step-ed-e7p-ability-play-r<N>-chatA` (keep the single quotes so the token is read only when git asks; it never appears on the command line), and nothing else (never `main`, never a tag, never force-push; the rulesets block all three). Never print, echo, log or commit the token or store it in `.git/config` or a saved remote; if it appears in output, say so (the CEO revokes and reissues it). Then hand back with the branch, the full tip sha, the tree, the Base sha, `pass N fail 0` and the host-example lines.
