# Grok Build kit (kit-2, 2026-11-09)

Owner: Engine Architect. **Status: 12 merged at `9dad92a` (PR #17, 2026-11-11). Next: step-13-chaos-generators written (chaos-player step C, the last of the three; awaiting QA); chaos plan in `docs/chaos-player-outline.md`.** Canonical location: `/workspace/tileengine/handoff/` (this folder). The older copy in `/workspace/tileengine/docs/grok-build-kit/` is superseded. The workflow background is in `/workspace/tileengine/docs/grok-build-handoff-plan.md` (DRAFT; the decisions below win where they differ).

## Where things go
- **Repo:** https://github.com/G-TileEngine/tileengine (visibility is the CEO's call). `README.md` on `main` is owned by CoS; steps never edit it. Nobody pushes to `main`; it changes only by merged PR.
- **Publishing (CoS):** push one kit commit to `main` with `BUILD_GUIDE.md` (root), `docs/STATES.md`, `src/types/core-types.ts` (or attach them to step 00). That commit is step 00's base. The Architect then writes each step's base SHA into the step file before it is sent.
- **Per step:** Grok Build works on branch `step/<step-id>-r<N>` from the base (`main`'s SHA after the previous accepted step), commits the hand-back in-repo at `handback/<step-id>/r<N>/` as the last commit, and delivers a verified git bundle plus HAND-BACK.md to the CEO's Drive; Chief Of Staff pushes the branch and opens the PR to `main` (CN-003). Architect review → QA (G1–G10 on a clean clone of the branch) → RaiKynn accepts via CoS → the Architect merges. Tagging is not used; merge commits on `main` are the record.
- **Change Notices:** `change-notices/CN-<NNN>-<slug>.md` here, attached to the step that carries them. Issued: `CN-001-sim-time-ms.md` (sim time is integer ms; carried by step 02), `CN-002-no-card-types-camelcase.md` (no-card-types also catches camelCase Card/Deck names; carried by step 01), `CN-003-delivery-bundle.md` (delivery is a git bundle to the CEO's Drive; Chief Of Staff opens the PR; carried by step 01), `CN-004-core-types-audio-ui-keys.md` (core-types adds `audio: 1`, `CORE_EVENT_KEYS` and `UiEventMap`; carried by step 02), `CN-005-project-reads-notice.md` (`src/project` may import the type-only `Notice`; carried by step 08), `CN-006-input-layer-sim-script.md` (`src/runtime/input` layer, the `sim` npm script and `scripts/sim.ts`, BUILD_GUIDE §3; carried by step 09c), `CN-007-fx-layer.md` (`src/fx` layer: one depcruise line and two BUILD_GUIDE §3 lines; carried by step 10).

## Files
| File | Goes where when published | What | Lines |
|---|---|---|---|
| `BUILD_GUIDE.md` | repo root | Root guide: goal, mode order, laws incl. M1–M9 and MODES-v2 hooks, layout, state rule, green, never-do, repo/branch/hand-back | 112 (CN-007 §3) |
| `STATES.md` | repo `docs/STATES.md` | State tables (Modes Designer input, Architect types); PROPOSED idle/TD notes; parked RPG/RTS | 228 |
| `/workspace/tileengine/data/core-types.ts` | repo `src/types/core-types.ts` | DSK's core types r14 / catalogue rev 17 (`UnitId`, `CoreDeck` (presentation/loader only), `CoreEventMap` incl. `actionLogged`, `LogSeq`, `ActionKind`, `ModeEventMap`, project-wide `OccupancyPolicy`, lanes, paths; no eslint-disable). **Repo pin since CN-004 (carried by step 02): sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23`** (adds `audio: 1`, `CORE_EVENT_KEYS`, `UiEventMap`; checked on `main` `92e4e96`). This `data/` file is now byte-identical to the repo pin (`f00c722c…`, checked 2026-11-10 against `main` `7944f79`) | — |
| `STEP-TEMPLATE.md` | kit only | Template for every step file | 46 |
| `HAND-BACK.md` | kit + attached to every step | What Grok Build returns and where (in-repo, PR) | 56 |
| `CHANGE-NOTICE-TEMPLATE.md` | kit only | Old / New / Affected / Action | 13 |
| `change-notices/CN-001-sim-time-ms.md` | attached to step 02 | Integer sim ms everywhere | 14 |
| `00-grok-build-workflow-answer.md` | kit only (input) | Grok Build's own workflow answer. Its `src/state/<mode>.table.ts` is superseded by BUILD_GUIDE §5 (`<name>.table.ts`) | 12 |

## Steps (send in order; each waits for the previous ACCEPT)
| Step file | Slice | Depends on | Lines |
|---|---|---|---|
| `steps/step-00-skeleton.md` | Repo skeleton, lint/dep gates, `check:state`, `check:law` (one rAF exception file) | — | 400 |
| `steps/step-01-state-tables.md` | Shared + tactics flow + tactics input tables, `xGo`, rejected-edge no-op, untargeted `CHOOSE_ACTION` | 00 | 183 |
| `steps/step-02-clock.md` | One clock, integer sim ms (CN-001), game speed, sim timers, turn fuse | 00, 01 | 161 |
| `steps/step-03-grid-edges.md` | `{c,r}` grid from `CoreMap`, tile types, edge walls, blocking objects, forced-move checks, notices | 00 | 153 |
| `steps/step-04-units-occupancy.md` | Units, one occupancy table with a policy (`strict1`), `moveTo`/`push`/`remove`, landedOn/pushBlocked hooks, reach | 03 | 176 |
| `steps/step-05-rng.md` | mulberry32, named streams, save/restore, golden vectors | 00 | 154 |
| `steps/step-06-pipes.md` | UNIT and TILE only; edge targets = TILE + side; no target = no pipe; roster; `toCell` | 03, 04 | 153 |
| `steps/step-07-events-log.md` | Core events (DSK `CoreEventMap` incl. `actionLogged`; `LogSeq` 0 = none applied) with a mode registry; M4 actions; command log + header; unit-level replay | 02, 04, 05, 06 | 193 |
| `steps/step-08-project-reader.md` | Read-only project reader: map, stage, manifest, placements (structure only, `stage.seed` as-is); carries CN-005 | 03, 05 | 173 |
| `steps/step-09-sim-harness.md` | Headless world from the reader, M4 `submit` on the one clock, `SimSnapshot`, `replayTicks(n)`, headless `advance(ms)`, replay / restore by tick replay (drivers, AI hook, intents deferred) | 02, 03, 04, 05, 07, 08 | 174 |
| `steps/step-09b-match-drivers.md` | Phase driver (`runMatch`, tactics tables via `xGo`) and tick driver (`runTicks`), AI hook `proposeActions(world, side, budget)` (M6), turn fuse on the one clock (user ms or off; BTF 60000 is preset data), pluggable `VictoryRule`, `phases` in `SimSnapshot`, 50-seed matches | 01, 02, 09 | 208 |
| `steps/step-09c-input-sim-script.md` | Pure input layer `src/runtime/input` (5 M7 intents, touch-first gesture mapper; thresholds are options), intents → tactics events in `src/sim/intents.ts`, `npm run sim` 50-seed report, missing-battle-phase throw; carries CN-006 | 01, 09, 09b | 168 |
| `steps/step-10-fx-order.md` | Effect order rebuilt from the design docs (no BTF copy): `src/fx/order` reader with a notice per clamp/fill-in, timeline on the one clock (hit at `connect`), the ten effect-order project options and read limits as caller inputs, the BTF preset as data in `src/btf-adapters/src/fx-preset.ts` (none in `src/fx`); lane-label adapter; QA 09c second-down test; carries CN-007. §A rules 3, 8–18 → step 10b | 02, 09c | 250 |
| `steps/step-10b-fx-timeline.md` | The rest of the effect timeline as cue data (`planEffect`: spawn once, second motion, bounce in tap order ≤ 8, free-fire pierce, chain, yank, hit kinds; §A rules 3, 8, 10, 13–18) with `pierce_hit_timing` / `chain_order` / `reel_knock` acting on cues; holy-sword landing tile (`pickLanding`, 8 around by default, 4 sides as an option, CEO 2026-11-10); pierce flight a fixed 0.40 s split over the tiles (`per_tile` option) and an impact per body (`once_at_contact` option), CEO 2026-11-10, BTF flight in `src/btf-adapters`; fourteen new options (landing neighbours, landing across a seam, pierce flight and impact burst, CEO-ruled; ten PROPOSED silent-spot defaults). No CN. §A 9, 11, 12 → step 10c | 10 | 315 |
| `steps/step-10c-fx-look.md` | Drawing-side look ramps, release and seeded copies for the FX painter (`planLook`, `lookAt`, `copyAt`; §A rules 9, 11, 12); tunables as `FxLookTune` / `BTF_FX_LOOK` in `src/btf-adapters`; no new `FxOptions` keys; no CN | 10b | 229 |
| `steps/step-11-player-driver.md` | Chaos-player step A: the player driver `createPlayer` (09c intents in, one `submit` out; reported rejects, CEO Q3), seats in `runMatch` (touch, bot, chaos, later online peer), `onStep` after every input; test AI as intents gives the 50-seed histories byte for byte; no CN | 09b, 09c | 175 |
| `steps/step-12-chaos-harness.md` | Chaos-player step B: `runChaos` plays a match through the player driver only (every side seated, `ai` throws), runs the QA (a) checks `CHAOS_CHECKS` after every step plus an end-of-run log replay, returns one outline-§4 failure record (engine sha and Node required, hash is the caller's); `replayChaos` replays it in one call, no retry; report-only smoke on the two official boards in green; no CN | 11 | 199 |
| `steps/step-13-chaos-generators.md` | Chaos-player step C: `chaosIntents` is a seeded `IntentHook` on its own `streamSeed(world.seed, stream)` stream that draws one kind per hook call from the caller's weights (legal via the caller's bot, stall, off-grid, enemy or unknown ids, taken or closed cells, cancel spam, confirm with no action, box-select, and (a)10 gesture recipes through `createGestureMapper`); `runChaosGen` records the generator settings in `presets.chaosGen`; `shrinkChaos` is the simple shrink (ddmin over the moves, same invariant and same divergent key, candidates replayed by side and order through `runChaos`, no retry, the result replays); report-only generator smoke with shrink in green; no CN | 12 | 175 |

Later (outlines in `/workspace/tileengine/docs/core-spine-slices.md`): the FX painter rewrite; after chaos step C: the `chaos:replay` command and failure-records folder, nightly seeds, then the dev-side exploit hunter (`docs/chaos-player-outline.md` §6, §9).

**Verification:** step 00 was rebuilt from its file alone in a clean `/tmp` folder and is green (`pass 7`). Every interface quoted in steps 01–08 was prototyped on top of it and the prototype is green (all six gates); the golden RNG vectors, the clock worked example, the push/hook logs and the step-08 reader (108/0) come from that prototype. Step 09 was prototyped on top of `main` `193900d` (117/0); step 09b on top of `main` `92e4e96` (123/0); step 09c on top of `main` `7944f79` (132/0, `npm run sim` checked); step 10 on top of `main` `a499d98` (144/0; CN-007 depcruise line proven with planted imports); step 10b on top of `main` `2052df8` (157/0, `npm run sim` unchanged); step 10c on top of `main` `1565a0f` (161/0, `npm run sim` unchanged); step 11 on top of `main` `e9d4820` (166/0, `npm run sim` unchanged, 258 of 294 lines); step 12 on top of `main` `1ff51d9` (170/0, `npm run sim` unchanged, 258 of 280 lines; three engine plants each caught by the report-only smoke with a record that replays identically); step 13 on top of `main` `9dad92a` (176/0, `npm run sim` unchanged, 224 of 250 lines; step 12's three engine plants plus a late one each caught by the generator smoke and shrunk (2–12 moves → 2, 4–14 → 4, 24–42 → 24; a planted promise 116 → 2) to a record that replays identically; 40 generator, shrink and mapper plants each fail a named test).

## QA checklist coverage (`docs/qa/handback-checklist.md`)
| Checklist item | Covered by |
|---|---|
| §0.1–0.5 hand-back inputs | HAND-BACK.md table rows 1–5 and the `HANDBACK.md` shape |
| §1 clean checkout in `/workspace/qa-runs/<step>/`, fresh `npm ci` | Clone of branch `step/<step-id>-r<N>` from the repo (pushed by CoS from the bundle) + head commit in `HANDBACK.md`; every step's acceptance starts with `npm ci && npm run green` |
| G1 tests green, no skip/only/todo | BUILD_GUIDE §6 "green"; every step states the minimum pass count (step 00: `pass 7`) and greps for `.only/.skip/.todo` |
| G2 typecheck clean, no loosening | BUILD_GUIDE §6 and §7; tsconfig `skipLibCheck: false`; tsconfig is in every step's Do-not-touch |
| G3 xGo grep | `scripts/check-state.sh` (six patterns verbatim) via `npm run check:state`, in `npm run green`; every step's acceptance repeats it |
| G4 interfaces match quotes | Every step's "Interfaces to match (quoted exactly)"; state types quoted only from STATES §4; core types imported from core-types.ts (marked confirmed / PROPOSED) |
| G5 do-not-touch | Every step's "Do not touch" + BUILD_GUIDE §7; diffs `<base>..<head>` |
| G6 scope = file list | Every step's file list + an acceptance line comparing `git diff --name-status` to it |
| G7 size cap | Per-file limits + ≤ 400 changed lines per step (`stat.txt`, excluding lockfile and `handback/`) |
| G8 build law A–H | BUILD_GUIDE §2 + M1–M9; `check:law` (gates one-clock and one-frame-loop); ESLint has the same single-file rAF exception `src/runtime/host/raf-driver.ts` (step 00 test proves it); BTF paths banned; G/H runtime steps later |
| G9 Decisions note | HAND-BACK rules; steps 02–06 list what to name |
| G10 acceptance | Every acceptance line is a command or a checkable fact |
| §2 outcomes, rework, 3 rejects | HAND-BACK "Outcomes and rework" (`step/<step-id>-r<N+1>` branch, new PR, same base) |
| §2 Change Notice | CHANGE-NOTICE-TEMPLATE.md + `change-notices/`; CN-001 issued |
| §5.1 guide contents | BUILD_GUIDE §1–§9 |
| §5.2 six sections, 150–400 lines | STEP-TEMPLATE; steps 00–13 are 150–400 lines each (table above) |
| §5.3 one version of each signature | STATES §4 = the only `Phase`/`Event`/`xGo` quote; sim time = integer ms in GUIDE, STATES, ARCH §2.3 and step 02 (CN-001); one rAF path string |
| §5.4 step 0 = Grok Build's example + `check:state` | `steps/step-00-skeleton.md`; re-pinned core-types sha; green from a clean copy |
| §5.5 where hand-backs go and base commit | HAND-BACK "Where" + every step header (repo, base, branch, in-repo hand-back) |

## Decided by the CEO (2026-11-09, via CoS; were open CEO questions)
- **No frozen copy of BTF's effect-order file** (`chess/skillrig/spec.ts`, ~900 lines). The effect order is rebuilt from the design docs: `/workspace/tileengine/docs/effect-order-from-docs.md` (draft), and every spot where the docs are silent is flagged to CoS there.
- **Turn timer:** the BTF preset default is **60000 ms**, user-adjustable (any positive integer ms; step 02 `FuseMs`). Preset/project data, not core.
- **Bot opening formation:** the user picks one of three shapes, `unit-roster.opening_row` = `back` (default) / `second` / `front` (DSK: setup-format §12.4h, project-format §6.8 `openingFront`). Setup data, not core.

## Open with QA (still open after the kit-review fixes)
- §3A and §3C now match the kit (host driver `src/runtime/host/raf-driver.ts` owns the frame loop; BTF paths `/workspace/g-tile-engine` and `/workspace/towerchess*` both banned). Nothing open there.
- Step 10 no longer vendors BTF's effect-order file (CEO 2026-11-09), so it needs no `no-btf-path` allow-list. A helper vendored later under its own ruling would.
