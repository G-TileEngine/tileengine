# Rebuild record: step 00b, sides from data (S0b)

Original brief: [`docs/maker/steps/step-00b-sides-from-data.md`](../maker/steps/step-00b-sides-from-data.md) r1 (blob `68a9138e`, sha256 `fe9f13b9f2ccdbbfa478e546049de6e6ef831d3c4a2cb0bddfaaf31352ae3933`, 115 lines, the same on main and at the merge). This is a play-stage step with no maker screen (guide L3). Do [`step-04a.md`](step-04a.md) first; this step starts on the 4a merge. This file records exactly what shipped.

Sources: PR #84 and branch `step/step-00b-sides-from-data-r1-chatA` (r1 tip `87f67eae`, r1 code head `aeb9a623`); `handback/step-00b-sides-from-data/r1/HANDBACK.md` at `87f67eae` (HB, blob `0c8e67a0`, 119 lines); Chief Of Staff verify report `/workspace/share/step00b-verify/report.md` (V, sha256 `2dc0c51a9d8c7cfc0644f20b841e0eb94a0acfcb513d6a0489383e7ba9427360`, 214 lines). Local `/workspace/tileengine/docs/qa/step-00b-review.md` (QA, git hash-object `f353f7f4`, 36 lines): **OK TO OPEN PR**, no must-fixes. Line numbers are at the commit named. Code line cites are at merge `d62f87bc` unless said otherwise.

## (a) Start and finish

