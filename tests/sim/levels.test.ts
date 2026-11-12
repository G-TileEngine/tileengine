import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { BTF_FX_PRESET, BTF_LEVEL_RULES } from "../../src/btf-adapters/src/index.ts";
import type { LevelRules } from "../../src/rules/levels/index.ts";
import { CHAOS_CHECKS, advance, createPlayer, createWorld, disposeWorld, replay, replayChaos, restore, runChaos, runMatch, snapshot, submit, type IntentHook } from "../../src/sim/index.ts";
import { bot, reachFarRow, seedless } from "./ai.ts";
import { input } from "./input.ts";
import { counter, seatAll } from "./seats.ts";
const POOLS = { knight: ["guard", "charge", "rally", "cleave", "ward"], archer: ["volley", "snipe"], wolf: ["howl", "bite", "pounce", "maul"], player: ["guard", "charge", "rally", "cleave", "volley", "snipe"], wolves: ["howl", "bite", "pounce", "maul"], rival: ["howl", "screech"] };
const UNIT: LevelRules = { ...BTF_LEVEL_RULES, bar: "unit" }, QUICK: LevelRules = { bar: "unit", thresholds: [3, 4, 5, 6], offerLevels: [1, 2, 4], offerSize: 3, xp: { move: 2 } };
const sha = (value: unknown): string => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const match = { victory: reachFarRow, fuse: 60000, maxRounds: 40, maxSimMs: 600000 };
const armed = (stage: "stage-fixed" | "stage-weighted", seed: number, rules: LevelRules) => seedless({ ...input(stage, seed), levels: { rules, pools: POOLS } });
const picky = (seed: number): IntentHook => {
  const base = bot(seed);
  return (world, side, budget) => {
    const levels = world.levels, picks: { intent: { type: "ChooseAbility"; index: number; unitId?: string } }[] = [];
    if (levels !== null && levels.rules.bar === "side") { if (levels.offer(side) !== null) picks.push({ intent: { type: "ChooseAbility", index: 0 } }); }
    else if (levels !== null) for (const unitId of budget.units) if (levels.offer(unitId) !== null) picks.push({ intent: { type: "ChooseAbility", unitId, index: 0 } });
    return [...picks, ...base(world, side, budget)];
  };
};
test("levelling is off unless the match opts in (step 18): no registry, no snapshot key, until it is asked for", () => {
  const off = createWorld(input("stage-fixed"));
  assert.equal(off.levels === null && !("levels" in snapshot(off)) && !off.bus.isRegistered("level.reached"), true);
  const on = createWorld({ ...input("stage-fixed"), levels: { rules: UNIT, pools: POOLS } });
  assert.equal(on.bus.isRegistered("level.reached") && on.bus.isRegistered("level.unlocked"), true);
  assert.deepEqual(snapshot(on).levels?.bars, []);
});
test("levels smoke (step 18): both bars, the quick per-unit rules, replay and restore", (t) => {
  const lines: string[] = [];
  for (const [name, rules] of [["btf-side", BTF_LEVEL_RULES], ["btf-unit", UNIT], ["quick-unit", QUICK]] as const) {
    for (const stage of ["stage-fixed", "stage-weighted"] as const) {
      const sides = stage === "stage-fixed" ? ["player", "wolves"] as const : ["player", "rival"] as const;
      const count = { win: 0, lose: 0, draw: 0, timeout: 0 }, histories = [], tally = { reached: 0, offers: 0, unlocked: 0 };
      for (let seed = 1; seed <= 20; seed += 1) {
        const src = armed(stage, seed, rules), world = createWorld(src);
        const result = runMatch(world, { ...match, sides: [...sides], seats: seatAll(world, sides, picky(seed), 200) });
        count[result.outcome] += 1; histories.push(world.bus.history());
        assert.equal(result.events.filter((event) => event.type === "MOVE_DONE").length, world.log.entries().filter((entry) => entry.action.kind === "move").length);
        assert.equal(world.bus.history().length < 1024, true);
        assert.deepEqual(replay(src, world.log, world.clock.tick()).levels?.state(), world.levels?.state());
        const snap = snapshot(world); assert.deepEqual(snapshot(restore(src, world.log, snap)), snap);
        for (const rec of world.bus.history()) {
          if (rec.event.type === "level.reached") { tally.reached += 1; if (rec.event.offer.length > 0) tally.offers += 1; }
          else if (rec.event.type === "level.unlocked") tally.unlocked += 1;
        }
      }
      const line = `levels smoke ${name} ${stage} seeds 1-20: win ${count.win} lose ${count.lose} draw ${count.draw} timeout ${count.timeout} reached ${tally.reached} offers ${tally.offers} unlocked ${tally.unlocked} history ${sha(histories)}`;
      t.diagnostic(line); lines.push(line);
    }
  }
  assert.deepEqual(lines, [
    "levels smoke btf-side stage-fixed seeds 1-20: win 18 lose 2 draw 0 timeout 0 reached 18 offers 17 unlocked 13 history 6b91cebadee3a4bfc960daecb92a6b51b673139250cbde83f5767b8cfda5fc53",
    "levels smoke btf-side stage-weighted seeds 1-20: win 5 lose 15 draw 0 timeout 0 reached 64 offers 40 unlocked 40 history 3a58d03a4ee6980e394fe76d6343ca8bd5617151df6d099119c688a2f2592a64",
    "levels smoke btf-unit stage-fixed seeds 1-20: win 18 lose 2 draw 0 timeout 0 reached 0 offers 0 unlocked 0 history f09905f4472d21fa7c0b7726eef350b9d9ba07704f44fcc0e5cf127b1d78d9af",
    "levels smoke btf-unit stage-weighted seeds 1-20: win 5 lose 15 draw 0 timeout 0 reached 8 offers 6 unlocked 3 history 885c1a7b242dc260ea640021230ea04e0cd85322178ff3862eccdb49b851bd44",
    "levels smoke quick-unit stage-fixed seeds 1-20: win 18 lose 2 draw 0 timeout 0 reached 283 offers 167 unlocked 151 history 5a8d757fd935d9b95e1b589b8b4a5c672bfcaaf2cba0f914314715eff53f448d",
    "levels smoke quick-unit stage-weighted seeds 1-20: win 5 lose 15 draw 0 timeout 0 reached 320 offers 160 unlocked 160 history ac883a9882f1a8c8315c666be603a697603aa466134a5e2f88be9503e03bcd30",
  ]);
});
test("the chaos checks hold with levelling on and the run replays from its JSON", () => {
  const hash = (text: string): string => createHash("sha256").update(text).digest("hex");
  const tools = { victory: reachFarRow, checks: CHAOS_CHECKS, hash, engineSha: "step18", node: "v24.22.1" };
  const opts = { ...tools, ruleset: "reachFarRow", fuse: 60000, maxRounds: 40, maxSimMs: 600000, moveMs: 200, idPrefix: "m", presets: { fxOptions: BTF_FX_PRESET }, sides: ["player", "rival"] as const };
  for (const rules of [QUICK, BTF_LEVEL_RULES]) for (let seed = 1; seed <= 5; seed += 1) {
    const src = armed("stage-weighted", seed, rules), result = runChaos(src, { ...opts, intents: picky(seed) });
    assert.equal(result.failure, null);
    assert.deepEqual(replayChaos(src, JSON.parse(JSON.stringify(result.run)) as typeof result.run, tools), result);
  }
});
test("a pick through the door (step 18): an unlock action, and a replay with no offer warns", () => {
  const src = { ...input("stage-fixed"), levels: { rules: UNIT, pools: POOLS } }, world = createWorld(src);
  world.phases = { battle: "idle" }; world.levels?.gain("knight#1", "knight", 17);
  const offer = world.levels?.offer("knight#1") ?? [], player = createPlayer(world, { side: "player", moveMs: 200, nextId: counter("m") });
  const step = player.feed({ type: "ChooseAbility", unitId: "knight#1", index: 1 });
  assert.equal(step.reject === null && step.event === null && world.phases.battle === "idle", true);
  assert.deepEqual(step.action, { id: "m1", kind: "unlock", actor: "knight#1", target: null, durationMs: null, turns: null, effects: [offer[1]] });
  assert.deepEqual(world.levels?.state().bars[0]?.abilities, [offer[1]]);
  assert.equal(world.log.lastSeq() === 1 && world.bus.history().filter((rec) => rec.event.type === "level.unlocked").length === 1, true);
  assert.deepEqual(snapshot(world).levels, world.levels?.state());
  assert.deepEqual(snapshot(world).levels?.bars, [{ id: "knight#1", xp: 0, level: 1, banked: 0, offer: null, abilities: [offer[1]] }]);
  const shot = snapshot(world); assert.deepEqual(JSON.parse(JSON.stringify(shot)).levels, shot.levels);
  assert.equal(replay(src, world.log, 0).notices.at(-1)?.code, "unlockFailed");
});
test("the side bar (step 18): one bar for the side, a foe cannot pick it, unitId is not read", () => {
  const world = createWorld({ ...input("stage-fixed"), levels: { rules: BTF_LEVEL_RULES, pools: POOLS } });
  const player = createPlayer(world, { side: "player", moveMs: null, nextId: counter("p") }), foe = createPlayer(world, { side: "wolves", moveMs: null, nextId: counter("w") });
  for (const [id, c, r] of [["knight#1", 0, 7], ["archer#2", 1, 7]] as const) {
    world.phases = { battle: "idle" }; player.feed({ type: "SelectUnit", unitId: id }); player.feed({ type: "TargetCell", at: { c, r } });
  }
  assert.deepEqual(snapshot(world).levels?.bars, [{ id: "player", xp: 2, level: 0, banked: 0, offer: null, abilities: [] }]);
  world.levels?.gain("player", "player", 15); const offer = world.levels?.offer("player") ?? []; assert.equal(offer.length, 3);
  assert.equal(foe.feed({ type: "ChooseAbility", index: 0 }).reject, "noOffer"); assert.equal(player.feed({ type: "ChooseAbility", index: 3 }).reject, "badPick");
  const step = player.feed({ type: "ChooseAbility", unitId: "wolf#3", index: 2 });
  assert.equal(step.reject, null); assert.equal(step.action?.actor, "player"); assert.deepEqual(step.action?.effects, [offer[2]]);
  assert.equal(world.levels?.offer("player"), null); assert.deepEqual(world.levels?.state().bars.find((bar) => bar.id === "player")?.abilities, [offer[2]]);
});
test("a disposed levelling world refuses the pick and keeps the offer", () => {
  const world = createWorld({ ...input("stage-fixed"), levels: { rules: UNIT, pools: POOLS } });
  world.phases = { battle: "idle" }; world.levels?.gain("knight#1", "knight", 17);
  const offer = world.levels?.offer("knight#1"), player = createPlayer(world, { side: "player", moveMs: null, nextId: counter("m") });
  disposeWorld(world); const step = player.feed({ type: "ChooseAbility", unitId: "knight#1", index: 0 });
  assert.equal(step.reject === "disposed" && step.action === null && world.log.lastSeq() === 0, true);
  assert.deepEqual(world.levels?.offer("knight#1"), offer);
});
test("a malformed unlock never throws (step 19) and is not logged", () => {
  const world = createWorld({ ...input("stage-fixed"), levels: { rules: UNIT, pools: POOLS } });
  world.levels?.gain("knight#1", "knight", 17); const first = world.levels?.offer("knight#1")?.[0] ?? "", before = JSON.stringify(world.levels?.state());
  const bad = (effects: unknown, bare = false): void => { const n = world.notices.length; const action = bare ? { id: "u", kind: "unlock", actor: "knight#1", target: null, durationMs: null, turns: null } : { id: "u", kind: "unlock", actor: "knight#1", target: null, durationMs: null, turns: null, effects }; assert.doesNotThrow(() => submit(world, action as never)); assert.equal(world.notices.length === n + 1 && world.notices.at(-1)?.code === "unlockFailed" && world.log.lastSeq() === 0 && JSON.stringify(world.levels?.state()) === before, true); };
  bad(undefined, true); for (const effects of [undefined, null, "guard", {}, [7], [first, null]]) bad(effects);
  const timed = { id: "t", kind: "unlock" as const, actor: "knight#1", target: null, durationMs: 100, turns: null, effects: [first] };
  submit(world, timed); assert.equal(world.log.lastSeq(), 1); timed.effects = null as never; const n = world.notices.length;
  assert.doesNotThrow(() => advance(world, 200)); assert.equal(world.notices.length === n && world.log.lastSeq() === 1 && world.levels?.state().bars[0]?.abilities[0] === first, true);
});
test("the empty id never unlocks (step 19) even when choose would accept it", () => {
  const pools = { knight: ["guard", "charge"] }, world = createWorld({ ...input("stage-fixed"), levels: { rules: UNIT, pools } });
  pools.knight.push(""); world.levels?.gain("knight#1", "knight", 17); assert.deepEqual(world.levels?.offer("knight#1"), ["guard", "charge"]);
  const calls: string[] = [], loose = createWorld({ ...input("stage-fixed"), levels: { rules: UNIT, pools: { knight: ["guard", "charge"] } } });
  loose.levels?.gain("knight#1", "knight", 17); const real = loose.levels; if (real === null) throw new Error("levels");
  const world2 = { ...loose, levels: { ...real, choose: (id: string, ability: string): boolean => { calls.push(id + ability); return true; } } };
  submit(world2, { id: "e", kind: "unlock", actor: "knight#1", target: null, durationMs: null, turns: null, effects: [""] });
  assert.equal(calls.length === 0 && world2.notices.at(-1)?.code === "unlockFailed" && world2.log.lastSeq() === 1, true);
  assert.deepEqual(real.offer("knight#1"), ["guard", "charge"]);
});
test("a logged unlock with no ability id (step 19) keeps the offer and the bus quiet", () => {
  const world = createWorld({ ...input("stage-fixed"), levels: { rules: UNIT, pools: POOLS } });
  world.levels?.gain("knight#1", "knight", 17); const first = world.levels?.offer("knight#1")?.[0] ?? "", before = JSON.stringify(world.levels?.state()), levelRecs = (): number => world.bus.history().filter((rec) => rec.event.type === "level.reached" || rec.event.type === "level.unlocked").length, bus = levelRecs(), notes = world.notices.length;
  const rows = [[], [""], null, [first, first], ["nope"]] as const;
  rows.forEach((effects, i) => submit(world, { id: `a${i}`, kind: "unlock", actor: effects === null ? "" : "knight#1", target: null, durationMs: null, turns: null, effects: effects === null ? [first] : effects }));
  assert.equal(world.notices.length === notes + 5 && world.notices.slice(notes).every((n) => n.code === "unlockFailed") && JSON.stringify(world.levels?.state()) === before && levelRecs() === bus && world.log.lastSeq() === 5, true);
  submit(world, { id: "ok", kind: "unlock", actor: "knight#1", target: null, durationMs: null, turns: null, effects: [first] });
  assert.deepEqual(world.levels?.state().bars[0]?.abilities, [first]); assert.equal(world.notices.length, notes + 5);
});
