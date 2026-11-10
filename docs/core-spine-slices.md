# TileEngine — core spine slice plan

Owner: Engine Architect. Status: **PLAN v1, 2026-11-09 (Europe/London, UTC+0).**

> **Update 22:40 (kit-2):** full step files for steps 00–07 now live in `/workspace/tileengine/handoff/steps/` and **supersede the outlines below** for those steps (names: `step-07-events-log`; interfaces as quoted there). Mode order is now grid tactics → idle RPG → tower defence (menu RPG and RTS parked). Sim time is integer ms (CN-001). Repo: https://github.com/G-TileEngine/tileengine (private), PR per step, hand-back in-repo at `handback/<step-id>/r<N>/`. Steps 08–10 remain outlines. Planning only: nothing here is built. Grok Build writes the code; the Engine Architect designs and signs off each slice; QA & Build Guard runs the gates; RaiKynn accepts.

Inputs read: BTF `ENGINE.md`, `BUILD_LAW.md`, `COMBAT_TARGET.md`, `TILE.md`, `SKILLRIG.md` (all under `/workspace/g-tile-engine/src/docs/`); BTF source `/workspace/g-tile-engine/src` (`src/engine/*`, `chess/game/*`, `chess/skillrig/*`, `scripts/*`); `docs/ARCHITECTURE-v0.md` v0.6; `docs/btf-survey.md`; `docs/END-GAME-REQUIREMENTS.md`; `data/project-format.md` r12/r13 and `data/core-types.ts` (sha256 `548f68fd…30ad`, 21:55); `tileengine-modes/MODES-v1.md` (M1–M9) and `STATES-input-for-architect.md`; `handoff/00-grok-build-workflow-answer.md`; `docs/qa/handback-checklist.md`; `docs/qa/painter-golden-test-plan.md`.

