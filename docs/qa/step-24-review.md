# Step 24 early review (H3, trusted saves)

Work stopped mid-review: EA is reworking `h3` after DSK flagged CN-009. Independent green/sim, greps, plants and tamper probes were not finished. Copies and scripts remain under `/workspace/tileengine-repo/qa-runs/s24-review/` for reuse on the next commit. `/tmp`, `main` (`219959a`) and `refs/cmp/*` were not touched.

## r0 findings (superseded proto)

**Date:** 2026-11-12 21:13 Europe/London (GMT)
**Proto (superseded):** `f6c78db` on `219959a` (tree `310334cd`). Kit then: step-24 `c646f645` (185 lines), README `23ab76ae`, spine `abe0aa09`, effects-v2-plan `f3d89809`. CN-009 `/tmp/h3-cn.md` (copied); DSK sign-off was still pending.

Verified on the tree, not a verdict:

- **CN-009 matches the real diff exactly:** four additive lines after the command-log header comment (the `MatchSave` type); nothing removed or reworded. Pin `f00c722c…` → `afb69587…` (full sha as in the CN). `tests/smoke.test.ts` is the only other pin edit. `package.json` / depcruise / check-law / lock unchanged. No `data/core-types.ts` change (DSK's copy, as the CN says).
- **G7:** 135 changed lines in 15 files vs `219959a` (118 insertions + 17 deletions), cap sum 195, each file exactly 4 under. File list matches the step.
- **Signing** is out of scope in the step (“no signature”; “Host, not engine”). Builders are not asked to invent a hash.
- **H2c carries 1 and 2 look closed in code:** `BTF_SPRITE_RECIPE_LIMITS` totals come from `RECIPE_CAPS.<key>[0]`; `BTF_STAGE_LIMITS.stages` from `DEFAULT_DOC_LIMITS.stages`. `historyBytes` ceiling is 1,048,576, under the 2 MiB `bytes` default, so an over-cap `historyBytes` can fire. The BTF stage comment is marked CEO-approved.
- **Still named H4** in the step: `restore` uses default `stepMs`, a save-text cap, the ~17× short-key heap, and a consistent-but-live direct reader. **`setOffset` / `feedIntent` / `units.get` live intent** remain on the spine’s step-20 H4 list but are not restated in the step-24 H4 list (the spine’s step-24 row also omits them and instead names “A’s SE-01 C2 test gap”).
- **Earlier-plant claims (from EA’s logs + typography, not rerun to completion):** s23 SE2 is `PARTIAL` (named s23 C2 test did not fail; SE-01’s own `parts[n].mirror` tests did) — consistent with a test gap, not a proven regression. s22 R4 is `PARTIAL` because it now fails the s23 door-copy test, as claimed.

No must-fix was confirmed. Save/replay tamper, freeze depth, hostile readers, one-source default flow, and zero-tick-on-mismatch probes were not completed on this commit.

## r2 — proto `c27d2e2` (CN-009 r2)

**Date:** 2026-11-12 21:32 Europe/London (GMT)
**Verdict: HOLD**
**Proto:** `c27d2e2` on `219959a` (branch `h3`; copies under `qa-runs/s24-review/r2/`, from `/tmp/h2-proto` and fresh clone `/tmp/h3-fresh`). Kit: step-24 `6fb058fa` (233 lines), README `716989f6`, spine `1d1afcad`. CN-009 r2 (DRAFT, DSK re-sign pending). `/tmp`, `main` (`219959a`) and `refs/cmp/*` were not touched. Reusable probes: `qa-runs/s24-review/r2/probes/` (`h3-probes.ts`, `h3-hooks.ts` + `run-hooks.sh`, `h3-btf-flow.ts`).

### Gates (independent, on the r2 copy)

- **512/0**, checks clean (depcruise 82 modules / 255 deps; check:state / check:law OK). Base `219959a` is 504/0; the +8 are the new trusted-saves tests.
- **Sims identical** to `219959a`: 48/2 `afc89d56`, 22/28 `b8007292`. The 20 pinned smokes match an independent `219959a` green.
- **Pins:** only `core-types` moved, `f00c722c` → `61fad786` (full sha as in CN-009 r2). `package.json` `1e5dd82c`, depcruise `45a3dbaa`, check-law `4d7bbf48`, lock `d7f64a09` unchanged. CN-009 r2 matches the real diff exactly: five add-only lines after the command-log header comment (`SaveHeader` and `MatchSave`); nothing removed or reworded; `tests/smoke.test.ts` is the only other pin edit. No `data/core-types.ts` change (DSK's copy, at re-sign-off).
- **G7:** 190 changed lines in 16 files vs `219959a` (173 insertions + 17 deletions), cap sum 254, each file exactly 4 under. New file `src/sim/migrations/save/index.ts` (9/13).
- **Greps 30/30**, **gp 24/24**, **plants 25/25** — all new plants CAUGHT: SV1–4, OP1–4, HE1, MG1–3, RP1 (and the rest of the step-24 set).
- **Earlier plants are test gaps, not regressions.** s23 **29/30**: SE2 is `PARTIAL` — the named s23 C2 test did not fail; SE-01's own `parts[n].mirror` / sample-reads-clean tests did. `fields.ts` is unchanged from `219959a`. Spine step-24 already names “A’s SE-01 C2 test gap” as staying H4. s22 **28/29**: R4 is `PARTIAL` because the plant now fails `the door copy (step 23)` — a home-test shift from the s23 clamp, not a regression. R4b still CAUGHT.

### Probes

- **Zero-tick:** every listed refusal (kind / not JSON / non-integer version, `saveFormatNewer`, `saveFormatOlder`, engine, project, and header disagreement — including with an engine opt-in) does **zero** `createWorld` and **zero** `replayTicks`, proved with spies on an instrumented clone. A good load does call both. Seed tamper is not in that list: it is a named `replay: world seed …` after `createWorld`, with no ticks applied.
- **Header disagreement** (`load: the log header is not the save header`) is refused as edited. No opt-in resumes it. Zero world work.
- **Tamper reach:** flipping `header.engineVersion` / `header.projectHash`, reorder / duplicate / huge seq, truncate, toJSON (never called), cycles and proxies as text, all give a named door refusal (`the log header is not the save header`, `load: bad entry`, `load: not JSON`, `load: not a match save`) and never throw past the door. Snapshot edits: named `restore: snapshot does not match the log`. Insert / delete of a well-formed entry also hit that restore check (`logSeq`) and do zero world work. `__proto__` / `constructor` keys are ignored and the save still loads.
- **Opt-ins:** a project or engine mismatch is accepted only with the boolean `true` for that field; each covers only its own mismatch. A string `'true'`, `1`, `'yes'`, `null`, `undefined`, or a proxy whose get is `true` is not a yes. A non-plain or throwing opts object is `load: input is not plain data`. An enumerable getter that yields `true` is copied to a real boolean and does resume — the door copy, not a proxy yes.
- **Deep freeze:** `entries()`, each entry, `action`, `effects`, `target`, and the header are frozen; mutation of those fields throws `TypeError`.
- **Hostile direct readers:** throwing / revoked proxies return `unreadable document` and never throw. Cycles, throwing getters, `toJSON`, and a `2^53+1` length liar return a named refusal (`unreadable document`, `bad field`, `wrong kind`, or `over cap`) and never throw. Bad limits still throw their RangeError first.
- **BTF defaults** come from one source at import (`RECIPE_CAPS[k][0]`, `DEFAULT_DOC_LIMITS.stages`). A throwaway source-edit (totals default `111`, stages default `777`) flows through to the BTF adapters.
- **`historyBytes` 1 MiB ceiling fires on its own:** a history of 1,048,615 bytes under the 2 MiB `bytes` default is `ok` with notice `overCap history` (and not over cap `bytes`).
- **H4 list** in this step now includes the F4 size note (a 2,048-entry log with capped text is about 2× the 1 MiB sync envelope; a save-text cap belongs to H4) and the live-intent carry (`setOffset`, `feedIntent`, `units.get` return the live record). Signing remains host, not engine. `replay` does not refuse another project's log.

### Must-fix

The `migrations/save` hook is not contained, and a hook result is not re-checked.

1. **A throwing or hostile hook escapes `loadSave`.** With `SAVE_MIGRATIONS["match-save"][0]` patched to throw (or to return a proxy that throws on read), `loadSave` of a `formatVersion: 0` save surfaces the raw `Error` (`hook boom` / `proxy hook`). There is no try/catch around `migrateSave`. A non-plain hook return (`5`) is only later refused as `load: not a match save` (a throw, not a typed refusal).
2. **A hook that returns a still-old document is accepted as a successful v1 load.** A step that returns `{ ...doc, formatVersion: 0 }` yields `OK notices=[]`. After a non-null hook result, `loadSave` does not re-check `formatVersion`. An honest upgrade that sets `formatVersion: 1` does load correctly.

Chains are empty at v1, so a shipped file does not hit a hook today. The hook and the older-format path are part of this step; a first registered step that throws or returns the same document is a door leak (silent success in the still-old case). Contain the hook (typed refusal, not a raw throw) and refuse a result that is not a plain match-save at format 1.

### Carry (not HOLD)

- Flipping save `header.projectId` or `header.savedAt` still loads. Agreement is only on `engineVersion` and `projectHash`, as the kit states. Host metadata is unchecked; signing stays out of scope.
- Enumerable getter opt-in is the door-copy case above, not a proxy yes.
- Reader cycles may name `bad field` / `wrong kind` rather than `unreadable document`; they do not throw (official test is `doesNotThrow`).
- DSK re-sign of CN-009 r2 is still pending (process, not a proto reject).
- SE2 C2 test gap and the ~17× short-key heap / default `stepMs` / consistent-but-live reader remain H4, as named.

H2c carries 1 and 2 are closed in this commit (one source, and `historyBytes` can fire). Live intent is now on the step-24 H4 list (closes the r0 note).

## r3 — proto `7aa021d` (hook containment)

**Date:** 2026-11-12 21:51 Europe/London (GMT)
**Verdict: OK TO SEND**
**Proto:** `7aa021d` on `219959a` (branch `h3r3`; copies under `/workspace/tileengine/qa-runs/s24-review/r3/` and `/workspace/tileengine-repo/qa-runs/s24-review/r3/`, from `/tmp/h3r3-fresh` and `/tmp/h2-proto`). Imported as `refs/cmp/s24-proto-r3` (and `refs/cmp/s24-proto-r2` = `c27d2e2` for the delta only; no existing `refs/cmp/*` overwritten). Kit: step-24 `74289ef4` (252 lines), README `178280cb`, spine `8fc33096`. `/tmp` and `main` (`219959a`) were not modified. Re-anchored hook probes: `qa-runs/s24-review/r3/probes/h3-hooks-r3.ts` (4th-argument registry injection on an instrumented `clone-hooks`; spies on `createWorld` / `replayTicks`). EA's `/tmp/r3-qa` runner was copied for reference and not relied on.

The r2 must-fix is closed. `loadSave` wraps `migrateSave` in try/catch, plain-copies the result, and re-checks `kind === "match-save"` and `formatVersion === SAVE_FORMAT`. Anything else is `{ ok: false, code: "saveMigrationFailed", needsMigration: true }`. A non-object step throws inside `migrateSave` and is caught as the same refusal. The optional 4th argument defaults to the frozen `SAVE_MIGRATIONS`.

### Gates (independent, on the r3 copy)

- **513/0**, checks clean (depcruise 82 modules / 255 deps; typecheck / lint / check:state / check:law OK). Base `219959a` is 504/0; r2 was 512/0; the +1 is the new "the migrations hook is contained (step 24)" test.
- **Sims identical** to `219959a` and to r2: 48/2 `afc89d56`, 22/28 `b8007292`. The 20 pinned smoke payloads match the independent `219959a` green (exploit-docs 516/1484 and 547/1453 included). Only the report-only heap-smoke MiB figures move, as usual.
- **Pins:** only `core-types` moved vs main, `f00c722c` → `61fad786` (full sha as in CN-009 r2; unchanged from r2). `package.json` `1e5dd82c`, depcruise `45a3dbaa`, check-law `4d7bbf48`, lock `d7f64a09` unchanged.
- **G7:** 208 changed lines in 16 files vs `219959a` (191 insertions + 17 deletions), cap sum 272, each file exactly 4 under. File list matches the step (`A` for `src/sim/migrations/save/index.ts` and `tests/sim/trusted-saves.test.ts`).

  | file | changed | cap |
  | --- | ---: | ---: |
  | `src/btf-adapters/src/sprite-recipe-limits.ts` | 4 | 8 |
  | `src/btf-adapters/src/stage-limits.ts` | 6 | 10 |
  | `src/core/log/log.ts` | 4 | 8 |
  | `src/paint/recipe/index.ts` | 2 | 6 |
  | `src/paint/recipe/limits.ts` | 2 | 6 |
  | `src/project/read/guard.ts` | 4 | 8 |
  | `src/project/read/manifest.ts` | 5 | 9 |
  | `src/project/read/map.ts` | 5 | 9 |
  | `src/project/read/stage.ts` | 5 | 9 |
  | `src/sim/index.ts` | 3 | 7 |
  | `src/sim/migrations/save/index.ts` | 11 | 15 |
  | `src/sim/run.ts` | 53 | 57 |
  | `src/types/core-types.ts` | 5 | 9 |
  | `tests/sim/recipe-caps.test.ts` | 2 | 6 |
  | `tests/sim/trusted-saves.test.ts` | 95 | 99 |
  | `tests/smoke.test.ts` | 2 | 6 |

- **Greps 32/32**, **gp 26/26** (K25 and K26 new, both CAUGHT), **plants 32/32** — HK1–HK7 all CAUGHT on "the migrations hook is contained (step 24)".
- **Earlier plants unchanged.** s23 **29/30**: SE2 is `PARTIAL` — the named s23 C2 test did not fail; SE-01's own `parts[n].mirror` / sample-reads-clean tests did (test gap, already carried to step 25). s22 **28/29**: R4 is `PARTIAL` because the plant now fails `the door copy (step 23)` — a home-test shift from the s23 clamp, not a regression. R4b still CAUGHT.

### Delta `c27d2e2`..`7aa021d`

Four files only: `src/sim/run.ts` (+11/−5), `src/sim/migrations/save/index.ts` (+5/−3), `src/sim/index.ts` (+1/−1, exports `SAVE_FORMAT` / `SaveChains`), `tests/sim/trusted-saves.test.ts` (+11/−1, the contained-hook test). No scope creep. Kit updates outside the proto commit name the containment, `saveMigrationFailed`, and both r2 carries.

### Hook probes (4th-argument injection; not EA's file-patch runner)

Every listed hostile case returns `{ ok: false, code: "saveMigrationFailed", needsMigration: true }`, never throws past the door, and does **zero** `createWorld` and **zero** `replayTicks` (spies on the instrumented clone, reset after the fixture world is built):

- a throwing hook
- a hostile proxy hook
- a hostile enumerable getter hook
- a still-old result (`formatVersion: 0`)
- a non-object result (`5`, `null`, `"x"`)
- the wrong kind (`kind: "save"` at `SAVE_FORMAT`)
- a `formatVersion` higher than `SAVE_FORMAT`

The honest upgrade (`formatVersion: SAVE_FORMAT`) loads (`OK notices=[]`) and does world work (`createWorld` 1, `replayTicks` 2). Injecting only the `save` chain leaves a v0 match-save as `saveFormatOlder` (the chains stay apart). The default registry is frozen `SAVE_MIGRATIONS` (outer object and both chain objects); assignment throws `TypeError`; a v0 load with no 4th argument is `saveFormatOlder` with zero ticks.

A `__proto__` or `constructor` key on an otherwise-honest upgrade is dropped by `plainCopy` (`SKIP` in `src/core/plain.ts:5`). The save then loads to the same snapshot; nothing is thrown past the door; no pollution leaks onto the world. That matches r2 tamper reach (`__proto__` / `constructor` keys are ignored and the save still loads) and the step's "plain-copied and re-checked" rule. It is not a containment miss.

### Carries and kit

Both r2 carries are named in the step file:

- `header.projectId` / `header.savedAt` flip still loads (agreement is only on `engineVersion` and `projectHash`) → the online step (`step-24-trusted-saves.md:246`).
- A direct reader on a cyclic document may give a generic reason (`bad field` / `wrong kind` / `unreadable document`), never a throw → step 25 (`step-24-trusted-saves.md:247`).

Quoted interfaces in the step match the code (`loadSave` 4th argument, `SaveChains`, `SAVE_FORMAT`, `saveMigrationFailed`, non-object step throws). README and spine describe the contained hook and both carries. SE2 C2 test gap, live intent, default `stepMs`, the save-text cap and the ~17× short-key heap stay H4, as named.

### Nits (not HOLD)

- `handoff/README.md:55` and `docs/core-spine-slices.md:9` still say CN-009 Data & Save Keeper sign-off is pending. The pin is already `61fad786` (CN-009 r2). Process wording, not a proto reject.
