# step-19-pick-hardening: a logged unlock needs exactly one ability id that is on offer (a malformed one is `unlockFailed`, never a throw), Levels and the hunter keep frozen copies of their settings, step 18's door and reject tests close their two gaps, and the exploit hunter learns levelling (a hostile `pick` kind, `(e)1` judges unlocks, `(a)9` watches levels)

Step id: step-19-pick-hardening          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read it; you do not push anything — see Delivery)
Base commit: `7a0de0c0ec8d8b7e2710b7dd799169fe6d8deb45` (`7a0de0c`, the se-01-recipe-reader merge on `main`, PR #24; verified by the Engine Architect 2026-11-12: green 463/0, sim unchanged, all sixteen smoke lines as pinned). The diff is always `<base>..<head>`.
Branch: `step/step-19-pick-hardening-r<N>`, created from the base. Never commit to `main`. Chief Of Staff pushes your branch and opens the PR to `main`.
Delivery (CN-003): `git bundle create step-19-pick-hardening-r<N>.bundle <base>..step/step-19-pick-hardening-r<N>`, then `git bundle verify`; upload the bundle plus a copy of HAND-BACK.md to the CEO's Drive. HANDBACK.md's PR line: `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete any file you did not upload in this chat; if a file with your bundle's name already exists, add a suffix to yours (e.g. `-chatB`) and name it in the hand-back.
Hand-back location: in the repo, on that branch: `handback/step-19-pick-hardening/r<N>/` (HAND-BACK.md), committed as the branch's last commit
Depends on: step-12 (`CHAOS_CHECKS`, `(a)9`, `ChaosView`), step-15-exploit-hunter (`EXPLOIT_KINDS`, `exploitWire`, `acceptedCheck` `(e)1`, `runExploit`, `replayExploit`), step-16-door-guard (the door's `malformed` guard), step-18-card-free-levelling (`createLevels`, `LevelRules`, `ChooseAbility`, `noOffer` / `badPick`, the `unlock` action, `SimSnapshot.levels`, the six levels smoke lines)
Read first: BUILD_GUIDE.md §2 laws 4, 5, 7, 9, 10, 12, M4, M7; `handoff/steps/step-18-card-free-levelling.md` Behaviour 1, 8, 9 and "Draw order"; `handoff/steps/step-15-exploit-hunter.md` (the kinds and `(e)1`); `src/sim/exploit.ts`, `src/sim/chaos.ts` `stillOf`, `src/sim/actions.ts` (as at the base); `docs/qa/chaos-player-invariants.md` (a)9, (e)1
Kit: kit-2, 2026-11-12. Engine Architect. The interfaces below were prototyped and run green (`npm run green`, 472/0) on Node 24.22.1 on top of the SE-01 merge `7a0de0c` (prototype `2a9441f`, r2 of the kit after QA's HOLD in `docs/qa/step-19-review.md`; a fresh clone of the prototype runs green), against `src/types/core-types.ts` sha256 `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23` (CN-004). `npm run sim` 48/2 and 22/28 and all sixteen smoke lines (four chaos, two exploit-docs, four exploit, six levels) are unchanged by this step; four new exploit-levels smoke lines are pinned.
Carries: **no Change Notice.** No pinned file changes: `core-types.ts` (`f00c722c…`), `package.json` (`1e5dd82c…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`), BUILD_GUIDE, STATES and every state table are unchanged. The door (`src/sim/player.ts`), the world, the snapshot and both drivers are unchanged. `ExploitKind` gains one member (`"pick"`, last); no pinned file lists the kinds. `src/rules/levels/levels.ts` refuses `""` in pools and keeps a frozen copy of its setup; no signature changes. The prototype is not attached: write your own code to these quotes.

> Working style: use your helper agents, take your time, self-review against Acceptance + QA checklist before hand-back (see BUILD_GUIDE).

> Paste-ready prompt for Grok Build starts here and ends at the end of this file.

## Goal
Close the three gaps QA and the Engine Architect found in step 18's merged build, and make the exploit hunter test levelling as a hostile peer would. After this step: (1) **An `unlock` action unlocks only when it names exactly one ability that is in that bar's pending offer.** No id (`effects: []`), two or more ids, an empty id, an empty or unknown bar, or an id not on offer gives the notice `unlockFailed` and changes nothing: the offer stays open, nothing is drawn, no event. `effects` missing, not an array or holding a non-string gives the same `unlockFailed` **and never throws** (at the base `log.append` threw `TypeError: a.effects is not iterable`). The merged build read a missing id as `""` (`effects[0] ?? ""`) and read only the first of two ids; an empty id is never an ability, and `apply` refuses it by name. (2) **Pools hold only non-empty ids, and `createLevels` keeps its own frozen copy of its rules and pools**, so an edit of the caller's objects after create can never offer `""` (QA's repro) or change a threshold. The hunter likewise keeps its own copy of its settings, and the kind and check lists are frozen. (3) Step 18's door test also checks the snapshot (QA plant L17), and its every-reject test also picks the last offered index, which must be accepted (QA plant D2). (4) **A new exploit kind `pick`** sends forged `ChooseAbility` wires: bad indexes, other sides' and made-up unit ids, a missing index, repeats. (5) **`(e)1` judges an accepted `unlock`** (until now it called every non-move action a finding), and **`(a)9` also compares `levels`** on a refused step or a step with no action. (6) Four pinned **exploit-levels smoke** lines, and a **tampered-log** test. Levelling stays off unless a match opts in; with it off nothing changes.

Rulings in this step (Engine Architect, 2026-11-12; the CEO rulings of step 18 stand: both bar modes, BTF uses the side bar, levels 2, 5 and 8 offer nothing, moves only earn XP, 1 each):
- **The step file's meaning wins over the merged build (step 18 Behaviour 8).** A logged unlock carries one ability id, as the door builds it (`effects: [offer[index]]`). Anything else in the log (no id, two ids, `""`) is a bad unlock: `unlockFailed`, offer kept. This also holds for a log read from JSON (a save or a peer), so the check sits in `apply`, not in the door. An unlock whose `effects` is not an array of strings cannot be packed into the log, so `submit` refuses it **before** `append` (not logged), and `apply` reads the ids again for a timed unlock (QA HOLD 1).
- **`""` is no ability id, refused twice (QA HOLD 2).** `createLevels` refuses a pool entry `""` with the step-18 `RangeError` (never dropped, never clamped), and `apply` refuses `""` itself, so neither guard alone is load-bearing.
- **Settings are read once into a frozen copy, then checked (QA HOLD 2's pattern, scanned across the step).** `createLevels` copies its rules and pools; `exploitWire` copies `gen.stream` and the weights; `EXPLOIT_KINDS` and `CHAOS_CHECKS` (array and entries) are frozen. Checking the caller's object and then using it live is the hole.
- **Why the exploit hunter, and not seats in `runTicks`, fills this step (Engine Architect).** The tick driver has no input model a seat can play: `runTicks` never writes phases (`(a)6`), so the door's tactics phases stay at `play.loading` and every seated intent is `illegal`. A seat there needs either the shared tick phase `play.running` (STATES §1.1: it "joins the `Phase` union by Change Notice with the first tick mode", idle RPG) or the RTS input tables (CEO-parked). Retiring the action hook also needs a Change Notice to M6 and an edit to `docs/STATES.md` §0 rule 8. That is its own step with a CEO question. The hostile-pick kind was deferred by step 18 by name ("The exploit hunter may add a hostile-pick kind later") and is the next exploit slice in the README queue (forged and replayed reward events: an unlock is the engine's first reward-like event).
- **`pick` is the last kind, so existing mixes draw as before.** `Rng.weighted` skips weights that are not above zero, so a mix with `pick: 0` makes the same one `next()` call and the same choice as at the base. The four exploit smoke lines and the first exploit test stay as pinned **only if** their mixes give `pick` weight 0 (the test helper `mixOf` changes for exactly that).
- **The hunter stays report-only and blind.** `src/sim/player.ts`, `driver-phase.ts` and `driver-tick.ts` do not change; the door does not learn about the hunter.

## Files to create or change
- change `src/sim/actions.ts`: the unlock reads exactly one id, checked before the log and again in `apply`; `""` refused (≤ 14 changed lines)
- change `src/rules/levels/levels.ts`: a frozen copy of rules and pools, read once; pools refuse `""` (≤ 22)
- change `src/sim/types.ts`: `"pick"` in `ExploitKind`, one comment line (≤ 7)
- change `src/sim/exploit.ts`: `"pick"` in `EXPLOIT_KINDS`, the index list, the `pick` wire, the `(e)1` unlock branch, frozen kinds, settings read once (≤ 34)
- change `src/sim/chaos.ts`: `(a)9` compares `levels`; `CHAOS_CHECKS` frozen (≤ 14)
- change `tests/rules/levels.test.ts` (≤ 21), `tests/sim/levels.test.ts` (≤ 51), `tests/sim/bot.test.ts` (≤ 10), `tests/sim/exploit.test.ts` (≤ 9)
- create `tests/sim/exploit-levels.test.ts` (≤ 106)

Size: ≤ 400 changed lines in total, counting insertions + deletions. The per-file caps above add up to 288 (prototype `2a9441f` on `7a0de0c`: 248 changed lines). No new fixtures. If you pass ~290, say so in Decisions.

## Interfaces to match (quoted exactly)
From step 12/15/18: `CHAOS_CHECKS`, `ChaosView`, `ChaosFinding`, `SnapshotKey`, `EXPLOIT_KINDS`, `ExploitGen`, `exploitWire`, `acceptedCheck`, `runExploit`, `replayExploit`, `createLevels`, `LevelRules`, `Action`, `submit`, `snapshot`, `replay`, `parseLog`. Import these; never retype them.
```ts
// src/sim/types.ts — ExploitKind becomes (one comment line of your own words above it):
export type ExploitKind = "legal" | "foreign" | "ghost" | "smuggle" | "cell" | "phase" | "replay" | "junk" | "shape" | "pick";
// src/sim/exploit.ts
export const EXPLOIT_KINDS: readonly ExploitKind[] = Object.freeze(["legal", "foreign", "ghost", "smuggle", "cell", "phase", "replay", "junk", "shape", "pick"]);
// the pick kind's index texts, in this order (the last one, "", means "no index key"):
const PICK_AT = ["0", "1", "2", "-0", "-1", "3", "1.5", "1e400", "9007199254740993", '"0"', "null", "[0]", ""];
// the pick kind's unit ids, in this order: [own, foeId, "", "ghost#9", "__proto__"]   (own and foeId as the existing kinds compute them)
// one pick wire text (exact bytes; `who` through JSON.stringify):
//   at !== "":  {"intent":{"type":"ChooseAbility","index":<at>,"unitId":<who>}}
//   at === "":  {"intent":{"type":"ChooseAbility","unitId":<who>}}
```
No other signature changes. `acceptedCheck(side, moveMs)`, `exploitWire(gen, legal)`, `runExploit`, `replayExploit`, `CHAOS_CHECKS` (same seven ids, same order) and every `PlayerReject` keep their base shapes. Write your own comments in your own words.

Behaviour (exact; each line has a test):
1. **The unlock action.** *`submit`*, after the `disposed` return and **before** `log.append`: an `unlock` whose `effects` is missing, not an array, or holds any non-string pushes `{ code: "unlockFailed", message: "unlock failed" }` and returns: not logged, nothing else changes, nothing throws. *`apply`* (`kind: "unlock"`, `target: null`) reads `effects` once into a copy and checks it again (a timed unlock lands later): it calls `world.levels.choose(action.actor, id)` only when levelling is on, the copy is an array of strings with **exactly one** entry `id`, and `id !== ""`. Otherwise, or when `choose` returns `false` (no such bar, no pending offer, `id` not in it, an empty `actor`), it pushes the same `unlockFailed` and nothing else changes: the offer stays pending, `banked` is kept, no draw, no event; `choose` is never asked for `""`, even by a Levels that would accept it. A well-formed bad unlock is still logged (as at the base: `submit` logs first). A replay or restore of a log with such entries gives the same `levels` as the log without them, plus one `unlockFailed` per entry. A JSON log entry with no `effects` array stays `bad entry` in `parseLog` (unchanged), so every path is a named result, never a `TypeError`.
2. **Levels setup:** `createLevels` reads `setup.rules` and `setup.pools` once each and builds a frozen copy (rules, `thresholds`, `offerLevels`, `xp`, the pools object and each pool); it checks and uses only the copy, and `levels.rules` is that copy. A later edit of the caller's objects changes nothing (no `""` offered, same thresholds). It throws `RangeError("createLevels: bad rules or pools")` when any pool entry is not a string **or is `""`**, and for a bad shape (setup, rules or pools not an object, pools an array, `thresholds` / `offerLevels` / a pool not an array, `xp` not an object) instead of a `TypeError`. The rest of step 18 Behaviour 1 is unchanged.
3. **`(a)9` watches levels:** for a refused step, after the existing units/occupancy, `logSeq` and `phases` comparisons, `before.levels` and `after.levels` must be equal (`JSON.stringify`), else the finding `{ key: "levels", expected: before.levels, actual: after.levels }`. For an accepted step with no action, after the existing units/occupancy pair, the same levels comparison. A step with an action is unchanged. With levelling off both sides are `undefined` (equal).
4. **`(e)1` judges an accepted unlock:** after the existing event checks and the `action === null` return, an action with `kind: "unlock"` is quiet (`null`) only when all hold: the bar is the seat's (`world.levels.rules.bar === "side"`: `actor === side.now`; otherwise a unit in `view.before.units` with that id, alive, of side `side.now`); `target === null`; `durationMs === null`; `effects.length === 1`; and `effects[0]` is in that bar's pending offer **in `view.before.levels`** (not `after`: the pick clears it). Otherwise `{ key: "levels", expected: <that offer or null>, actual: <the action> }`. Every other action is judged as at the base.
5. **The `pick` kind (`exploitWire`):** after the shared draws (Draw order), `at = r.pick(PICK_AT)`, `who = r.pick([own, foeId, "", "ghost#9", "__proto__"])`, the wire text as quoted, then `r.next() < 0.5` → `[text]`, else `[text, text]` (a repeated pick). It sends nothing else. Through the door: a side bar ignores `unitId`; `"-0"` parses to `-0`, a legal index 0; `"9007199254740993"` parses to `9007199254740992`; `"1e400"` to `Infinity`; every non-integer, negative or too-large index is `badPick` when an offer is pending.
6. **Off means off; old mixes unchanged:** with levelling off a pick is `noUnit`, `notOwn` or `noOffer` (no bar has an offer), and a mix with `pick: 0` draws exactly as at the base, so the sixteen base lines hold.
7. **The hunter's settings are its own:** `exploitWire(gen, legal)` reads `gen.stream` and `gen.mix` once, checks them as at the base (plus: the stream must be a string, the mix an object, each weight a number; else `RangeError("exploit: settings")`), and draws only from that frozen copy; an edit of `gen` after the call changes no wire. `EXPLOIT_KINDS`, `CHAOS_CHECKS` and each check entry are frozen. A run record still holds the caller's `gen`.

## Draw order (exact; any pinned line below must be reproducible from this section alone)
- **Levelling off, every base test, smoke and `npm run sim` match:** no draw is added. `"pick"` is appended last to `EXPLOIT_KINDS`; every base mix gives it weight 0; `r.weighted` skips it, so the kind draw (one `next()`) and every later draw are as at the base.
- **One `exploitWire` call (the base order, unchanged; `r` = `createRng(streamSeed(world.seed, gen.stream))` with `gen.stream` as read when `exploitWire` was called, made once on the first call):**
  ```
  kind = EXPLOIT_KINDS[r.weighted(weights in EXPLOIT_KINDS order)]   // 1 next()
  fair = legal(world, side, budget)                                  // the legal hook's own draws on its own stream, as at the base
  if kind == "legal": return fair
  own  = budget.units empty ? "none" : r.pick(budget.units)          // 1 next() if not empty
  cell = { c: r.int(cols), r: r.int(rows) }                          // 2 next()
  foe  = alive units of other sides, in world.units.all() order
  foeId = foe empty ? own : r.pick(foe).id                           // 1 next() if not empty
  if kind == "pick":                                                 // new; exactly 3 more next()
    at  = r.pick(PICK_AT)                                            // 13 entries, quoted order
    who = r.pick([own, foeId, "", "ghost#9", "__proto__"])
    return r.next() < 0.5 ? [text] : [text, text]
  ```
  `r.pick(xs)` = `xs[r.int(xs.length)]`, `r.int(n)` = `floor(r.next() * n)`. The other kinds are as at the base.
- **Levelling on:** offers draw only from the world's `"levels"` stream, as in step 18 "Draw order"; a refused pick and an `unlockFailed` draw nothing; a fair pick draws only if the banked XP it releases opens the next offer.
- **The exploit-levels smoke (below)** uses only these streams: placement (`"pool"`), the bot `bot(seed)` (`"ai"`), the hunter (`"exploit"`), and `"levels"`.

## Tests that prove it is done
Run: `npm test`. Common: `POOLS`, `UNIT`, `QUICK` and `armed(stage, seed, rules)` = `seedless({ ...input(stage, seed), levels: { rules, pools: POOLS } })` as in step 18's tests. Exploit options as in `tests/sim/exploit.test.ts` (`victory: reachFarRow`, `checks: CHAOS_CHECKS`, `hash` = sha256 hex, `fuse: 60000`, `maxRounds: 40`, `maxSimMs: 600000`, `moveMs: 200`, `idPrefix: "m"`, `presets: {}`, any `engineSha` / `node`), sides `["player", "wolves"]` on stage-fixed and `["player", "rival"]` on stage-weighted, `legal: bot(seed)`. `mix(over, rest)` = every kind `rest`, then `over`. Test titles start with the quoted words (QA's plants find tests by them); the rest of each title is yours.
- `tests/rules/levels.test.ts`
  - "createLevels refuses bad rules (step 18)…" also refuses pools `{ knight: ["guard", ""] }` and `{ knight: [""] }` with the RangeError text.
  - "createLevels keeps its own frozen copy (step 19)…" (new): after create, push `""` into a pool, empty `offerLevels`, set `thresholds[0]` and `xp.move`: `levels.rules` deep-equals the rules as given, is frozen (an assignment throws `TypeError`), and the offer holds no `""`. A pool behind a getter that returns a different array on a second read is read once (the offer comes from the first). The bad shapes of Behaviour 2 (`null`, `{}`, rules `null`, pools `null` / `[]`, `thresholds` missing, `offerLevels: 1`, `xp: null`) each throw the RangeError text.
- `tests/sim/levels.test.ts`
  - "a pick through the door (step 18)…" (carry 2, QA L17): after the accepted pick, `snapshot(world).levels` deep-equals `world.levels.state()`, its `bars` are exactly `[{ id: "knight#1", xp: 0, level: 1, banked: 0, offer: null, abilities: [offer[1]] }]`, and a JSON round trip of the snapshot keeps `levels`.
  - "a malformed unlock never throws (step 19)…" (new; `UNIT`, `gain("knight#1", "knight", 17)`): `submit` of an unlock with no `effects` key, `undefined`, `null`, `"guard"`, `{}`, `[7]`, `[first, null]`: none throws; after each one more notice, `unlockFailed`; `lastSeq` stays 0; `levels.state()` byte-identical. Then a timed unlock (`durationMs: 100`, `[first]`) is submitted (logged, `lastSeq` 1), its `effects` set to `null`, and `advance(world, 200)`: no throw, exactly one more notice, `unlockFailed`, levels unchanged.
  - "the empty id never unlocks (step 19)…" (new): pools `{ knight: ["guard", "charge"] }`; after `createWorld`, `pools.knight.push("")`, then `gain`: the offer is exactly `["guard", "charge"]` (QA's repro). Then a world copy whose Levels' `choose` records its calls and returns `true`: `submit` of `[""]` is `unlockFailed`, `choose` is never called, `lastSeq` 1, the real offer unchanged.
  - "a logged unlock with no ability id (step 19)…" (new; `UNIT`, `gain("knight#1", "knight", 17)`, `first = offer[0]`): `submit` five unlocks for `knight#1` unless named: `effects []`, `[""]`, actor `""` with `[first]`, `[first, first]`, `["nope"]`. After each: one more notice, `unlockFailed`; `levels.state()` byte-identical to before the five; no new `level.*` record on the bus. Then `lastSeq` 5, the offer unchanged; `[first]` unlocks it (abilities `[first]`, no new notice).
- `tests/sim/bot.test.ts` "every reject reason is reached…" (carry 3, QA D2): after the two step-18 `badPick` feeds it also feeds index `-1` and the string `"1"` (`badPick` each). The step-18 `kept` snapshot still equals the world's after every refusal. Then index **1, the last of the offer `["guard", "ward"]`**, is accepted (`reject` null, `effects ["ward"]`, abilities `["ward"]`), then the step-17 `disposed`. Ten reasons listed; `lastSeq` 1; history 19.
- `tests/sim/exploit.test.ts`: `mixOf` gives `pick` weight 0 (so its pinned numbers stay); "each hostile kind sends its documented wire…" expects `pick: "ChooseAbility:noOffer ChooseAbility:noUnit ChooseAbility:notOwn"` (levelling off) and checks that every pick wire is one or two `ChooseAbility` texts and at least one is sent twice.
- `tests/sim/exploit-levels.test.ts` (new)
  - "hostile picks (step 19)…": stage-fixed seeds 1–10, `mix({ legal: 3, pick: 3 }, 0)`, once with `QUICK` and once with `BTF_LEVEL_RULES`, a spy check after `CHAOS_CHECKS`. Every run: `failure` null; `replayExploit` of the JSON-copied run gives the same `hashes`. Every refused pick leaves `levels` equal before and after; every accepted pick's `effects[0]` was in its bar's offer before. The set of pick results is exactly `badPick noOffer noUnit notOwn ok` (`QUICK`) and `badPick noOffer ok` (side bar). The set of index texts sent is exactly `PICK_AT`.
  - "(e)1 and (a)9 with levelling (step 19)…": for `UNIT` and `BTF_LEVEL_RULES`, a world where the player's bar (`knight#1` / `player`) and the foe's bar (`wolf#3` / `wolves`) each hold an offer; `after` = the same snapshot with every offer cleared. A fair unlock of `offer[0]` is quiet. These give key `levels`: the foe's bar with an own-offer id, the foe's bar with the player's id, `["nope"]`, `[]`, two ids, `durationMs: 200`, a tile target. `(a)9`: a refused pick whose `after.levels` differs gives `levels`; equal gives null; an accepted `SELECT_UNIT` step whose levels differ gives `levels`.
  - "exploit levels smoke (step 19)…": rules `btf-side` = `BTF_LEVEL_RULES` and `quick-unit` = `QUICK`, both stages, seeds 1–20, `mix({ legal: 6, pick: 3 }, 1)`. A failure is printed and must replay to the same failure. `unlocked` counts distinct `unlock` action ids per run (the hunter's twin replay runs the checks again), and `hashes` is the sha256 of `JSON.stringify` of the 20 runs' `hashes` arrays. Each line goes out through `t.diagnostic(line)`, and the four are pinned with one `assert.deepEqual`:
    - `exploit levels smoke btf-side stage-fixed seeds 1-20: runs 20 failed 0 steps 1746 rejects 485 unlocked 0 buckets [] hashes b4200d6ec2acfe7d95498be21f27f3cb881476717867ad97627d2d07cdb874eb`
    - `exploit levels smoke btf-side stage-weighted seeds 1-20: runs 20 failed 0 steps 2337 rejects 689 unlocked 5 buckets [] hashes 78bc5fb6de8e44e404f1ed9a0c4a57cf47bff84acd556e9d47c61af1da7dde6c`
    - `exploit levels smoke quick-unit stage-fixed seeds 1-20: runs 20 failed 0 steps 1746 rejects 484 unlocked 1 buckets [] hashes 1bdb13470d2e0e45776099e3d7a58d1330b3b91bf7b154348d7d4fde2ceb70ba`
    - `exploit levels smoke quick-unit stage-weighted seeds 1-20: runs 20 failed 0 steps 2337 rejects 689 unlocked 5 buckets [] hashes 7e7ee7a6ac6f7f1ebffd4fe301f944f592974483e50f4c3ebed30b53fa2b0866`
    (The two stage-weighted lines share `steps`, `rejects` and `unlocked` by chance: per seed they differ; the `hashes` differ.)
  - "the hunter's settings are its own (step 19)…" (new): `EXPLOIT_KINDS`, `CHAOS_CHECKS` and every check are frozen (a push or an assignment throws `TypeError`). Two worlds, the same all-`1` gen: on one, the gen is edited after `exploitWire` (stream `"match"`, `pick: 0`, `legal: 50`); 40 calls each give the same wires. Mix `null`, stream `7`, a weight `"1"` throw `RangeError("exploit: settings")`.
  - "a tampered log (step 19)…": stage-fixed seed 3 with `QUICK`, both sides seated with `bot(3)` (no picks), so offers are left open. Append six forged unlocks at the last tick to the parsed log: `effects []`, `[""]`, actor `""`, two ids, `["nope"]`, actor `"ghost#9"`. `parseLog` reads it; `replay` gives `levels` equal to the clean log's and exactly six more notices, all `unlockFailed`. The same log with one entry's `effects` removed is not read (`ok: false`).
- Unchanged (byte-identical): `npm run sim` prints the base's two lines; the four chaos, two exploit-docs, four exploit and six levels smoke lines are as at the base. Green ≥ 472.

## How a planted bug is caught (for QA; prototype `2a9441f` on `7a0de0c`; reverted after each; `/tmp/s19-plants.sh` on the Architect's box)
Each plant is an **intent**; the script holds the prototype's example patch. On the build, QA adapts the patch text to that build's code (same intent, same expected failing tests). A "plant text not found" line means "adapt it", not "passed".
| Plant (one intent; one or two edits) | Tests that fail (of 472), by title prefix |
|---|---|
| A1 an unlock with no id or two ids reads `effects[0]` (the merged build's `?? ""`) / A4 a nameless unlock is silent | a logged unlock with no ability id, a tampered log |
| A2 a pool may hold `""` | createLevels refuses bad rules |
| A3 the merged step-18 reading (`effects[0] ?? ""`, no `""` refusal) plus A2 | a logged unlock with no ability id, a tampered log, createLevels refuses bad rules |
| B1 the snapshot drops `levels` (QA L17) | a pick through the door, levelling is off (+ smoke, chaos) |
| C1 the last index refused (QA D2) / C2 a negative index counts from the end / C3 a numeric string index accepted | every reject reason |
| E1 `(e)1` has no unlock branch / E6 `(e)1` reads the offer after the step | hostile picks, (e)1 and (a)9, exploit levels smoke |
| E2 an ability not offered / E3 whose bar it is ignored / E4 two ids / E5 a timed or targeted unlock, accepted by `(e)1` | (e)1 and (a)9 |
| F1 `(a)9` lets a refused step change levels / F2 … a step with no action | (e)1 and (a)9 |
| K1 `pick` not the last kind | exploit levels smoke |
| K2 a pick never sent twice | each hostile kind, exploit levels smoke |
| K3 an index text dropped / K4 a foe's unit id never sent / K5 the index key always sent | hostile picks, exploit levels smoke |
| K6 the old exploit mixes give `pick` a weight | exploit smoke, the exploit hunter is a seeded hostile peer |
| M1 `submit` appends an unlock before checking `effects` (QA HOLD 1) / M2 `apply` trusts a timed unlock's `effects` | a malformed unlock never throws |
| M3 `apply` passes `""` on to `choose` (the explicit refusal removed; QA HOLD 2) | the empty id never unlocks |
| M4 `createLevels` keeps the caller's live pools (QA HOLD 2) | the empty id never unlocks, createLevels keeps its own frozen copy |
| M5 … the caller's live rules / M6 the pools read twice (checked one read, copied from another) / M7 a bad shape throws `TypeError` | createLevels keeps its own frozen copy |
| M8 the wire reads the live mix / M9 … the live stream / M10 `EXPLOIT_KINDS` mutable / M11 the `CHAOS_CHECKS` entries mutable | the hunter's settings are its own |

All 33 test plants fail their named tests (`/tmp/s19-plants.log`: 33/33). M2 is caught by the notice count (the clock reports a callback throw instead of rethrowing it). On the prototype, step 18's 36 plants adapted to the merged build (`/tmp/s18-plants-B.sh`; L13 and D8 re-adapted to this step's code in `/tmp/s18-plants-B-r2.sh`) are now 36/36 with the named tests (they were 34/36: L17 and D2 now fail the door and every-reject tests). Grep plants (caught by Acceptance; `/tmp/s19-grep-plants.sh`, 19/19): `ChooseAbility` in `src/runtime` (M7); `core-types.ts` touched; an extra file; the door (`player.ts`) edited; `Math.random` in the wire; a second rng in the hunter; `pick` not last in the union; a pinned line edited; a test title renamed; a cap blown; a side literal in `src/sim`; `src/sim` importing `btf-adapters`; and, by the behaviour probes, M1, M2, M3, M4, M5, M8 and M10 above.

## Example
```ts
submit(world, { id: "u1", kind: "unlock", actor: "knight#1", target: null, durationMs: null, turns: null, effects: [] });
world.notices.at(-1);            // { code: "unlockFailed", message: "unlock failed" }; world.levels.offer("knight#1") unchanged
submit(world, { id: "u2", kind: "unlock", actor: "knight#1", target: null, durationMs: null, turns: null, effects: null as never });
// no throw: one more unlockFailed, world.log.lastSeq() unchanged (refused before the log)
const onlyPick = Object.fromEntries(EXPLOIT_KINDS.map((k) => [k, k === "pick" ? 1 : 0])) as ExploitGen["mix"];
exploitWire({ stream: "exploit", mix: onlyPick }, bot(1))(world, "player", budget);
// e.g. ['{"intent":{"type":"ChooseAbility","index":1e400,"unitId":"wolf#3"}}'] → fed: notOwn under a unit bar; under the side bar
// unitId is not read, so badPick if the side has an offer, else noOffer. Nothing changes either way.
```

## How later steps use this (context only; do not build)
- The online-play step validates every peer pick through the same door; the `pick` kind is its first hostile-peer fuzz for levelling. Refusal logging and flags live in the online add-on, never in `src/sim` (`docs/chaos-player-outline.md` §10).
- Seats in `runTicks` and retiring the action hook come with the first tick mode (idle RPG: `play.running` by Change Notice, plus the M6 Change Notice). That step needs a CEO answer first.
- QA may add "a refused pick changes no levels" to (a)9 and "an unlock comes only from the seat's own pending offer" to (e)1 in `docs/qa/chaos-player-invariants.md` (QA-owned).

## Decisions note: what to name
- Why the one-id rule sits in `apply` (logs from JSON) and not only at the door, and how you showed the merged `?? ""` reading is gone.
- How a pool `""` is refused, and why it is refused, not dropped; why `apply` also refuses `""` (two guards: either alone was QA's hole).
- Where a malformed `effects` is caught before `log.append`, and why `apply` checks again (a timed unlock lands later).
- What your setup copies hold, that each field is read once, and the other settings you found read live (the scan).
- How `pick` stays last, how the base mixes keep `pick: 0`, and how you checked that the sixteen base lines did not move.
- Your `(e)1` unlock branch: where the offer is read from (`before`) and why.
- How your `(a)9` change keeps the base lines (levelling off: both `undefined`).
- The draw order of the `pick` kind as you built it.
- Anything you chose that the file doesn't state (law 12).

## Do not touch
- `src/types/core-types.ts`, `BUILD_GUIDE.md`, `docs/**`, `scripts/**`, `eslint.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.dependency-cruiser.cjs` (change only by Change Notice).
- `src/core/**`, `src/state/**`, `src/runtime/**`, `src/project/**`, `src/fx/**`, `src/paint/**`, `src/btf-adapters/**`, `src/rules/turns/**`, `src/rules/levels/{types,index}.ts`, `src/index.ts`, `src/sim/{player,world,run,driver-phase,driver-tick,intents,chaos-gen,shrink,exploit-docs,dispose,index}.ts`.
- `tests/fixtures/**` and every test and helper not in the file list (`tests/sim/{ai,seats,input}.ts` included).
- Anything outside this repo: `/workspace/g-tile-engine/**`, `/workspace/tileengine/**`, `/workspace/towerchess*`.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 from a clean checkout of the head commit. `npm test`: fail 0, skipped 0, todo 0; pass ≥ 472; `rg -n '\.(only|skip|todo)\(' tests` prints nothing.
- [ ] `npm run sim` prints exactly the base's two lines (`… win 48 lose 2 … afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75`, `… win 22 lose 28 … b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c`); the four chaos, two exploit-docs, four exploit and six levels smoke lines are as at the base; the four exploit-levels lines are as in "Tests".
- [ ] `npm run check:state` / `check:law` print OK; `npm run deps` reports no violations; `sha256sum src/types/core-types.ts package.json .dependency-cruiser.cjs scripts/check-law.sh` prints `f00c722c0fc64322fcda7fe057c49ba6a94c3fd64c1b29f302c0bb3bb3492c23`, `1e5dd82cb52db7ffbff747b020ec550b383b9c7a1164f182a8b0e793a60088c5`, `45a3dbaad28c0c827e2aa64ed0b63129b471e29482c8d6e6d88f5211c5118831`, `4d7bbf48edf945851022711bf9a9e765db8eac63b77c52b14865e5faf83b0163`; `git diff <base>..<head>` over every "Do not touch" path is empty.
- [ ] Names: the `ExploitKind` line as quoted; `EXPLOIT_KINDS` at run time is the ten kinds in the quoted order; the nine test titles start as quoted ("a malformed unlock never throws (step 19)", "the empty id never unlocks (step 19)", "createLevels keeps its own frozen copy (step 19)", "the hunter's settings are its own (step 19)", "a logged unlock with no ability id (step 19)", "a tampered log (step 19)", "hostile picks (step 19)", "(e)1 and (a)9 with levelling (step 19)", "exploit levels smoke (step 19)"); the four pinned lines appear once each in `tests/sim`.
- [ ] Behaviour probes (QA runs them on the working tree): the five bad unlocks give five `unlockFailed` and leave `levels.state()` byte-identical, then one good unlock unlocks; a pool `""` throws the step-18 RangeError; an unlock with `effects` missing, `undefined`, `null`, a string, `[7]` or `[id, null]` never throws, gives `unlockFailed` and logs nothing, and a timed unlock spoiled before it lands gives one more `unlockFailed` and no clock error; a pool edited after create offers no `""` and `[""]` is refused without asking a loose `choose`; `levels.rules`, `EXPLOIT_KINDS` and `CHAOS_CHECKS` are frozen, an edit after create changes no rule, offer or wire; `(e)1` is quiet for a fair unlock and gives `levels` for a foe bar, an id not offered, two ids, a duration; `(a)9` gives `levels` for a refused or action-less step that changed levels; 600 `pick`-only wire calls send exactly the 13 index forms, the five unit-id kinds, `ChooseAbility` only, and at least one repeat.
- [ ] Boundaries: `rg -l ChooseAbility src` lists exactly `src/sim/exploit.ts`, `src/sim/index.ts`, `src/sim/player.ts`, `src/sim/types.ts`; none in `src/runtime`; one `createRng(` line in `src/sim/exploit.ts`; no `createRng|streamSeed` in `src/rules/levels`, `src/sim/actions.ts`, `src/sim/chaos.ts`; no `Math.random` in `src`.
- [ ] Laws hold: no `Date|performance.now|setTimeout|setInterval|setImmediate|queueMicrotask|requestAnimationFrame`, `createHash|crypto.|process.` or `node:` imports in `src`; no rules words (`hp|maxhp|mana|cost|damage|deck|cards?|stats?|gold|currency|reward`) in `src/sim`, `src/runtime`, `src/rules/levels`; no side literals in `src/sim` or `src/rules`; no `phase` word in `src/rules/levels`; nothing imports sim; `src/sim` and `src/rules` import nothing from `btf-adapters`.
- [ ] `git diff --name-status <base>..<head> -- . ':!handback'` lists exactly the 10 files of the file list (`A` for the one created, `M` for the rest); `git diff --stat` ≤ 400 changed lines, each file within its cap.
- [ ] Hand-back `handback/step-19-pick-hardening/r<N>/` complete per HAND-BACK.md, with the PR line as in Delivery; the bundle verifies and its branch tip is the hand-back commit; nothing committed to `main`.

## Not in this step (deferred; flagged, do not invent)
- Seats in `runTicks`, retiring the action hook (M6 Change Notice), the tick phase `play.running` (STATES Change Notice), RTS input tables (CEO-parked).
- What an unlocked ability does; XP for kills or attacks; the card-hand form; the ahead/behind sheets at 2, 5 and 8; reading pools from project documents; carrying levels between matches.
- A general action-shape guard in `submit` (QA HOLD scan): a hand-built action with a malformed `target` (`packAction` reads `at.c`), an invalid `durationMs` (`clock.after`) or bad `effects` on another kind can still throw; the door and `parseLog` never build these, and `src/core/log` is do-not-touch. `chaos-gen.ts` reads its mix live (do-not-touch); the `btf-adapters` presets are mutable objects (now copied by `createLevels`).
- A chaos-generator pick kind; refusal logging, flags or appeals (the online add-on); editing `docs/qa/chaos-player-invariants.md` (QA) or the outline (Architect).

## Out of scope
- Any HP, attack, damage or stat rule; networking, lobbies, saves; any change to the door, the command log format, the snapshot, the state tables or the gesture intents.
