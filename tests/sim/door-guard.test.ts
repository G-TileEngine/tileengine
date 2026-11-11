import assert from "node:assert/strict";
import { test } from "node:test";
import { createPlayer, createWorld, runMatch, snapshot, type IntentInput, type PlayerStep } from "../../src/sim/index.ts";
import { input } from "./input.ts";
import { counter } from "./seats.ts";

test("the door's shape guard (B1): malformed is named, changes nothing, and a later tap still moves the selected unit", () => {
  const world = createWorld(input("stage-fixed")); world.phases = { battle: "idle" };
  const player = createPlayer(world, { side: "player", moveMs: null, nextId: counter("m") });
  const finger = (): string => JSON.stringify([snapshot(world).units, snapshot(world).occupancy, world.log.lastSeq(), world.phases]);
  assert.equal(player.feed({ type: "SelectUnit", unitId: "knight#1" }).reject === null && world.phases.battle === "unitSelected", true);
  const kept = finger();
  const cases: readonly (readonly [unknown, unknown?])[] = [[undefined], [null], [7], ["SelectUnit"], [[]], [{ type: "Confirm" }, "x"], [{ type: "Confirm" }, [0, 7]], [{ type: "TargetCell" }], [{ type: "TargetCell", at: null }], [{ type: "TargetCell", at: [0, 7] }], [{ type: "TargetCell", at: "0,7" }]];
  for (const [intent, aim] of cases) { const step = player.feed(intent as never, aim as never); assert.deepEqual([step.reject, step.event, step.action, step.from, step.intent, finger()], ["malformed", null, null, "unitSelected", intent ?? null, kept]); }
  assert.equal(player.feed({ type: "TargetCell", at: { c: "0", r: 7 } } as never).reject, "offGrid");
  assert.equal(player.feed({ type: "Hack" } as never, { c: 0, r: 7 }).reject, "noEvent");
  const knight = snapshot(world).units.find((u) => u.id === "knight#1");
  assert.equal(player.feed({ type: "TargetCell", at: { c: 0, r: 7 } }).reject === null && knight?.at.r === 8 && player.history().filter((s) => s.reject === "malformed").length === 11, true);
  const after = snapshot(world).units.find((u) => u.id === "knight#1");
  assert.equal(after?.at.c === 0 && after.at.r === 7, true);
});
test("runMatch never throws on a wire input of any shape (B1): nine shapes are malformed and units stay", () => {
  const world = createWorld(input("stage-fixed")), before = JSON.stringify(snapshot(world).units), rejects: PlayerStep["reject"][] = [];
  const nine: unknown[] = [null, 7, "SelectUnit", [], {}, { intent: null }, { intent: [] }, { intent: { type: "TargetCell" } }, { intent: { type: "TargetCell", at: null } }];
  const nextId = counter("m"), intents = (): IntentInput[] => [{ intent: { type: "SelectUnit", unitId: "knight#1" } }, ...(nine as IntentInput[])];
  const seats = [{ player: createPlayer(world, { side: "player" as const, moveMs: 200, nextId }), intents, onStep: (step: PlayerStep) => { rejects.push(step.reject); } }, { player: createPlayer(world, { side: "wolves" as const, moveMs: 200, nextId }), intents: (): IntentInput[] => [] }];
  runMatch(world, { sides: ["player", "wolves"], victory: () => null, fuse: 10, maxRounds: 1, maxSimMs: 1000, seats });
  assert.deepEqual(rejects, [null, ...nine.map(() => "malformed" as const)]);
  assert.equal(JSON.stringify(snapshot(world).units), before);
});
test("createWorld reads the stage under the host's stageLimits: over the cap and a hostile kind throw; at the cap loads", () => {
  const base = input("stage-weighted"), boom = (stage: unknown, re: RegExp): void => { assert.throws(() => createWorld({ ...base, stage }), (err: unknown) => re.test(String(err))); };
  const over = structuredClone(base.stage) as { enemyPool: { picks: number } }; over.enemyPool.picks = 145; boom(over, /^Error: stage: bad field enemyPool$/);
  const hostile = structuredClone(base.stage) as { kind: unknown }; hostile.kind = { toString(): string { throw new Error("no"); }, valueOf(): number { throw new Error("no"); } }; boom(hostile, /^Error: stage: wrong kind object$/);
  const at = structuredClone(base.stage) as { enemyPool: { picks: number } }; at.enemyPool.picks = 144;
  assert.equal(createWorld({ ...base, stage: at, stageLimits: { picks: 144, waveUnits: 144 } }).units.all().some((u) => u.id === "knight#1"), true);
});
