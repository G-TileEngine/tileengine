import type { Action } from "../core/log/index.ts";
import { startFuse } from "../rules/turns/fuse.ts";
import { xGo, type Event } from "../state/index.ts";
import { submit } from "./actions.ts";
import { replayTicks } from "./run.ts";
import type { AiHook, MatchOptions, MatchResult, SimWorld } from "./types.ts";

const noAi: AiHook = () => { throw new Error("runMatch: ai was asked with no hook"); };

export function runMatch(world: SimWorld, opts: MatchOptions): MatchResult {
  if (!Number.isInteger(opts.maxRounds) || opts.maxRounds < 1) throw new RangeError("runMatch: maxRounds must be an integer >= 1");
  if (!Number.isInteger(opts.maxSimMs) || opts.maxSimMs < 0) throw new RangeError("runMatch: maxSimMs must be an integer >= 0");
  if (!seatsOk(opts)) throw new RangeError("runMatch: bad seats");
  if (opts.ai === undefined && opts.sides.some((side) => !(opts.seats ?? []).some((seat) => seat.player.side === side))) throw new RangeError("runMatch: every side needs a seat or the ai");
  const events: Event[] = [];
  const mark = (e: Event): void => {
    events.push(e);
    const battle = world.phases.battle;
    if (battle === undefined) throw new Error("runMatch: battle phase missing");
    world.phases = { ...world.phases, battle: xGo(battle, e) };
  };
  mark({ type: "BATTLE_READY" });
  mark({ type: "DEPLOY_DONE" });
  let outcome: MatchResult["outcome"] | null = null;
  let rounds = 0;
  while (outcome === null && rounds < opts.maxRounds && world.clock.now() < opts.maxSimMs) {
    rounds += 1;
    mark({ type: "ROUND_BEGIN" });
    for (const [i, side] of opts.sides.entries()) {
      turn(world, opts, side, mark, events);
      const got = opts.victory(world, { round: rounds, side });
      if (got !== null) { outcome = got; mark({ type: "CHECK_END", outcome: got }); break; }
      mark({ type: "CHECK_NONE", next: i + 1 < opts.sides.length ? "sideStart" : "roundEnd" });
      if (world.clock.now() >= opts.maxSimMs) break;
    }
    if (outcome === null && world.phases.battle === "roundEnd") mark({ type: "ROUND_END" });
  }
  return { outcome: outcome ?? "timeout", rounds, events };
}
function seatsOk(opts: MatchOptions): boolean {
  const seen: string[] = [];
  for (const seat of opts.seats ?? []) {
    if (!opts.sides.includes(seat.player.side) || seen.includes(seat.player.side)) return false;
    seen.push(seat.player.side);
  }
  return true;
}
function turn(world: SimWorld, opts: MatchOptions, side: MatchOptions["sides"][number], mark: (e: Event) => void, events: Event[]): void {
  mark({ type: "SIDE_BEGIN" });
  let expired = false;
  const fuse = startFuse(world.clock, opts.fuse, () => { expired = true; });
  const seat = opts.seats?.find((s) => s.player.side === side);
  while (!expired && world.clock.now() < opts.maxSimMs) {
    const units = world.units.all().filter((u) => u.alive && u.side === side).map((u) => u.id);
    if (seat !== undefined) {
      const inputs = seat.intents(world, side, { kind: "side", units });
      if (inputs.length === 0) { replayTicks(world, 1); continue; }
      for (const input of inputs) {
        if (expired || world.clock.now() >= opts.maxSimMs) break;
        const step = seat.player.feed(input.intent, input.aim);
        if (step.reject === null && step.event !== null) events.push(step.event);
        if (step.action !== null) land(world, step.action, () => expired, mark);
        seat.onStep?.(step, world);
      }
    } else {
      const actions = (opts.ai ?? noAi)(world, side, { kind: "side", units });
      if (actions.length === 0) { replayTicks(world, 1); continue; }
      for (const action of actions) {
        if (expired || world.clock.now() >= opts.maxSimMs) break;
        stepAction(world, action, () => expired, mark);
      }
    }
    break;
  }
  fuse?.cancel();
  mark(expired ? { type: "FUSE_EXPIRE" } : { type: "END_TURN" });
  mark({ type: "SIDE_END" });
}
function land(world: SimWorld, action: Action, expired: () => boolean, mark: (e: Event) => void): void {
  const ms = action.durationMs === null ? 0 : Math.max(action.durationMs, world.clock.stepMs);
  replayTicks(world, Math.ceil(ms / world.clock.stepMs));
  mark({ type: "MOVE_DONE" });
  if (!expired()) { mark({ type: "WAIT" }); mark({ type: "UNIT_DONE", next: "idle" }); }
}
function stepAction(world: SimWorld, action: Action, expired: () => boolean, mark: (e: Event) => void): void {
  const target = action.target;
  if (action.kind === "move" && target !== null && target.pipe === "tile") {
    mark({ type: "SELECT_UNIT", unitId: action.actor });
    mark({ type: "TAP_MOVE_CELL", at: { c: target.at.c, r: target.at.r } });
    submit(world, action);
    land(world, action, expired, mark);
    return;
  }
  submit(world, action);
}
