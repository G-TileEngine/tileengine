import type { Action } from "../core/log/index.ts";
import { TABLES, mergeTables } from "../state/index.ts";
import { submit } from "./actions.ts";
import { isDisposed } from "./dispose.ts";
import { feedIntent, intentEvent } from "./intents.ts";
import type { Player, PlayerOptions, PlayerReject, PlayerStep, SimWorld } from "./types.ts";

const EDGES = mergeTables(TABLES);
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
/** The door's shape guard (step 16): a fed value is read only after its shape is known; anything else is `malformed`. */
function malformed(intent: unknown, aim: unknown): boolean {
  return !isObj(intent) || (aim !== undefined && aim !== null && !isObj(aim)) || (intent.type === "TargetCell" && !isObj(intent.at));
}

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
      if (isDisposed(world)) return { intent: (intent ?? null) as PlayerStep["intent"], aim: (aim ?? null) as PlayerStep["aim"], tick: world.clock.tick(), from, event: null, action: null, reject: "disposed" };
      if (malformed(intent, aim)) {
        const step: PlayerStep = { intent: (intent ?? null) as PlayerStep["intent"], aim: (aim ?? null) as PlayerStep["aim"], tick: world.clock.tick(), from, event: null, action: null, reject: "malformed" };
        steps.push(step);
        return step;
      }
      if (intent.type === "ChooseAbility") {
        const levels = world.levels, sideBar = levels !== null && levels.rules.bar === "side", unit = sideBar ? undefined : world.units.get(intent.unitId ?? "");
        const missing = !sideBar && (unit === undefined || !unit.alive), foreign = !sideBar && unit !== undefined && unit.alive && unit.side !== opts.side;
        const barId = sideBar ? opts.side : unit?.id, pending = !missing && !foreign && levels !== null && barId !== undefined ? levels.offer(barId) : null;
        const ability = pending !== null && Number.isInteger(intent.index) && intent.index >= 0 && intent.index < pending.length ? pending[intent.index] : undefined;
        const reject = missing ? "noUnit" as const : foreign ? "notOwn" as const : pending === null ? "noOffer" as const : ability === undefined ? "badPick" as const : null;
        const action: Action | null = reject === null && ability !== undefined && barId !== undefined ? { id: opts.nextId(), kind: "unlock", actor: barId, target: null, durationMs: null, turns: null, effects: [ability] } : null;
        if (action !== null) submit(world, action);
        const picked: PlayerStep = { intent, aim: null, tick: world.clock.tick(), from, event: null, action, reject };
        steps.push(picked);
        return picked;
      }
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
