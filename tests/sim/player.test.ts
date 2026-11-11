import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { parseLog } from "../../src/core/log/index.ts";
import { createGestureMapper, type Intent, type PointerSample } from "../../src/runtime/input/index.ts";
import { createPlayer, createWorld, replay, runMatch, snapshot, type MatchOptions, type PlayerReject, type SimWorld } from "../../src/sim/index.ts";
import { forward, reachFarRow, seedless } from "./ai.ts";
import { input } from "./input.ts";
import { asIntents, counter } from "./seats.ts";
const base: MatchOptions = { sides: ["player", "wolves"], ai: () => [], victory: () => null, fuse: 60000, maxRounds: 40, maxSimMs: 600000 };
const kinds = (events: readonly { type: string }[]): string[] => events.map((e) => e.type);
const finger = (world: SimWorld): string => { const s = snapshot(world); return JSON.stringify([s.units, s.occupancy, s.logSeq, s.phases]); };
const idle = (): SimWorld => { const world = createWorld(input("stage-fixed")); world.phases = { battle: "idle" }; return world; };
const cell = (c: number, r: number): Intent => ({ type: "TargetCell", at: { c, r } });
const sel = (unitId: string): Intent => ({ type: "SelectUnit", unitId });
test("the test AI as intents through the player driver gives the same 50-seed histories, byte for byte", () => {
  const pins = [["stage-fixed", ["player", "wolves"], 48, 2, "afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75"], ["stage-weighted", ["player", "rival"], 22, 28, "b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c"]] as const;
  for (const [stage, sides, win, lose, hash] of pins) {
    const count = { win: 0, lose: 0, draw: 0, timeout: 0 }; const histories = [];
    for (let seed = 1; seed <= 50; seed += 1) {
      const world = createWorld(seedless(input(stage, seed)));
      const nextId = counter("m");
      const intents = asIntents(forward(seed));
      const players = sides.map((side) => createPlayer(world, { side, moveMs: 200, nextId }));
      count[runMatch(world, { ...base, sides: [...sides], ai: () => { throw new Error("asked"); }, victory: reachFarRow, seats: players.map((player) => ({ player, intents })) }).outcome] += 1;
      histories.push(world.bus.history());
    }
    assert.equal(`${count.win}/${count.lose}/${count.draw}/${count.timeout}`, `${win}/${lose}/0/0`);
    assert.equal(createHash("sha256").update(JSON.stringify(histories)).digest("hex"), hash);
  }
});
test("rejects are reported, add no event and change no unit, occupancy, log or phase (CEO Q3)", () => {
  const world = idle();
  const player = createPlayer(world, { side: "player", moveMs: 200, nextId: counter("m") });
  const got: { from: string; reject: PlayerReject | null }[] = [];
  const feed = (intent: Intent, from: string, reject: PlayerReject | null, aim?: { c: number; r: number }) => {
    const before = finger(world);
    const step = player.feed(intent, aim);
    got.push({ from: step.from, reject: step.reject });
    assert.equal(step.from === from && step.reject === reject && step.action === null, true);
    if (reject !== null) assert.equal(finger(world), before);
    return step;
  };
  const rows: readonly [Intent, string, PlayerReject | null][] = [
    [{ type: "BoxSelect", from: { c: 0, r: 0 }, to: { c: 0, r: 1 } }, "idle", "noEvent"], [{ type: "Confirm" }, "idle", "noEvent"], [cell(0, 7), "idle", "noEvent"],
    [sel("wolf#3"), "idle", "notOwn"], [sel("ghost#9"), "idle", "noUnit"], [sel("knight#1"), "idle", null],
    [cell(-1, 7), "unitSelected", "offGrid"], [cell(6, 0), "unitSelected", "offGrid"], [{ type: "Cancel" }, "unitSelected", null], [{ type: "Cancel" }, "idle", "illegal"],
  ];
  for (const [intent, from, reject] of rows) feed(intent, from, reject);
  world.phases = { battle: "targeting" };
  assert.equal(feed(cell(0, 7), "targeting", "noAction").event?.type === "CONFIRM_TARGET" && feed({ type: "Confirm" }, "targeting", "noAction", { c: 0, r: 7 }).event?.type === "CONFIRM_TARGET", true);
  world.phases = { battle: "moving" };
  feed(sel("knight#1"), "moving", "illegal");
  assert.deepEqual(player.history().map((s) => ({ from: s.from, reject: s.reject })), got);
  assert.equal(player.history().length === 13 && world.log.lastSeq() === 0 && !world.notices.some((n) => n.code === "moveFailed"), true);
  const fresh = idle(); fresh.phases = { battle: "unitSelected" };
  const before = finger(fresh);
  const miss = createPlayer(fresh, { side: "player", moveMs: 200, nextId: counter("m") }).feed(cell(0, 7));
  assert.equal(miss.reject === "noUnit" && miss.event?.type === "TAP_MOVE_CELL" && miss.action === null && finger(fresh) === before, true);
  const again = idle(); const late = createPlayer(again, { side: "player", moveMs: 200, nextId: counter("m") });
  late.feed(sel("knight#1")); again.units.remove("knight#1"); const gone = finger(again); const dead = late.feed(cell(0, 7));
  assert.equal(dead.reject === "noUnit" && dead.action === null && finger(again) === gone, true);
});
test("a tap-move submits one move with the caller's id and ms; the core still decides blocked cells", () => {
  const world = idle();
  const player = createPlayer(world, { side: "player", moveMs: 200, nextId: counter("k") });
  player.feed(sel("knight#1"));
  const step = player.feed(cell(0, 7));
  assert.deepEqual(step.action, { id: "k1", kind: "move", actor: "knight#1", target: { pipe: "tile", at: { c: 0, r: 7 } }, durationMs: 200, turns: null, effects: [] });
  assert.equal(step.event?.type === "TAP_MOVE_CELL" && world.phases.battle === "moving" && world.log.lastSeq() === 1, true);
  for (let i = 0; i < 20; i += 1) world.clock.step();
  assert.deepEqual(world.units.get("knight#1")?.at, { c: 0, r: 7 });
  const blocked = idle();
  const other = createPlayer(blocked, { side: "player", moveMs: null, nextId: counter("k") });
  other.feed(sel("knight#1"));
  const fail = other.feed(cell(1, 8));
  assert.equal(fail.action?.durationMs === null && blocked.notices.at(-1)?.code === "moveFailed" && blocked.log.lastSeq() === 1, true);
  assert.deepEqual(blocked.units.get("knight#1")?.at, { c: 0, r: 8 });
  assert.throws(() => createPlayer(world, { side: "player", moveMs: 1.5, nextId: () => "a" }), RangeError);
  const bare = createWorld(input("stage-fixed")); bare.phases = {};
  assert.throws(() => createPlayer(bare, { side: "player", moveMs: 200, nextId: () => "a" }).feed({ type: "Cancel" }), /player: battle phase missing/);
});
test("touch gestures reach submit through the same door; events match the AI turn (CEO Q2, STATES rule 8)", () => {
  const px = (kind: PointerSample["kind"], c: number, r: number, ms: number): PointerSample => ({ kind, id: 1, pointer: "touch", x: c * 64 + 32, y: r * 64 + 32, ms });
  const want = ["BATTLE_READY", "DEPLOY_DONE", "ROUND_BEGIN", "SIDE_BEGIN", "SELECT_UNIT", "TAP_MOVE_CELL", "MOVE_DONE", "WAIT", "UNIT_DONE", "END_TURN", "SIDE_END", "CHECK_END"];
  const play = (samples: readonly PointerSample[]) => {
    const world = createWorld(input("stage-fixed"));
    const player = createPlayer(world, { side: "player", moveMs: 200, nextId: counter("k") });
    let used = false;
    const result = runMatch(world, { ...base, sides: ["player"], fuse: 1000, victory: () => "draw", seats: [{ player, intents: () => {
      if (used) return [];
      used = true;
      const map = createGestureMapper({ cellPx: 64, tapMaxPx: 10, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (sq) => world.units.occupantAt(sq) });
      return samples.flatMap((sample) => map(sample).map((intent) => ({ intent })));
    } }] });
    assert.deepEqual([kinds(result.events), world.units.get("knight#1")?.at, world.log.lastSeq()], [want, { c: 0, r: 7 }, 1]);
  };
  play([px("down", 0, 8, 0), px("up", 0, 8, 90), px("down", 0, 7, 400), px("up", 0, 7, 480)]);
  play([px("down", 0, 8, 0), px("move", 0, 7, 80), px("up", 0, 7, 200)]);
});
test("onStep runs after every input (moves landed); per-step snapshots repeat and the log replays; bad seats throw", () => {
  const run = () => {
    const src = input("stage-fixed"); const world = createWorld(src); const snaps: string[] = [];
    const intents = asIntents(forward(3)); const nextId = counter("m");
    const players = (["player", "wolves"] as const).map((side) => createPlayer(world, { side, moveMs: 200, nextId }));
    runMatch(world, { ...base, victory: reachFarRow, seats: players.map((player) => ({ player, intents, onStep: (_s, w) => { snaps.push(JSON.stringify(snapshot(w))); } })) });
    return { src, world, snaps, players };
  };
  const a = run(); const b = run();
  const n = a.players.reduce((k, p) => k + p.history().length, 0);
  assert.equal(a.snaps.length > 20 && a.snaps.length === n && a.players.every((p) => p.history().every((s) => s.reject === null)), true);
  assert.deepEqual(b.snaps, a.snaps);
  const log = parseLog(a.world.log.toJSON()); if (!log.ok) throw new Error(log.error);
  assert.deepEqual(replay(a.src, log.log, a.world.clock.tick()).bus.history(), a.world.bus.history());
  const bad = createWorld(input("stage-fixed"));
  const seat = { player: createPlayer(bad, { side: "player", moveMs: 200, nextId: counter("m") }), intents: () => [] };
  assert.throws(() => runMatch(bad, { ...base, seats: [seat, seat] }), RangeError);
  const other = createWorld(input("stage-fixed"));
  assert.throws(() => runMatch(other, { ...base, sides: ["wolves"], seats: [{ player: createPlayer(other, { side: "player", moveMs: 200, nextId: () => "a" }), intents: () => [] }] }), RangeError);
});