A **slice** here is one Grok Build **step** (Grok Build's word): 150–400 changed code lines, one subsystem. Slice ids are step ids: `step-NN-<slug>`. Step files live in `docs/grok-build-kit/steps/`. Only **step-00** is written out in full (`docs/grok-build-kit/steps/step-00-skeleton.md`, paste-ready and verified green on this box). The rest are outlines below; each becomes a step file from `docs/grok-build-kit/STEP-TEMPLATE.md` when its predecessor is accepted.

Related kit files: `docs/grok-build-kit/BUILD_GUIDE.md` (root guide; laws incl. M1–M9), `docs/STATES.md` (state tables), `docs/grok-build-kit/HAND-BACK.md`, `docs/grok-build-kit/STEP-TEMPLATE.md`, `docs/grok-build-handoff-plan.md`.

---

## 1. What the BTF engine docs require

### 1.1 `ENGINE.md` (118 lines): the shared shelf
- `src/engine` is the only shared import; it "does not know a hero, a stage, a bite, or a card cost" (L3–5). Shelf: `square.ts` cell math, `pin.ts`, `image.ts` (30 s core / 4 s optional loads, `ImageMiss`), `sprite.ts`, `miss.ts` (magenta miss), `pack.ts` (fail-closed packs), `clock.ts` (one rAF; games subscribe), `log.ts` (`who/from/to/card/seed`) (L7–18).
- A thrown tick is logged and the frame continues (L22). `pack.request` throws for an undeclared URL (L24).
- Boot: the loader starts the clock, the screen stops it; games never start their own rAF (L39). Curtain waits on a fixed asset list; a miss stays on the gate (L41).
- Saves: two `localStorage` documents that never share a key (L45–56).
- Command log: the chess writer stores lines; replay reads `readLog()`; "Undo is a game choice on top of the log. The log is not the undo." (L69–71).
- A second game: "Copy the shelf. Leave the kits." Own pack, art root, save key; one clock; a card arms then you tap; the server owns the bag and rank (L100–108).
- Do not: HP/mana/card cost in `src/engine`; a second clock; `new Image()` on tap; share save keys; import `src/game/stage` from a tower file (L110–118).

### 1.2 `BUILD_LAW.md` (13 lines)
Don't revert/simplify unless the ticket names it (1); over-cap files are extracted, not rewritten (2); missing art copies the last good file, no "cousin" (3); a bug in A is not permission to edit B (4); flags write only when a beat closes (5); keep beat ids and kit numbers (6); suggestions are not tickets (7); after extract, `tsc` clean + play 1-1 and 1-2 once, then stop (8); targeting is two pipes and one live table, no third system (9); an online action isn't done until its type is in the SEAT set (10); a seat-run change isn't done until `queue/rules.mjs` is rebuilt (11).

### 1.3 `COMBAT_TARGET.md` (83 lines)
- Two pipes, one table. **UNIT** = every BASIC: aim at the living body, follow it if it moved, can't be dodged, never fire at a dead unit's last cell (L7–12). **TILE** = every damaging SKILL/ULT/enemy skillshot: pick a cell at cast, play the animation either way, hit only a living occupant on arrival, no mid-flight retarget (L14–20).
- HUD/avatar face hits are not a third pipe: a dock overlay that picks a mug, damage by hero id (L22–25).
- Roster: two live lists `{id, cell, alive}`; the cell updates every frame from where the sprite is drawn; dead ids leave the lists that frame (L29–32).
- Gale needles: the living id wins, else whoever stands on the stored cell, else miss (L49, table L72). Poison/shields: status on the unit id, neither pipe (L73). "Basics read the drawn cell every shot. Skills read the cell they chose when cast." (L75).
- The board: same two pipes; a card is aim → cast → apply (L51–57). Morgana: no occupancy left on the lunge cell (L59–64). Gust focus prefers an id, not a third pipe (L78–83).

### 1.4 `TILE.md` (95 lines)
- The 18 lane cells, numbered column-major ("count down, then east"): `id = col*3 + lane + 1` (L5–9; code `chess/game/stage/tile.ts:20-26`). "These ids stay… Do not 'improve' the numbering" (L3, L20). Tickets must name tiles by these ids (L15).
- Live cell is `{lane, col}`; `COLS = 6`, hero half col 0–2, foe half 3–5 (L27–38). `PlayerRow`/`EnemyRow` are column depths, a known name collision (L50–52).
- Off-stone `col < 0` and `col >= COLS` (entry at col 6) are not tiles (L89). `occupantAt(c, cell)` is the living UNIT on a TILE this frame; sliding units occupy their body cell (L91–95).

### 1.5 `SKILLRIG.md` (182 lines)
- A booth for designing tile effects; it doesn't ship; three files `spec.ts` (the order), `paint.ts` (preview), `SkillRig.tsx` (UI) (L3–13). Saved looks in `localStorage` `bloodline-skillrig-v1` (L15).
- Same language as the engine: `c` grows right, `r` grows down, `c0 r0` top-left (L23); one canvas loop and the engine clock in games (L26); no HP/mana/cost in the engine; damage is only a number the game may apply, blank = not a hit (L27).
- Blades are existing `/tower/…` pictures tinted in code (L25, L175). Scale 0.40–2.40 (L52); board 2–8 × 1–10, six steps max (L36, L68–69); loading clamps out-of-range values silently (L163).
- The paste block is `SKILLRIG v1` + paragraph + JSON; the JSON wins (L148–161). Implementers play `frames` on the game's clock and apply the hit at `connect` (L171–182). Copies jitter deterministically ("the same numbers come back every play", L116).

## 2. Conflicts with ARCHITECTURE v0.6 (and how the slices resolve them)

| # | BTF doc says | ARCHITECTURE v0.6 says | Resolution in this plan |
|---|---|---|---|
| X1 | `ENGINE.md` L100–102: a second game **copies the shelf** | §0/§7: reuse only through thin adapters; **no frozen copy of the effect-order file** (CEO 2026-11-09) | Nothing is copied. Step-10 rewrites the effect order from the design docs (`effect-order-from-docs.md`); silent spots go to CoS |
| X2 | `ENGINE.md` L17, L39; `src/engine/clock.ts:13-33`: the clock **is** the rAF loop, variable `dt`, frame cap read from the game (`clock.ts:3` imports `@/game/graphics`) | §2.3: core clock is a pure fixed-step scheduler fed by `advance()`; the only rAF is `src/runtime/host/raf-driver.ts`; cap injected | step-02 rewrites the clock (keeps dt clamp 0.1 s and error isolation). BUILD_GUIDE names `raf-driver.ts` as the one future rAF owner — QA's checklist §3A says "the clock module", which must be read as the driver |
| X3 | `ENGINE.md` L18, `log.ts:3-9`: command `{who, from, to, card, seed}` with strings; `towerLog.ts:4-8` "seed" is a match counter, not an RNG seed | §1/§3.4: `Command {kind, actor, target(pipe), via}`, no `card`; seeded `core/rng` | step-07: log entries are M4 action objects; header `{seed, formatVersion, engineVersion, projectHash}` (CoS ruling); real seed from step-05. "The log is not the undo" kept |
| X4 | `ENGINE.md` L45–56, `pin.ts`: saves and pins in `localStorage` | §6, §8: no storage outside `platform`; lint ban | `check:law` and ESLint ban storage in `src/` from step-00 |
| X5 | `ENGINE.md` L106: "A card arms, then you tap a legal piece" as the second-game pattern | §3.4: cards optional, presentation per ability group; core/rules never mention cards (M9) | core lint bans `card`/`deck`; state tables use `CHOOSE_ACTION`, not cards |
| X6 | `ENGINE.md` L107, `BUILD_LAW.md` 10–11: server owns bag/rank; SEAT set; rebuild `queue/rules.mjs` | Offline-first; optional `net` port only (§5.2) | Not carried. No server rules build. Network banned in `src/` |
| X7 | `ENGINE.md` L54, L67 cite `src/game/…` paths that moved to `chess/game/…` | §8 rule 6: docs cite paths that exist (CI link check) | Every cite in this plan is to the current tree; step files are checked by QA D ("docs vs code") |
| X8 | `COMBAT_TARGET.md` L30, L75; `target.ts:92` `refreshLive` / `:65` `drawnHeroCell`: the logic cell is read **from where the sprite is drawn**, every frame | §12.1/§12.9: visual layers are never read by logic; units are 1×1 logic; MODES M3: cell + draw-only offset | Inverted: the sim cell is the truth and drawing reads it. Offset (`tile.ts:39` `bodyCell`/`walkX` idea) is draw-only and never changes occupancy (step-04) |
| X9 | `COMBAT_TARGET.md` L7–20, kit table: **every** BASIC is UNIT and **every** damaging SKILL is TILE (fixed law) | §9 freedom row: each ability picks UNIT or TILE (both legal, never a third) | Compatible as presets: the BTF preset keeps the law; the core only offers the two pipes (step-06) |
| X10 | `COMBAT_TARGET.md` L49/L72 Gale: living id, else the stored cell | §0: `core/targeting` exports exactly `aimUnit()` and `aimTile()`, "no third export" | Gale = `aimUnit(…, { fallbackAt })`: still the UNIT pipe with an optional TILE fallback, not a third pipe (step-06). Needs no new export kind |
| X11 | `COMBAT_TARGET.md` L22–25: HUD/avatar "face hits" pick a mug, not a cell | Not covered by ARCHITECTURE | Out of the core spine. Logged as a gap for the presentation/HUD design; if ever needed it is a UNIT aim on a unit with no cell, never a third pipe |
| X12 | `TILE.md` L3, L15, L20: lane ids 1–18 stay and tickets must use them; cell `{lane, col}`, `COLS = 6` (`square.ts:13`) | §8 rule 5, M8: `{c, r}` only; any cols × rows; lane ids are editor labels | Lane ids become a label adapter (`tile.ts:20-32` mapping, rewritten in step-10, outside core) with a unit test of all 18 (MODES M8 QA) |
| X13 | `TILE.md` L89: off-stone entry cells (`col === 6`) for spawning wings | Grid has no off-map cells; format warns and skips off-map entries | Gap noted for waves/entry later (rules); not in the core spine |
| X14 | `SKILLRIG.md` L163, `spec.ts:312` `normalize`: silently clamps board, counts, seconds | CEO "warn, don't block"; DSK `boothClamp` notice | step-10 adapter diffs raw vs normalized and returns a notice for every clamp |
| X15 | `SKILLRIG.md` L52: fractional blade scale 0.40–2.40; `paint.ts:754` `drawBlade` draws fractional | §12.10: `scale_snap: whole` by default in the engine draw path; BTF not patched | Not in the core spine (runtime/fx). Recorded so step-10 doesn't "fix" `paint.ts` |
| X16 | `SKILLRIG.md` L25, L175; `spec.ts:177-185` `STOCK` blade `src` = `/tower/…?v=1` root-absolute | §8 rule 7: no root-absolute asset paths; resolve through `AssetResolver` | step-10 keeps `src` as a provenance key only; the adapter exposes `bladeKey`, never a URL |
| X17 | `SKILLRIG.md` L15, `spec.ts:190` `STORE_KEY`, `:889-937` `loadStore/saveStore` (localStorage) | §7: vendored copy removes `loadStore`/`saveStore`; CoS Q7: start clean | Removed in the vendored copy (the only allowed edit besides import paths) |
| X18 | BTF edges: `towerTerrain.ts:176-189` stores `e`/`s` on the tile ("west and north live on the neighbour") | project-format §6.4 / core-types `CoreEdge`: writer canonical form is `w`/`n` on the tile; reader accepts any form | step-03 normalises every edge to one internal key (`n`/`w` form) and accepts all four sides; a test covers both BTF-style and format-style input |
| X19 | `BUILD_LAW.md` 3: missing art = copy the last good file, never a "cousin" | §12.9: 7-step clip fallback ending in a procedural stand-in token | Not core. Flag for the runtime: the stand-in is labelled and warned, which is the opposite of BTF's "never imagine a cousin"; ARCH keeps it because warn-don't-block |
| X20 | `BUILD_LAW.md` 8: green = `tsc` clean + play 1-1 and 1-2 | QA checklist G1–G10 | Green = BUILD_GUIDE §6 (`npm run green`) plus QA's gates |

Additional conflicts found while building the kit (not BTF docs, but they bind the slices):
- **K1 — Package layout.** ARCHITECTURE §1–2 is a pnpm monorepo `packages/*` with three enforcement layers (package boundaries, dependency-cruiser, ESLint). Grok Build asked for one npm project with `src/` and `src/state/`, and QA's greps scan `src`. **Plan:** one npm package, layers as folders `src/<layer>/`, enforced by dependency-cruiser + ESLint + `check:law` (two of ARCH's three layers plus greps). The split into workspace packages is a later Change Notice. ARCHITECTURE §1 needs a v0.7 note (pointer added to its changelog).
- **K2 — State tables are new.** ARCHITECTURE has no `src/state` layer or `xGo`. They come from Grok Build's state rule and Modes Designer's tables (`docs/STATES.md`). Placed above core (core never imports state, M2), below rules/runtime.
- **K3 — "phase" in core.** ARCH §2.3 calls the clock's render callback a "render-phase callback"; MODES M2 forbids `phase` in core. The clock API uses `onRender`/`onTick`.
- **K4 — `Event` name.** Grok Build's exact signature `xGo(from: Phase, event: Event)` shadows the global DOM/Node `Event`. Kept exactly; always imported explicitly; the core bus type is `CoreEvent`.
- **K5 — Toolchain.** TypeScript 7.0.2 is `latest` on npm, but `typescript-eslint 8.72.2` supports `<6.1`. Pinned TypeScript **6.0.3** (verified green).
- **K6 — Facing letters.** core-types `Facing = "N"|"E"|"S"|"W"` (mapped to clip suffixes up/right/down/left) vs ARCH §12.9 clip names. Compatible via DSK's single mapping; noted so nobody adds a second facing type.