| | Value |
|---|---|
| Base | `02efdd040ce0384c08b0a51fb310fc7737df7de5`, the step 4a merge (PR #83). Floor **1053** tests (guide L10: if CoS gives a later base, the floor is that base's count + 7; the go-line base is the 4a merge, already 1053) |
| r1 commits | `aeb9a623` play-stage: sides and paint come from the stage (code head, tree `ae649638`), `87f67eae` hand-back (tree `901f9d7a`) (V, HB:3). Linear, no merges. Author and committer `G-TileEngine <G-TileEngine@users.noreply.github.com>` |
| r1 verdict | QA **OK TO OPEN PR** (QA:3). No must-fixes. r1 only |
| Merge | PR #84 "Step 00b: sides from data", merge commit `d62f87bc521115cff588282a48ce086535743207`, 2026-11-19 19:29 (UK time). Tree `84968a8dbbef6138dd8862f7fd59d4c60d431c1f` (the same tree CoS merged against `461596eb`; V §11, QA:36). First parent `461596eb980f0dd9cc0caf2db8dcb358747b3695` (the step-04a rebuild record and QA reviews, docs-only after `02efdd04`), second parent `87f67eae` |
| After the merge | main is still `d62f87bc`. The 00b QA review is local only; it has not been added to main yet |
| Tests | 1053 + N=7 (the named sides tests) = **1060 pass / 0 fail** (HB:15-23, V §4, QA:8) |
| Size | Accepted measure, `git diff --shortstat 02efdd04..aeb9a623 -- . ':!handback/**'`, is 7 files, **130 insertions + 37 deletions = 167** ≤ 400 (guide L74, L97; checklist G7 at `docs/qa/handback-checklist.md` L26; `BUILD_GUIDE.md` L123; QA:14, HB:25). The same shortstat holds at the r1 tip `87f67eae`. On the merge commit, also exclude `':!docs/**'` (or measure at the code head): main added three docs files after the base, 1216 insertions, which are not this step. Without that exclusion the merge shortstat is 10 files, 1346 insertions and 37 deletions. Every file is inside its cap (QA:14, HB:114) |
| Stamp | `node tools/maker/build.ts <out>` writes stamp `aea638c4c7f6`. Compared with the base build, the play-stage release changes only `build.json`, the five edited `tools/play-stage/*.js` files and the new `sides.js`. The maker adds only `sides.js`. No editor code and no dev globals (QA:23) |
| Smoke | This step changes play-stage input and drawing, so S0 is required (guide L19-20, L101). S0 sha256 `d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941` (blob `1f50845a`, 107 lines) is unedited. Under google-chrome: S0 prints `TOUCH SMOKE PASS` after 7 ok at 390 and 7 ok at 360, port 8797; s3 prints `TOUCH SMOKE PASS` after checks 1–9 at both widths, port 8798; s4a prints `SMOKE PASS` after checks 1–8 at both widths, port 8799 (guide L101; HB:43-105; V §7; QA:22) |

## (b) Files

From `git diff --name-status 02efdd04..87f67eae -- . ':!handback/**' ':!docs/**'`. Line counts are `git diff --numstat` insertions and deletions. The same 7 product files are on the merge tree `84968a8d`.

| File | Change | Lines | Purpose |
|---|---|---|---|
| `tools/play-stage/sides.ts` | new | 12 (cap 25) | Pure: `NEUTRAL`, `type Paint`, `sidesOf` (Rules 1, guide L48-52, L66) and `paintOf` (Rules 5, guide L56, L66) |
| `tools/play-stage/match.ts` | edited | 32 (15+/17−, cap 35) | Rules 2 and 3: drop `SIDES` and `type Side`; `me` / `order` / guarded `wiped`; every `"wolves"` and `"player"` literal; `mine` in `view()` (guide L67, L54) |
| `tools/play-stage/board.ts` | edited | 13 (8+/5−, cap 20) | `sides` on `play`; `createPlayer` side; the paint map and scene sprites (Rules 6); `pixelsOf` plain recipe-id bake is `TEAM.neutral` (guide L68, L60) |
| `tools/play-stage/looks.ts` | edited | 5 (3+/2−, cap 10) | `dressPx` by `@paint` (Rules 6, guide L69, L58) |
| `tools/play-stage/load.ts` | edited | 20 (10+/10−, cap 22) | `TEAM` rename `wolves` → `enemy`; drop `Recipe.team` and the team value on each of the 7 rows (guide L70, L56) |
| `tools/play-stage/hud.ts` | edited | 6 (3+/3−, cap 8) | `mine` in `HudView`; banner and End-turn colour use it (guide L71, L54) |
| `tests/tools/play-stage-sides.test.ts` | new | 79 (cap 110) | The 7 named tests (guide L72, L76-83). Each name matches the guide character for character (QA:9) |

No other product file. Nothing under `src/`, `tests/tools/golden/`, `handoff/`, `tools/host-example/`, `scripts/`, `fixtures/`, `data/`, `package.json` or `package-lock.json`. No existing test was edited (guide L87-88, QA:13).

One-job rule (`docs/qa/handback-checklist.md` §3 I, L67): no touched code file is over about 500 lines. The largest is `match.ts` at 171 lines. `sides.ts` holds the one job the guide gives it (QA:18, V check 14).

## (c) Key code and git commands

`sidesOf` is the whole of Rules 1. Types and body at `tools/play-stage/sides.ts:1-12`:

```ts
export const NEUTRAL = "neutral";
export type Paint = "player" | "enemy" | "neutral";
const box = (v: unknown): Record<string, unknown> | null => (typeof v === "object" && v !== null ? v as Record<string, unknown> : null);
export function sidesOf(stage: unknown, units: readonly { readonly side: string }[]): { readonly me: string; readonly order: readonly string[]; readonly contest: boolean } {
  const root = box(stage), sides = root !== null && Object.hasOwn(root, "sides") ? box(root["sides"]) : null;
  const load = sides !== null && Object.hasOwn(sides, "loadout") ? sides["loadout"] : undefined;
  const me = typeof load === "string" ? load : "player";
  const present: string[] = [];
  for (const unit of units) if (unit.side !== NEUTRAL && !present.includes(unit.side)) present.push(unit.side);
  return { me, order: [me, ...present.filter((side) => side !== me)], contest: present.length >= 2 };
}
export const paintOf = (side: string, me: string): Paint => (side === me ? "player" : side === NEUTRAL ? "neutral" : "enemy");
```

`me` defaults to `"player"` when `stage.sides.loadout` is not a string. That is the format's own default (§6.5; guide L93; HB:109), the same one `resolvePlacements` already uses, not a silent Law 12 default. Document keys use `Object.hasOwn` (guide L92). `"neutral"` is skipped in `present`, so it never enters `order`. `contest` is true only when two or more non-neutral sides have a unit at start (guide L51). `createPlay` computes this once (`tools/play-stage/board.ts:65`) and returns it as `sides` (`board.ts:120`). Sides never change during a match in this step (guide L52).

`createPlay` then uses `sides.me` for the player and keeps the existing bot budget (guide L43, L54):

```ts
const player = createPlayer(world, { side: sides.me, moveMs, nextId: () => `p${n += 1}`, step, spellOf: (id) => { const u = world.units.get(id); return u === undefined ? undefined : spellRef(body.rules, u.unitId); } });
const bot = botAbilityPriority({ setup: body.rules, stepReach: step.reach, actionsPerTurn: budget.actionsPerTurn });
```

Those two lines are `board.ts:75-76`. The bot is `src/rules/turns/bot-ability-priority.ts`; this step does not edit it.

`createMatch` reads `play.sides` once (`tools/play-stage/match.ts:23-24`) and drops `SIDES`, `type Side`, and every `"player"` / `"wolves"` literal (guide L54). There is no `"player"` or `wolves` left in `match.ts` or `board.ts` (QA:17). `wiped` is only created when `contest` is true, so free roam never calls `wipeRule` (guide L53, Rules 2):

```ts
const me = play.sides.me, order = play.sides.order, wiped = play.sides.contest ? wipeRule(win.out, order) : null;
let side = me, outcome: Outcome | null = null, talk: Talk | null = null, round = 1, turns = 0, queue: Action[] = [], armed: "unitSelected" | "actMenu" | null = null;
```

`finish` (`match.ts:36-46`) walks `order` and falls back to `me`. The wipe uses optional call, so a one-side stage has no outcome:

```ts
const finish = (): boolean => {
  const from = play.world.phases.battle;
  if (from !== "idle" && from !== "unitSelected") return false;
  go({ type: "END_TURN" }); go({ type: "SIDE_END" });
  const got = wiped?.(play.world, { round, side }) ?? null;
  if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return true; }
  const i = order.indexOf(side), last = i + 1 >= order.length;
  go({ type: "CHECK_NONE", next: last ? "roundEnd" : "sideStart" });
  if (last) { go({ type: "ROUND_END" }); round += 1; go({ type: "ROUND_BEGIN" }); }
  side = order[(i + 1) % order.length] ?? me; if (side === me) spent.clear(); go({ type: "SIDE_BEGIN" }); return false;
};
```

Every side after `me` is a bot side, run in `order`, each with `play.bot(play.world, side)` and the same `actions_per_turn` budget (guide L54). `pump` (`match.ts:65`) and `endTurn` (`match.ts:115`) use `side !== me`. `landed` (`match.ts:78`) returns early when `side === me`. The `pump` line keeps both `side !== me` checks from the base's both `side === "wolves"` checks (`02efdd04` `match.ts:67`):

```ts
if (queue.length === 0 && play.walk === null && side !== me && !finish() && side !== me) { queue = [...play.bot(play.world, side)]; pump(); }
```

The second `side !== me` is after `finish()`, which assigns `side = order[(i + 1) % order.length] ?? me` (`match.ts:45`). That is the guide's "run the bot for the side `finish` lands on when it isn't `me`" (guide L54). Recursion in `pump` is bounded by `order.length`, because each hop advances `side` along `order` and stops when `side === me` or `finish()` returns true.

`view()` adds `mine: side === me` (`match.ts:134`). `createMatch` returns `sides` on the API (`match.ts:170`):

```ts
return api as typeof api & { readonly side: string; readonly outcome: Outcome | null; readonly talk: Talk | null; readonly done: ReadonlySet<string>; readonly sides: typeof play.sides };
```

`HudView` gains `readonly mine: boolean` (`tools/play-stage/hud.ts:3`). The two colour lines use it in place of `view.side === "player"` (guide L39, L54, L71):

```ts
banner.style.background = view.mine ? "#14213d" : "#6b1d2a";
```

at `hud.ts:25`, and `q("end").style.outlineColor = view.mine ? "#2f6fad" : "#b23b32"` at `hud.ts:28`. The hex values are unchanged.

Colour is by side, not recipe (Rules 5). `tools/play-stage/load.ts:6-7`:

```ts
export const TEAM = { player: 0x2f6fad, enemy: 0xb23b32, neutral: 0xc6a15a } as const;
export type Recipe = { readonly id: string; readonly name: string };
```

`TEAM.wolves` is renamed `TEAM.enemy` at the same hex `0xb23b32`. `Recipe.team` is gone from the type, `fallback` (`load.ts:8`) and the 7 `RECIPES` rows (`load.ts:9-16`). Names and ids are unchanged (guide L56, L90).

Sprite ids stay stable so the frozen S0 smoke and the pinned tests still find units by recipe id (Rules 6, guide L57-60). `createPlay` builds a paint map once (`board.ts:78-79`). The scene sprite is the recipe id for the first paint of that recipe in placement order; a later unit of the same recipe in a different paint uses `<recipeId>@<paint>`. The sheet is always `unitAsset(\`${recipeId}@${tone}\`)`:

```ts
const fx = createPlayFx(body.effects), looks = dress(world.grid, body.looks), paint = new Map<string, { readonly sprite: string; readonly asset: SceneAsset }>(), seen = new Map<string, string>();
for (const u of world.units.all()) { const recipeId = recipeIn(body.recipes, u.unitId).id, tone = paintOf(u.side, sides.me), prior = seen.get(recipeId); if (prior === undefined) seen.set(recipeId, tone); paint.set(u.id, { sprite: prior === undefined || prior === tone ? recipeId : `${recipeId}@${tone}`, asset: unitAsset(`${recipeId}@${tone}`) }); }
```

`scene()` reads that map (`board.ts:135`):

```ts
const units = world.units.all().map((u) => { const row = paint.get(u.id); if (row === undefined) throw new Error("play: paint"); assets[row.sprite] = row.asset; return { id: u.id, sprite: row.sprite, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
```

`dressPx` (`tools/play-stage/looks.ts:34-42`) splits at the last `@`, and paints only a known `RECIPES` id with an own `TEAM` key (`Object.hasOwn`). A plain `play:anim:<recipeId>` with no `@` paints neutral. `play:anim:constructor` stays `undefined`:

```ts
export function dressPx(id: string): Pixels | undefined {
  if (id === "play:ground") return strip([0x243044, hex(WATER_RAMP[0]), 0x6b6256]);
  if (id === "play:canopy") return strip([0x1e6b3a]);
  if (id === "play:brazier") return strip([hex(FLAME_RAMP[0])]);
  if (!id.startsWith("play:anim:")) return undefined;
  const body = id.slice("play:anim:".length), cut = body.lastIndexOf("@"), recipeId = cut < 0 ? body : body.slice(0, cut), paint = cut < 0 ? "neutral" : body.slice(cut + 1);
  if (!Object.values(RECIPES).some((row) => row.id === recipeId) || !Object.hasOwn(TEAM, paint)) return undefined;
  return animPx(paint === "player" ? TEAM.player : paint === "enemy" ? TEAM.enemy : TEAM.neutral);
}
```

`pixelsOf`'s plain recipe-id bake has no side, so it bakes `TEAM.neutral` (`board.ts:46`; at base `02efdd04` this was line 45, `TEAM[recipe.team]`; the new `sides.ts` import shifts it by one):

```ts
for (const recipe of Object.values(RECIPES)) if (recipe.id === id) return bake(id, TEAM.neutral, recipe.name.slice(0, 1));
```

The seven named tests live in `tests/tools/play-stage-sides.test.ts`. They are built as `createMatch({ ...demoDocs(), stage: edited structuredClone(stage) }, 20)` with `demoDocs` and `U` from `tests/tools/demo-fixture.ts`. No new fixture file (guide L76). The names, character for character (guide L77-83, QA:9):

1. `sides: the demo builds [player, wolves] from data, wolves act on End Turn, and the turn returns` — bundled demo, `order` is `["player","wolves"]` and `contest` is true; after End Turn and the walks land, a Wolf has a log entry, the side is `player` and there is no outcome (`play-stage-sides.test.ts:32-36`).
2. `sides: an enemy pool on the default side 'rival' gets enemy turns and can be wiped for a win` — `sides` deleted, order `["player","rival"]`; End Turn gives a Wolf a log entry and returns to `player`; with every Wolf removed, the next End Turn is a `win` (`:37-43`).
3. `sides: a stage with one side at start is free roam: no outcome, End Turn returns to the player` — `enemyPool: { mode: "fixed", entries: [] }`, order `["player"]`, `contest` false; three End Turns leave `outcome === null`, side `player` and phase `idle` (`:44-48`).
4. `sides: a neutral placed with side = the enemy side ('rival') acts and is targetable` — `sides` deleted, Wolves removed, Villager neutral entry `side: "rival"`; the Villager moved next to the Knight is in `targetsFor(…, "basic")`, and after End Turn the Villager has a log entry (`:49-53`).
5. `sides: a neutral with no side is never targeted, never acts and is not counted for the wipe` — demo Villager next to the Knight is not a basic target, `neutral` is not in `order`; with the Wolves removed, End Turn is a `win` while the Villager lives and has no log entry (`:54-60`).
6. `sides: unit colour comes from side, not the recipe` — first pixel of Knight, Wolf, Villager and Merchant (side `player`) is `TEAM.player`, `TEAM.enemy`, `TEAM.neutral` and `TEAM.player`; a Villager on the enemy side (pool and a sided neutral) is `TEAM.enemy`; an extra no-side Wolf is `TEAM.neutral` while the pool Wolves stay `TEAM.enemy` (`:61-72`).
7. `sides: no play-stage file names the wolves or reads a recipe team` — every `tools/play-stage/*.ts` matches neither `/wolves/` nor `/\.team\b/` (`:73-79`).

Each of the 7 failed on the base `02efdd04` before the change (0 pass / 7 fail) and passed on the tip (HB:29, V check 5, QA:10). On the base, tests 1, 2, 3 and 5 threw on a missing `play.sides`; test 4's villager log assertion was false; test 6 compared the wolf pixel with `TEAM.enemy`, which did not exist; test 7 found `wolves` in `board.ts` (HB:29). QA plants (QA:11): changing `contest` to `present.length >= 1` fails only test 3; dropping the neutral branch of `paintOf` fails only test 6.

Pinned tests must pass unedited (guide L45): `tests/tools/play-stage-p17.test.ts`, `tests/tools/touch-play.test.ts`, `tests/tools/play-stage.test.ts`, `tests/tools/play-stage-looks.test.ts`, `tests/tools/play-stage-parity.test.ts`. P2 (`tests/project/load/one-parser.test.ts`) passes with no edit (guide L91, L98; HB:26; QA:12). `tools/host-example/` is untouched; it keeps its own `["player","wolves"]` at line 17, out of scope (guide L94, L114). No new dependency and no new framework (guide L86, L94).

## (d) What went wrong, in order, and the fix

r1 only. QA **OK TO OPEN PR**, no must-fixes (QA:3). There is no r2 product change.

The go-line base is the 4a merge `02efdd04`, not the guide's written tip `3bd3e5db` (guide L9-12). Guide L12 warned that 4a would edit `tools/play-stage/looks.ts` ground frames and that this step would then need a rebase. 4a shipped with zero `tools/play-stage/` diff (Path and Dirt are hidden, not painted), so this step's `dressPx` edit needed no rebase. The guide's play-stage line numbers still held on `02efdd04` (HB:108), with two cite notes that change no code:

1. **Guide L42 path.** L42 lists `bot-ability-priority.ts` line 18 (`foeOf`) after `src/rules/battle/targets.ts` line 10 and `battle.ts` line 60, which reads as `src/rules/battle/bot-ability-priority.ts`. The file is `src/rules/turns/bot-ability-priority.ts:18`. CoS's verify report quoted this as `src/rules/ai/`, which the guide does not say. Docs-only; fix it in the next guide revision (QA:26, QA:33).
2. **`recipeIn` tails (step 02b carry A).** The guide cites `recipeOf` at `match.ts:136` and `board.ts:132` because it was checked on `3bd3e5db`. At base `02efdd04` both tails already call `recipeIn(body.recipes, …)` (from step 02b, carry A). This step keeps the `match.ts` tail as is apart from `"player"` → `me` (it is `match.ts:134` at the merge, after `SIDES` / `type Side` were removed), and replaces `board.ts:132`'s `worn` lookup with the paint map (Rules 6; the scene units line is `board.ts:135` at the merge). Not creep: no new `recipeIn` behaviour (QA:27).

The trial count on `3bd3e5db` was 7 files, 121 insertions and 34 deletions (guide L74, L109). On the go-line base the accepted count is 130 + 37 = 167. Do not chase the trial number.

## (e) Do it right first time

- Start from the 4a merge `02efdd04`. The floor is 1053 + 7 = 1060, not the 1043 written against `3bd3e5db`.
- Put `sidesOf` / `paintOf` in `tools/play-stage/sides.ts`. Do not hard-code `SIDES`, `type Side`, `"player"` or `"wolves"` in `match.ts`. Use `play.sides.me`, `play.sides.order` and `play.sides.contest`.
- Skip `wipeRule` when `contest` is false (`wiped?.(…) ?? null`). A one-side stage must stay in free roam with no outcome.
- Run every side after `me` as a bot, in `order`, with the existing `actions_per_turn` budget. Do not add a second budget and do not edit `src/`.
- Keep sprite ids stable (Rules 6): the first paint of each recipe keeps the recipe id as the scene sprite; later paints use `<recipeId>@<paint>`. If you suffix every sprite, S0 and the pinned tests break.
- Colour comes from `paintOf` and `TEAM.player` / `TEAM.enemy` / `TEAM.neutral`. Remove `Recipe.team`. Rename `TEAM.wolves` to `TEAM.enemy` at the same hex. `pixelsOf` of a plain recipe id bakes `TEAM.neutral`.
- The 7 test names must match guide L77-83 character for character. Each must fail on the base and pass on the tip. Do not edit any existing test, golden, fixture or smoke script.
- Measure with `git diff --shortstat <base>..HEAD -- . ':!handback/**'`. Count insertions plus deletions. 167 is the accepted number. Do not trim a test to fit a cap.
- `me` defaulting to `"player"` is the format default, not a silent one. Use `Object.hasOwn`. No `JSON.parse`, `formatVersion` or `kind ===` in `tools/play-stage`. Leave `tools/host-example/` and `scripts/sim.ts` alone.

## (f) Rebuild check

From a rebuild branch on `02efdd04` with the 7 product files committed and matching the blob table (or on the merge `d62f87bc`):

```bash
# Product gate. On the merge also exclude docs/**, because main added the
# step-04a record and QA reviews after 02efdd04; those are not this step.
# The branch itself did not touch docs, so the same command without
# ':!docs/**' at the code head is the QA measure and is also 130 + 37 = 167.
git diff --shortstat 02efdd04..HEAD -- . ':!handback/**' ':!docs/**'
#   7 files changed, 130 insertions(+), 37 deletions(-)

git diff --shortstat 02efdd04..HEAD -- . ':!handback/**'   # at the code head or r1 tip
#   7 files changed, 130 insertions(+), 37 deletions(-)

sha256sum tests/tools/golden/demo-parity.json
#   90dde42a3f1aeec4845ea3d5997e1f6bf06b9ec039bc070309d4eb4a49a86839
git diff --stat 02efdd04..HEAD -- tests/tools/golden/   # empty

sha256sum handoff/steps/tests/s0-play-input/touch-smoke.mjs
#   d528795e50897328c1f300d0bbd5807e3f74cc80ca0f27eed0af6e77f4903941

npm ci && npm run green   # 1060 pass, 0 fail. Includes:
#   ✔ (a) parity: seed 24301 bot versus bot equals the 1a golden
# and the 7 ✔ sides: … lines. The same 7, copied onto the base without
# this change, are 0 pass / 7 fail.

# Smokes under google-chrome, at 390 and 360 CSS px:
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s0-play-input/touch-smoke.mjs . 8797
#   7 ok @390, 7 ok @360, then TOUCH SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s3-test/touch-smoke.mjs . 8798
#   ok 1-9 @390, ok 1-9 @360, then TOUCH SMOKE PASS
PLAYWRIGHT_CORE=<playwright-core dir> CHROME=<chrome bin> node handoff/steps/tests/s4a-stage-paint/smoke.mjs . 8799
#   ok 1-8 @390, ok 1-8 @360, then SMOKE PASS
```

Against the merge tree: on your rebuild branch, `git diff 02efdd04 HEAD -- tests/tools/play-stage-sides.test.ts tools/play-stage/board.ts tools/play-stage/hud.ts tools/play-stage/load.ts tools/play-stage/looks.ts tools/play-stage/match.ts tools/play-stage/sides.ts` must be empty. The blob table below lists the exact git blob id each file must have at `d62f87bc`; `git ls-tree -r HEAD -- <path>` on the rebuild must show the same id.

## QA non-blockers carried forward

From QA:26-27 and QA:31-33, plus two 4b notes confirmed against merge `d62f87bc` (they are not numbered in QA:30-33). None of these blocked the PR.

1. The hud colour switch (`view.mine`) has no test. A mutation back to `view.side === "player"` still passes green, because the hud is DOM-only and the guide asks for no test. A cheap hud test would pin it in 4b (QA:31).
2. A stage whose only starting side is not `me` gets `contest` false, so it has no outcome and that side plays forever. That follows the data (Rules 1-2). 4b's no-enemy info row should cover the case (QA:32).
3. Fix the guide L42 path in the next guide revision: the file is `src/rules/turns/bot-ability-priority.ts`, not the `src/rules/battle/…` path L42 implies (QA:26, QA:33).
4. The `recipeIn` tails at `match.ts` / `board.ts` came from step 02b carry A. They were already on base `02efdd04`. This is not creep (QA:27). See (d).
5. The second `side !== me` at `match.ts:65` needs a comment. It is not a duplicate of the first check: `finish()` in between advances `side` along `order` (see (c)).
6. `pump()` is bounded by `order.length` (each recursive hop follows `finish()` along `order`, and stops when the turn returns to `me` or an outcome is set). This was checked by QA in a follow-up (not in QA f353f7f4) with 4 node repro cases at aeb9a623, 3 of them with a bot side that had no units or no legal actions: none hung, each End Turn returned to me or ended with an outcome.

Step 2, step 3 and step 4a carries that were already open are unchanged by this step.

## Blob check

Each file must have exactly this git blob id at `d62f87bc`. On a rebuild run `git ls-tree -r HEAD -- <path>` and compare, or `git hash-object <path>`.

| File | git blob id | lines |
|---|---|---|
| `tools/play-stage/sides.ts` | `c99207747b8c49d3abdd2a3ea77ca095e3d1e656` | 12 |
| `tools/play-stage/match.ts` | `fcde4e211edf57f967620c06a511b0a91db9a866` | 171 |
| `tools/play-stage/board.ts` | `f9ea85d2018055cfaf4b255cbc316302fe4d7dc0` | 139 |
| `tools/play-stage/looks.ts` | `dc402a5b955c7f2b1f96fce0ead160ab275aaeea` | 62 |
| `tools/play-stage/load.ts` | `33b37c86405e380349eb00d31e232089dd7bd537` | 26 |
| `tools/play-stage/hud.ts` | `675f1a8c39093b97ac0114a5801af9ff09e8a862` | 37 |
| `tests/tools/play-stage-sides.test.ts` | `02af1adbc18737b6fef8fd412530e0389b4d0916` | 79 |

## Appendix: full code as merged (step 00b, PR #84)

New files are given in full. Edited files are given as the exact diff from `02efdd04` to `d62f87bc`, then in full as merged. Copy them byte for byte; the blob table checks you did.

### `tools/play-stage/sides.ts` (new)

```ts
export const NEUTRAL = "neutral";
export type Paint = "player" | "enemy" | "neutral";
const box = (v: unknown): Record<string, unknown> | null => (typeof v === "object" && v !== null ? v as Record<string, unknown> : null);
export function sidesOf(stage: unknown, units: readonly { readonly side: string }[]): { readonly me: string; readonly order: readonly string[]; readonly contest: boolean } {
  const root = box(stage), sides = root !== null && Object.hasOwn(root, "sides") ? box(root["sides"]) : null;
  const load = sides !== null && Object.hasOwn(sides, "loadout") ? sides["loadout"] : undefined;
  const me = typeof load === "string" ? load : "player";
  const present: string[] = [];
  for (const unit of units) if (unit.side !== NEUTRAL && !present.includes(unit.side)) present.push(unit.side);
  return { me, order: [me, ...present.filter((side) => side !== me)], contest: present.length >= 2 };
}
export const paintOf = (side: string, me: string): Paint => (side === me ? "player" : side === NEUTRAL ? "neutral" : "enemy");
```

### `tests/tools/play-stage-sides.test.ts` (new)

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { targetsFor } from "../../src/rules/battle/index.ts";
import { TEAM } from "../../tools/play-stage/load.ts";
import { createMatch } from "../../tools/play-stage/match.ts";
import { demoDocs, U } from "./demo-fixture.ts";

type Stage = Record<string, unknown>;
type Match = ReturnType<typeof createMatch>;
const stageOf = (): Stage => { const raw = structuredClone(demoDocs().stage); if (typeof raw !== "object" || raw === null) throw new Error("stage"); return raw as Stage; };
const open = (stage: Stage): Match => createMatch({ ...demoDocs(), stage }, 20);
const idOf = (m: Match, unitId: string): string => { const id = m.world.units.all().find((u) => u.unitId === unitId && u.alive)?.id; if (id === undefined) throw new Error(unitId); return id; };
const land = (m: Match): void => { m.endTurn(); for (let i = 0; i < 40 && m.walk !== null; i += 1) { m.world.clock.advance(40); m.sync(); } };
const logged = (m: Match, unitId: string): boolean => { const ids = new Set(m.world.units.all().filter((u) => u.unitId === unitId).map((u) => u.id)); return m.world.log.entries().some((e) => ids.has(e.action.actor)); };
const rows = (v: unknown): Stage[] => Array.isArray(v) ? v.flatMap((row) => (typeof row === "object" && row !== null ? [row as Stage] : [])) : [];
const noSides = (s: Stage): Stage => { const next = { ...s }; delete next["sides"]; return next; };
const noPool = (s: Stage): Stage => ({ ...s, enemyPool: { mode: "fixed", entries: [] } });
const tint = (m: Match, inst: string): number => {
  const scene = m.scene(), unit = scene.units.find((u) => u.id === inst), asset = unit === undefined ? undefined : scene.assets[unit.sprite];
  const px = asset === undefined ? undefined : m.pixels(asset.sheet.id), r = px?.data[0], g = px?.data[1], b = px?.data[2];
  if (r === undefined || g === undefined || b === undefined) throw new Error(inst);
  return ((r << 16) | (g << 8) | b) >>> 0;
};
const beside = (m: Match, unitId: string): string => {
  const knight = idOf(m, U.knight), other = idOf(m, unitId), at = m.world.units.get(knight)?.at;
  if (at === undefined) throw new Error("knight");
  if (!m.world.units.moveTo(other, { c: at.c, r: at.r - 1 }, "move").ok) throw new Error("move");
  return other;
};

test("sides: the demo builds [player, wolves] from data, wolves act on End Turn, and the turn returns", () => {
  const m = open(stageOf());
  assert.deepEqual([...m.sides.order], ["player", "wolves"]); assert.equal(m.sides.contest, true);
  land(m); assert.equal(logged(m, U.wolf), true); assert.equal(m.side, "player"); assert.equal(m.outcome, null);
});
test("sides: an enemy pool on the default side 'rival' gets enemy turns and can be wiped for a win", () => {
  const m = open(noSides(stageOf()));
  assert.deepEqual([...m.sides.order], ["player", "rival"]);
  land(m); assert.equal(logged(m, U.wolf), true); assert.equal(m.side, "player");
  m.world.units.all().filter((u) => u.unitId === U.wolf).forEach((u) => m.world.units.remove(u.id));
  land(m); assert.equal(m.outcome, "win");
});
test("sides: a stage with one side at start is free roam: no outcome, End Turn returns to the player", () => {
  const m = open(noPool(stageOf()));
  assert.deepEqual([...m.sides.order], ["player"]); assert.equal(m.sides.contest, false);
  for (let n = 0; n < 3; n += 1) { land(m); assert.equal(m.outcome, null); assert.equal(m.side, "player"); assert.equal(String(m.world.phases.battle), "idle"); }
});
test("sides: a neutral placed with side = the enemy side ('rival') acts and is targetable", () => {
  const s = noSides(noPool(stageOf())), m = open({ ...s, neutrals: rows(s["neutrals"]).map((row) => row["unitId"] === U.villager ? { ...row, side: "rival" } : row) });
  const villager = beside(m, U.villager), hits = targetsFor(m.world.grid, m.world.units, idOf(m, U.knight), "basic", demoDocs().rules);
  assert.equal(hits.some((t) => t.id === villager), true); land(m); assert.equal(logged(m, U.villager), true);
});
test("sides: a neutral with no side is never targeted, never acts and is not counted for the wipe", () => {
  const m = open(stageOf()), villager = beside(m, U.villager);
  assert.equal(targetsFor(m.world.grid, m.world.units, idOf(m, U.knight), "basic", demoDocs().rules).some((t) => t.id === villager), false);
  assert.equal(m.sides.order.includes("neutral"), false);
  m.world.units.all().filter((u) => u.unitId === U.wolf).forEach((u) => m.world.units.remove(u.id));
  land(m); assert.equal(m.outcome, "win"); assert.equal(m.world.units.get(villager)?.alive, true); assert.equal(logged(m, U.villager), false);
});
test("sides: unit colour comes from side, not the recipe", () => {
  const m = open(stageOf());
  assert.equal(tint(m, idOf(m, U.knight)), TEAM.player); assert.equal(tint(m, idOf(m, U.wolf)), TEAM.enemy);
  assert.equal(tint(m, idOf(m, U.villager)), TEAM.neutral); assert.equal(tint(m, idOf(m, U.merchant)), TEAM.player);
  const bare = noPool(stageOf()), foe = open({ ...bare, enemyPool: { mode: "fixed", entries: [{ unitId: U.villager, at: { c: 2, r: 0 } }] }, neutrals: rows(bare["neutrals"]).map((row) => row["unitId"] === U.villager ? { ...row, side: "wolves" } : row) });
  const painted = foe.world.units.all().filter((u) => u.unitId === U.villager && u.side === "wolves");
  assert.equal(painted.length, 2); for (const u of painted) assert.equal(tint(foe, u.id), TEAM.enemy);
  const extra = stageOf(), lone = open({ ...extra, neutrals: [...rows(extra["neutrals"]), { unitId: U.wolf, at: { c: 0, r: 6 } }] });
  const kept = lone.world.units.all().find((u) => u.unitId === U.wolf && u.side === "wolves"), added = lone.world.units.all().find((u) => u.unitId === U.wolf && u.side === "neutral");
  if (kept === undefined || added === undefined) throw new Error("wolf");
  assert.equal(tint(lone, kept.id), TEAM.enemy); assert.equal(tint(lone, added.id), TEAM.neutral);
});
test("sides: no play-stage file names the wolves or reads a recipe team", () => {
  for (const name of readdirSync(new URL("../../tools/play-stage/", import.meta.url))) {
    if (!name.endsWith(".ts")) continue;
    const text = readFileSync(new URL(`../../tools/play-stage/${name}`, import.meta.url), "utf8");
    assert.equal(/wolves/.test(text), false, name); assert.equal(/\.team\b/.test(text), false, name);
  }
});
```

### `tools/play-stage/match.ts` (edited)

Diff `02efdd04` → `d62f87bc`:

```diff
diff --git a/tools/play-stage/match.ts b/tools/play-stage/match.ts
index 877a198..fcde4e2 100644
--- a/tools/play-stage/match.ts
+++ b/tools/play-stage/match.ts
@@ -12,8 +12,6 @@ import { bundledDocs } from "./project.ts";
 
 /** Orthogonal reach of the demo line-shot when a row omits reach. Not an engine rule. */
 export const DEFAULT_SPELL_REACH = 3;
-const SIDES = ["player", "wolves"] as const;
-type Side = (typeof SIDES)[number];
 type Talk = { readonly name: string; readonly text: string };
 type Btn = { readonly show: boolean; readonly on: boolean };
 
@@ -22,8 +20,8 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
   const baseIntend = play.intend, baseSync = play.sync;
   const win = installOne(WIN_CONDITION, {});
   if (win.out === null) throw new Error("play: win-condition");
-  const wiped = wipeRule(win.out, SIDES);
-  let side: Side = "player", outcome: Outcome | null = null, talk: Talk | null = null, round = 1, turns = 0, queue: Action[] = [], armed: "unitSelected" | "actMenu" | null = null;
+  const me = play.sides.me, order = play.sides.order, wiped = play.sides.contest ? wipeRule(win.out, order) : null;
+  let side = me, outcome: Outcome | null = null, talk: Talk | null = null, round = 1, turns = 0, queue: Action[] = [], armed: "unitSelected" | "actMenu" | null = null;
   const spent = new Set<string>();
   const spellList = (id: string): { id: string }[] => {
     const actor = play.world.units.get(id), bag = rules.abilities;
@@ -39,12 +37,12 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
     const from = play.world.phases.battle;
     if (from !== "idle" && from !== "unitSelected") return false;
     go({ type: "END_TURN" }); go({ type: "SIDE_END" });
-    const got = wiped(play.world, { round, side });
+    const got = wiped?.(play.world, { round, side }) ?? null;
     if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return true; }
-    const i = SIDES.indexOf(side), last = i + 1 >= SIDES.length;
+    const i = order.indexOf(side), last = i + 1 >= order.length;
     go({ type: "CHECK_NONE", next: last ? "roundEnd" : "sideStart" });
     if (last) { go({ type: "ROUND_END" }); round += 1; go({ type: "ROUND_BEGIN" }); }
-    side = SIDES[(i + 1) % SIDES.length] ?? "player"; if (side === "player") spent.clear(); go({ type: "SIDE_BEGIN" }); return false;
+    side = order[(i + 1) % order.length] ?? me; if (side === me) spent.clear(); go({ type: "SIDE_BEGIN" }); return false;
   };
   const landMove = (action: Action): boolean => {
     const at = action.target !== null && action.target.pipe === "tile" ? action.target.at : undefined, unit = play.world.units.get(action.actor);
@@ -64,20 +62,20 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
       if (action.kind === "move" && landMove(action)) return;
       if (action.kind !== "move") submit(play.world, action);
     }
