# Step 16 lean review (door guard: fix B1–B4 — shape guard at the one door, safe `wrong kind`, caller-set stage limits, finite weights)

**Date:** 2026-11-11 22:24 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-16-door-guard.md` sha256 `e3f400764eeb835caf5a156abc21ca662a3f43c5b5ae00706f10f00e7486a7b7` (153 lines)
**Backup of this sha:** `/workspace/qa-runs/s16-review/step-16-e3f40076.md`
**Base:** `adce77478e54ae4b38274e5f38f3ef3588e9c0c1` — confirmed `origin/main` (PR #20 merge of step 15; parents `e5241e2` and `c1e8665`, as EA described). Clone was fetch-only and left at local `e5241e2` (`behind 3`); working tree not checked out or edited.
**CN:** none, as claimed. `PlayerReject` lives only in `src/sim/types.ts`; no pinned file lists the reasons. `src/btf-adapters` gains one data file importing a `src/project/read` type (allowed, same pattern as `fx-preset.ts`). Pins hold: core-types `f00c722c…`, depcruise `dcf61c61…`, `package.json` `1e5dd82c…`, lock `d7f64a09…` identical to Base. GUIDE sha256 `c27e1292…` (unchanged).
**Kit docs:** README sha256 `a156a2fc970c6ea622758ff7e7fd7edce85e91394bb5156cf0f472507252ec7a`; core-spine sha256 `551bd7095fe0f0183ace19ca7eae193665f8b500097c9c2bb34e48426784e3e7` (found under `/workspace/tileengine/`, not yet on `origin/main`). Both still describe a pre-merge / r1 world — required bumps below. Outline sha unchanged from step 15; its stale §9 line is flagged in the step file and not edited here.
**Prototype:** already at `/workspace/qa-runs/s16-review/proto` (HEAD `72b4e5f193537c930c96fe3afffd49a7843bd414`, parent `adce774`, branch `s16-r2`). Greps / plants scripts were already copied there; a plants runner was retargeted off `/tmp` (`s16-plants-r2-run.sh` calls `s16-greps.sh`). `/tmp` was not edited.
**Remotes:** read-only. Existing `refs/cmp/*` and earlier qa-runs trees were not edited. GitHub and Drive were not touched.
**(a)9 file:** `docs/qa/chaos-player-invariants.md` gained `malformed` in this review (QA-owned). Pre-edit backup: `qa-runs/s16-review/chaos-player-invariants.md.pre-s16` sha256 `69c30fc30d92e1939eac6c40c1669a3ed6d1a4140de4feb7696a04aee738bb47`. New sha256 `6871558d6e6945a7ef41464949d9499cdff9dc75372155caf62980720d5b3b9e`.

## Result

The step file `e3f40076…` (153 lines) and proto `72b4e5f` **pass** every technical check. Green is **198/0**, sim is unchanged, G7 is 168+/56− = **224** of 235 (every file has at least 4 lines of slack), pins hold, greps **45/45**, plants **24/24** test and **12/12** grep, B1–B4 are actually fixed (independent repros against the proto), the six smoke lines are pinned with `assert.equal`, flip to `failed 0` / `findings 0` with empty buckets, and print each failure with its run. L77 holds: no new RNG draws in the diff. No CN miss, no build-law miss, no scope creep (exactly the 21 named files; DNT empty). The three ports onto B’s helpers are present as described.

**Not OK TO SEND until README and core-spine are refreshed.** Those two files (the shas EA named) still say step 15’s code merge is pending, step 16’s Base is PROVISIONAL, the step-16 row is **151** lines, and Verification still cites proto `3099a16` / **212** of 235. The step file already pins Base `adce774` and proto r2 `72b4e5f` at 224 of 235. Exact bumps are below. No step-file or proto fixes.

---

## Fixes required before send (kit docs only)

1. **README status** (opening paragraph): 00–15 merged at `adce774` (PR #20, parents `e5241e2` + `c1e8665`). Step 16 written, Base `adce774`. Drop “code merge pending” and “Base PROVISIONAL (the step-15 merge, pinned on verify)”.
2. **README step-16 table row:** **153** lines (not 151); Base `adce774` (not “Base PROVISIONAL (step-15 merge)”).
3. **README Verification:** step 16 on proto r2 `72b4e5f` on `adce774`, **224** of 235 (not “on top of the step-15 prototype `3099a16`” / 212 of 235).
4. **core-spine** (`551bd709`): the same status refresh in the header, the 2026-11-10 update blurb, and line 9; mark step 15 merged at `adce774`; step 16 Base `adce774` and size **~224** (not ~212 / PROVISIONAL).

The outline’s stale §9 line (the first exploit slice “comes once the first save/import format and the first reward/currency events exist”) is still stale — step 15 already shipped forged intents and tampered official docs. The step file correctly defers editing `docs/chaos-player-outline.md` (“proposed in the Architect’s report, not edited here”). Same residual as the step-15 review; not a send-block for this kit.

---

## 1. Shas / line counts / Base / kit — PASS (step file); docs stale

| Check | Result |
|---|---|
| Step sha / lines | `e3f40076…`, **153** lines, matches EA |
| Base / merge | `adce774` is `origin/main` (PR #20, parents `e5241e2` + `c1e8665`) |
| Pins | core-types `f00c722c…`, depcruise `dcf61c61…`, `package.json` `1e5dd82c…`, lock unchanged, all identical to Base |
| CN | none, as claimed |
| Kit shas | README `a156a2fc…`, core-spine `551bd709…`, as claimed — content is pre-merge / r1 (fixes above) |

---

## 2. Prototype `72b4e5f` — PASS (green, caps, quotes, greps, plants)

On the existing copy `qa-runs/s16-review/proto`, Node v24.22.1. `node_modules` came with the copy; lock matches Base. Greps were run with base argument `adce774` (the script default `3099a16` is stale, as EA said).

| Check | Result |
|---|---|
| `npm run green` | exit 0; **198/0/0/0**; tsc / lint / deps (66 modules, 196 deps) / check:state / check:law OK. Log: `qa-runs/s16-review/proto-green.log` |
| `npm run sim` | unchanged `48/2 afc89d56…` / `22/28 b8007292…` |
| Existing smokes | gen 1730/278 and 3154/563; chaos 3120 and 5542; all `failed 0` — match Base |
| Exploit smokes | all six lines **byte-for-byte** as in the kit, and **asserted**: fixed all-kinds 1604/309, no-shape 1617/367; weighted all-kinds 2043/480, no-shape 2299/592; all `failed 0` / `buckets []`. Docs: 581/1419 and 607/1393, findings 0. Each failure / finding is printed with `t.diagnostic(JSON.stringify(…))` including the run, and must replay |
| huntDocs-500 | accepted 157 / refused 343 / findings `[]`; with limits `2e9` the two `(e)9 stage enemyPool.picks` findings return and replay |
| G7 `adce774..HEAD` excl. handback/lock | **21 files, 168+/56− = 224** ≤ 235. name-status is exactly the 21 kit files (`A` for the three created). DNT empty. Every file has ≥ 4 lines of slack (exploit-docs.test.ts cap is 34, as on step-file line 37) |
| Types / interface quotes | **verbatim** vs the kit (`StageLimits`, `readStage` signature, `BTF_STAGE_LIMITS` plus its comment, the index exports, `PlayerReject` seven reasons, `SimInput.stageLimits` after `chosen`, `DocCaps.limits`, `isObj`, the `malformed` comment and signature) |
| Greps | **45/45 ALL OK** (saved `s16-greps.sh`, base `adce774`) |
| Kit plants | **24/24** test plants fail a named test; **12/12** grep plants caught. Tree restored clean at `72b4e5f` |
| Build law | one clock / no `Date` / `Math.random` / rAF in the src diff; UNIT/TILE pipes only; no chess / vendor trees; door still names no player kind; one `submit(` in `player.ts`; `src/sim` does not import `btf-adapters`; no cap literals in `src/project` or `src/sim`; rules words also over `stage.ts` and `stage-limits.ts` |
| Draw order (L77) | **holds.** `exploit.ts` is untouched; `exploit-docs.ts` only changes `readStage(doc)` to `readStage(doc, caps.limits)`. The src diff adds no `rng` / `streamSeed` / `.next(` / `Math.random` calls. The only `streamSeed` hits in the whole diff are pre-existing comments or test helpers (`types.ts` comment, `placements.test.ts`, `world.test.ts`). Runs that used to stop at a B1 throw now keep drawing in the base order |

The three ports onto B’s helpers are in the proto: the kinds `tag` is `String((step.intent as { type?: unknown } | null)?.type)`; the `"exploit-b"` check compares whole reports (findings are now both `[]`); each smoke is one `t.diagnostic(line); assert.equal(…)` line (two `t.diagnostic(` lines per file) and prints each failure with its run. That closes the step-15 residual.

---

## 3. B1–B4 actually fixed — PASS

Re-ran the step-15 repros (adapted copy at `qa-runs/s16-review/repro/b1-b4-proto.ts`, required `StageLimits` passed, placement loops skipped if a reader ever accepted an over-cap doc; `/tmp` originals and the s15 scripts were not edited). Against proto `72b4e5f`:

| Bug | On `08274d7` (step-15 review) | On proto `72b4e5f` |
|---|---|---|
| B1 malformed wire (`null` input, `7`, `"SelectUnit"`, `{}`, `intent: null` / `[]`, `TargetCell` missing `at` or `at: null`, seed-8 archer then `at: null`) | `TypeError` out of `runMatch` | **no throw**; first hostile step is reject `"malformed"` |
| B2 hostile `kind` `{toString:1,valueOf:1}` | `TypeError` in every reader / `createWorld` | readers return `{ ok: false, error: "wrong kind object" }`; `createWorld` throws `Error: stage: wrong kind object` (named, not a `String()` crash) |
| B3 `picks=1e9` / waves `count=1e9` | reader accepted; hang / OOM path with `allowRepeats` or huge wave counts | both **refused** `{ ok: false, error: "bad field enemyPool" }`; `createWorld` throws `Error: stage: bad field enemyPool`; no placement call, no hang. `picks=144` at the BTF cap is accepted |
| B4 weight `1e400` (`Infinity` after `JSON.parse`) | accepted | **refused** `{ ok: false, error: "bad field enemyPool" }` |

---

## 4. Notes (not send-blocks)

- `BTF_STAGE_LIMITS = { picks: 144, waveUnits: 144 }` is **PROPOSED, pending CEO**, as the step file says.
- The CEO’s 25-clean-runs count can start once this step lands: the six lines are now pinned and clean. The blocking switch stays deferred (QA vets each block first).
- QA has added `malformed` to (a)9 in `docs/qa/chaos-player-invariants.md` (backup and new sha above). The outline is left to EA, as the step file asks.