## 3. Slice order (13 steps; step 09 split into 09 / 09b / 09c on 2026-11-10)

| Step | Slice | Depends on | Size (est. code + tests) |
|---|---|---|---|
| step-00-skeleton | Repo skeleton, lint/dep gates, `check:state`, `check:law` | — | ~240 (verified) |
| step-01-state-tables | Shared table + tactics flow + tactics input, `xGo`, rejected-edge no-op | 00 | ~330 |
| step-02-clock | One clock: fixed-step sim time, ticks + render, pause/step/timeScale, sim timers, the turn fuse | 00 (01 for the fuse event type) | ~300 |
| step-03-grid-edges | `{c,r}` grid from `CoreMap`, tile types, edges (walls), blocking objects, notices | 00 | ~320 |
| step-04-units-occupancy | Units with cell + offset + facing + side, one occupancy table, reach (BFS) | 03 | ~330 |
| step-05-rng | mulberry32, named streams, save/restore state | 00 | ~160 |
| step-06-pipes | UNIT/TILE pipes: `aimUnit`, `aimTile`, `resolveAim`, roster, half-up cell rounding | 04 | ~260 |
| step-07-events-log-replay | `CoreEvent` bus, M4 actions, command log with header, replay determinism | 02, 05, 06 | ~360 |
| step-08-project-reader | Read-only reader for map/stage/manifest (VersionGuard), resolved placements | 03, 05 | ~350 |
| step-09-sim-harness | Headless world: reader + clock + grid + units + log; M4 `submit`; snapshot / replay / restore (merged, 294) | 01–08 | ~300 |
| step-09b-match-drivers | Phase and tick drivers, AI hook (M6), turn fuse, pluggable victory, `phases` in the snapshot, 50-seed matches | 01, 02, 09 | ~260 |
| step-09c (input + tooling) | Input intents incl. `BoxSelect` (M7), tap/drag mappers, the `sim` script | 01, 09b | ~200 |
| step-10-fx-order | `fx-order` reader rewritten from the design docs (no BTF copy, CEO 2026-11-09) + lane-label adapter | 00, 07; CoS answers to the silent spots | ~350 |

Order rationale: gates first so every later step is policed; state tables early because they're pure and pin the vocabulary every driver uses; clock before anything time-based; grid → units → pipes is the spatial stack; RNG before the log so the header carries a real seed; the reader after the spatial types so it builds real grids; the harness proves the whole spine headless; the BTF adapter last because it waits on a CEO ruling and isn't on the critical path.

## 4. Common sign-off checklist (every step)
**Engine Architect review (before QA):**
- [ ] Interfaces match the step file's quotes exactly (names, order, optionality, readonly, return types).
- [ ] Types from `src/types/core-types.ts` imported, not redefined; `MAY-MOVE` fields read through one accessor.
- [ ] Laws: one clock, `{c,r}` only, UNIT/TILE only, no rule words or `phase` in core, seeded RNG only, no network/storage, no BTF path; M1–M9 honoured where the step touches them.
- [ ] Tests named in the step exist, assert behaviour (not just "doesn't throw"), and cover the warn-not-block cases.
- [ ] Decisions note: every chosen default named with value and reason; deviations match the diff.
- [ ] BTF intent cited in the step is honoured, and nothing was copied from BTF.
**QA & Build Guard:** G1–G10 of `docs/qa/handback-checklist.md` from a clean checkout in `/workspace/qa-runs/<step>/`.
**RaiKynn (via Chief Of Staff):** accept / reject in plain words. Then the Architect merges and tags `accepted/<step-id>`.

