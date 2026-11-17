# QA review: step-ed-e6-designer-page (kit-1 r2, proto r2)
QA & Build Guard, 2026-11-17 (GMT). Evidence: `docs/qa/qa-runs/effect-designer/e6/`. Repo clone fetch-only; only `refs/cmp/*` made; no push, no GitHub/Drive writes (rulesets read with `gh api` GET only).

## Verdict: **OK TO SEND with the QA pin adopted**, after the send gate clears (builder token)
r2 builds DSK D6 (`ed2e705f`) rulings 1–3 and my E6 notes correctly: gates green on the Base and on today's main, EA's 67 plants and my D6/risk plants caught or smoke-caught, probes PASS, browser smoke clean at 390×844. One must-fix (three missed plants: test gaps only, no code bug) is closed by the QA pin below, which the kit should carry as a third shipped test (floor 871 → 874). Four should-fixes, none blocking.

## Intake
- Bundle `step-ed-e6-proto-r2.bundle` sha256 `09d44a84c89c…2992`, verify ok, requires `6add89b6`.
  - Fetched to `refs/cmp/ede6-proto-r2` = `1323d34e3e7f1f7a4036dbf968fcca0394477410`, tree `9a15b7e6`, parent r1 `837855e4` → `6add89b6`.
  - Both commits author+committer `G-TileEngine <G-TileEngine@users.noreply.github.com>`.
- `6add89b6..1323d34e`: 10 files, +303/−3 = **306** (in 150–400, cap 334), as claimed.
  - Pinned files (package.json, lock, depcruise, check-law, core-types) and `src/runtime`, `src/core`: no diff.
  - No editor/tools import in `src/runtime` or `src/core`.
- Shipped tests byte-identical to the kit: `effect-e6-save.test.ts` `a57c08bd…`, `ed-e6.test.ts` `e74379a4…`.
- Kit: `push-sha256.txt` sha256 `8c4e9133…`; `sha256sum -c` from `tree/` → 10/10 OK (5 new, 5 modified):
  - doc `48c30d20`, paste `2af18928`, CN-028 `ddd3eefc`, CN-003 `f9f85c30`, BUILD_GUIDE `857a06a1`, HAND-BACK `f2907c1f`, STEP-TEMPLATE `c9dabf7b`, README `7067d712`.
- origin/main has moved to `5cb385ba` (B1 merge + docs).
  - Trial merges onto it are clean (`git merge-tree`, no overlap with E6 paths).

## Gates (sequential; `pgrep` clear before each; P1-2's run waited out)
| Ref | Main | Floor | Tests | Result |
|---|---|---|---|---|
| proto `1323d34e` | `6add89b6` | 871 | 871/0 (main 858) | **PASS** (deps 117/375) — `gates-r2.log` |
| trial `021903a0` = r2 onto `5cb385ba` | `5cb385ba` | 887 | 887/0 (main 874) | **PASS** (deps 123/393) — `gates-r2-on-main.log` |
| trial `1354a32f` = r2 + QA pin onto `5cb385ba` | `5cb385ba` | 890 | 890/0 | **PASS** — `gates-pin-on-main.log` |

Typecheck, lint, state, law, smoke PASS on all three; sim/stress SAME as main, no p95 flake. r1's stopped run stays in `gates-proto.log` (partial, held).

## Plants (in place on `/workspace/cmp/ede6-R2`; caught iff E5 + E6 tests fail) — `plants-r2.log`
- **EA `ede6-plants-r2.py`: 67/67** (matches EA).
- **QA D6 `qa-ede6-plants-d6.py`: 9/12.** D3 (no-rev file reads as absent) is an equivalent mutant (every `revOf` use has `?? 0`).
  - D6 (page path not under `effects/`) and D8 (`fx_` id) are page glue: `saveAndUse` refuses them (`invalidValue`, nothing written); the smoke catches D6.
- **QA risk `qa-ede6-plants-risk.py`: 11/20 → 14/20 with the pin** (`plants-pin-recheck.log`).
  - Caught: cross-doc stale (R1), newest-doc-only undo (R2), S8 regroup (R3), notes code (R5), id error code (R6), rollback order/empty-vs-remove/failing-op (R7–R9), created doc kept (R19), Undo uncaught (R20).
  - Missed, fixed by the pin: **R4** no-op subset compare, **R12** new-effect history cap 200 → 100000, **R18** a preset over the Fit sparks cap.
  - Missed, page-only, **caught by the smoke** (`smoke-mutants.log`): R10 (undone file never purged: `.deleted` file left after the 2nd save), R14 (9-char ULID time: Save refused), R16 (old driver not disposed: 2–6 callbacks/frame), R17 (grid ignores the intent chip: 7 tiles).
  - Missed, not caught: R11 (purge failure aborts the toast; by design the purge is best-effort), R15 (mint with zero randomness; only `taken` guards it) → S3.
- Probe `e6-probe.ts` (`probe-r2.log`): **PROBE PASS 32/32**
  - D6-3 for rev 3, `{}`, junk, `null`, `[]`, `0`, `"x"` × absent/null expected → `staleRev`, file untouched
  - D6-1 refuses label name, no dir, `fx_`, 25 chars, `I`, reused id
  - D6-2 undo moves to `effects/.deleted/<id>.json` with history, owner drops the id, a repeat undo is `staleRev`
  - rollback at **every** failure point of Save (2 ops) and Undo (3 ops, incl. the `.deleted` write and the source remove) rethrows and leaves the files byte-identical.

