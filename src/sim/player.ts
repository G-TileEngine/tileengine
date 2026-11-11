import type { Action } from "../core/log/index.ts";
import { TABLES, mergeTables } from "../state/index.ts";
import { submit } from "./actions.ts";
import { feedIntent, intentEvent } from "./intents.ts";
import type { Player, PlayerOptions, PlayerReject, PlayerStep, SimWorld } from "./types.ts";

const EDGES = mergeTables(TABLES);

function rejectOf(world: SimWorld, opts: PlayerOptions, from: PlayerStep["from"], event: PlayerStep["event"], selected: string | null): PlayerReject | null {
  if (event === null) return "noEvent";
  if (!EDGES.has(`${from}|${event.type}`)) return "illegal";
  if (event.type === "SELECT_UNIT") {
    const unit = world.units.get(event.unitId);
    if (unit === undefined || !unit.alive) return "noUnit";
    if (unit.side !== opts.side) return "notOwn";
    return null;
  }
  if (event.type === "CONFIRM_TARGET") return "noAction";
  if (event.type === "TAP_MOVE_CELL") {
    const unit = selected === null ? undefined : world.units.get(selected);
    if (unit === undefined || !unit.alive) return "noUnit";
    if (unit.side !== opts.side) return "notOwn";
    if (!world.grid.inBounds(event.at)) return "offGrid";
  }
  return null;
}
export function createPlayer(world: SimWorld, opts: PlayerOptions): Player {
  if (opts.moveMs !== null && (!Number.isInteger(opts.moveMs) || opts.moveMs < 0)) throw new RangeError("createPlayer: moveMs must be null or an integer >= 0");
  const steps: PlayerStep[] = [];
  let selected: string | null = null;
  return {
    side: opts.side,
    feed(intent, aim) {
      const from = world.phases.battle;
      if (from === undefined) throw new Error("player: battle phase missing");
      const event = intentEvent(from, intent, aim ?? null);
      const reject = rejectOf(world, opts, from, event, selected);
      let action: Action | null = null;
      if (reject === null && event !== null) {
        feedIntent(world, intent, aim ?? null);
        if (event.type === "TAP_MOVE_CELL" && selected !== null) {
          action = { id: opts.nextId(), kind: "move", actor: selected, target: { pipe: "tile", at: { c: event.at.c, r: event.at.r } }, durationMs: opts.moveMs, turns: null, effects: [] };
          submit(world, action);
        }
        selected = event.type === "SELECT_UNIT" ? event.unitId : null;
      }
      const step: PlayerStep = { intent, aim: aim ?? null, tick: world.clock.tick(), from, event, action, reject };
      steps.push(step);
      return step;
    },
    history: () => steps.slice(),
  };
}