-    if (queue.length === 0 && play.walk === null && side === "wolves" && !finish() && side === "wolves") { queue = [...play.bot(play.world, "wolves")]; pump(); }
+    if (queue.length === 0 && play.walk === null && side !== me && !finish() && side !== me) { queue = [...play.bot(play.world, side)]; pump(); }
   };
   /** Ability confirm lands in `resolving`. Walk the legal edges back to `idle` (or `play.result` on a wipe) so the player can select again and End turn. Talk stays on `actMenu` and does not take `UNIT_DONE`. */
   const settle = (): void => {
     if (play.world.phases.battle !== "resolving") return;
     if (play.selected !== null) spent.add(play.selected);
     go({ type: "RESOLVE_DONE" });
-    const got = wiped(play.world, { round, side });
+    const got = wiped?.(play.world, { round, side }) ?? null;
     if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return; }
     go({ type: "CHECK_NONE", next: "unitDone" });
     go({ type: "UNIT_DONE", next: "idle" });
     play.followId = null;
   };
-  play.landed(() => { if (side !== "wolves") return; go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); pump(); });
+  play.landed(() => { if (side === me) return; go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); pump(); });
   const wipe = (): void => { play.aims = []; talk = null; play.focus(null); play.followId = null; };
   const back = (): "unitSelected" | "actMenu" | null => {
     if (play.world.phases.battle !== "targeting") return null;
@@ -110,17 +108,17 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
     },
     wait() { spend(); },
     endTurn() {
-      if (play.walk !== null || side !== "player" || outcome !== null) return;
+      if (play.walk !== null || side !== me || outcome !== null) return;
       if (play.world.phases.battle === "targeting") back();
       const now = play.world.phases.battle;
       if (now === "actMenu") spend(); else if (now === "unitSelected") baseIntend({ type: "Cancel" });
-      wipe(); turns += 1; if (finish()) return; const next = ((): Side => side)(); if (next === "wolves") { queue = [...play.bot(play.world, next)]; pump(); }
+      wipe(); turns += 1; if (finish()) return; if (side !== me) { queue = [...play.bot(play.world, side)]; pump(); }
     },
     closeTalk() { talk = null; if (play.world.phases.battle === "actMenu") spend(); play.focus(null); },
     recentreTarget(): Sq | null {
       const cur = play.selected === null ? undefined : play.world.units.get(play.selected);
       if (cur !== undefined && cur.alive) return { c: cur.at.c, r: cur.at.r };
-      const own = play.world.units.all().find((u) => u.alive && u.side === "player");
+      const own = play.world.units.all().find((u) => u.alive && u.side === me);
       return own === undefined ? null : { c: own.at.c, r: own.at.r };
     },
     restart: () => createMatch(docs, moveMs),
