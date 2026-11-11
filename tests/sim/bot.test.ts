import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import type { Intent } from "../../src/runtime/input/index.ts";
import { createPlayer, createWorld, disposeWorld, runMatch, snapshot, type IntentHook, type IntentInput, type PlayerReject, type SimWorld } from "../../src/sim/index.ts";
import { bot, forward, reachFarRow, seedless } from "./ai.ts";
import { input } from "./input.ts";
import { counter, seatAll } from "./seats.ts";
const base = { victory: reachFarRow, fuse: 60000, maxRounds: 40, maxSimMs: 600000 };
const boards = [["stage-fixed", ["player", "wolves"], 48, 2, "afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75"], ["stage-weighted", ["player", "rival"], 22, 28, "b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c"]] as const;
const sha = (value: unknown): string => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const botMatch = (stage: "stage-fixed" | "stage-weighted", sides: readonly ("player" | "wolves" | "rival")[], seed: number, intents: IntentHook = bot(seed)) => {
  const world = createWorld(seedless(input(stage, seed))), seats = seatAll(world, sides, intents, 200);
  return { result: runMatch(world, { ...base, sides: [...sides], seats }), world, seats };
};
test("the test bot plays only through the player driver: no ai, the pinned 50-seed histories, no rejects, every logged move is a player step", () => {
  for (const [stage, sides, win, lose, hash] of boards) {
    const count = { win: 0, lose: 0, draw: 0, timeout: 0 }, histories = [];
    for (let seed = 1; seed <= 50; seed += 1) {
      const { result, world, seats } = botMatch(stage, [...sides], seed);
      count[result.outcome] += 1;
      histories.push(world.bus.history());
      const steps = seats.flatMap((seat) => seat.player.history());
      const ids = steps.flatMap((step) => step.action === null ? [] : [step.action.id]).sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
      assert.deepEqual(ids, Array.from({ length: world.log.lastSeq() }, (_, i) => `m${i + 1}`));
      assert.equal(steps.every((step) => step.reject === null && (step.intent.type === "SelectUnit" || step.intent.type === "TargetCell")), true);
    }
    assert.equal(`${count.win}/${count.lose}/${count.draw}/${count.timeout}`, `${win}/${lose}/0/0`);
    assert.equal(sha(histories), hash);
  }
});
test("parity (CEO: kept until the old hook is removed): the deprecated action hook and the bot through seats give the same outcome, events, log and history on every seed", () => {
  for (const [stage, sides] of boards) {
    for (let seed = 1; seed <= 50; seed += 1) {
      const world = createWorld(seedless(input(stage, seed))), result = runMatch(world, { ...base, sides: [...sides], ai: forward(seed) }), seated = botMatch(stage, [...sides], seed);
      assert.deepEqual([seated.result, seated.world.log.toJSON(), seated.world.bus.history(), snapshot(seated.world)], [result, world.log.toJSON(), world.bus.history(), snapshot(world)]);
    }
  }
});
test("the bot answers only with SelectUnit / TargetCell pairs for the units in its budget; a forged input in front of its batch is a reported reject and changes nothing else", () => {
  const world = createWorld(seedless(input("stage-fixed", 3))), hook = bot(3);
  assert.deepEqual(hook(world, "player", { kind: "side", units: ["knight#1", "archer#2", "merchant#6"] }), [
    { intent: { type: "SelectUnit", unitId: "knight#1" } }, { intent: { type: "TargetCell", at: { c: 0, r: 7 } } },
    { intent: { type: "SelectUnit", unitId: "archer#2" } }, { intent: { type: "TargetCell", at: { c: 1, r: 7 } } },
    { intent: { type: "SelectUnit", unitId: "merchant#6" } }, { intent: { type: "TargetCell", at: { c: 4, r: 3 } } },
  ]);
  assert.deepEqual(hook(world, "player", { kind: "side", units: ["ghost#9"] }), []);
  const plain = botMatch("stage-fixed", ["player", "wolves"], 3), shared = bot(3);
  let first = true;
  const forged: IntentHook = (w, side, budget) => { const batch = shared(w, side, budget); if (side !== "player" || !first) return batch; first = false; return [{ intent: { type: "SelectUnit", unitId: "wolf#3" } }, { intent: { type: "Confirm" }, aim: { c: 0, r: 7 } }, ...batch]; };
  const bad = botMatch("stage-fixed", ["player", "wolves"], 3, forged);
  assert.deepEqual([bad.result, bad.world.log.toJSON(), bad.world.bus.history()], [plain.result, plain.world.log.toJSON(), plain.world.bus.history()]);
  assert.deepEqual(bad.seats.flatMap((seat) => seat.player.history()).flatMap((step) => step.reject === null ? [] : [[step.intent.type, step.reject]]), [["SelectUnit", "notOwn"], ["Confirm", "noEvent"]]);
});
test("every reject reason is reached and changes nothing, including a selected unit that turns foreign or dies before the tap; a side with no seat and no ai throws", () => {
  const real = createWorld(input("stage-fixed"));
  real.phases = { battle: "idle" };
  const kept = JSON.stringify(snapshot(real)), over: { patch: { alive: false } | { side: "wolves" } | null } = { patch: null }, units = real.units;
  const world: SimWorld = { ...real, units: { ...units, get: (id) => { const u = units.get(id); return u === undefined || over.patch === null || id !== "knight#1" ? u : { ...u, ...over.patch }; } } };
  const player = createPlayer(world, { side: "player", moveMs: 200, nextId: counter("m") });
  const finger = (): string => JSON.stringify([snapshot(world).units, snapshot(world).occupancy, world.log.lastSeq(), world.phases]);
  const reasons = new Set<PlayerReject>();
  const feed = (intent: Intent, reject: PlayerReject | null, aim?: { c: number; r: number }): void => {
    const before = finger(), step = player.feed(intent, aim);
    if (reject === null) { assert.equal(step.reject, null); return; }
    reasons.add(reject);
    assert.equal(step.action === null && step.reject === reject && finger() === before, true);
  };
  feed({ type: "Confirm" }, "noEvent"); feed({ type: "Cancel" }, "illegal"); feed({ type: "SelectUnit", unitId: "wolf#3" }, "notOwn");
  over.patch = { alive: false }; feed({ type: "SelectUnit", unitId: "knight#1" }, "noUnit"); over.patch = null;
  feed({ type: "SelectUnit", unitId: "knight#1" }, null); feed({ type: "TargetCell", at: { c: 6, r: 8 } }, "offGrid");
  over.patch = { side: "wolves" }; feed({ type: "TargetCell", at: { c: 0, r: 7 } }, "notOwn");
  over.patch = { alive: false }; feed({ type: "TargetCell", at: { c: 0, r: 7 } }, "noUnit"); over.patch = null;
  feed({ type: "Cancel" }, null); world.phases = { battle: "targeting" }; feed({ type: "Confirm" }, "noAction", { c: 0, r: 7 });
  feed({ type: "TargetCell", at: null } as unknown as Intent, "malformed");
  disposeWorld(world); feed({ type: "SelectUnit", unitId: "knight#1" }, "disposed");
  const listed: Record<PlayerReject, true> = { noEvent: true, illegal: true, noUnit: true, notOwn: true, offGrid: true, noAction: true, malformed: true, disposed: true };
  assert.deepEqual([...reasons].sort(), Object.keys(listed).sort());
  assert.equal(world.log.lastSeq() === 0 && player.history().length === 11 && JSON.stringify(snapshot(real)) === kept, true);
  const only = createWorld(input("stage-fixed"));
  assert.throws(() => runMatch(only, { ...base, sides: ["player", "wolves"], seats: seatAll(only, ["player"], () => [], 200) }), /runMatch: every side needs a seat or the ai/);
  const none = createWorld(input("stage-fixed"));
  assert.throws(() => runMatch(none, { ...base, sides: ["player", "wolves"] }), /runMatch: every side needs a seat or the ai/);
  const both = createWorld(input("stage-fixed"));
  assert.equal(runMatch(both, { ...base, sides: ["player", "wolves"], seats: seatAll(both, ["player", "wolves"], bot(1), 200) }).outcome, "win");
});
test("online is just another driver: seats fed only from intents sent as JSON (as a peer would) give the same per-step snapshot hashes, log and history; nothing in src/ knows", () => {
  const wire: string[] = [];
  const run = (fromWire: boolean) => {
    const world = createWorld(seedless(input("stage-weighted", 5))), hashes: string[] = [], nextId = counter("m"), live = bot(5);
    let i = 0;
    const intents: IntentHook = (w, side, budget) => { if (!fromWire) { const answer = live(w, side, budget); wire.push(JSON.stringify(answer)); return answer; } return JSON.parse(wire.at(i++) ?? "[]") as IntentInput[]; };
    const sides = ["player", "rival"] as const;
    const seats = sides.map((side) => ({ player: createPlayer(world, { side, moveMs: 200, nextId }), intents, onStep: (_s: unknown, w: SimWorld) => { hashes.push(sha(snapshot(w))); } }));
    const result = runMatch(world, { ...base, sides: [...sides], seats });
    return { result, hashes, log: world.log.toJSON(), history: [world.bus.history(), seats.map((seat) => seat.player.history())], i };
  };
  const a = run(false), b = run(true);
  assert.equal(a.hashes.length > 50 && b.i === wire.length, true);
  assert.deepEqual([b.result, b.hashes, b.log, b.history], [a.result, a.hashes, a.log, a.history]);
});
