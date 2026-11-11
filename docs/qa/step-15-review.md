# Step 15 lean review (dev-side exploit hunter, slice 1: hostile wire intents + tampered project documents; report-only)

**Date:** 2026-11-11 18:25 Europe/London (GMT)
**Judge:** QA & Build Guard (independent)
**Step:** `handoff/steps/step-15-exploit-hunter.md` sha256 `0e79c0f3bed90f447224a9d073d32bfe0c316a90d0d11ba21e228a190626fc06` (174 lines)
**Backup of this sha:** `/workspace/qa-runs/s15-review/step-15-0e79c0f3.md`
**Base:** `08274d7db674602951e01d460724adc4d4e8ba71` — confirmed `origin/main` / clone HEAD (PR #19 merge of step 14; parents `cddbcd7` and `4af5931`). Clone was not edited (an unrelated 1-line dirty `handoff/README.md` was left untouched).
**CN:** none, as claimed. Two new files in `src/sim/` (an existing layer; `world.ts` already imports `src/project/read`; depcruise allows it and `npm run deps` is clean). `types.ts` / `index.ts` gain lines only. **No engine file changes** (DNT on `src/sim/{actions,intents,run,world,driver-phase,driver-tick,player,chaos,chaos-gen,shrink}.ts`, `src/project/**`, and every existing test is empty). Pins hold: core-types `f00c722c…`, depcruise `dcf61c61…`, `package.json` `1e5dd82c…`, lock `d7f64a09…` identical to Base. GUIDE sha256 `c27e1292…` (unchanged).
**Kit docs:** README sha256 `600c77533af02250cc12a915c98686d6decd87b8be3563d169c0a68281707932`; core-spine sha256 `838a63c00c5968aaf82427476de08688f8c867d2245c34f011478ecd3bb52493`; chaos-player outline sha256 `ef384d2a450619d2098da1d71b1bc1ecdb96747e05fd9d08853b4bc9f4128a7e` (unchanged, including the stale §7 line already deferred).
**Prototype:** `/tmp/s15-proto` was copied first (HEAD `3099a16aa656cdf4a4f27aa8bb652d0b3793b50b`, “hostile wire intents through the one door, tampered project documents through the readers; report-only”, parent `08274d7`). Fresh copy: `qa-runs/s15-review/proto` at the same commit, Node v24.22.1. Greps / plants scripts copied to `qa-runs/s15-review/` and run from there, retargeted off `/tmp`. `/tmp` was not edited.
**Remotes:** read-only. Existing `refs/cmp/*` and earlier qa-runs trees were not edited. GitHub and Drive were not touched.
**(e) file:** `docs/qa/chaos-player-invariants.md` section (e) was edited in this review (QA-owned). A pre-edit backup is `qa-runs/s15-review/chaos-player-invariants.md.pre-e`.

## Result

**OK TO SEND** on sha `0e79c0f3…` (174 lines). No CN miss, no build-law miss, no scope creep, and no engine file was touched (B1–B4 are pinned as reported, not fixed). Green is **191/0**, G7 is 338+/1− = **339** of 360 (and under every per-file cap), pins and sim and the four existing smokes match the base, and the six exploit smoke lines match the kit. 33 greps ALL OK; 28/28 test plants fail a named test; 14/14 grep plants caught. The foreign-tap plant (E2) is caught only by step 14’s reject test, as disclosed.

B1–B4 are **all real** on `main` `08274d7` (independent repro, not the proto hunter). Rulings: (e)1–(e)9 adopted with (e)2 / (e)3 / (e)8 / (e)9 as report-only target promises; a report-only smoke that prints known failures is acceptable (with one residual pin); the four deferrals are acceptable for slice 1.

No blocking kit edits. Residuals and the (e) diff are below.

---

## Residuals (not send-blocks)

**1. The six exploit smoke summary lines are printed, not asserted.** Each failure / finding must replay (that *is* asserted), green stays 0, and today’s output matches the kit lines exactly. But dropping the last seed of either smoke stays **191/0** (own plant). A silent bucket change would not break green. Step 12/13 smokes used the same `t.diagnostic`-only pattern (they happened to print `failed 0`). Recommended kit addition, not a send-block — after each summary `t.diagnostic(...)`, assert equality to the pinned line. Exact text:

In `tests/sim/exploit.test.ts`, after the `t.diagnostic(\`exploit smoke ${stage}…\`)` line, add:

```ts
assert.equal(`exploit smoke ${stage} seeds 1-20 ${shape === 1 ? "all kinds" : "no shape"}: runs 20 failed ${failed} steps ${steps} rejects ${rejects} buckets ${JSON.stringify([...buckets].sort())}`, /* the matching kit line for that stage / shape */);
```

In `tests/sim/exploit-docs.test.ts`, after the docs-smoke `t.diagnostic(...)`, add the same form against the two pinned docs-smoke lines. Do not assert `failed === 0` / `findings.length === 0` (the report-only greps already ban that). The proposed fix step already says these pins flip to empty buckets once B1–B4 are fixed.

**2. The three quoted CEO phrases** ("never throws uncaught", "never yields polluted prototypes", "never hangs: caps on size and depth") appear only in this kit in the repo docs. The topics and the backing / report-only rule are in outline §9 and §6. Ruling (1) still adopts (e)2 / (e)3 / (e)8 / (e)9 as report-only target promises on that wording, flagged as kit-attributed.

**3. Official `stage-weighted` with `allowRepeats: false` does not hang on a huge `picks`.** `resolvePlacements` exits early (`poolExhausted`) after the two positive weights (0.1 ms at `picks=3e6`). The uncapped loop is still real when `allowRepeats` is true or when a waves `count` is huge (see ruling 3). The hunter’s `(e)9` check still reports `picks` above the caller cap before placement runs.

---

## 1. Shas / line counts / Base / kit — PASS

| Check | Result |
|---|---|
| Step sha / lines | `0e79c0f3…`, **174** lines, matches EA |
| Base | `08274d7` is `origin/main` (PR #19, parents `cddbcd7` + `4af5931`) |
| Pins | core-types `f00c722c…`, depcruise `dcf61c61…`, `package.json` `1e5dd82c…`, lock unchanged, all identical to Base |
| CN | none, as claimed (`src/sim` already imports `project/read`; no engine files in the diff) |
| Kit shas | README `600c7753…`, core-spine `838a63c0…`, outline `ef384d2a…`, as claimed |

README: 14 merged at `08274d7` (PR #19), new 15 row (174 lines), Later lists the proposed `step-16-door-guard`, later exploit slices (saves, imports, rewards, online peers; outline §9), and hook retirement. Core-spine: status 00–14 merged at `08274d7`, step 15 written, new row `~340`. Outline unchanged.

---

## 2. Prototype `3099a16` — PASS (green, caps, quotes, greps, plants)

On the copy `qa-runs/s15-review/proto`, Node v24.22.1. `node_modules` came with the copy; lock matches Base.

| Check | Result |
|---|---|
| `npm run green` | exit 0; **191/0/0/0**; tsc / lint / deps (65 modules, 194 deps) / check:state / check:law OK |
| `npm run sim` | unchanged `48/2 afc89d56…` / `22/28 b8007292…` |
| Existing smokes | gen 1730/278 and 3154/563; chaos 3120 and 5542; all `failed 0` — match Base |
| Exploit smokes | four intent lines and two docs lines **byte-for-byte** as in the kit (failed 16 / 0 / 17 / 0; docs findings 1 and 8) |
| G7 `08274d7..HEAD` excl. handback/lock | **6 files, 338+/1− = 339** ≤ 360. Caps: exploit.ts 95/100, exploit-docs.ts 76/82, types.ts 15/20, index.ts 4/8, exploit.test.ts 94/100, exploit-docs.test.ts 55/60 |
| Types / index quotes | **verbatim** vs the kit |
| Greps | **33/33 ALL OK** (saved `s15-greps-run.sh`) |
| Kit plants | **28/28** test plants fail a named test; **14/14** grep plants caught. E2 (foreign selected unit) fails only step 14’s “every reject reason…” test — disclosed, and correct (no peer can reach it). Trees restored clean |
| Own plants | Skipping `legal()` except on kind `"legal"` fails the seeded, kinds, and (e)3/(e)4 tests (188/3). Cutting the last smoke seed stays 191/0 (residual 1) |
| Build law | one clock / no `Date` / `Math.random` / rAF in `src/sim` and `src/runtime`; UNIT/TILE pipes only; no chess trees; no `submit` / clock / phase write in the hunter; door still names no player kind; `gold\|currency\|reward` added to the rules-word grep |

`types.ts` append matches the kit quote. Streams are caller inputs (`"exploit"` only in tests). Caps are `DocCaps` inputs (tests: `["picks","count"]`, `10000`, `64`, `{cols:12,rows:12}`, `["knight","archer"]`).

---

## 3. Rulings

### (1) (e)1–(e)9 — adopt, with (e)2 / (e)3 / (e)8 / (e)9 as report-only target promises

Adopted into `docs/qa/chaos-player-invariants.md` section (e). What changed is listed at the end of this file.

- **(e)1** adopt as written (plain accepted step). Backed by step 11 Behaviour 2 and step 14’s every-reject test.
- **(e)2** adopt as a **target** promise: no wire input throws out of the driver. CEO wording ("never throws uncaught"); **B1** shows it is not held today. Report-only until the door-guard fix step.
- **(e)3** adopt as a **target** promise: no prototype pollution. CEO wording ("never yields polluted prototypes"). Report-only as an exploit promise (BTF has no tested exploit checks). Official path does not currently pollute (palette `__proto__` is dropped silently — the kit’s observation stands).
- **(e)4** adopt as written (same wire, same hashes). Backed by step 14’s JSON-fed seat and “online is just another driver”.
- **(e)5** adopt as written: a pointer to reuse the (a) checks, no new src id. `runExploit` still runs `CHAOS_CHECKS`.
- **(e)6** adopt: no reader / placement throw on a tampered document. Step 08 backs “a bad document is a hard error”; **B2** is a real throw. Report-only for the throw case.
- **(e)7** adopt as written (a refusal names a key). Backed by step 08’s named hard-error tests.
- **(e)8** adopt as a **target** promise: an accepted document is `plainDeep`. CEO / plain-data wording; **B4** breaks it today. Report-only.
- **(e)9** adopt, with one clarification: depth is a **generator** cap on hostile values, not an engine-facing promise. The engine-facing bound is caller-named count keys and the picker budget. CEO wording ("never hangs: caps on size and depth"); **B3** is real. Report-only. Caps stay caller inputs (law 11).

This matches “two chaos players” (outline §9): slice 1 starts the dev-side hunter on **current** surfaces (forged / malformed intents through the player driver, as outline §9 already allowed once harness B existed; project documents as the present stand-in for later saves/imports). Saves, rewards, currency, sandbox escapes stay listed as later (e) topics. Starting now is the right call; the outline line “its first own slice comes once the first save/import format and the first reward/currency events exist” is slightly stale and can wait for an outline tidy (not this kit).

### (2) Report-only smoke that PRINTS failures — acceptable

Yes. CEO Q7 / the 25-clean-runs gate: never fail the job, never assert the run clean. Green is 191/0. Each printed failure must replay (asserted). Output is deterministic today and matches the six kit lines. The “no shape” / clean-bucket lines show the rest of the hunter is clean; the all-kinds lines are the known B1 buckets, not a flake.

This is the same report-only mechanism as steps 12/13, except those smokes happened to print `failed 0`. Printing known, replaying failures is better than hiding them. Residual 1: assert the six summary strings so a silent bucket change cannot hide. Do not start the 25-clean count until the fix step empties those buckets.

### (3) B1–B4 on `main` `08274d7` — all real

Reproduced independently from `/workspace/tileengine-repo` at `08274d7` (scripts in `qa-runs/s15-review/repro/`; the proto hunter was not imported). Node v24.22.1.

**B1 — REAL.** `runMatch` with seats throws `TypeError` out of the driver on malformed JSON-fed intents. stage-fixed seed 8, select `archer#2` then `{intent:{type:"TargetCell",at:null}}` throws `TypeError: Cannot read properties of null (reading 'c')`. The five kit messages all come out:

| Input (first player batch, then the bot) | Throw |
|---|---|
| `null` | `TypeError: Cannot read properties of null (reading 'intent')` |
| `{intent:null}` | `… of null (reading 'type')` |
| `{"intent":{"type":"TargetCell"}}` after a select | `… of undefined (reading 'c')` |
| `{"intent":{"type":"TargetCell","at":null}}` after a select | `… of null (reading 'c')` |
| `7` / `"SelectUnit"` / `{}` | `… of undefined (reading 'type')` |

Sites: `driver-phase.ts` `input.intent`; `intents.ts` `intent.type` and `intent.at.c`. A first-wire `{"intent":[]}` did **not** throw (outcome `lose`) — that shape is in the hunter’s list but is not one of the five required B1 messages.

Exact repro:

```sh
# from a tree at 08274d7, or run qa-runs/s15-review/repro/b1-b4.ts (imports that tree)
node --experimental-strip-types qa-runs/s15-review/repro/b1-b4.ts
```

Or the seed-8 case: `createWorld(seedless(input("stage-fixed", 8)))`, `runMatch` with both sides seated, player hook returns `JSON.parse('{"intent":{"type":"SelectUnit","unitId":"archer#2"}}')` then `JSON.parse('{"intent":{"type":"TargetCell","at":null}}')`.

**B2 — REAL.** `guard.ts` L29 is `wrong kind ${String(json.kind)}`. `kind: {toString:1, valueOf:1}` throws `TypeError: Cannot convert object to primitive value` from `readManifest`, `readMap`, `readStage`, and `createWorld` (which calls `readStage(input.stage)`).

```ts
const bad = { kind: { toString: 1, valueOf: 1 }, formatVersion: 2 };
readManifest(bad); // throws
createWorld({ ...input("stage-fixed", 8), stage: { ...input("stage-fixed", 8).stage, kind: { toString: 1, valueOf: 1 } } }); // throws
```

**B3 — REAL**, with the official-fixture nuance in residual 3. `isInt(v.picks, 0)` / `isInt(e.count, 0)` accept `1e9` (`readStage` ok, `picks=1000000000` / `count=1000000000`). `resolvePlacements` (`placements.ts`) does `for (let n = 0; n < pool.picks; n += 1) ids.push(...)` and the same for waves `count`, with no cap.

- Official `stage-weighted` (`allowRepeats: false`, two positive weights): `picks=3e6` returns in **0.1 ms** with `poolExhausted` (does not hang).
- Same pool, `allowRepeats: true`, `picks=3e6`: **159 ms**, **3,000,000 picker calls**, 5 placements (`notPlaced`). (EA’s 1.6 s is the same bug on a slower box; this box is faster.) Scaling: 1e5 → 12.2 ms, 1e6 → 50 ms.
- Waves `count=3e6`: **108.7 ms**, also uncapped.
- `picks=1e9` / waves `count=1e9` was run under `ulimit -v 1572864` (1.5 GB; Node can start at that cap) and `timeout 15s`. Both died with `FATAL ERROR: … JavaScript heap out of memory` in **0.63 s** / **0.46 s** (exit 134). Do **not** run 1e9 uncapped on the box: linear extrapolation from 3e6 is ~50 s plus a billion-entry `ids` array.

Exact repro (safe): `qa-runs/s15-review/repro/b3-count.ts 3000000 weighted-repeat`. For 1e9, always use the 1.5 GB ulimit and a timeout.

**B4 — REAL.** Splicing `"weight":1e400` into official `stage-weighted.json`, `JSON.parse` yields `Infinity`. `readStage` accepts it (`ok: true`, `weight=Infinity` — `typeof weight === "number"` is not `Number.isFinite`). `JSON.stringify` of the accepted doc writes `"weight":null`; re-reading that text is refused (`bad field enemyPool`).

```sh
# splice the official fixture's first weight 3 → 1e400, then:
node --experimental-strip-types qa-runs/s15-review/repro/b1-b4.ts   # B4 section
```

### (4) Deferrals — acceptable for slice 1

Yes, all four. Out-of-turn intents: the door has no turn; `runMatch` only asks a seat on its turn; the online queue owns the rest. Dead units: nothing dies yet; step 14 already reaches those rejects through a test-only view. Shrink for exploit records: a run already stops at the first finding; ddmin can wait. Non-JSON wire: the online add-on’s parser; this hook’s contract is `JSON.parse` of text. None is needed for this slice’s done-means. Fixing B1–B4 is correctly a later fix step (CEO Q8).

---

## 4. What changed in `docs/qa/chaos-player-invariants.md` section (e)

The placeholder **TBD** bullet list was replaced with the adopted (e)1–(e)9 table and the backing / report-only notes above. Kept: the later CEO topics (saves/imports, rewards, currency, sandbox, online cheat) and the game-side system-promises paragraph, so they are not lost. The header `Updated` line now records this fill-in. The Pointers section gained one sentence pointing at this review. A pre-edit copy is `qa-runs/s15-review/chaos-player-invariants.md.pre-e`. Ids were adopted, not reworded, except (e)9’s depth clarification (generator cap vs engine-facing count/picker bound).