@@ -133,7 +131,7 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
       const btn = (show: boolean, hot: boolean): Btn => ({ show, on: hot });
       const spellOn = on && spellRef(rules, unit.unitId) !== undefined;
       return {
-        turn: side === "player" ? "YOUR TURN" : "ENEMY TURN", side, name: on ? names[unit.unitId] ?? recipeIn(body.recipes, unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
+        turn: side === me ? "YOUR TURN" : "ENEMY TURN", side, mine: side === me, name: on ? names[unit.unitId] ?? recipeIn(body.recipes, unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
         actions: { basic: btn(menu, basic.length > 0), spell: btn(menu && spellOn, spells.length > 0), talk: btn(on && interact.length > 0, interact.length > 0), wait: btn(phase === "actMenu", phase === "actMenu"), end: btn(true, true) },
       };
     },
@@ -149,10 +147,10 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
     if (intent.type !== "SelectUnit") return null;
     const u = play.world.units.get(intent.unitId); return u === undefined ? null : u.at;
   };
-  const ready = (id: string): boolean => { const u = play.world.units.get(id); return u !== undefined && u.alive && u.side === "player" && !spent.has(id); };
+  const ready = (id: string): boolean => { const u = play.world.units.get(id); return u !== undefined && u.alive && u.side === me && !spent.has(id); };
   const commit = (at: Sq): unknown => { const cell = { c: at.c, r: at.r }; api.intend({ type: "TargetCell", at: cell }); return api.intend({ type: "TargetCell", at: cell }); };
   play.feed = (intent: DoorIntent): unknown => {
-    if (talk !== null || play.walk !== null || side !== "player" || outcome !== null) return undefined;
+    if (talk !== null || play.walk !== null || side !== me || outcome !== null) return undefined;
     const phase = play.world.phases.battle, at = atOf(intent);
     if (phase === "targeting" && at !== null && listed(play.aims, at)) return commit(at);
     if (phase === "targeting") {
@@ -169,5 +167,5 @@ export function createMatch(docs?: PlayDocs, moveMs = 200) {
     if (phase === "actMenu" && intent.type === "SelectUnit") return undefined;
     return api.intend(intent);
   };
-  return api as typeof api & { readonly side: Side; readonly outcome: Outcome | null; readonly talk: Talk | null; readonly done: ReadonlySet<string> };
+  return api as typeof api & { readonly side: string; readonly outcome: Outcome | null; readonly talk: Talk | null; readonly done: ReadonlySet<string>; readonly sides: typeof play.sides };
 }
```

As merged:

```ts
import type { Action } from "../../src/core/log/index.ts";
import { inOrthogonalReach, targetsFor, wipeRule, WIN_CONDITION } from "../../src/rules/battle/index.ts";
import { installOne } from "../../src/rules/behaviours/registry.ts";
import { walkTo } from "../../src/rules/move/path.ts";
import { submit } from "../../src/sim/actions.ts";
import type { DoorIntent } from "../../src/sim/types.ts";
import type { Outcome } from "../../src/state/index.ts";
import type { Sq } from "../../src/types/core-types.ts";
import { createPlay, spellRef } from "./board.ts";
import { recipeIn, type PlayDocs } from "./load.ts";
import { bundledDocs } from "./project.ts";

/** Orthogonal reach of the demo line-shot when a row omits reach. Not an engine rule. */
export const DEFAULT_SPELL_REACH = 3;
type Talk = { readonly name: string; readonly text: string };
type Btn = { readonly show: boolean; readonly on: boolean };

export function createMatch(docs?: PlayDocs, moveMs = 200) {
  const body = docs ?? bundledDocs(), play = createPlay(body, moveMs, false), rules = body.rules, lines = body.talk ?? {}, names = body.names ?? {};
  const baseIntend = play.intend, baseSync = play.sync;
  const win = installOne(WIN_CONDITION, {});
  if (win.out === null) throw new Error("play: win-condition");
  const me = play.sides.me, order = play.sides.order, wiped = play.sides.contest ? wipeRule(win.out, order) : null;
  let side = me, outcome: Outcome | null = null, talk: Talk | null = null, round = 1, turns = 0, queue: Action[] = [], armed: "unitSelected" | "actMenu" | null = null;
  const spent = new Set<string>();
  const spellList = (id: string): { id: string }[] => {
    const actor = play.world.units.get(id), bag = rules.abilities;
    if (actor === undefined) return [];
    const row = bag !== undefined && Object.hasOwn(bag, actor.unitId) ? bag[actor.unitId]?.[0] : undefined;
    const reach = row?.reach ?? DEFAULT_SPELL_REACH, out: { id: string }[] = [];
    for (const foe of play.world.units.all()) if (foe.alive && foe.id !== actor.id && foe.side !== actor.side && foe.side !== "neutral" && inOrthogonalReach(actor.at, foe.at, reach)) out.push({ id: foe.id });
    return out;
  };
  const cells = (list: readonly { id: string }[]): Sq[] => list.flatMap((t) => { const u = play.world.units.get(t.id); return u === undefined ? [] : [u.at]; });
  const go = (e: Parameters<typeof play.go>[0]): void => { play.go(e); };
  const finish = (): boolean => {
    const from = play.world.phases.battle;
    if (from !== "idle" && from !== "unitSelected") return false;
    go({ type: "END_TURN" }); go({ type: "SIDE_END" });
    const got = wiped?.(play.world, { round, side }) ?? null;
    if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return true; }
    const i = order.indexOf(side), last = i + 1 >= order.length;
    go({ type: "CHECK_NONE", next: last ? "roundEnd" : "sideStart" });
    if (last) { go({ type: "ROUND_END" }); round += 1; go({ type: "ROUND_BEGIN" }); }
    side = order[(i + 1) % order.length] ?? me; if (side === me) spent.clear(); go({ type: "SIDE_BEGIN" }); return false;
  };
  const landMove = (action: Action): boolean => {
    const at = action.target !== null && action.target.pipe === "tile" ? action.target.at : undefined, unit = play.world.units.get(action.actor);
    if (at === undefined || unit === undefined) return false;
    play.focus(action.actor); play.followId = action.actor; go({ type: "SELECT_UNIT", unitId: action.actor });
    const path = walkTo(play.world.grid, play.world.units, action.actor, play.step.reach, at);
    if (path === null || path.length === 0) return false;
    go({ type: "TAP_MOVE_CELL", at: { c: at.c, r: at.r } });
    const dur = moveMs * path.length;
    submit(play.world, { ...action, durationMs: dur });
    play.arm({ path, from: { c: unit.at.c, r: unit.at.r }, t0: play.world.clock.now(), dur });
    return play.walk !== null;
  };
  const pump = (): void => {
    while (queue.length > 0 && play.walk === null) {
      const action = queue.shift(); if (action === undefined) break;
      if (action.kind === "move" && landMove(action)) return;
      if (action.kind !== "move") submit(play.world, action);
    }
    if (queue.length === 0 && play.walk === null && side !== me && !finish() && side !== me) { queue = [...play.bot(play.world, side)]; pump(); }
  };
  /** Ability confirm lands in `resolving`. Walk the legal edges back to `idle` (or `play.result` on a wipe) so the player can select again and End turn. Talk stays on `actMenu` and does not take `UNIT_DONE`. */
  const settle = (): void => {
    if (play.world.phases.battle !== "resolving") return;
    if (play.selected !== null) spent.add(play.selected);
    go({ type: "RESOLVE_DONE" });
    const got = wiped?.(play.world, { round, side }) ?? null;
    if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return; }
    go({ type: "CHECK_NONE", next: "unitDone" });
    go({ type: "UNIT_DONE", next: "idle" });
    play.followId = null;
  };
  play.landed(() => { if (side === me) return; go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); pump(); });
  const wipe = (): void => { play.aims = []; talk = null; play.focus(null); play.followId = null; };
  const back = (): "unitSelected" | "actMenu" | null => {
    if (play.world.phases.battle !== "targeting") return null;
    const from = armed === "unitSelected" ? "unitSelected" : "actMenu";
    baseIntend({ type: "Cancel" }); if (from === "unitSelected") go({ type: "UNDO_MOVE" }); armed = null; return from;
  };
  const spend = (): void => { if (play.world.phases.battle !== "actMenu") return; if (play.selected !== null) spent.add(play.selected); go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); play.followId = null; };
  const api = Object.assign(play, {
    intend(intent: DoorIntent) {
      const step = baseIntend(intent);
      if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "interact") {
        const target = step.action.target, id = target !== null && target.pipe === "unit" ? target.unitId : undefined, u = id === undefined ? undefined : play.world.units.get(id);
        const key = u === undefined ? "" : `talk-${u.unitId}`;
        const text = key !== "" && Object.hasOwn(lines, key) ? lines[key] ?? "" : "";
        talk = { name: u === undefined ? "" : names[u.unitId] ?? recipeIn(body.recipes, u.unitId).name, text };
        play.world.phases = { ...play.world.phases, battle: "actMenu" };
      } else if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "ability") settle();
      return step;
    },
    sync() { baseSync(); },
    choose(kind: "basic" | "spell" | "talk"): string | null {
      const id = play.selected; if (id === null) return "noUnit";
      const list = kind === "spell" ? spellList(id) : targetsFor(play.world.grid, play.world.units, id, kind === "talk" ? "interact" : "basic", rules);
      if (list.length === 0) return "noTarget";
      const from = play.world.phases.battle;
      const step = baseIntend({ type: "ChooseAction", actionId: kind === "talk" ? "interact" : kind, unitId: id });
      if (!("reject" in step) || step.reject !== null) return "reject" in step && step.reject !== null ? step.reject : "illegal";
      armed = from === "unitSelected" ? "unitSelected" : "actMenu";
      play.aims = cells(list); play.aimKind = kind === "spell" ? "spell" : "basic"; return null;
    },
    wait() { spend(); },
    endTurn() {
      if (play.walk !== null || side !== me || outcome !== null) return;
      if (play.world.phases.battle === "targeting") back();
      const now = play.world.phases.battle;
      if (now === "actMenu") spend(); else if (now === "unitSelected") baseIntend({ type: "Cancel" });
      wipe(); turns += 1; if (finish()) return; if (side !== me) { queue = [...play.bot(play.world, side)]; pump(); }
    },
    closeTalk() { talk = null; if (play.world.phases.battle === "actMenu") spend(); play.focus(null); },
    recentreTarget(): Sq | null {
      const cur = play.selected === null ? undefined : play.world.units.get(play.selected);
      if (cur !== undefined && cur.alive) return { c: cur.at.c, r: cur.at.r };
      const own = play.world.units.all().find((u) => u.alive && u.side === me);
      return own === undefined ? null : { c: own.at.c, r: own.at.r };
    },
    restart: () => createMatch(docs, moveMs),
    view() {
      const id = play.selected, unit = id === null ? undefined : play.world.units.get(id), phase = play.world.phases.battle, on = unit !== undefined && unit.alive;
      const max = unit === undefined ? 0 : (Object.hasOwn(rules.stats, unit.unitId) ? rules.stats[unit.unitId]?.hp : rules.base.hp) ?? rules.base.hp;
      const hp = on ? play.world.rules?.state().units.find((u) => u.id === unit.id)?.hp ?? max : 0;
      const menu = on && (phase === "unitSelected" || phase === "actMenu" || phase === "targeting");
      const basic = on ? targetsFor(play.world.grid, play.world.units, unit.id, "basic", rules) : [], interact = on ? targetsFor(play.world.grid, play.world.units, unit.id, "interact", rules) : [], spells = on ? spellList(unit.id) : [];
      const btn = (show: boolean, hot: boolean): Btn => ({ show, on: hot });
      const spellOn = on && spellRef(rules, unit.unitId) !== undefined;
      return {
        turn: side === me ? "YOUR TURN" : "ENEMY TURN", side, mine: side === me, name: on ? names[unit.unitId] ?? recipeIn(body.recipes, unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
        actions: { basic: btn(menu, basic.length > 0), spell: btn(menu && spellOn, spells.length > 0), talk: btn(on && interact.length > 0, interact.length > 0), wait: btn(phase === "actMenu", phase === "actMenu"), end: btn(true, true) },
      };
    },
  });
  Object.defineProperty(api, "side", { get: () => side });
  Object.defineProperty(api, "outcome", { get: () => outcome });
  Object.defineProperty(api, "talk", { get: () => talk });
  Object.defineProperty(api, "done", { get: () => spent });
  const same = (a: Sq, b: Sq): boolean => a.c === b.c && a.r === b.r;
  const listed = (list: readonly Sq[], at: Sq): boolean => list.some((c) => same(c, at));
  const atOf = (intent: DoorIntent): Sq | null => {
    if (intent.type === "TargetCell") return intent.at;
    if (intent.type !== "SelectUnit") return null;
    const u = play.world.units.get(intent.unitId); return u === undefined ? null : u.at;
  };
  const ready = (id: string): boolean => { const u = play.world.units.get(id); return u !== undefined && u.alive && u.side === me && !spent.has(id); };
  const commit = (at: Sq): unknown => { const cell = { c: at.c, r: at.r }; api.intend({ type: "TargetCell", at: cell }); return api.intend({ type: "TargetCell", at: cell }); };
  play.feed = (intent: DoorIntent): unknown => {
    if (talk !== null || play.walk !== null || side !== me || outcome !== null) return undefined;
    const phase = play.world.phases.battle, at = atOf(intent);
    if (phase === "targeting" && at !== null && listed(play.aims, at)) return commit(at);
    if (phase === "targeting") {
      const from = back(); play.aims = []; talk = null; play.followId = null;
      if (intent.type === "SelectUnit" && ready(intent.unitId) && intent.unitId !== play.selected) { if (from !== "unitSelected") spend(); return api.intend(intent); }
      return undefined;
    }
    if (intent.type === "SelectUnit" && !ready(intent.unitId)) return undefined;
    if (phase === "unitSelected" && intent.type === "TargetCell") {
      if (at !== null && listed(play.reach, at)) return commit(at);
      baseIntend({ type: "Cancel" }); wipe(); return undefined;
    }
    if (phase === "actMenu" && intent.type === "SelectUnit" && intent.unitId !== play.selected) { spend(); return api.intend(intent); }
    if (phase === "actMenu" && intent.type === "SelectUnit") return undefined;
    return api.intend(intent);
  };
  return api as typeof api & { readonly side: string; readonly outcome: Outcome | null; readonly talk: Talk | null; readonly done: ReadonlySet<string>; readonly sides: typeof play.sides };
}
```

### `tools/play-stage/board.ts` (edited)

Diff `02efdd04` → `d62f87bc`:

```diff
diff --git a/tools/play-stage/board.ts b/tools/play-stage/board.ts
index 8c307b4..f9ea85d 100644
--- a/tools/play-stage/board.ts
+++ b/tools/play-stage/board.ts
@@ -17,6 +17,7 @@ import { RECIPES, TEAM, TILE, docsToInput, recipeIn, recipeOf, type PlayDocs } f
 import { bundledDocs } from "./project.ts";
 import { createPlayFx, fxPx } from "./fx.ts";
 import { dress, dressPx, unitAsset } from "./looks.ts";
