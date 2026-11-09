# CN-001: sim time is integer milliseconds everywhere
Date: 2026-11-09   Raised by: QA (kit review 2026-11-09, finding B2); ruled by Chief Of Staff / Engine Architect
Old: ARCHITECTURE-v0 §2.3 — "`core/clock` is a pure scheduler: `advance(dtSeconds)` → fixed-step sim ticks (… timers counted in sim time or turns) …"; "Turn timers … are a `rules/turns` timer counted in sim seconds"; §8 rule 4 — "Timers count sim seconds or turns". BUILD_GUIDE law 1 and STATES §0.6 already said "integer milliseconds" / "sim milliseconds" (the two sources disagreed).
New: Sim time is **integer milliseconds everywhere, never seconds or floats.**
- `Clock.advance(dtMs: number): void` — `dtMs` is an integer ≥ 0; a non-integer or negative value throws `RangeError` (programming error). The host driver `src/runtime/host/raf-driver.ts` rounds its frame delta and carries the remainder.
- `Clock.after(ms, cb)` — `ms` is an integer ≥ 0 (same `RangeError`). `Clock.now()` = `tick() × stepMs`, an integer; `stepMs` (default 10) and `maxFrameMs` (default 100) are integers ≥ 1.
- Game speed (x1/x2/x3, `timeScale`) runs more fixed steps per host frame; it never changes `stepMs`, and the clock's accumulator stays an integer (quarter-ms).
- Every timer (turn fuse `FUSE_EXPIRE`, `BUILD_TIMER_EXPIRE`, match clock) is counted in integer sim ms on the one clock. Project knobs given in seconds (e.g. `turn_seconds`) are converted once by the project reader (step 08), never in the clock or a timer helper.
- **Turn fuse (scope added 2026-11-09, QA):** `FuseSetting = "off" | FuseMs`, where `FuseMs` is a positive integer of sim ms; `startFuse` does no unit conversion (no `* 1000`); a value that is not an integer or is `<= 0` throws `RangeError` `invalidValue:`. Any value is legal (user-adjustable, CEO); 30000 and 60000 are suggestions; the BTF preset default 60000 (CEO) is preset/project data, not core. Step 02 not yet issued, so no new CN.
- M4 actions: `durationMs` is an integer ≥ 0 or `null`.
- Render `alpha` is a float in [0, 1) for drawing only; it is never sim time.
Affected steps already done: none (no step has been sent to Grok Build).
Action: refactor, do not patch. Carried by `steps/step-02-clock.md` (Files: `src/core/clock/{types,clock,index}.ts`, `src/rules/turns/fuse.ts`; Tests: `tests/core/clock.test.ts` "integer ms only", "game speed runs more steps, same step size", `tests/rules/fuse.test.ts`). Step 07 applies it to `Action.durationMs` and log ticks.
Kit files updated: ARCHITECTURE-v0 §0, §2, §2.3, §2.4, §8 rule 4, changelog v0.6.2; BUILD_GUIDE §2 law 1; STATES §0.6; steps/step-02-clock.md; steps/step-07-events-log.md.