---

## 5. Slices

### step-00-skeleton — repo skeleton and gates  *(full step file written)*
- **Goal:** Grok Build's Step 0 (strict ES2022 TS project with `src/`, `src/state/`, `tests/smoke.test.ts`, `BUILD_GUIDE.md`, `.gitignore`; `npm test` and `npm run typecheck` exit 0) plus the law gates: ESLint, dependency-cruiser, `npm run check:state` (QA's G3 grep verbatim), `npm run check:law`, and tests proving each gate fails on bad code.
- **Files:** `package.json`, `package-lock.json`, `tsconfig.json`, `eslint.config.mjs`, `.dependency-cruiser.cjs`, `.gitignore`, `scripts/check-state.sh`, `scripts/check-law.sh`, `src/index.ts`, `src/{state,core}/.gitkeep`, `src/types/core-types.ts` (DSK copy), `tests/smoke.test.ts`, `tests/gates.test.ts`, `tests/fixtures/**`, `BUILD_GUIDE.md`, `docs/STATES.md`.
- **Depends on:** nothing.
- **Acceptance tests (QA-runnable):** `npm ci && npm run green` exits 0; `npm test` → pass 6 / fail 0; `sh scripts/check-state.sh tests/fixtures/state-bad` exits 1; `sh scripts/check-law.sh tests/fixtures/law-bad` exits 1 with four groups; a temporary `src/core/a.ts` importing `src/state/` fails `npm run deps` with `core-imports-only-types`; sha256 of the three copied files matches.
- **Out of scope:** any engine code; workspace packages; Vite/DOM; CI files.
- **BTF it adapts:** none (contrast only): BTF `eslint.config.mjs` has recommended + react-hooks only (no boundaries); `package.json:7` `"sideEffects": false` kept as a habit; `package.json:21` `typecheck: tsc --noEmit` mirrored.
- **Sign-off specifics:** verified on this box (Node 24.22.1, npm 10.34.6, rg 14.1.1): extracted from the step file into a clean folder and `npm run green` exited 0.

### step-01-state-tables — shared + tactics flow + tactics input, `xGo`
- **Goal:** implement `docs/STATES.md` §3–§4: the shared table (targeting/resolving/victoryCheck/result + overlay rows), the tactics flow and input tables, the pure `xGo`, and the rejected-edge no-op guarantee. No drivers, no overlay stack holder, no mode table.
- **Files:** create `src/state/types.ts`, `src/state/shared.table.ts`, `src/state/tactics.flow.table.ts`, `src/state/tactics.input.table.ts`, `src/state/xgo.ts`, `src/state/index.ts`; tests `tests/state/{xgo.accepts,xgo.rejected-noop,tables.merge,tables.coverage,tactics.script}.test.ts`. Remove `src/state/.gitkeep`.
- **Interfaces (quoted exactly from STATES.md §4):** `Phase`, `Outcome`, `TargetRef`, `Event`, `EventType`, `Row`, `Table`; `export function xGo(from: Phase, event: Event): Phase`; plus `export const SHARED_TABLE: Table`, `TACTICS_FLOW_TABLE: Table`, `TACTICS_INPUT_TABLE: Table`, `ALL_PHASES: readonly Phase[]`, `ALL_EVENT_TYPES: readonly EventType[]` (lists checked exhaustive at compile time via `Record<Phase, true>`).
- **Depends on:** step-00.
- **Acceptance tests:** the five STATES.md §6 tests by name; `npm run check:state` OK with zero REVIEW lines outside `xgo.ts`/`types.ts`; a duplicate `(from, event)` row added in a test throws at merge; `xGo` never throws for any `Phase × EventType` pair (exhaustive loop).
- **Out of scope:** the mode table, overlay stack holder, turn/side bookkeeping ("sets" are tags only), fuse timer, RPG/RTS tables, any import from `src/core`.
- **BTF it adapts:** none (rewrite from intent). Turn flow intent from `chess/game/towerChess.ts:572` `handOff`, `:697` `tickTowerChess`, `:1190` `yourTurn`, `:1304` `tapTowerChess`; fuse intent from `chess/game/towerChessClock.ts:109-122` (which reads `Date.now` at `:112` — the reason FUSE_EXPIRE must come from the sim clock).
- **Sign-off specifics:** M2 — `src/core` untouched; AI and player share every event (script test runs the rival side through the same events); FUSE_EXPIRE edges exist from idle/unitSelected/actMenu/targeting only.

### step-02-clock — the one clock (M1)
- **Goal:** `src/core/clock`: a pure scheduler. `advance(realDtMs)` (fed later by the host rAF driver, by tests now) runs whole fixed sim ticks; sim time is an integer of ms; `onTick` for tick-driven logic and `onRender(simMs, alpha)` for drawing (M1: turns and ticks on the same clock). `pause/resume/step/setTimeScale`; sim-time timers `after(ms)`; one throwing subscriber is reported and doesn't stop the others. Plus `src/rules/turns/fuse.ts`: the turn fuse option `30 | 60 | "off"` that emits `FUSE_EXPIRE` from a sim timer.
- **Files:** `src/core/clock/{clock.ts,index.ts}`, `src/rules/turns/fuse.ts`, tests `tests/core/clock.test.ts`, `tests/rules/fuse.test.ts`. Remove `src/core/.gitkeep`.
- **Interfaces (to be quoted in the step file):**
  ```ts
  export type ClockOptions = { readonly stepMs: number; readonly maxFrameMs: number };   // defaults 10 and 100
  export type SimTimer = { readonly id: number; cancel(): void };
  export interface Clock {
    advance(realDtMs: number): void;
    now(): number;                                            // integer sim ms = ticks × stepMs
    ticks(): number;
    onTick(fn: (simMs: number, stepMs: number) => void): () => void;
    onRender(fn: (simMs: number, alpha: number) => void): () => void;
    after(ms: number, fn: () => void): SimTimer;
    pause(): void; resume(): void; isPaused(): boolean; step(): void;
    setTimeScale(x: number): void;
    onError(fn: (err: unknown) => void): () => void;
  }
  export function createClock(opts?: Partial<ClockOptions>): Clock;
  // src/rules/turns/fuse.ts
  export type FuseSetting = 30 | 60 | "off";
  export function startFuse(clock: Clock, setting: FuseSetting, emit: (e: { readonly type: "FUSE_EXPIRE" }) => void): SimTimer | null;
  ```