+import { paintOf, sidesOf } from "./sides.ts";
 
 export { recipeOf, TILE };
 const FONT: Readonly<Record<string, readonly number[]>> = {
@@ -42,7 +43,7 @@ export function pixelsOf(id: string): Pixels | undefined {
   if (id === "play:path-player") return bake(id, 0xf0c14a, "");
   if (id === "play:aim-attack") return bake(id, 0xe04848, "");
   if (id === "play:aim-spell") return bake(id, 0xf08a30, "");
-  for (const recipe of Object.values(RECIPES)) if (recipe.id === id) return bake(id, TEAM[recipe.team], recipe.name.slice(0, 1));
+  for (const recipe of Object.values(RECIPES)) if (recipe.id === id) return bake(id, TEAM.neutral, recipe.name.slice(0, 1));
   return id.startsWith("starter:unknown-") ? bake(id, TEAM.neutral, "?") : undefined;
 }
 export const MIN_CELL_CSS = 44;
@@ -61,6 +62,7 @@ type Walk = { path: readonly Sq[]; from: Sq; t0: number; dur: number };
 export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
   const body = docs ?? bundledDocs(), talk = body.talk ?? {}, chosen = body.chosen ?? [], tiles = body.tiles ?? [];
   const world = createWorld(docsToInput({ ...body, talk, chosen, tiles }).input);
+  const sides = sidesOf(body.stage, world.units.all());
   const go = (e: Event): void => { const from = world.phases.battle; if (from === undefined) throw new Error("play: phase"); world.phases = { ...world.phases, battle: xGo(from, e) }; };
   go({ type: "BATTLE_READY" }); go({ type: "DEPLOY_DONE" }); go({ type: "ROUND_BEGIN" }); go({ type: "SIDE_BEGIN" });
   const installed = installOne(STEP_PATTERN, {});
@@ -70,10 +72,11 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
   const spent = installOne(ACTION_BUDGET, {});
   if (spent.out === null) throw new Error("play: action-budget");
   const budget = spent.out;
-  const player = createPlayer(world, { side: "player", moveMs, nextId: () => `p${n += 1}`, step, spellOf: (id) => { const u = world.units.get(id); return u === undefined ? undefined : spellRef(body.rules, u.unitId); } });
+  const player = createPlayer(world, { side: sides.me, moveMs, nextId: () => `p${n += 1}`, step, spellOf: (id) => { const u = world.units.get(id); return u === undefined ? undefined : spellRef(body.rules, u.unitId); } });
   const bot = botAbilityPriority({ setup: body.rules, stepReach: step.reach, actionsPerTurn: budget.actionsPerTurn });
   const gestures = createGestureMapper({ cellPx: TILE, tapMaxPx: 12, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (at) => world.units.occupantAt(at) });
-  const fx = createPlayFx(body.effects), looks = dress(world.grid, body.looks), worn = new Map<string, SceneAsset>();
+  const fx = createPlayFx(body.effects), looks = dress(world.grid, body.looks), paint = new Map<string, { readonly sprite: string; readonly asset: SceneAsset }>(), seen = new Map<string, string>();
+  for (const u of world.units.all()) { const recipeId = recipeIn(body.recipes, u.unitId).id, tone = paintOf(u.side, sides.me), prior = seen.get(recipeId); if (prior === undefined) seen.set(recipeId, tone); paint.set(u.id, { sprite: prior === undefined || prior === tone ? recipeId : `${recipeId}@${tone}`, asset: unitAsset(`${recipeId}@${tone}`) }); }
   let selected: string | null = null, pending: Sq | null = null, reach: Sq[] = [], preview: Sq[] = [], walk: Walk | null = null, aims: Sq[] = [], aimKind: "basic" | "spell" = "basic", followId: string | null = null, onLand: (() => void) | null = null;
   let route: (intent: DoorIntent) => unknown = (intent) => intend(intent);
   const mark = (): void => { reach = selected === null ? [] : reachCells(world.grid, world.units, selected, step.reach); };
@@ -114,7 +117,7 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
     return stepped;
   };
   return {
-    world, step, intend, sync, bot, pixels: pixelsOf, autoWait, go, fx, looks,
+    world, step, intend, sync, bot, pixels: pixelsOf, autoWait, go, fx, looks, sides,
     focus(id: string | null): void { selected = id; pending = null; preview = []; mark(); },
     arm(next: Walk): void { walk = next; sync(); },
     landed(fn: (() => void) | null): void { onLand = fn; },
@@ -129,7 +132,7 @@ export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
       const aimSheet = aimKind === "spell" ? AIM_S : AIM_A, aimOver = world.phases.battle === "targeting" ? aims.map((c) => ({ band: "fxGround" as const, sheet: aimSheet, x: c.c * TILE, y: c.r * TILE })) : [];
       const overlays = selected === null ? aimOver : [...reach.map((c) => ({ band: "fxGround" as const, sheet: REACH, x: c.c * TILE, y: c.r * TILE })), ...preview.map((c) => ({ band: "fxGround" as const, sheet: PATH, x: c.c * TILE, y: c.r * TILE })), ...aimOver];
       const assets: Record<string, SceneAsset> = { ...looks.assets, "play:fx": { sheet: { id: "play:fx", columns: 4, fw: TILE, fh: TILE } } };
-      const units = world.units.all().map((u) => { const id = recipeIn(body.recipes, u.unitId).id; const asset = worn.get(id) ?? unitAsset(id); worn.set(id, asset); assets[id] = asset; return { id: u.id, sprite: id, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
+      const units = world.units.all().map((u) => { const row = paint.get(u.id); if (row === undefined) throw new Error("play: paint"); assets[row.sprite] = row.asset; return { id: u.id, sprite: row.sprite, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
       return { cols: world.grid.cols, rows: world.grid.rows, tileW: TILE, tileH: TILE, mapSeed: world.seed, assets, layers: looks.layers, units, objects: looks.objects, overlays, effects: fx.ingest(world.log, world.clock.stepMs, world.clock.now()), style: looks.style, waterTiles: looks.waterTiles, seeThroughCanopy: true as const };
     },
   };
```

As merged:

```ts
import { installOne } from "../../src/rules/behaviours/registry.ts";
import { reachCells, walkTo } from "../../src/rules/move/path.ts";
import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.ts";
import { botAbilityPriority } from "../../src/rules/turns/bot-ability-priority.ts";
import { createGestureMapper } from "../../src/runtime/input/gestures.ts";
import type { PointerSample } from "../../src/runtime/input/types.ts";
import type { Pixels } from "../../src/runtime/render/bakes.ts";
import type { Sheet } from "../../src/runtime/render/types.ts";
import type { SceneAsset } from "../../src/runtime/scene/world-scene.ts";
import { createPlayer } from "../../src/sim/player.ts";
import type { DoorIntent } from "../../src/sim/types.ts";
import { createWorld } from "../../src/sim/world.ts";
import { xGo, type Event } from "../../src/state/index.ts";
import type { Sq } from "../../src/types/core-types.ts";
import { RECIPES, TEAM, TILE, docsToInput, recipeIn, recipeOf, type PlayDocs } from "./load.ts";
import { bundledDocs } from "./project.ts";
import { createPlayFx, fxPx } from "./fx.ts";
import { dress, dressPx, unitAsset } from "./looks.ts";
import { paintOf, sidesOf } from "./sides.ts";

export { recipeOf, TILE };
const FONT: Readonly<Record<string, readonly number[]>> = {
  A: [14, 17, 17, 31, 17, 17, 17], C: [14, 17, 16, 16, 16, 17, 14], K: [17, 18, 20, 24, 20, 18, 17],
  M: [17, 27, 21, 21, 17, 17, 17], V: [17, 17, 17, 17, 17, 10, 4], W: [17, 17, 17, 21, 21, 27, 17], "?": [14, 17, 2, 4, 4, 0, 4],
};
const cache = new Map<string, Pixels>();
const sheet = (id: string): Sheet => ({ id, columns: 1, fw: TILE, fh: TILE });
const REACH = sheet("play:reach-player"), PATH = sheet("play:path-player"), AIM_A = sheet("play:aim-attack"), AIM_S = sheet("play:aim-spell");
function bake(id: string, rgb: number, letter: string): Pixels {
  const hit = cache.get(id); if (hit !== undefined) return hit;
  const data = new Uint8ClampedArray(TILE * TILE * 4), r = (rgb >>> 16) & 255, g = (rgb >>> 8) & 255, b = rgb & 255;
  for (let i = 0; i < data.length; i += 4) { data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255; }
  const rows = letter === "" ? undefined : FONT[letter] ?? FONT["?"];
  if (rows !== undefined) for (let y = 0; y < rows.length; y += 1) { const bits = rows[y] ?? 0; for (let x = 0; x < 5; x += 1) if ((bits & (1 << (4 - x))) !== 0) { const o = ((y + 4) * TILE + (x + 5)) * 4; data[o] = 248; data[o + 1] = 244; data[o + 2] = 230; data[o + 3] = 255; } }
  const px = { w: TILE, h: TILE, data }; cache.set(id, px); return px;
}
export function pixelsOf(id: string): Pixels | undefined {
  const dressed = dressPx(id); if (dressed !== undefined) return dressed;
  const sparked = fxPx(id); if (sparked !== undefined) return sparked;
  if (id === "play:floor") return bake(id, 0x243044, "");
  if (id === "play:reach-player") return bake(id, 0x3b82f6, "");
  if (id === "play:path-player") return bake(id, 0xf0c14a, "");
  if (id === "play:aim-attack") return bake(id, 0xe04848, "");
  if (id === "play:aim-spell") return bake(id, 0xf08a30, "");
  for (const recipe of Object.values(RECIPES)) if (recipe.id === id) return bake(id, TEAM.neutral, recipe.name.slice(0, 1));
  return id.startsWith("starter:unknown-") ? bake(id, TEAM.neutral, "?") : undefined;
}
export const MIN_CELL_CSS = 44;
export const HUD_TOP = 48, ROW_FOOT = 88, PLATE_H = 44, HUD_FOOT = ROW_FOOT + PLATE_H;
export const boardBox = (viewH: number): { top: number; height: number } => ({ top: HUD_TOP, height: Math.max(0, viewH - HUD_TOP - HUD_FOOT) });
export function fit(devW: number, devH: number, cols: number, rows: number, dpr: number): { s: number; padX: number; padY: number } {
  const mw = cols * TILE, mh = rows * TILE, fitted = Math.floor(Math.min(devW / mw, devH / mh)), minS = Math.ceil((MIN_CELL_CSS * dpr) / TILE);
  const s = Math.max(Number.isFinite(minS) && minS >= 1 ? minS : 1, Number.isFinite(fitted) && fitted >= 1 ? fitted : 1);
  return { s, padX: Math.floor((devW - Math.floor(devW / s) * s) / 2), padY: Math.floor((devH - Math.floor(devH / s) * s) / 2) };
}
/** Own ability rows only. A prototype key such as `constructor` is not a spell. */
export function spellRef(setup: { readonly abilities?: Readonly<Record<string, readonly { readonly effectRef: string }[]>> }, id: string): string | undefined {
  const bag = setup.abilities; if (bag === undefined || !Object.hasOwn(bag, id)) return undefined; return bag[id]?.[0]?.effectRef;
}
type Walk = { path: readonly Sq[]; from: Sq; t0: number; dur: number };
export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
  const body = docs ?? bundledDocs(), talk = body.talk ?? {}, chosen = body.chosen ?? [], tiles = body.tiles ?? [];
  const world = createWorld(docsToInput({ ...body, talk, chosen, tiles }).input);
  const sides = sidesOf(body.stage, world.units.all());
  const go = (e: Event): void => { const from = world.phases.battle; if (from === undefined) throw new Error("play: phase"); world.phases = { ...world.phases, battle: xGo(from, e) }; };
  go({ type: "BATTLE_READY" }); go({ type: "DEPLOY_DONE" }); go({ type: "ROUND_BEGIN" }); go({ type: "SIDE_BEGIN" });
  const installed = installOne(STEP_PATTERN, {});
  if (installed.out === null) throw new Error("play: step-pattern");
  const step = installed.out;
  let n = 0;
  const spent = installOne(ACTION_BUDGET, {});
  if (spent.out === null) throw new Error("play: action-budget");
  const budget = spent.out;
  const player = createPlayer(world, { side: sides.me, moveMs, nextId: () => `p${n += 1}`, step, spellOf: (id) => { const u = world.units.get(id); return u === undefined ? undefined : spellRef(body.rules, u.unitId); } });
  const bot = botAbilityPriority({ setup: body.rules, stepReach: step.reach, actionsPerTurn: budget.actionsPerTurn });
  const gestures = createGestureMapper({ cellPx: TILE, tapMaxPx: 12, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (at) => world.units.occupantAt(at) });
  const fx = createPlayFx(body.effects), looks = dress(world.grid, body.looks), paint = new Map<string, { readonly sprite: string; readonly asset: SceneAsset }>(), seen = new Map<string, string>();
  for (const u of world.units.all()) { const recipeId = recipeIn(body.recipes, u.unitId).id, tone = paintOf(u.side, sides.me), prior = seen.get(recipeId); if (prior === undefined) seen.set(recipeId, tone); paint.set(u.id, { sprite: prior === undefined || prior === tone ? recipeId : `${recipeId}@${tone}`, asset: unitAsset(`${recipeId}@${tone}`) }); }
  let selected: string | null = null, pending: Sq | null = null, reach: Sq[] = [], preview: Sq[] = [], walk: Walk | null = null, aims: Sq[] = [], aimKind: "basic" | "spell" = "basic", followId: string | null = null, onLand: (() => void) | null = null;
  let route: (intent: DoorIntent) => unknown = (intent) => intend(intent);
  const mark = (): void => { reach = selected === null ? [] : reachCells(world.grid, world.units, selected, step.reach); };
  const sync = (): void => {
    if (walk === null || selected === null) return;
    const t = walk.dur <= 0 ? 1 : (world.clock.now() - walk.t0) / walk.dur;
    if (t >= 1) {
      world.units.setOffset(selected, null);
      const from = world.phases.battle;
      if (from === "moving") { let phase = xGo(from, { type: "MOVE_DONE" }); if (autoWait) { phase = xGo(phase, { type: "WAIT" }); phase = xGo(phase, { type: "UNIT_DONE", next: "idle" }); } world.phases = { ...world.phases, battle: phase }; }
      walk = null; pending = null; preview = []; mark(); onLand?.(); return;
    }
    const steps = walk.path.length, f = t * steps, i = Math.min(steps - 1, Math.floor(f)), a = i === 0 ? walk.from : walk.path[i - 1], b = walk.path[i];
    if (a === undefined || b === undefined) return;
    world.units.setOffset(selected, { dx: (b.c - a.c) * (f - i), dy: (b.r - a.r) * (f - i) });
  };
  const intend = (intent: DoorIntent) => {
    if (intent.type === "SelectUnit") {
      const stepped = player.feed(intent);
      pending = null; preview = [];
      selected = stepped.reject === null ? intent.unitId : selected;
      if (stepped.reject !== null) selected = null;
      mark(); return stepped;
    }
    if (intent.type === "Cancel") { pending = null; preview = []; return player.feed(intent); }
    if (intent.type !== "TargetCell") return player.feed(intent);
    const at = intent.at, same = pending !== null && pending.c === at.c && pending.r === at.r, targeting = world.phases.battle === "targeting";
    const on = (targeting ? aims : reach).some((c) => c.c === at.c && c.r === at.r);
    if (!same && !on) { pending = null; preview = []; return { reject: "notReachable" as const, preview: [] as readonly Sq[] }; }
    if (!same) { pending = { c: at.c, r: at.r }; preview = targeting ? [pending] : (selected === null ? [] : walkTo(world.grid, world.units, selected, step.reach, at) ?? []); return { preview }; }
    const stepped = player.feed(intent);
    pending = null; preview = [];
    if (stepped.action?.kind === "move" && stepped.path !== undefined && selected !== null) {
      const u = world.units.get(selected);
      walk = { path: stepped.path, from: { c: u?.at.c ?? at.c, r: u?.at.r ?? at.r }, t0: world.clock.now(), dur: stepped.action.durationMs ?? 0 };
      followId = selected; sync();
    }
    return stepped;
  };
  return {
    world, step, intend, sync, bot, pixels: pixelsOf, autoWait, go, fx, looks, sides,
    focus(id: string | null): void { selected = id; pending = null; preview = []; mark(); },
    arm(next: Walk): void { walk = next; sync(); },
    landed(fn: (() => void) | null): void { onLand = fn; },
    get aims() { return aims; }, set aims(v: readonly Sq[]) { aims = v.map((c) => ({ c: c.c, r: c.r })); },
    get aimKind() { return aimKind; }, set aimKind(v: "basic" | "spell") { aimKind = v; },
    get followId() { return followId; }, set followId(v: string | null) { followId = v; },
    get selected() { return selected; }, get reach() { return reach; }, get pending() { return pending; }, get walk() { return walk; },
    get feed() { return route; }, set feed(fn: (intent: DoorIntent) => unknown) { route = fn; },
    pointer(sample: PointerSample): void { for (const intent of gestures(sample)) route(intent); },
    scene() {
      sync();
      const aimSheet = aimKind === "spell" ? AIM_S : AIM_A, aimOver = world.phases.battle === "targeting" ? aims.map((c) => ({ band: "fxGround" as const, sheet: aimSheet, x: c.c * TILE, y: c.r * TILE })) : [];
      const overlays = selected === null ? aimOver : [...reach.map((c) => ({ band: "fxGround" as const, sheet: REACH, x: c.c * TILE, y: c.r * TILE })), ...preview.map((c) => ({ band: "fxGround" as const, sheet: PATH, x: c.c * TILE, y: c.r * TILE })), ...aimOver];
      const assets: Record<string, SceneAsset> = { ...looks.assets, "play:fx": { sheet: { id: "play:fx", columns: 4, fw: TILE, fh: TILE } } };
      const units = world.units.all().map((u) => { const row = paint.get(u.id); if (row === undefined) throw new Error("play: paint"); assets[row.sprite] = row.asset; return { id: u.id, sprite: row.sprite, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
      return { cols: world.grid.cols, rows: world.grid.rows, tileW: TILE, tileH: TILE, mapSeed: world.seed, assets, layers: looks.layers, units, objects: looks.objects, overlays, effects: fx.ingest(world.log, world.clock.stepMs, world.clock.now()), style: looks.style, waterTiles: looks.waterTiles, seeThroughCanopy: true as const };
    },
  };
}
```

### `tools/play-stage/looks.ts` (edited)

Diff `02efdd04` → `d62f87bc`:

```diff
diff --git a/tools/play-stage/looks.ts b/tools/play-stage/looks.ts
index 6e2b6cc..dc402a5 100644
--- a/tools/play-stage/looks.ts
+++ b/tools/play-stage/looks.ts
@@ -36,8 +36,9 @@ export function dressPx(id: string): Pixels | undefined {
   if (id === "play:canopy") return strip([0x1e6b3a]);
   if (id === "play:brazier") return strip([hex(FLAME_RAMP[0])]);
   if (!id.startsWith("play:anim:")) return undefined;
-  const recipe = Object.values(RECIPES).find((row) => animId(row.id) === id);
-  return recipe === undefined ? undefined : animPx(TEAM[recipe.team]);
+  const body = id.slice("play:anim:".length), cut = body.lastIndexOf("@"), recipeId = cut < 0 ? body : body.slice(0, cut), paint = cut < 0 ? "neutral" : body.slice(cut + 1);
+  if (!Object.values(RECIPES).some((row) => row.id === recipeId) || !Object.hasOwn(TEAM, paint)) return undefined;
+  return animPx(paint === "player" ? TEAM.player : paint === "enemy" ? TEAM.enemy : TEAM.neutral);
 }
 type Grid = { readonly cols: number; readonly rows: number; tileTypeAt(at: { readonly c: number; readonly r: number }): { readonly id: string } };
 const cycle = (name: string, n: number) => ({ cycle: { ramp: { name, steps: Array.from({ length: n }, (_, i) => i) } } });
```

As merged:

```ts
import type { Pixels } from "../../src/runtime/render/bakes.ts";
import type { FxLit, Light, LightPlan, LightWorld } from "../../src/runtime/render/light.ts";
import type { FrameSource } from "../../src/runtime/render/world-motion.ts";
import type { SceneAsset } from "../../src/runtime/scene/world-scene.ts";
import { RECIPES, TEAM, TILE, type Looks } from "./load.ts";

export const DEMO_LOOKS: Looks = { canopy: [[4, 1], [5, 1], [5, 2]], braziers: [[1, 2], [5, 6]] };

export const WATER_RAMP = ["#1b3a5c", "#2a5d8a", "#4f8fc0", "#cfe8f5"] as const;
export const FLAME_RAMP = ["#b8401c", "#e8762a", "#f6c04a"] as const;
export const WASH = 0.5, LIGHT_RES = 4;
export const animId = (id: string): string => `play:anim:${id}`;
const hex = (s: string): number => Number.parseInt(s.slice(1), 16);
const put = (data: Uint8ClampedArray, o: number, n: number): void => { data[o] = (n >>> 16) & 255; data[o + 1] = (n >>> 8) & 255; data[o + 2] = n & 255; data[o + 3] = 255; };
const strip = (frames: readonly number[]): Pixels => {
  const data = new Uint8ClampedArray(TILE * frames.length * TILE * 4);
  for (let f = 0; f < frames.length; f += 1) for (let y = 0; y < TILE; y += 1) for (let x = 0; x < TILE; x += 1) put(data, (y * TILE * frames.length + f * TILE + x) * 4, frames[f] ?? 0);
  return { w: TILE * frames.length, h: TILE, data };
};
export function frameOf(px: Pixels, f: number, fw: number, fh: number): Pixels {
  const data = new Uint8ClampedArray(fw * fh * 4);
  for (let y = 0; y < fh; y += 1) data.set(px.data.subarray((y * px.w + f * fw) * 4, (y * px.w + (f + 1) * fw) * 4), y * fw * 4);
  return { w: fw, h: fh, data };
}
export const sourceOf = (own: (id: string) => Pixels | undefined): FrameSource => (id, f, fw, fh) => { const px = own(id); return px === undefined ? undefined : frameOf(px, f, fw, fh); };
export const picturesOf = (own: (id: string) => Pixels | undefined, link: { pixels(id: string): Pixels | undefined }): ((id: string) => Pixels | undefined) => (id) => own(id) ?? link.pixels(id);
export const litPlan = (lighting: { plan(world: LightWorld, lights: readonly Light[], wash: number, dim: number, res: number, fx?: FxLit): LightPlan }, looks: { readonly light: LightWorld; readonly lights: readonly Light[] }, lit: FxLit): LightPlan => lighting.plan(looks.light, looks.lights, WASH, 0, LIGHT_RES, lit);
export const unitAsset = (id: string): SceneAsset => ({ sheet: { id: animId(id), columns: 2, fw: TILE, fh: TILE }, clips: [{ name: "idle", frames: [0, 1] }] });
const animPx = (rgb: number): Pixels => {
  const one = strip([rgb]), data = new Uint8ClampedArray(TILE * 2 * TILE * 4);
  for (let y = 0; y < TILE; y += 1) { data.set(one.data.subarray(y * TILE * 4, (y + 1) * TILE * 4), (y * TILE * 2) * 4); if (y > 0) data.set(one.data.subarray((y - 1) * TILE * 4, y * TILE * 4), (y * TILE * 2 + TILE) * 4); }
  return { w: TILE * 2, h: TILE, data };
};
export function dressPx(id: string): Pixels | undefined {
  if (id === "play:ground") return strip([0x243044, hex(WATER_RAMP[0]), 0x6b6256]);
  if (id === "play:canopy") return strip([0x1e6b3a]);
  if (id === "play:brazier") return strip([hex(FLAME_RAMP[0])]);
  if (!id.startsWith("play:anim:")) return undefined;
  const body = id.slice("play:anim:".length), cut = body.lastIndexOf("@"), recipeId = cut < 0 ? body : body.slice(0, cut), paint = cut < 0 ? "neutral" : body.slice(cut + 1);
  if (!Object.values(RECIPES).some((row) => row.id === recipeId) || !Object.hasOwn(TEAM, paint)) return undefined;
  return animPx(paint === "player" ? TEAM.player : paint === "enemy" ? TEAM.enemy : TEAM.neutral);
}
type Grid = { readonly cols: number; readonly rows: number; tileTypeAt(at: { readonly c: number; readonly r: number }): { readonly id: string } };
const cycle = (name: string, n: number) => ({ cycle: { ramp: { name, steps: Array.from({ length: n }, (_, i) => i) } } });
export function dress(grid: Grid, looks?: Looks) {
  const n = grid.cols * grid.rows, tiles: number[] = [], blocks = new Uint8Array(n);
  for (let i = 0; i < n; i += 1) { const id = grid.tileTypeAt({ c: i % grid.cols, r: (i / grid.cols) | 0 }).id, tile = id === "water" ? 1 : id === "wall-block" ? 2 : 0; tiles.push(tile); if (tile === 2) blocks[i] = 1; }
  const canopy = looks === undefined ? undefined : Array.from({ length: n }, () => null as number | null);
  if (looks !== undefined && canopy !== undefined) for (const [c, r] of looks.canopy) canopy[r * grid.cols + c] = 0;
  const assets: Record<string, SceneAsset> = { "play:ground": { sheet: { id: "play:ground", columns: 3, fw: TILE, fh: TILE }, styled: true, tileProps: { "1": { motion: cycle("water", 3) } } } };
  if (canopy !== undefined) { assets["play:canopy"] = { sheet: { id: "play:canopy", columns: 1, fw: TILE, fh: TILE }, motion: { sway: { trunkFrom: 8 } } }; assets["play:brazier"] = { sheet: { id: "play:brazier", columns: 1, fw: TILE, fh: TILE }, styled: true, motion: cycle("fire", 3) }; }
  const braziers = looks?.braziers ?? [];
  return {
    assets,
    layers: [{ tileset: "play:ground", aboveUnits: false, visible: true, tiles }, ...(canopy === undefined ? [] : [{ tileset: "play:canopy", aboveUnits: true, visible: true, tiles: canopy }])],
    objects: braziers.map(([c, r]) => ({ assetId: "play:brazier", at: { c, r } })),
    style: { ramps: { water: [...WATER_RAMP], fire: [...FLAME_RAMP] } },
    waterTiles: { "play:ground": [1] as const },
    light: { cols: grid.cols, rows: grid.rows, tileW: TILE, tileH: TILE, blocks },
    lights: braziers.map(([c, r]) => ({ x: (c + 0.5) * TILE, y: (r + 0.5) * TILE, radius: 3 * TILE, colour: FLAME_RAMP[2] })),
  };
}
```

### `tools/play-stage/load.ts` (edited)

Diff `02efdd04` → `d62f87bc`:

```diff
diff --git a/tools/play-stage/load.ts b/tools/play-stage/load.ts
index cccece5..33b37c8 100644
--- a/tools/play-stage/load.ts
+++ b/tools/play-stage/load.ts
@@ -3,17 +3,17 @@ import type { SimInput } from "../../src/sim/types.ts";
 import type { CoreTileType } from "../../src/types/core-types.ts";
 
 export const TILE = 16;
-export const TEAM = { player: 0x2f6fad, wolves: 0xb23b32, neutral: 0xc6a15a } as const;
-export type Recipe = { readonly id: string; readonly name: string; readonly team: keyof typeof TEAM };
-const fallback = (id: string): Recipe => ({ id: `starter:unknown-${id}`, name: "Unknown", team: "neutral" });
+export const TEAM = { player: 0x2f6fad, enemy: 0xb23b32, neutral: 0xc6a15a } as const;
+export type Recipe = { readonly id: string; readonly name: string };
+const fallback = (id: string): Recipe => ({ id: `starter:unknown-${id}`, name: "Unknown" });
 export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
-  knight: { id: "starter:hero-sword", name: "Knight", team: "player" },
-  archer: { id: "starter:hero-staff", name: "Archer", team: "player" },
-  cleric: { id: "starter:hero-cleric", name: "Cleric", team: "player" },
-  crate: { id: "starter:prop-crate", name: "Crate", team: "neutral" },
-  merchant: { id: "starter:npc-merchant", name: "Merchant", team: "player" },
-  villager: { id: "starter:npc-villager", name: "Villager", team: "neutral" },
-  wolf: { id: "starter:enemy-wolf", name: "Wolf", team: "wolves" },
+  knight: { id: "starter:hero-sword", name: "Knight" },
+  archer: { id: "starter:hero-staff", name: "Archer" },
+  cleric: { id: "starter:hero-cleric", name: "Cleric" },
+  crate: { id: "starter:prop-crate", name: "Crate" },
+  merchant: { id: "starter:npc-merchant", name: "Merchant" },
+  villager: { id: "starter:npc-villager", name: "Villager" },
+  wolf: { id: "starter:enemy-wolf", name: "Wolf" },
 });
 export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
 export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
```

As merged:

```ts
import type { BattleSetup } from "../../src/rules/battle/battle.ts";
import type { SimInput } from "../../src/sim/types.ts";
import type { CoreTileType } from "../../src/types/core-types.ts";

export const TILE = 16;
export const TEAM = { player: 0x2f6fad, enemy: 0xb23b32, neutral: 0xc6a15a } as const;
export type Recipe = { readonly id: string; readonly name: string };
const fallback = (id: string): Recipe => ({ id: `starter:unknown-${id}`, name: "Unknown" });
export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
  knight: { id: "starter:hero-sword", name: "Knight" },
  archer: { id: "starter:hero-staff", name: "Archer" },
  cleric: { id: "starter:hero-cleric", name: "Cleric" },
  crate: { id: "starter:prop-crate", name: "Crate" },
  merchant: { id: "starter:npc-merchant", name: "Merchant" },
  villager: { id: "starter:npc-villager", name: "Villager" },
  wolf: { id: "starter:enemy-wolf", name: "Wolf" },
});
export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>> };
export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
  const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
  if (hostSeed === undefined) throw new Error("play: seed");
  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: { picks: 0, waveUnits: 0 }, hostSeed, engineVersion: "0.0.0", projectHash: "demo" }, talk: docs.talk };
}
```

### `tools/play-stage/hud.ts` (edited)

Diff `02efdd04` → `d62f87bc`:

```diff
diff --git a/tools/play-stage/hud.ts b/tools/play-stage/hud.ts
index 285907c..675f1a8 100644
--- a/tools/play-stage/hud.ts
+++ b/tools/play-stage/hud.ts
@@ -1,6 +1,6 @@
 import { HUD_TOP, PLATE_H, ROW_FOOT } from "./board.ts";
 export type HudView = {
-  readonly turn: string; readonly side: string; readonly name: string; readonly hp: number; readonly max: number; readonly selected: boolean;
+  readonly turn: string; readonly side: string; readonly mine: boolean; readonly name: string; readonly hp: number; readonly max: number; readonly selected: boolean;
   readonly outcome: "win" | "lose" | "draw" | null; readonly turns: number; readonly talk: { readonly name: string; readonly text: string } | null;
   readonly actions: { readonly basic: Btn; readonly spell: Btn; readonly talk: Btn; readonly wait: Btn; readonly end: Btn };
 };
