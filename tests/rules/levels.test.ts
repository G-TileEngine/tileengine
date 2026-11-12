import assert from "node:assert/strict";
import { test } from "node:test";
import { BTF_LEVEL_RULES } from "../../src/btf-adapters/src/index.ts";
import { createRng, streamSeed } from "../../src/core/rng/index.ts";
import { createLevels, type LevelBar, type LevelRules, type Levels } from "../../src/rules/levels/index.ts";
const POOLS = { knight: ["guard", "charge", "rally", "cleave", "ward"], archer: ["volley", "snipe"], wolf: ["howl", "bite", "pounce", "maul"], player: ["guard", "charge", "rally", "cleave", "volley", "snipe"], wolves: ["howl", "bite", "pounce", "maul"], rival: ["howl", "screech"] };
const unit = { ...BTF_LEVEL_RULES, bar: "unit" as const };
type Ev = { type: string; level?: number; offer?: readonly string[]; ability?: string };
const make = (seed: number, rules: LevelRules, pools: Record<string, readonly string[]>): { levels: Levels; events: Ev[] } => {
  const events: Ev[] = [];
  return { levels: createLevels({ rules, pools }, createRng(streamSeed(seed, "levels")), (event) => { events.push(event); }), events };
};
const drawn = (seed: number, pool: readonly string[], size: number, have: readonly string[] = []): string[] => {
  const rng = createRng(streamSeed(seed, "levels")), cands: string[] = [];
  for (const a of pool) if (!have.includes(a) && !cands.includes(a)) cands.push(a);
  if (cands.length <= size) return cands;
  for (let i = 0; i < size; i += 1) { const j = i + rng.int(cands.length - i), left = cands[i], right = cands[j]; if (left !== undefined && right !== undefined) { cands[i] = right; cands[j] = left; } }
  return cands.slice(0, size);
};
test("levels gain (step 18): bars, banking, a pick, and a pool-less climb to the top", () => {
  assert.deepEqual(BTF_LEVEL_RULES, { bar: "side", thresholds: [17, 11, 13, 11, 13, 14, 11, 11, 11], offerLevels: [1, 3, 4, 6, 7, 9], offerSize: 3, xp: { move: 1 } });
  const knight = { id: "knight#1", unitId: "knight", side: "player" };
  assert.deepEqual(make(1, BTF_LEVEL_RULES, POOLS).levels.barOf(knight), { id: "player", pool: "player" });
  assert.deepEqual(make(1, unit, POOLS).levels.barOf(knight), { id: "knight#1", pool: "knight" });
  const { levels, events } = make(1, unit, { knight: POOLS.knight });
  const bar = (): LevelBar => levels.state().bars[0] ?? { id: "", xp: -1, level: -1, banked: -1, offer: [], abilities: [] };
  levels.gain("knight#1", "knight", 16);
  assert.deepEqual(bar(), { id: "knight#1", xp: 16, level: 0, banked: 0, offer: null, abilities: [] });
  levels.gain("knight#1", "knight", 1); const offer = levels.offer("knight#1") ?? [];
  assert.deepEqual(offer, ["rally", "charge", "guard"]); assert.equal(events.length === 1, true);
  levels.gain("knight#1", "knight", 30);
  assert.equal(bar().banked, 30);
  const before = JSON.stringify([levels.state(), events]);
  assert.equal(levels.choose("knight#1", "nope"), false);
  assert.equal(JSON.stringify([levels.state(), events]), before);
  assert.equal(levels.choose("knight#1", offer[1] ?? ""), true);
  assert.deepEqual([bar().level, bar().xp, bar().banked, bar().abilities], [3, 0, 6, [offer[1]]]);
  assert.equal(events.length === 4 && events[1]?.type === "level.unlocked", true);
  assert.deepEqual([events[2]?.level, events[2]?.offer], [2, []]);
  assert.equal(events[3]?.level === 3 && events[3]?.offer?.length === 3 && !events[3]?.offer?.includes(offer[1] ?? ""), true);
  const wolf = make(1, unit, { knight: POOLS.knight }); wolf.levels.gain("wolf#3", "wolf", 111);
  assert.deepEqual([wolf.levels.state().bars[0]?.level, wolf.levels.state().bars[0]?.xp], [8, 10]);
  wolf.levels.gain("wolf#3", "wolf", 50); wolf.levels.gain("wolf#3", "wolf", 1);
  assert.deepEqual([wolf.levels.state().bars[0]?.level, wolf.levels.state().bars[0]?.xp, wolf.levels.state().bars[0]?.banked], [9, 0, 0]);
});
test("offer draw order (step 18): the partial shuffle, duplicates dropped, no draw when the pool fits or the key is inherited", () => {
  const rules: LevelRules = { bar: "unit", thresholds: [1, 1, 1], offerLevels: [1, 2, 3], offerSize: 3, xp: { move: 1 } };
  for (const seed of [1, 2, 3]) {
    const { levels } = make(seed, rules, { knight: POOLS.knight });
    levels.gain("knight#1", "knight", 1);
    const probe = createRng(streamSeed(seed, "levels")); probe.next(); probe.next(); probe.next();
    assert.deepEqual(levels.offer("knight#1"), drawn(seed, POOLS.knight, 3));
    assert.deepEqual(levels.state().rngState, probe.state());
  }
  const pin = make(1, rules, { knight: POOLS.knight }); pin.levels.gain("knight#1", "knight", 1);
  assert.deepEqual(pin.levels.offer("knight#1"), ["rally", "charge", "guard"]);
  const { levels, events } = make(4, rules, { archer: ["volley", "snipe", "volley"] }); const start = levels.state().rngState;
  levels.gain("archer#2", "archer", 1); assert.deepEqual(levels.offer("archer#2"), ["volley", "snipe"]);
  levels.choose("archer#2", "snipe"); levels.gain("archer#2", "archer", 1); assert.deepEqual(levels.offer("archer#2"), ["volley"]);
  levels.choose("archer#2", "volley"); levels.gain("archer#2", "archer", 1);
  assert.equal(levels.offer("archer#2"), null); assert.deepEqual([events.at(-1)?.level, events.at(-1)?.offer], [3, []]);
  const quiet = make(1, rules, {}); const held = quiet.levels.state().rngState;
  quiet.levels.gain("bat#1", "bat", 1); quiet.levels.gain("ctor#1", "constructor", 1);
  assert.equal(quiet.levels.offer("bat#1") === null && quiet.levels.offer("ctor#1") === null, true);
  assert.deepEqual(quiet.levels.state().rngState, held); assert.deepEqual(levels.state().rngState, start);
});
test("createLevels refuses bad rules (step 18): never clamped", () => {
  const base: LevelRules = { bar: "unit", thresholds: [1], offerLevels: [1], offerSize: 1, xp: { move: 0 } };
  const text = "createLevels: bad rules or pools";
  const boom = (rules: LevelRules, pools: Record<string, readonly string[]> = {}): void => { assert.throws(() => createLevels({ rules, pools }, createRng(1), () => {}), (e: unknown) => e instanceof RangeError && (e as RangeError).message === text); };
  boom({ ...base, bar: "team" as "unit" }); boom({ ...base, thresholds: [] }); boom({ ...base, thresholds: [17, 0] }); boom({ ...base, thresholds: [1.5] });
  boom({ ...base, offerLevels: [10] }); boom({ ...base, offerLevels: [0] }); boom({ ...base, offerSize: 0 }); boom({ ...base, xp: { move: -1 } });
  boom(base, { knight: ["guard", ""] }); boom(base, { knight: [""] });
  assert.throws(() => createLevels({ rules: base, pools: { knight: "guard" as never } }, createRng(1), () => {}), RangeError);
  assert.throws(() => make(1, base, {}).levels.gain("a", "a", 1.5), (e: unknown) => e instanceof RangeError && (e as RangeError).message === "levels: amount must be an integer >= 0");
});
test("createLevels keeps its own frozen copy (step 19) so a later edit cannot change an offer", () => {
  const rules: LevelRules = { bar: "unit", thresholds: [1, 2], offerLevels: [1], offerSize: 3, xp: { move: 1 } };
  const pools = { knight: ["guard", "charge"] }, { levels } = make(1, rules, pools), given = JSON.parse(JSON.stringify(rules)) as LevelRules;
  (pools.knight as string[]).push(""); (rules.offerLevels as number[]).splice(0); (rules.thresholds as number[])[0] = 9; (rules.xp as { move: number }).move = 0;
  assert.deepEqual(levels.rules, given); assert.throws(() => { (levels.rules as { offerSize: number }).offerSize = 4; }, TypeError);
  levels.gain("knight#1", "knight", 1); assert.deepEqual(levels.offer("knight#1"), ["guard", "charge"]);
  let n = 0; const live = { get knight(): readonly string[] { n += 1; return n === 1 ? ["guard", "charge"] : [""]; } };
  const once = createLevels({ rules: given, pools: live }, createRng(streamSeed(1, "levels")), () => {});
  once.gain("k", "knight", 1); assert.equal(n === 1 && JSON.stringify(once.offer("k")) === JSON.stringify(["guard", "charge"]), true);
  const text = "createLevels: bad rules or pools", shapes = [null, {}, { rules: null, pools: {} }, { rules: given, pools: null }, { rules: given, pools: [] }, { rules: { ...given, thresholds: undefined }, pools: {} }, { rules: { ...given, offerLevels: 1 }, pools: {} }, { rules: { ...given, xp: null }, pools: {} }];
  for (const setup of shapes) assert.throws(() => createLevels(setup as never, createRng(1), () => {}), (e: unknown) => e instanceof RangeError && (e as RangeError).message === text);
});