- **Depends on:** step-00 (step-01 for the `FUSE_EXPIRE` type; the fuse imports `Event` from `src/state/types.ts`).
- **Acceptance tests:** 1000 × `advance(16.6)` gives the same `ticks()` as one run of the same deltas replayed (determinism); a 5000 ms real gap advances at most `maxFrameMs` (dt clamp, BTF `clock.ts:15`); a throwing tick subscriber is reported via `onError` and the next subscriber still runs (BTF `clock.ts:25-31`); paused clock: `advance` adds no ticks, `step()` adds exactly one; `setTimeScale(2)` doubles ticks per real ms; `after(30000)` fires on the tick where `now() >= 30000` and not before; fuse `30` fires `FUSE_EXPIRE` once at 30000 sim ms, `60` at 60000, `"off"` never; a fuse doesn't fire while paused; `check:law` passes (no rAF/Date/timers in `src/`); `src/core` contains no `phase` word.
- **Out of scope:** the rAF host driver (runtime), frame-rate cap UI, turn/side bookkeeping, match clock (`match_minutes`).
- **BTF it adapts:** none — **rewrite** of `src/engine/clock.ts` keeping its rules: one loop (`:1`), dt clamp 0.1 s (`:15`), error isolation (`:25-31`), `subscribe` returns an unsubscribe (`:51-56`). Dropped: the game import `frameRate` (`:3`), rAF inside the engine (`:20`, `:40`), `performance.now` (`:38`).
- **Sign-off specifics:** M1 (one clock, ticks + turn events both work), FUSE from sim time only, chosen `stepMs` (10) and `maxFrameMs` (100) named in the Decisions note.

### step-03-grid-edges — `{c,r}` grid, tile types, walls
- **Goal:** `src/core/grid`: build a read-only grid from `CoreMap` + the stage's resolved `CoreTileType[]`; walkability from the logic palette; edge walls that block movement and adjacency both ways; blocking map objects; warnings (never throws) for unknown palette ints, unknown tile-type ids (run as `floor`), off-map edges/objects (skipped), duplicate walls (count once), non-1×1 footprints (played 1×1), and `wrapEdges: true` (`wrapEdgesIgnored`).
- **Files:** `src/core/notice.ts`, `src/core/grid/{grid.ts,edges.ts,index.ts}`, tests `tests/core/grid.test.ts`, `tests/core/edges.test.ts`.
- **Interfaces (outline):**
  ```ts
  import type { CoreMap, CoreTileType, CoreTerrainKnobs, Sq } from "../../types/core-types.ts";
  export type Notice = { readonly code: string; readonly message: string; readonly at?: Sq };
  export type Side4 = "n" | "e" | "s" | "w";
  export interface Grid {
    readonly cols: number; readonly rows: number;
    inBounds(at: Sq): boolean; index(at: Sq): number; cellOf(index: number): Sq;
    tileType(at: Sq): CoreTileType; isOpen(at: Sq): boolean;
    wallBetween(a: Sq, b: Sq): boolean; neighbours4(at: Sq): readonly Sq[];   // order n, e, s, w; excludes walled and off-map
    canForceInto(from: Sq, to: Sq, knobs: CoreTerrainKnobs): boolean;        // edge walls always stop; wall-block tiles per push_into_walls
  }
  export function createGrid(map: CoreMap, tileTypes: readonly CoreTileType[], opts: { readonly wrapEdges: boolean }): { readonly grid: Grid; readonly notices: readonly Notice[] };
  ```
- **Depends on:** step-00.
- **Acceptance tests:** 6×9 and 12×12 grids build with no rebuild (M8); `index`/`cellOf` round-trip for every cell, row-major `i = r*cols + c`; a wall `{c:2,r:4,side:"n"}` blocks (2,3)↔(2,4) both ways and the BTF-style `{c:2,r:3,side:"s"}` is the same wall (counted once, X18); an off-map edge is skipped with a notice; a palette int with no entry runs as `floor` + notice; an object with `blocks: true` closes its cell; `wrapEdges: true` gives `wrapEdgesIgnored` and no wrap adjacency; `canForceInto` is false across any edge wall even with `push_into_walls: true`, and true into a `wall-block` tile only when the knob is on; no hard-coded cols/rows/tile px anywhere (grep `\b6\b` reviewed).
- **Out of scope:** pathing costs, LOS/shots (`wall_blocks_los/shots` are rules knobs, later), wall looks, map visual layers, multi-tile footprints.
- **BTF it adapts:** none (rewrite). Intent: `chess/game/towerTerrain.ts:58` `EarthEdge`, `:60-69` `EarthSeam`, `:176-178` `seamKey`, `:181-189` `seamsOn` (edge storage, opposite canonical side); `towerChess.ts:410-412` `inBoard`. Anti-pattern not repeated: `src/engine/square.ts:13` `COLS = 6` and module-level board state (`square.ts` `setTowerBoard`).
- **Sign-off specifics:** core-types imported (no local `Sq`/`CoreEdge`); every non-fatal case is a notice; M8.