@@ -22,10 +22,10 @@ export function createHud(act: Act): { hideBanner(): void; render(view: HudView)
   q("restart").addEventListener("click", () => act.restart()); q("back").addEventListener("click", () => act.restart());
   window.setTimeout(hideBanner, 1260);
   const render = (view: HudView): void => {
-    q("pill").textContent = view.turn; banner.textContent = view.turn; banner.style.background = view.side === "player" ? "#14213d" : "#6b1d2a";
+    q("pill").textContent = view.turn; banner.textContent = view.turn; banner.style.background = view.mine ? "#14213d" : "#6b1d2a";
     q("plate").style.display = view.selected ? "flex" : "none"; q("who").textContent = view.name; q("hpText").textContent = `${view.hp}/${view.max}`;
     const bar = q("hp").querySelector("i"); if (bar instanceof HTMLElement) bar.style.width = `${view.max <= 0 ? 0 : Math.max(0, Math.min(120, Math.round((120 * view.hp) / view.max)))}px`;
-    q("end").style.outlineColor = view.side === "player" ? "#2f6fad" : "#b23b32";
+    q("end").style.outlineColor = view.mine ? "#2f6fad" : "#b23b32";
     for (const key of ["basic", "spell", "talk", "wait", "end"] as const) { const b = buttons[key], row = view.actions[key]; b.style.display = row.show ? "block" : "none"; b.style.opacity = row.on ? "1" : "0.4"; }
     const said = view.talk; sheet.style.display = said === null ? "none" : "block"; if (said !== null) { const name = sheet.querySelector("b"), text = sheet.querySelector("span"); if (name !== null) name.textContent = said.name; if (text !== null) text.textContent = said.text === "" ? "…" : said.text; }
     const over = view.outcome !== null; veil.style.display = over ? "flex" : "none";
```

As merged:

```ts
import { HUD_TOP, PLATE_H, ROW_FOOT } from "./board.ts";
export type HudView = {
  readonly turn: string; readonly side: string; readonly mine: boolean; readonly name: string; readonly hp: number; readonly max: number; readonly selected: boolean;
  readonly outcome: "win" | "lose" | "draw" | null; readonly turns: number; readonly talk: { readonly name: string; readonly text: string } | null;
  readonly actions: { readonly basic: Btn; readonly spell: Btn; readonly talk: Btn; readonly wait: Btn; readonly end: Btn };
};
type Btn = { readonly show: boolean; readonly on: boolean };
type Act = { choose(kind: "basic" | "spell" | "talk"): void; wait(): void; endTurn(): void; restart(): void; menu(): void; recentre(): void; closeTalk(): void };
const css = `html,body{margin:0}#hud{position:fixed;inset:0;pointer-events:none;font:16px sans-serif;color:#f4efe2}#hud button{pointer-events:auto;min-width:48px;min-height:48px;border:0;border-radius:8px;background:#1c2838;color:#f4efe2}#top{position:absolute;left:0;right:0;top:0;height:${HUD_TOP}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#menu{width:48px;height:48px;margin-left:auto}#recentre{width:48px;height:48px;flex:none}#banner{position:absolute;left:0;right:64px;top:0;height:${HUD_TOP}px;box-sizing:border-box;background:#14213d;color:#e8c872;border-top:2px solid #e8c872;border-bottom:2px solid #e8c872}#plate{position:absolute;left:0;right:0;bottom:${ROW_FOOT}px;height:${PLATE_H}px;display:flex;align-items:center;gap:8px;padding:0 8px;background:#101826}#face{width:32px;height:32px;background:#2f6fad}#hp{width:120px;height:10px;background:#243044}#hp i{display:block;height:10px;background:#3dd68c}#row{position:absolute;left:0;right:0;bottom:24px;height:64px;display:flex;align-items:center;gap:8px;padding:0 8px}#end{margin-left:auto;margin-right:12px;outline:2px solid #2f6fad}#sheet{position:absolute;left:8px;right:8px;bottom:${ROW_FOOT + PLATE_H}px;max-height:35%;box-sizing:border-box;display:none;overflow:auto;background:#f4efe2;color:#1c140c;padding:8px;border-radius:8px;pointer-events:auto;font-size:16px}#sheet b{display:block}#sheet button{width:48px;height:48px}#veil{position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:rgba(8,10,16,.72);pointer-events:auto}#card{background:#101826;padding:16px;border:2px solid #e8c872;text-align:center}#card button{margin:8px}#hud #banner{pointer-events:none}`;
export function createHud(act: Act): { hideBanner(): void; render(view: HudView): void } {
  const root = document.createElement("div"); root.id = "hud"; root.innerHTML = `<style>${css}</style><div id="top"><span id="pill"></span><button id="recentre" type="button">Recentre</button><button id="menu" type="button">Menu</button></div><button id="banner" type="button">YOUR TURN</button><div id="plate"><i id="face"></i><span id="who"></span><span id="hp"><i></i></span><span id="hpText"></span></div><div id="row"><button id="attack" type="button">Attack</button><button id="spell" type="button">Spell</button><button id="talk" type="button">Talk</button><button id="wait" type="button">Wait</button><button id="end" type="button">End turn</button></div><div id="sheet"><b></b><span></span><button id="close" type="button">Close</button></div><div id="veil"><div id="card"><h2></h2><p></p><p id="turns"></p><button id="restart" type="button">Restart</button><button id="back" type="button">Back</button></div></div>`;
  document.body.append(root);
  const q = (id: string): HTMLElement => { const n = root.querySelector(`#${id}`); if (!(n instanceof HTMLElement)) throw new Error(id); return n; };
  const banner = q("banner"), veil = q("veil"), sheet = q("sheet");
  const buttons: Record<"basic" | "spell" | "talk" | "wait" | "end", HTMLElement> = { basic: q("attack"), spell: q("spell"), talk: q("talk"), wait: q("wait"), end: q("end") };
  let held = true;
  const hideBanner = (): void => { held = false; banner.style.display = "none"; };
  banner.addEventListener("click", hideBanner); q("menu").addEventListener("click", () => act.menu());
  q("attack").addEventListener("click", () => act.choose("basic")); q("spell").addEventListener("click", () => act.choose("spell"));
  q("talk").addEventListener("click", () => act.choose("talk")); q("wait").addEventListener("click", () => act.wait()); q("end").addEventListener("click", () => act.endTurn());
  q("recentre").addEventListener("click", () => act.recentre()); q("close").addEventListener("click", () => act.closeTalk());
  q("restart").addEventListener("click", () => act.restart()); q("back").addEventListener("click", () => act.restart());
  window.setTimeout(hideBanner, 1260);
  const render = (view: HudView): void => {
    q("pill").textContent = view.turn; banner.textContent = view.turn; banner.style.background = view.mine ? "#14213d" : "#6b1d2a";
    q("plate").style.display = view.selected ? "flex" : "none"; q("who").textContent = view.name; q("hpText").textContent = `${view.hp}/${view.max}`;
    const bar = q("hp").querySelector("i"); if (bar instanceof HTMLElement) bar.style.width = `${view.max <= 0 ? 0 : Math.max(0, Math.min(120, Math.round((120 * view.hp) / view.max)))}px`;
    q("end").style.outlineColor = view.mine ? "#2f6fad" : "#b23b32";
    for (const key of ["basic", "spell", "talk", "wait", "end"] as const) { const b = buttons[key], row = view.actions[key]; b.style.display = row.show ? "block" : "none"; b.style.opacity = row.on ? "1" : "0.4"; }
    const said = view.talk; sheet.style.display = said === null ? "none" : "block"; if (said !== null) { const name = sheet.querySelector("b"), text = sheet.querySelector("span"); if (name !== null) name.textContent = said.name; if (text !== null) text.textContent = said.text === "" ? "…" : said.text; }
    const over = view.outcome !== null; veil.style.display = over ? "flex" : "none";
    const title = q("card").querySelector("h2"), blurb = q("card").querySelector("p");
    if (over && title !== null && blurb !== null) { title.textContent = view.outcome === "win" ? "Victory" : view.outcome === "lose" ? "Defeat" : "Draw"; blurb.textContent = view.outcome === "lose" ? "Your units fell" : "All enemies defeated"; q("turns").textContent = `${view.turns} turns`; }
    if (!held) banner.style.display = "none";
  };
  return { hideBanner, render };
}
```

