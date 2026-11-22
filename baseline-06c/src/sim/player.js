                                                   
import { TABLES, mergeTables, xGo } from "../state/index.js";
import { submit } from "./actions.js";
import { isDisposed } from "./dispose.js";
import { feedIntent, intentEvent } from "./intents.js";
import { walkTo } from "../rules/move/index.js";
                                                                                            

const EDGES = mergeTables(TABLES);
const isObj = (v         )                               => typeof v === "object" && v !== null && !Array.isArray(v);
/** The door's shape guard (step 16): a fed value is read only after its shape is known; anything else is `malformed`. */
function malformed(intent         , aim         )          {
  return !isObj(intent) || (aim !== undefined && aim !== null && !isObj(aim)) || (intent.type === "TargetCell" && !isObj(intent.at));
}

function rejectOf(world          , opts               , from                    , event                     , selected               )                      {
  if (event === null) return "noEvent";
  if (!EDGES.has(`${from}|${event.type}`)) return "illegal";
  if (event.type === "SELECT_UNIT") {
    const unit = world.units.get(event.unitId);
    if (unit === undefined || !unit.alive) return "noUnit";
    if (unit.side !== opts.side) return "notOwn";
    return null;
  }
  if (event.type === "TAP_MOVE_CELL") {
    const unit = selected === null ? undefined : world.units.get(selected);
    if (unit === undefined || !unit.alive) return "noUnit";
    if (unit.side !== opts.side) return "notOwn";
    if (!world.grid.inBounds(event.at)) return "offGrid";
  }
  if (event.type === "CONFIRM_TARGET" && event.target.pipe === "tile" && world.units.get(world.units.occupantAt(event.target.at) ?? "")?.alive !== true) return "noTarget";
  return null;
}
export function createPlayer(world          , opts               )         {
  if (opts.moveMs !== null && (!Number.isInteger(opts.moveMs) || opts.moveMs < 0)) throw new RangeError("createPlayer: moveMs must be null or an integer >= 0");
  const steps               = [];
  let selected                = null, pending                                        = null;
  return {
    side: opts.side,
    feed(intent, aim) {
      const from = world.phases.battle;
      if (from === undefined) throw new Error("player: battle phase missing");
      if (isDisposed(world)) return { intent: (intent ?? null)                        , aim: (aim ?? null)                     , tick: world.clock.tick(), from, event: null, action: null, reject: "disposed" };
      if (malformed(intent, aim)) {
        const step             = { intent: (intent ?? null)                        , aim: (aim ?? null)                     , tick: world.clock.tick(), from, event: null, action: null, reject: "malformed" };
        steps.push(step);
        return step;
      }
      if (intent.type === "ChooseAbility") {
        const levels = world.levels, sideBar = levels !== null && levels.rules.bar === "side", unit = sideBar ? undefined : world.units.get(intent.unitId ?? "");
        const missing = !sideBar && (unit === undefined || !unit.alive), foreign = !sideBar && unit !== undefined && unit.alive && unit.side !== opts.side;
        const barId = sideBar ? opts.side : unit?.id, pending = !missing && !foreign && levels !== null && barId !== undefined ? levels.offer(barId) : null;
        const ability = pending !== null && Number.isInteger(intent.index) && intent.index >= 0 && intent.index < pending.length ? pending[intent.index] : undefined;
        const reject = missing ? "noUnit"          : foreign ? "notOwn"          : pending === null ? "noOffer"          : ability === undefined ? "badPick"          : null;
        const action                = reject === null && ability !== undefined && barId !== undefined ? { id: opts.nextId(), kind: "unlock", actor: barId, target: null, durationMs: null, turns: null, effects: [ability] } : null;
        if (action !== null) submit(world, action);
        const picked             = { intent, aim: null, tick: world.clock.tick(), from, event: null, action, reject };
        steps.push(picked);
        return picked;
      }
      if (intent.type === "ChooseAction") {
        const id = intent.unitId ?? selected ?? "", unit = world.units.get(id), known = intent.actionId === "basic" || intent.actionId === "interact" || intent.actionId === "spell";
        const event = { type: "CHOOSE_ACTION"         , actionId: intent.actionId, next: "targeting"          };
        const reject = !EDGES.has(`${from}|CHOOSE_ACTION`) ? "illegal"          : unit === undefined || !unit.alive ? "noUnit"          : unit.side !== opts.side ? "notOwn"          : !known ? "illegal"          : null;
        if (reject === null && unit !== undefined) { world.phases = { ...world.phases, battle: xGo(from, event) }; selected = unit.id; pending = intent.actionId; }
        const picked             = { intent, aim: null, tick: world.clock.tick(), from, event: reject === null ? event : null, action: null, reject };
        steps.push(picked);
        return picked;
      }
      const event = intentEvent(from, intent, aim ?? null);
      const first = rejectOf(world, opts, from, event, selected);
      const held = event?.type === "CONFIRM_TARGET" && pending === null ? "noAction"          : first;
      const path = held === null && event?.type === "TAP_MOVE_CELL" && selected !== null && opts.step !== undefined ? walkTo(world.grid, world.units, selected, opts.step.reach, event.at) : undefined;
      const reject = path === null ? "notReachable" : held;
      let action                = null;
      if (reject === null && event !== null) {
        feedIntent(world, intent, aim ?? null);
        if (event.type === "TAP_MOVE_CELL" && selected !== null) {
          const ms = !path || opts.moveMs === null ? opts.moveMs : opts.moveMs * path.length;
          action = { id: opts.nextId(), kind: "move", actor: selected, target: { pipe: "tile", at: { c: event.at.c, r: event.at.r } }, durationMs: ms, turns: null, effects: [] };
          submit(world, action);
        }
        if (event.type === "CONFIRM_TARGET" && pending !== null && selected !== null && event.target.pipe === "tile") {
          const id = world.units.occupantAt(event.target.at);
          if (id !== undefined) { const ref = pending === "spell" ? opts.spellOf?.(selected) : undefined; action = { id: opts.nextId(), kind: pending === "interact" ? "interact" : "ability", actor: selected, target: { pipe: "unit", unitId: id }, durationMs: null, turns: null, effects: ref === undefined || ref === "" ? [] : [ref] }; submit(world, action); }
          pending = null;
        }
        if (event.type === "SELECT_UNIT") selected = event.unitId; else if (event.type === "CANCEL") pending = null; else if (event.type !== "TAP_MOVE_CELL") selected = null;
      }
      const step             = { intent, aim: aim ?? null, tick: world.clock.tick(), from, event, action, reject, ...(action !== null && path ? { path } : {}) };
      steps.push(step);
      return step;
    },
    history: () => steps.slice(),
  };
}