### step-04-units-occupancy — units, one occupancy table, reach (M3)
- **Goal:** `src/core/unit`: units placed from `ResolvedPlacement` (core-types); each has `side`, logic cell `at`, draw-only `offset {dx,dy}` (M3), `alive`, `facing: Facing | null`. One occupancy table keyed by cell (living units only); `kill` removes a unit from occupancy the same tick; `moveTo` changes the cell (the M4 action layer calls it at the end of a move's duration); `reachable` does a BFS over the grid with walls, closed cells and an option for bodies blocking.
- **Files:** `src/core/unit/{units.ts,reach.ts,index.ts}`, tests `tests/core/units.test.ts`, `tests/core/reach.test.ts`.
- **Interfaces (outline):**
  ```ts
  import type { ResolvedPlacement, SideId, Facing, Sq } from "../../types/core-types.ts";
  export type Offset = { readonly dx: number; readonly dy: number };     // tile fractions; draw only
  export type UnitState = { readonly id: string; readonly side: SideId; readonly at: Sq; readonly offset: Offset; readonly alive: boolean; readonly facing: Facing | null };
  export interface Units {
    place(p: ResolvedPlacement): readonly Notice[];   // closed or occupied cell: placed anyway + notice (warn, don't block)
    get(id: string): UnitState | null; all(): readonly UnitState[];
    occupantAt(at: Sq): UnitState | null;              // living unit on that cell this tick
    moveTo(id: string, to: Sq): boolean; setOffset(id: string, o: Offset): void; setFacing(id: string, f: Facing | null): void;
    kill(id: string): void;
  }
  export function createUnits(grid: Grid): Units;
  export function reachable(grid: Grid, units: Units, from: Sq, maxSteps: number, opts: { readonly bodiesBlock: boolean; readonly side: SideId }): readonly Sq[];
  ```
- **Depends on:** step-03.
- **Acceptance tests:** M3 QA: place at `{c,r}`, set offset `{dx:0.5,dy:0}`, `occupantAt` still that unit at its cell and not the next one; offset back to 0 after settle; `kill` → `occupantAt` null in the same tick and the unit absent from occupancy (COMBAT_TARGET L31); `moveTo` updates occupancy atomically (no lunge-cell residue, COMBAT_TARGET L64); placing on a closed cell or a taken cell gives a notice and still places; `reachable` respects walls both ways, closed cells, `maxSteps`, and bodies (option on/off); `facing` null by default and never inferred from side; the `neutral` side is accepted; no second occupancy table (grep).
- **Out of scope:** stats/HP (rules), action durations (step-07/09), footprints > 1×1, move costs by terrain, jump-over.
- **BTF it adapts:** none (rewrite). Intent: `chess/game/stage/target.ts:9` `LiveUnit {id, cell, alive}`, `:144-153` `occupantAt`; `chess/game/stage/tile.ts:39-50` `bodyCell` (walk offset → M3 offset); `chess/game/towerChess.ts:414-415` `moveSquares` ("the landing tile must be empty; a body on the way stops that line"). Not reused: `towerChess.ts:103-121` `Piece` (hp/maxHp/energy leak), `stage/occupy.ts:7` plant slots.
- **Sign-off specifics:** M3; one occupancy table; no rule words.

### step-05-rng — seeded randomness
- **Goal:** `src/core/rng`: mulberry32 with integer state, `int`, `pick`, weighted pick, named sub-streams so pool picks, AI and FX don't disturb each other, and save/restore for replay and saves.
- **Files:** `src/core/rng/{rng.ts,index.ts}`, test `tests/core/rng.test.ts`.
- **Interfaces (outline):**
  ```ts
  export type RngState = { readonly a: number };
  export interface Rng { next(): number; int(maxExclusive: number): number; pick<T>(xs: readonly T[]): T; weighted(weights: readonly number[]): number; state(): RngState }
  export function createRng(seed: number): Rng;
  export function restoreRng(state: RngState): Rng;
  export function streamSeed(seed: number, name: string): number;
  ```
- **Depends on:** step-00.
- **Acceptance tests:** seed `0x5eed` → first 5 `next()` values equal a committed vector (computed by the reference mulberry32 from `towerTourney.ts:66-75`); same seed → same sequence; `restoreRng(r.state())` continues identically; `streamSeed(s,"pool") !== streamSeed(s,"ai")` and both stable; `int` is in range for 10,000 draws; `weighted` never picks a zero weight; `Math.random` absent (`check:law`).
- **Out of scope:** choosing a fresh seed (entropy comes from the platform/host at play start; core takes a number), crypto.
- **BTF it adapts:** none (rewrite of a 9-line algorithm). Reference: `chess/game/towerTourney.ts:66-75` `mulberry32`. Anti-pattern not repeated: `:515` `Math.random = mulberry32(0xc0ffee)` (monkey-patching the global). Contrast `towerLog.ts:4-8` (`seed` is a counter, not a seed).
- **Sign-off specifics:** golden vector committed; no globals patched.

### step-06-pipes — UNIT and TILE
- **Goal:** `src/core/targeting`: the two pipes and the live roster. `aimUnit` follows a body; `aimTile` fixes a cell at cast; `resolveAim` at arrival returns hit/miss per COMBAT_TARGET; the roster lists living units only; `toCell` rounds real effect points half-up per axis (ARCH §12.10) so anything that hits goes through a pipe.
- **Files:** `src/core/targeting/{pipes.ts,roster.ts,index.ts}`, tests `tests/core/pipes.test.ts`.
- **Interfaces (outline):**
  ```ts
  export type UnitAim = { readonly pipe: "unit"; readonly unitId: string; readonly fallbackAt: Sq | null };
  export type TileAim = { readonly pipe: "tile"; readonly at: Sq };
  export type Aim = UnitAim | TileAim;
  export type Resolution = { readonly hit: true; readonly unitId: string; readonly at: Sq } | { readonly hit: false; readonly reason: "dead" | "empty" | "offMap" };
  export function aimUnit(unitId: string, opts?: { readonly fallbackAt?: Sq }): UnitAim;
  export function aimTile(at: Sq): TileAim;
  export function resolveAim(aim: Aim, units: Units, grid: Grid): Resolution;
  export function roster(units: Units, side?: SideId): readonly { readonly id: string; readonly at: Sq }[];
  export function toCell(point: { readonly c: number; readonly r: number }): Sq;
  ```
- **Depends on:** step-04.
- **Acceptance tests:** UNIT: target moves → hit lands at its new cell; target dead → `{hit:false, reason:"dead"}`, never its old cell (COMBAT_TARGET L10–12); TILE: occupant on arrival → hit; empty → miss; unit that left the cell → miss; no retarget (L17–20); Gale (`fallbackAt`): living id wins; dead id + someone on the stored cell → that unit; dead id + empty cell → miss (L49); roster excludes dead the same tick; `toCell({c:2.5,r:-0.5})` = `{c:3,r:0}` (half-up per axis); exports are exactly the listed names (no third aim kind; a type-level test that `Aim["pipe"]` is `"unit" | "tile"`).
- **Out of scope:** shapes (cone/bar/line → behaviours), legality filters (rules), LOS/shots, status effects, HUD face hits (X11).
- **BTF it adapts:** none (rewrite from `docs/COMBAT_TARGET.md`). Intent: `chess/game/stage/target.ts:92` `refreshLive` (live lists; inverted per X8), `:139-142` `unitCell`, `:144-153` `occupantAt`. The code imports heroes/chapter/wolf pack (`target.ts:1-6`), which is why it isn't adapted.
- **Sign-off specifics:** two pipes only; Gale fallback is UNIT; nothing reads drawn positions.

### step-07-events-log-replay — events, actions as data, command log
- **Goal:** `src/core/events` (a typed, synchronous, ordered bus stamped with the sim tick) and `src/core/log` (append-only command log of M4 action objects with the header `{seed, formatVersion, engineVersion, projectHash}`, JSON round-trip). Replay determinism is proven here at unit level and end-to-end in step-09.
- **Files:** `src/core/events/{bus.ts,index.ts}`, `src/core/log/{action.ts,log.ts,index.ts}`, tests `tests/core/bus.test.ts`, `tests/core/log.test.ts`.
- **Interfaces (outline):**
  ```ts
  export type CoreEvent = { readonly type: string; readonly tick: number; readonly data: Readonly<Record<string, unknown>> };
  export interface EventBus { emit(type: string, data?: Readonly<Record<string, unknown>>): void; on(type: string, fn: (e: CoreEvent) => void): () => void; history(): readonly CoreEvent[] }
  export function createBus(clock: Clock): EventBus;
  export type ActionTarget = Aim | { readonly pipe: "none" };
  export type Action = { readonly id: string; readonly kind: "move" | "ability" | "wait" | (string & {}); readonly actor: string;
    readonly target: ActionTarget; readonly durationMs: number | null; readonly turns: number | null; readonly effects: readonly string[];
    readonly via?: { readonly presentation: string; readonly ref?: string } };
  export type LogHeader = { readonly seed: number; readonly formatVersion: 1; readonly engineVersion: string; readonly projectHash: string };
  export type LogEntry = { readonly tick: number; readonly action: Action };
  export interface CommandLog { readonly header: LogHeader; append(tick: number, action: Action): void; entries(): readonly LogEntry[]; toJSON(): string }
  export function createLog(header: LogHeader): CommandLog;
  export function parseLog(json: string): { readonly ok: true; readonly log: CommandLog } | { readonly ok: false; readonly error: string };
  ```
- **Depends on:** step-02, step-05, step-06.
- **Acceptance tests:** events delivered in emit order, stamped with `clock.ticks()`; a throwing listener doesn't stop the others; log `toJSON` → `parseLog` round-trips byte-identically; header carries `engineVersion` from `src/index.ts` and the given seed; an action with `durationMs: 200` is stored as data (M4); `via` is logged and nothing in core reads it (M9 grep); log is append-only (no remove/edit API; "the log is not the undo", ENGINE.md L71); `parseLog` of a wrong `formatVersion` returns an error, not a throw.
- **Out of scope:** executing actions (step-09 harness and later rules), undo, networking (`NetPort`), persistence.
- **BTF it adapts:** none (rewrite of the same idea). Intent: `src/engine/log.ts:3-9` `Command`, `:13-21` `writeCommand`, `:23-25` `readLog`; `chess/game/towerLog.ts:11-22` `noteLine`/`noteSq` (string `"col,rank"` coordinates and `card` field not repeated).
- **Sign-off specifics:** header exactly the CoS ruling; no `card` word; projectHash is an input (core has no crypto).

### step-08-project-reader — read-only reader, VersionGuard, placements
- **Goal:** `src/project/read`: parse `CoreProjectManifest`, `CoreMap`, `CoreStage` from JSON (current version only, by `VersionGuard`; anything else returns `needsMigration`), and resolve match-start placements (`ResolvedPlacement[]`): the chosen loadout into `playerSpawns` in order, fixed enemies, weighted picks (through an injected picker so the reader stays layer-clean), neutrals with sides from `stage.sides` / defaults `player`/`rival`/`neutral`, facing from `SpawnSq.facing` (`null` if absent). `stage.seed` returned as-is (absent = runtime picks a fresh seed).
- **Files:** `src/project/read/{guard.ts,map.ts,stage.ts,manifest.ts,placements.ts,index.ts}`, tests `tests/project/{guard,map,stage,placements}.test.ts`, fixtures `tests/fixtures/project/{map-6x9,map-12x12,stage-fixed,stage-weighted}.json`.
- **Interfaces (outline):**
  ```ts
  export type ReadResult<T> = { readonly ok: true; readonly doc: T; readonly notices: readonly Notice[] }
    | { readonly ok: false; readonly needsMigration: true; readonly kind: CoreDocKind; readonly found: unknown }
    | { readonly ok: false; readonly needsMigration: false; readonly error: string };
  export function readManifest(json: unknown): ReadResult<CoreProjectManifest>;
  export function readMap(json: unknown): ReadResult<CoreMap>;
  export function readStage(json: unknown): ReadResult<CoreStage>;
  export function resolvePlacements(stage: CoreStage, map: MapSize, chosen: readonly string[], pick: (weights: readonly number[]) => number): { readonly placements: readonly ResolvedPlacement[]; readonly notices: readonly Notice[] };
  ```
  (`Notice` lives in `src/core/notice.ts`; the reader may import it only if the step adds an allowed edge `project → core/notice.ts` to dependency-cruiser — decided in the step file, or `Notice` moves to `src/types/` by Change Notice.)
- **Depends on:** step-03 (Notice), step-05 (for the harness picker; the reader itself takes a function).
- **Acceptance tests:** map v5 / stage v2 / tile-project v6 accepted; `formatVersion` 4 → `needsMigration` (never patched); missing required field → `error` (hard) vs off-map spawn → notice (soft); extra loadout units beyond `playerSpawns` aren't placed and give a notice; weighted picks are reproducible with a fixed picker; sides default correctly and `neutrals[].side` overrides; `facing` absent → `null`; the reader passes `wrapEdges` / `footprint` through; the grid owns those notices; the 6×9 and 12×12 fixtures load (M8); the reader never writes, never fetches, never imports `src/core` beyond `Notice`.
- **Out of scope:** migrations (`@te/project-write`), setups/answers/value layering, assets, waves after turn 0 (rules), `computeIndex`/`exportClosure`.
- **BTF it adapts:** none. BTF has no authored map format (project-format §6.4 "No authored tile map exists in BTF"); legacy `ui-shell/js/setup-store.js:682` shapes are never read (ARCH §8 rule 9).
- **Sign-off specifics:** VersionGuard exact; MAY-MOVE fields (`facing`, `seed`, `footprint`, `wrapEdges`) each read in one accessor.

### step-09-sim-harness — headless world, M4 actions, snapshot, replay  *(written and merged: `handoff/steps/step-09-sim-harness.md`, PR #10)*
- **Split (2026-11-10):** the original slice did not fit 400 changed lines, so it became three steps. The step files are binding; this outline is context only.
- **step-09 (merged):** `src/sim/{types,world,actions,run,index}.ts`. `createWorld(input)` (reader → grid → seed `stageSeed ?? hostSeed` → pool-stream placements → `units.place`), `submit` (log, then apply at the end of `durationMs`; `move` / `wait` only), headless `advance(world, ms)` (integer ms, whole steps) and `replayTicks(world, n)`, `snapshot(world): SimSnapshot`, `replay(input, log, untilTick)`, and `restore(input, log, snap)` by deterministic tick replay (CEO default; no `Units.restore`).
- **step-09b-match-drivers (written):** `src/sim/driver-phase.ts` `runMatch(world, opts)` walks the tactics tables with `xGo`; every side gets the same events; a stalled side is ended by the turn fuse (`startFuse`, user ms or `"off"`; the BTF 60000 default is preset data). `src/sim/driver-tick.ts` `runTicks(world, opts)` asks the same hook every `everyMs` for idle units. `AiHook = (world, side, budget) => readonly Action[]` (no `phase`, M6). `VictoryRule = (world, { round, side }) => Outcome | null` is the caller's; the sim holds no HP or KO rule, and the test rule (reach the far row) lives in tests. `SimSnapshot` gains `phases` (keys `tick, clockMs, rngState, units, occupancy, phases, logSeq`); `restore` takes `phases` from the snapshot. Acceptance: 50 seeds on 6×9 and 12×12 end in `win`/`lose`/`draw` and replay to the same history; the fuse ends a stalled side at exactly its ms (also mid-move); fuse off → `timeout` at `maxSimMs`.
- **step-09c (to write):** input intents `SelectUnit | TargetCell | Confirm | Cancel | BoxSelect` → state events (STATES §3.4): tap-tap and drag mappers give identical event lists, `BoxSelect` no-ops without throwing (M7). Open: where the intent type lives (`src/state` vs a future `src/runtime/input`; nothing may import `src/sim`). Also the `sim` script (prints outcome + event-history hash; the hash needs `node:crypto`, so it lives outside `src/`). It needs one `package.json` script line and a `scripts/` file; whether that is a step-scoped allowance or a CN (BUILD_GUIDE §3 lists `scripts/` contents) is decided when 09c is written.
- **MODES-v2 (kept):** offline catch-up is host-supplied elapsed ms, capped by a project setting; the core never reads wall time. Two user options (CEO): deterministic tick replay (default, used by tests; built in step 09) or a seeded rules-layer estimate marked `estimated: true` in the snapshot and excluded from replay-equality tests (not yet scheduled).
- **Out of scope (all three):** rendering, real behaviours/stats, attacks and effects (step 10 and rules), the action menu/cards (M9), saves, network, the `estimated: true` offline estimate.
- **BTF it adapts:** none (rewrite). Intent: `scripts/sim-50.mjs:1-30` (batch-sim report), `chess/game/towerTourney.ts:62-63` fixed `DT = 0.05` / `MAX_TICKS = 16000`. Anti-patterns not repeated: `scripts/node-game.mjs:4-18` browser shims (`localStorage`, `document`) — the spine needs none; `towerTourney.ts:515` global `Math.random` patch.
- **Sign-off specifics:** this is the spine's proof; the Architect re-reads BUILD_GUIDE vs code (QA drift sweep is due here: 5–7 steps).

### step-10-fx-order — effect order rebuilt from the design docs + lane labels  *(CEO 2026-11-09: no frozen BTF copy)*
- **Goal:** TileEngine's own `fx-order` reader (asset kind `fx-order`): a `SKILLRIG v1` paste is read, validated and clamped with a notice per clamp (X14, warn don't block), and played as the ordered steps in `effect-order-from-docs.md` §A on the one clock; the hit applies at `connect` through the last step (SKILLRIG.md L178). Built from the design docs only; **BTF code is not read for the order**. Every silent spot listed in that doc needs a CoS answer before its test is written; until then the step marks it `PENDING CoS` and does not guess. Blade `src` stays a provenance key (`bladeKey`), never a URL (X16). Also the lane-label adapter `src/btf-adapters/src/lane-labels.ts` (`laneIdToSq` / `sqToLaneId`, 18 ids ↔ `{c: col, r: lane}`; rewritten, 10 lines).
- **Files (outline):** `src/fx/order/{types,read,timeline,index}.ts`, `src/btf-adapters/src/{lane-labels,index}.ts`, tests `tests/fx/{read,timeline}.test.ts`, `tests/btf-adapters/lane-labels.test.ts`.
- **Depends on:** step-00, step-02 (clock), step-07 (events); CoS answers to the silent spots.
- **Acceptance tests (outline):** each numbered rule in `effect-order-from-docs.md` §A has one test citing its doc line; the hit time is `start(last) + connect × seconds(last)`; `damage: null` invents no number; clamps give notices; `lane-labels`: all 18 ids map to `{c,r}` and back, id 2 = `{c:0,r:1}`, id 11 = `{c:3,r:1}` (TILE.md L58–60). No file under `src/` contains BTF code (QA build-law C), and nothing reads `/workspace/g-tile-engine`.
- **Out of scope:** the FX painter (`paint.ts`, Q9 narrowed, pending), `scale_snap`, the editor booth.
- **Sign-off specifics:** every rule cites a doc line; every silent spot is answered by CoS or still marked `PENDING CoS`.

## 6. CEO decisions this plan needs (plain words)
1. ~~Keep one frozen copy of a Before The Fall file?~~ **DECIDED (CEO 2026-11-09): no.** The effect order is rebuilt from the design docs (`effect-order-from-docs.md`); every spot where the docs are silent is flagged to CoS. Step 10 is now a rewrite.
2. **Where Grok Build's code lives.** Grok Build prefers its shared workspace folder. We propose `/workspace/artifacts/tileengine-engine/` on this computer, if Grok Build can reach it; otherwise a git repo you choose. This needs your or Chief Of Staff's go-ahead together with Grok Build's answer.
3. ~~Turn timer for the Before The Fall preset: 30 or 60 seconds?~~ **DECIDED (CEO 2026-11-09): 60000 ms default, user-adjustable.** It is preset/project data; core's fuse takes any positive integer ms (step 02 `FuseMs`).
4. **Bot opening formation.** **DECIDED (CEO 2026-11-09): the user's choice of three shapes** (`unit-roster.opening_row` = `back` / `second` / `front`, DSK setup-format §12.4h). Setup data, not core.
