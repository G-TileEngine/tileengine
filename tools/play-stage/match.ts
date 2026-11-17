import type { Action } from "../../src/core/log/index.ts";
import { inOrthogonalReach, targetsFor, wipeRule, WIN_CONDITION } from "../../src/rules/battle/index.ts";
import { installOne } from "../../src/rules/behaviours/registry.ts";
import { walkTo } from "../../src/rules/move/path.ts";
import { submit } from "../../src/sim/actions.ts";
import type { DoorIntent } from "../../src/sim/types.ts";
import type { Outcome } from "../../src/state/index.ts";
import type { Sq } from "../../src/types/core-types.ts";
import { createPlay, spellRef } from "./board.ts";
import { DEMO_SETUP, DEMO_TALK, recipeOf, type PlayDocs } from "./load.ts";

/** Orthogonal reach of the demo line-shot when a row omits reach. Not an engine rule. */
export const DEFAULT_SPELL_REACH = 3;
const SIDES = ["player", "wolves"] as const;
type Side = (typeof SIDES)[number];
type Talk = { readonly name: string; readonly text: string };
type Btn = { readonly show: boolean; readonly on: boolean };

export function createMatch(docs?: PlayDocs, moveMs = 200) {
  const play = createPlay(docs, moveMs, false), rules = docs?.rules ?? DEMO_SETUP, lines = docs?.talk ?? DEMO_TALK;
  const baseIntend = play.intend, baseSync = play.sync;
  const win = installOne(WIN_CONDITION, {});
  if (win.out === null) throw new Error("play: win-condition");
  const wiped = wipeRule(win.out, SIDES);
  let side: Side = "player", outcome: Outcome | null = null, talk: Talk | null = null, round = 1, turns = 0, queue: Action[] = [];
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
    const got = wiped(play.world, { round, side });
    if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return true; }
    const i = SIDES.indexOf(side), last = i + 1 >= SIDES.length;
    go({ type: "CHECK_NONE", next: last ? "roundEnd" : "sideStart" });
    if (last) { go({ type: "ROUND_END" }); round += 1; go({ type: "ROUND_BEGIN" }); }
    side = SIDES[(i + 1) % SIDES.length] ?? "player"; go({ type: "SIDE_BEGIN" }); return false;
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
    if (queue.length === 0 && play.walk === null && side === "wolves" && !finish() && side === "wolves") { queue = [...play.bot(play.world, "wolves")]; pump(); }
  };
  /** Ability confirm lands in `resolving`. Walk the legal edges back to `idle` (or `play.result` on a wipe) so the player can select again and End turn. Talk stays on `actMenu` and does not take `UNIT_DONE`. */
  const settle = (): void => {
    if (play.world.phases.battle !== "resolving") return;
    go({ type: "RESOLVE_DONE" });
    const got = wiped(play.world, { round, side });
    if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return; }
    go({ type: "CHECK_NONE", next: "unitDone" });
    go({ type: "UNIT_DONE", next: "idle" });
    play.followId = null;
  };
  play.landed(() => { if (side !== "wolves") return; go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); pump(); });
  const api = Object.assign(play, {
    intend(intent: DoorIntent) {
      const step = baseIntend(intent);
      if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "interact") {
        const target = step.action.target, id = target !== null && target.pipe === "unit" ? target.unitId : undefined, u = id === undefined ? undefined : play.world.units.get(id);
        const key = u === undefined ? "" : `talk-${u.unitId}`;
        const text = Object.hasOwn(lines, key) ? lines[key] ?? "" : Object.hasOwn(lines, "talk-villager") ? lines["talk-villager"] ?? "" : "";
        talk = { name: u === undefined ? "" : recipeOf(u.unitId).name, text };
        play.world.phases = { ...play.world.phases, battle: "actMenu" };
      } else if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "ability") settle();
      return step;
    },
    sync() { baseSync(); },
    choose(kind: "basic" | "spell" | "talk"): string | null {
      const id = play.selected; if (id === null) return "noUnit";
      const step = baseIntend({ type: "ChooseAction", actionId: kind === "talk" ? "interact" : kind, unitId: id });
      if (!("reject" in step) || step.reject !== null) return "reject" in step && step.reject !== null ? step.reject : "illegal";
      const list = kind === "spell" ? spellList(id) : targetsFor(play.world.grid, play.world.units, id, kind === "talk" ? "interact" : "basic", rules);
      play.aims = cells(list); play.aimKind = kind === "spell" ? "spell" : "basic"; return null;
    },
    wait() { if (play.world.phases.battle !== "actMenu") return; go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); play.followId = null; },
    endTurn() { if (play.world.phases.battle === "actMenu") api.wait(); if (side === "player") turns += 1; if (finish()) return; if (side === "wolves") { queue = [...play.bot(play.world, side)]; pump(); } },
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
        turn: side === "player" ? "YOUR TURN" : "ENEMY TURN", side, name: on ? recipeOf(unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk,
        actions: { basic: btn(menu, basic.length > 0), spell: btn(menu && spellOn, spells.length > 0), talk: btn(on && interact.length > 0, interact.length > 0), wait: btn(phase === "actMenu", phase === "actMenu"), end: btn(true, true) },
      };
    },
  });
  Object.defineProperty(api, "side", { get: () => side });
  Object.defineProperty(api, "outcome", { get: () => outcome });
  Object.defineProperty(api, "talk", { get: () => talk });
  return api as typeof api & { readonly side: Side; readonly outcome: Outcome | null; readonly talk: Talk | null };
}
