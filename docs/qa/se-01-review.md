# SE-01 lean review (sprite recipe reader, guard, SpriteRecipeLimits, CN-008 paint layer)

**Date:** 2026-11-12 04:27 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/se-01-recipe-reader.md` sha256 `cbf6d731f20be78eee42976cc332c2e5a5c9671ce27eb36baee68c7e3dfb6cb2` (255 lines). Copy at `/workspace/qa-runs/se01-review/kit-se-01-recipe-reader.cbf6.md` is byte-identical. Versus the pre-caps file `d9d57f4a…`, only L19 and L92 changed: `PROPOSED` became CEO-accepted 2026-11-12 / `CEO 2026-11-12`. The cap numbers are unchanged.
**CN-008:** `handoff/change-notices/CN-008-paint-layer.md` sha256 `23189e0fd8fa5f504f3a2653137c0739543d7949df0c7e9b4e9af67f35dbd82c` (25 lines), byte-identical to the review copy.
**Base:** `d05be365f79a62e8f61c74eac7fbb0553c4bee50` — confirmed `origin/main` (PR #23 merge of step 18; parents `ff3370b` and `7bd8967`, as EA described). Clone was fetch-only and left at `d05be36`. Working tree not checked out or edited.
**Pins:** core-types `f00c722c…` and package.json `1e5dd82c…` unchanged (lock `d7f64a09…`). CN-008 pins hold on the proto: depcruise `dcf61c61…` → `45a3dbaa…` (+2, no deletions) and `scripts/check-law.sh` `80421816…` → `4d7bbf48…` (+5, no deletions; the old sha is the CN’s “Old” line). GUIDE sha256 `27a12d2f…` (113 lines; previously `c27e1292…`, backup in `qa-runs/se01-review/kit-backup/`).
**Kit docs:** README sha256 `df96b535fa102a843540c4e857230d045e2ea1deea2f4153ddbeb4fabf0697c1` (only the SE-01 row changed vs the pre-caps README `3e3f0f87…`: caps are now “CEO-accepted 2026-11-12”). Spine sha256 `c3af6281…`. Copies under `/workspace/tileengine/` match. Not yet on `origin/main`.
**Prototype:** `/workspace/qa-runs/se01-review/proto-7a38` at `7a38a013ec849c885ea21f15430b303187897db9` (one-line comment change on `873e9cc`, itself parented on `d05be36`). Final green, tsc, sim, pins, greps and plants were re-run here. The earlier copy at `proto/` (`873e9cc`) was left clean; an interrupted plant edit was reverted. `/tmp` was not edited.
**Remotes:** read-only. Existing `refs/cmp/*` and earlier qa-runs trees were not edited. GitHub and Drive were not touched.

The BTF sprite caps (`side` 256, `parts` 256, `points` 256, `runs` 16384, `joints` 64, `anims` 32, `frames` 64, `variants` 32, `historyBatches` 2000, `historyBytes` 1000000) are **CEO-accepted 2026-11-12**, not pending. Kit L92 (the `BTF_SPRITE_RECIPE_LIMITS` comment) is **byte-identical** to the proto comment (160 bytes). The quoted export line matches too.

## Result

**HOLD.** One hold, from the hostile-input fuzz (ask 2). Everything else — gates, CN-008 plants, caps, draw-order, scope, law, the 240 generated tests, and the step-file decisions in ask 3 — is clean and would be OK TO SEND on sha `cbf6d731…` once the hold is fixed. Green is **463/0**, sim is unchanged, G7 is 367+/0− = **367** of 400 with at least 4 lines of slack per file except the two CN files (pinned by sha), greps **49/49**, plants **55/55** (33 test, 13 import, 9 check:law). All sixteen smoke lines are byte-identical to the step-16/17/18 pins. No RNG draws. No painter or renderer. No UNIT/TILE import in `src/paint`.

**Hold:** `readSpriteRecipe` throws when the input object’s `kind` or `formatVersion` is an own enumerable getter that throws (`Error: getter kind` / `Error: getter formatVersion`). Those two fields are read from the raw object *before* `plain()`’s try/catch. A throwing `toJSON`, a throwing getter on any later field (e.g. `name`), a throwing `toString` on a `kind` object, cycles, and a 100000-deep nest are all caught as `not plain JSON` or `wrong kind object` and do not throw. The API takes objects, not only `JSON.parse` text, and the kit’s “never throws” claim (plus this review’s brief) makes an uncaught getter a hold. Fix: wrap the preamble in the same try, or run `plain()` first and then read `kind` / `formatVersion` from `stored` (a throwing getter then becomes `not plain JSON`). The only intended throw remains the limits `RangeError`.

Kit-doc nits, not holds: README Verification still names prototype `873e9cc` (bump to `7a38a01` on send; numbers 463/0 and 367/400 are unchanged). Spine’s SE-01 row still says `BTF_SPRITE_RECIPE_LIMITS` PROPOSED — the step file and the README row are already CEO-accepted.

The three step-18 carry items are parked under the next levelling step in the README (including EA’s ruling that an empty-id or missing-`effects` unlock gives `unlockFailed` and keeps the offer). Not in this kit.

Answers to EA’s three questions are in §§1–3 below.

---

## Gates (re-run on proto `7a38a01`)

| Check | Result |
|---|---|
| `npm run green` | exit 0; **463/0/0/0**; tsc / lint / deps (77 modules, 225 deps) / check:state / check:law OK. Log: `qa-runs/se01-review/proto-7a38-green.log` |
| `npm run sim` | unchanged `48/2 afc89d56…` / `22/28 b8007292…` |
| Existing smokes (16 lines) | gen 1730/278 and 3154/563; chaos 3120 and 5542; exploit 1604/309, 1617/367, 2043/480, 2299/592, docs 581/1419 and 607/1393 findings 0; levels histories `6b91ceba…` / `3a58d03a…` / `f09905f4…` / `885c1a7b…` / `5a8d757f…` / `ac883a98…` — **byte-identical** to the step-16/17/18 pins |
| G7 `d05be36..HEAD` excl. handback/lock | **12 files, 367+/0− = 367** ≤ 400. name-status is exactly the 12 kit files (`A` for the nine created, `M` for the three changed). DNT empty. Slack is 4 on every non-CN file except `recipe-read.test.ts` (85/90). Tightest non-CN: `fields.ts` 108/112, types 33/37, limits 10/14, read 44/48, sample 41/45, fields test 31/35. CN files are exactly +2 and +5 |
| Greps | **49/49 ALL OK** (`se01-greps.sh`, base `d05be36`) |
| Kit plants | **55/55** caught (33 test, 13 depcruise, 9 check:law). Tree restored clean at `7a38a01` |
| Draw order | **None**, as written. No `createRng` / `streamSeed` / `src/core/rng` in `src/paint`. `"match"` / `"pool"` / `"levels"` untouched because nothing on the match path imports `src/paint` |
| Build law | one clock still; no `Date` / `Math.random` / rAF in the src diff; integer maths only in `src/paint` at runtime (`Math.floor` to floor a `floatParam`; no `**`, `pow`, trig, `exp`, `log`, `hypot`). `check:law` OK. Paint does not import UNIT or TILE |
| Scope | reader, guard, limits and CN-008 only. `src/paint/` is `recipe/{types,limits,fields,read,index}.ts`. No rasteriser, goldens, bank, writer or editor |

---

## 1. CN-008 depcruise plants, and the type-only btf-adapters exception

The official 13 import plants were re-run on `7a38a01` against both the new config (`45a3dbaa…`) and the base config (`dcf61c61…`, `git show d05be36:.dependency-cruiser.cjs`). They do exercise the new rules:

- Paint → `core/clock` or `state`: fails `paint-imports-only-types-notice` on the new config, **passes** on the base config.
- Paint → `sim` or `btf-adapters`: the new rule plus the existing `nothing-imports-sim` / `adapters-only-from-runtime-editor` (those existing rules also fire on the base config).
- `src/sim`, `src/rules` or `src/index.ts` → paint: fails `only-runtime-editor-import-paint` on the new config, **passes** on the base config.
- `src/project`, `src/core` or `src/fx` → paint: the new rule plus that layer’s existing import rule (the existing rule also fires on the base config).
- `src/runtime/host`, `src/editor` and a type-only import from `src/btf-adapters` **pass** on both configs.

The type-only btf-adapters exception is **package-narrow, not type-narrow**. The depcruise line is `from: { path: "^src/(?!paint|runtime|editor|btf-adapters)" }`, so any import kind from those folders is allowed. An independent plant of `import { readSpriteRecipe } from "../../paint/recipe/index.ts"` in `src/btf-adapters/src/` **passes** `npm run deps`. The type-only constraint is the kit grep (R6c, 49/49) and the checklist, not the gate. That is as the CN describes (`import type` checked by grep; the architecture-doc draft forbade the package entirely). Narrow enough for this slice: adapters currently import only the limits type, `src/paint` still cannot import `src/btf-adapters`, and core/state/rules/sim/project/fx still cannot import paint. Residual, not a hold: a later value import in adapters would pass `deps` and would have to be caught by the grep.

The nine check:law plants fail `[paint-integer-only]` on `**`, `Math.pow`, `Math.sin`, `Math.hypot`, `Math.log`, `Intl`, `Date` and `damage`, and a JSDoc `/**` plus a plain `*` pass.

Deliberate departure from `docs/sprite-recipe-architecture.md` (`3cb6eb18`) is documented in the CN and is the right call: it matches `BTF_STAGE_LIMITS` / `BTF_FX_PRESET`.

---

## 2. Hostile-input fuzz — hold on throwing getters for `kind` / `formatVersion`

Independent probe (`qa-runs/se01-review/fuzz.log`) against `readSpriteRecipe` on proto `7a38a01`. No hang, no OOM. Cases that passed (no throw):

- 1000-deep arrays or objects: readable. 100000-deep either: `not plain JSON` in 8–22 ms (the `plain()` try/catch absorbs the stack overflow).
- Own `__proto__` / `constructor` / `prototype` dropped with `droppedKey`, document order, values not entered; `Object.prototype` not polluted; unknown keys kept.
- `formatVersion` 2: ok, `readOnly` true, `newerFormat formatVersion`. `formatVersion` 0: `{ ok: false, needsMigration: true, found: 0 }`.
- 1e6-char `name`: copied, no general string cap (residual for a later cap if wanted; not a hold). `historyBytes` and `parts` caps: `overCap`, `doc` cut or history notice as specified, `stored` kept.
- `NaN` / `Infinity` on `size.w` become `null` in `stored` (JSON), `badField`, default 32. `-0` becomes `0` in `stored`, then `badField` (0 is out of range), default 32.
- Non-objects (`null`, `[]`, `"x"`, `7`): `not an object`. Cycles (array or object): `not plain JSON`.
- Hostile `kind` object whose `toString` / `valueOf` throw: `wrong kind object` (no `String()` on an object — the step-16 / B2 rule holds).
- Throwing `toJSON`, and a throwing enumerable getter on `name`: `not plain JSON`.

**Failed (hold):** a throwing own getter on `kind` or on `formatVersion` escapes. `read.ts` reads `head.kind` and `head.formatVersion` from the raw input, then only later calls `plain(json)` inside try/catch. No other throw was found; there is still exactly one `throw` in `src/paint` (the limits `RangeError`).

---

## 3. Step-file decisions — sound; 240 tests are meaningful

- Hex colours in either case: `/^#[0-9a-fA-F]{6}$/`; `#5A3A2A` reads clean (kit pin and independent probe).
- Missing required fields warn (`badField`) and take the table default; optional fields marked `?` (and the export-stripped `history`, `name`, `rev`, `locked`, `promotedFrom`, `code.src`) are absent from `doc` with no notice. A paint-form recipe (those keys stripped) reads with **no notice**. R1 holds on the kit test and on an independent floored-`light` + unknown-`extra` round trip.
- Neutral defaults are as written: `light` 0 (not BTF’s 135), `size` 32×32, frame `ms` 100. Confirmed by dropping those fields.
- No banned float maths in `src/paint` at runtime. `Math.floor` is the specified flooring of a `floatParam`. Range sentinels use `Number.POSITIVE_INFINITY` / `NEGATIVE_INFINITY` in the `int()` helper; they are not computed from recipe data.
- The 240 generated tests are **meaningful, not padding**. `fieldPaths` walks every key path of `SAMPLE` except top-level `kind` / `formatVersion`, and does not enter a run or point, `history.ops`, `code.out`, or a frame/facing `geom`. Each path gets its own test: wrong type → exactly one `badField` naming that key, `stored` keeps the bad value, `doc` does not; then `null` / `NaN` / `-1e9` / `0.5` / `""` / `[]` / `{}` / `"__proto__"` still return `ok: true`. That is one real assertion per table field, which is what the plants (T3, T14, T29, T33) rely on.

---

## Scope, law, docs, export audit

Scope is the 12 named files only. No `src/sim` / `src/rules` / core-types change; `sprite-recipe` is not added to `CurrentFormatVersions` (DSK ruling 1). BUILD_GUIDE vs `c27e1292` is exactly the two CN-008 §3 lines (new `src/paint/` row under `src/fx/`, and the scripts row gains “+ the src/paint ban list, CN-008”). README Lines cell is **255**; Verification includes proto `873e9cc`, 463/0, 367 of 400 (nits above). Spine size is **~367**.

**Export audit (QA-owned):** `src/paint` imports only `./…`, `../../types/…` (none today) and `../../core/notice.ts` (`import type { Notice }`). It does not import `src/editor`, `src/runtime`, or anything editor-only. Nothing on the runtime path imports `src/paint` yet (only `src/btf-adapters` does, type-only). A later runtime import of the reader will not pull editor code, because there is no editor code in this layer.

Residual, not a hold: no general string-length cap (`name`, `code.src`, …); `stored` is a full JSON copy, so a huge list is kept even though `doc` cuts at the cap. Both are as specified. SE-07’s `huntSpriteRecipes` is already deferred.

---

## Recheck 55e5ea0 (hold fix)

**Date:** 2026-11-12 04:40 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** sha256 `b701d181618c7d7933c6496082956bb7d1dcaddf8461c1919718d5582081891e` (255 lines). Copy at `qa-runs/se01-review/fix/step.b701.md`, byte-identical to `/workspace/tileengine/handoff/steps/se-01-recipe-reader.md`.
**README / spine:** `76ccaf27…` / `46101065…`, also identical to the originals under `/workspace/tileengine/`.
**Prototype:** `/workspace/qa-runs/se01-review/fix/proto-55e5` at `55e5ea0299b780e65043ac82029b9be734d379db` (parent `7a38a01`; message names the QA hold). Diff vs parent touches only `src/paint/recipe/read.ts` (+7/−5) and `tests/paint/recipe-read.test.ts` (+5), as claimed. The guard now copies first (`plain(json)` inside the existing try) and reads `kind` / `formatVersion` from `stored`. CN-008 `23189e0f…` and BUILD_GUIDE `27a12d2f…` are unchanged. Depcruise pin stays `45a3dbaa…`. Clone left at `d05be36`. `/tmp` was not edited. Tree restored clean at `55e5ea0`.

## Result

**OK TO SEND** on sha `b701d181…` (255 lines), proto `55e5ea0`. The hold is fixed. Green is still **463/0**, G7 is **374** of 400 (caps raised on the two edited files: `read.ts` 46/50, `recipe-read.test.ts` 90/94; slack 4 on both; cap sum 414), greps **50/50**, plants **64/64** (35 test including T34/T35, 13 depcruise, 9 check:law, 7 grep). Sim and all sixteen smoke lines are unchanged. Pins hold.

### (a) Hostile fuzz — nothing throws

The earlier probe was re-run on `55e5ea0` (`qa-runs/se01-review/fix/fuzz-55e5.log`), plus a revoked proxy, a proxy whose `get` / `getOwnPropertyDescriptor` traps throw, and the JSON.parse paths. **fuzz: ALL OK.** The two previous holds — a throwing own getter on `kind` or on `formatVersion` — now return `{ ok: false, error: "not plain JSON" }` and do not throw. Same result for a throwing getter on `name`, throwing `toJSON`, a revoked proxy, a throwing trap, and cycles. No hang, no OOM. The other earlier cases (hex, defaults, paint-form, versions, pollution, NaN/Infinity/−0, non-objects, deep nests, caps, hostile `kind` `toString`) still hold.

### (b) T34 / T35 and grep R9 exercise the real reader

T34 restores the pre-fix order (read `kind` / `formatVersion` from `json` before `plain()`). T35 puts `Array.isArray(json)` back on the raw input (a revoked proxy throws from `Array.isArray`). Both fail the **recipe guard** test, which now calls `readSpriteRecipe` with throwing getters on `kind`, `formatVersion` and `name`, and with a revoked proxy, and asserts `not plain JSON` with no throw. Grep R9 imports this build’s `readSpriteRecipe` and `BTF_SPRITE_RECIPE_LIMITS` from the working tree and requires `not plain JSON` (never `THROW`) for those getters, `toJSON`, a revoked proxy, a cycle and a throwing trap. GP7 (restore the old guard) fails R9. Caught.

### (c) Rewritten R6c

Independent plants against R6c, plus official GP1–GP6:

- Fail the grep: a value `import { readSpriteRecipe }`, the same import split over lines, `export { readSpriteRecipe }`, an inline `{ type SpriteRecipeLimits }`, a dynamic `import()`, and `require()` of `src/paint`.
- Pass: a one-line `import type`, a multi-line `import type`, and `export type { SpriteRecipeLimits }`. The existing adapters file still passes.

GP1–GP5 are each caught (R6c fails; `npm run deps` still passes — depcruise is package-narrow, the grep is the type-only gate). GP6 (multi-line `import type`) passes. Depcruise pin is still `45a3dbaa…`.

### (d) Behaviour 2 change is acceptable

The guard now copies first, so an uncopyable object is `not plain JSON` even when `kind` is also wrong (confirmed: a cyclic `{ kind: "map", … }` is `not plain JSON`, not `wrong kind map`). Law 10 is “warn, don’t block” for *field* problems; an unreadable document is already a hard failure. You cannot safely classify `kind` or the version on an object you cannot copy, so “can’t copy” winning is consistent. Anything from `JSON.parse` is unaffected: `{"kind":"map","formatVersion":1}` is still `wrong kind map`, `[]` and `null` are still `not an object`, and `JSON.parse(JSON.stringify(SAMPLE))` still reads clean. A plain `[]` still becomes `not an object` after the copy (`Array.isArray(stored)`).

### (e) Doc nits are fixed; no other drift

Diffs against `cbf6d731` / `df96b535` / `c3af6281` (and the `fix/prefix/` backups, which are byte-identical to those):

- README Verification now names prototype `55e5ea0`, 374 of 400, greps 50/50 and plants 64/64. The SE-01 row also notes the hold fix and the CEO-accepted rulings. No other README lines changed.
- Spine SE-01 row only: caps are **CEO-accepted 2026-11-12**, size ~374, plus the plain-copy guard and the same rulings note.
- Step file (still 255 lines): proto sha `55e5ea0`; caps `read.ts` ≤ 50 and `recipe-read.test.ts` ≤ 94 (sum 414, proto 374); Behaviour 2/3 rewritten (copy first; all later reads, the guard’s included, are on `stored`); guard test, plant table, Decisions and Acceptance updated to match; the rulings header records the CEO’s 2026-11-12 block acceptance (`data/sprite-recipe-rulings.md` ACCEPTED r1.1). No unrelated drift.

### (f) Gates on proto `55e5ea0`

| Check | Result |
|---|---|
| `npm run green` | exit 0; **463/0/0/0**; tsc / lint / deps (77 modules, 225 deps) / check:state / check:law OK. Log: `qa-runs/se01-review/fix/proto-55e5-green.log` |
| `npm run sim` | unchanged `48/2 afc89d56…` / `22/28 b8007292…` |
| 16 smoke lines | byte-identical to the previous pins |
| Pins | core-types `f00c722c…`, package.json `1e5dd82c…`, lock `d7f64a09…`, depcruise `45a3dbaa…`, check-law `4d7bbf48…` |
| G7 `d05be36..HEAD` excl. handback/lock | **12 files, 374+/0− = 374** ≤ 400. Same 12 kit files. Slack ≥ 4 on every non-CN file |
| Greps | **50/50 ALL OK** (`se01-greps.5d91.sh`, including R9-hostile) |
| Plants | **64/64** (`se01-plants.ef26.sh` with `SE01_GREPS` pointed at that script). Tree clean at `55e5ea0` |