## Browser smoke (`smoke.mjs`, Chrome 156 headless, 390×844 DPR 3, touch) — `smoke-r2.log`, `smoke-r2.png`
- `?for=basic-attack&kind=melee` opens with 1 tile (Slash arc); the strip paints (390×253, 98 670 px).
- **rAF: one loop** — max 1 callback per frame, 0 frames with >1, both at first boot and after Turn, 1×, 2×, 3×, Turn re-boots.
- Save & use → toast "Saved 'Slash arc' and basic-attack uses it. One undo." and OPFS `setups/basic-attack.json` + `effects/setup_01M7KNW5….json` (valid ULID).
- Undo → "Undone."; OPFS: the effect is now `effects/.deleted/setup_01M7KNW5….json`, owner kept.
- 2nd Save & use → new id; the `.deleted` file is **purged** (ruling 13).
- **18 buttons, min 48×48 CSS px; none under 44.** **Page errors: none.** Console: one 404 (favicon, not a page request).
- Bad owner file (written into OPFS, then Save & use):
  - junk and `null` → "Not saved: … Nothing was changed.", files unchanged.
  - a JSON **array** → saved over (S1).

## EA's question: is a quoted browser smoke enough for E6? **Yes — and it is required, not optional.**
Four of my page plants (R10, R14, R16, R17) and D6 are caught only by the smoke, so the hand-back must quote the smoke lines for: tile count, rAF max callbacks/frame after a re-boot, the OPFS listing after Save, Undo and a 2nd Save, button sizes and page errors. E7 turns it into an automated check (`smoke.mjs` is a ready base).

## Findings
**Must-fix**
- **M1 (closed by the QA pin).** Plants R4, R12, R18 missed (G1). Pin `refs/cmp/ede6-qa-fix-a` = `3ef0e6efdd6191e80c314b1425e4bfd30161978d` on `1323d34e`: adds `tests/editor/effect-e6-qa.test.ts` (21 lines, sha256 `738e46f5…a139`; noreply; typecheck/lint clean):
  - the new-effect history is `{cap: 200 = WRITER.cap, baseSeq: 0, ops: []}`
  - every preset passes `fit(…, {preset: true})` with no message and ≤ 3 steps
  - a stored `{source: "user"}` without `value` plus a write is a change.
  - Bundle `/workspace/share/ede6-qa-fix-a.bundle` (`1323d34e..3ef0e6ef`) sha256 `eea8cb236882b53fc5b9b239f3a45c6022d5bb67b325c975b80524f3fb541dff`.
  - Ask: ship it as the step's third kit test (floor 871 → 874; 890 on `5cb385ba`).

**Should-fix**
- **S1** An owner file holding a JSON array (or `{}`) is overwritten on Save & use by a doc with no `kind`/`formatVersion`/`id`/`behaviourId` (smoke; `probe-array-owner.ts`).
  - Fix: refuse a non-record owner or one without an envelope (`invalidValue` toast, nothing written).
  - Junk/`null` owners are refused, but the toast says "storage error"; say "can't read <file>".
  - A non-number owner `rev` becomes `NaN` in `readDoc` and stays `staleRev`.
- **S2** Trash survives a reload: `trash` is page memory, so after Undo + reload the `.deleted` file is never purged (ruling 13's one-entry window).
  - Purge `effects/.deleted/` on load, or carry it to E7 with the Undo/Redo bar.
- **S3** The ULID mint lives in DOM glue (`page.ts`), so no Node test sees its format or randomness (R15). Move it to a DOM-free module with a test (E7 carry is fine).
- **S4 (process, CEO setting)** Ruleset `27424037` has `require_last_push_approval: false` and allows `squash`/`rebase`.
  - Set it to `true` (the last pusher's approval never counts) and allow `merge` only (keeps `--no-ff` for any UI merge).

**Report-only**
- Redo (restore from `.deleted`) is E7 by the step doc (§ Not in this step); E6's toast offers Undo only.
- `Date.now`/`crypto`/`new Date()` are in `tools/` (host role, ruling 2), not `src/`.
- Scope: `tools/` 120 lines (grid 20, presets 12, strip 19, store 15 Node-tested; page 48, html 6 glue) all map to scope L132 — in scope.

## Process docs (CN-028), updated for r2
- Still consistent across CN-028, CN-003 header, BUILD_GUIDE §8 L119, HAND-BACK, STEP-TEMPLATE and handoff/README: one builder (ChatA), one QA review, rework on `-r<N+1>-chatA`; push that one branch only; CoS opens the PR.
- Kept: noreply identity, §0.6 helpers (REJECT if missing), gates, gh-pages behind RaiKynn's typed OK **naming the commit** (P-S2 done), builder pastes through the CEO.
- README L9 "Issued" list now up to date (CN-023–025 reserved).
- **Rulesets** (read ~02:05 GMT; all `active`, only bypass = admin role, actor 5):
  - `27424037` main + gh-pages: PR with 1 approval, stale approvals dismissed on push, no force-push, no deletion.
  - `27424039` `step/**`: no force-push, no deletion.
  - `27424042` tags (`~ALL`): no create, update or delete.
- **P-M1: closed**, given the token as specified: a direct push to main is blocked; a merge needs an approval the token can't give (no Pull requests permission), and a push after approval dismisses it.
  - Residual → S4.
- **P-S1: closed** (step branches can't be rewritten or deleted; no tags).
  - Report-only: a write collaborator can still create a non-`step/` branch; only the paste rule stops it.
- **Send gate: kept.** CN-028 and step doc L14/L20 say the builder token is outstanding (separate write-only collaborator account, never `G-TileEngine` or an admin; Contents read/write only) and the step stays held until it exists; the builder never sees the token.
- The repo is public, so the branch push is public: the CEO SEND is that gate.
