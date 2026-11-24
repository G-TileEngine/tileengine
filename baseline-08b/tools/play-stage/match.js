                                                          
import { inOrthogonalReach, targetsFor, wipeRule, WIN_CONDITION } from "../../src/rules/battle/index.js";
import { installOne } from "../../src/rules/behaviours/registry.js";
import { walkTo } from "../../src/rules/move/path.js";
import { submit } from "../../src/sim/actions.js";
                                                         
                                                        
import { linkAt, linkEvent,                } from "../../src/rules/session/links.js";
import { partyOf } from "../../src/rules/session/party.js";
                                                        
import { createPlay, spellRef } from "./board.js";
import { recipeIn,               } from "./load.js";
import { bundledDocs } from "./project.js";

/** Orthogonal reach of the demo line-shot when a row omits reach. Not an engine rule. */
export const DEFAULT_SPELL_REACH = 3;
                                                             
                                                            

export function createMatch(docs           , moveMs = 200) {
  const body = docs ?? bundledDocs(), play = createPlay(body, moveMs, false), rules = body.rules, lines = body.talk ?? {}, names = body.names ?? {};
  const baseIntend = play.intend, baseSync = play.sync;
  const win = body.win ?? installOne(WIN_CONDITION, {}).out;
  if (win === null) throw new Error("play: win-condition");
  const me = play.sides.me, order = play.sides.order, wiped = play.sides.contest ? wipeRule(win, order) : null;
  let side = me, outcome                 = null, talk              = null, round = 1, turns = 0, queue           = [], armed                                    = null;
  const spent = new Set        ();
  const spellList = (id        )                   => {
    const actor = play.world.units.get(id), bag = rules.abilities;
    if (actor === undefined) return [];
    const row = bag !== undefined && Object.hasOwn(bag, actor.unitId) ? bag[actor.unitId]?.[0] : undefined;
    const reach = row?.reach ?? DEFAULT_SPELL_REACH, out                   = [];
    for (const foe of play.world.units.all()) if (foe.alive && foe.id !== actor.id && foe.side !== actor.side && foe.side !== "neutral" && inOrthogonalReach(actor.at, foe.at, reach)) out.push({ id: foe.id });
    return out;
  };
  const cells = (list                           )       => list.flatMap((t) => { const u = play.world.units.get(t.id); return u === undefined ? [] : [u.at]; });
  const go = (e                               )       => { play.go(e); };
  const finish = ()          => {
    const from = play.world.phases.battle;
    if (from !== "idle" && from !== "unitSelected") return false;
    go({ type: "END_TURN" }); go({ type: "SIDE_END" });
    const got = wiped?.(play.world, { round, side }) ?? null;
    if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return true; }
    const i = order.indexOf(side), last = i + 1 >= order.length;
    go({ type: "CHECK_NONE", next: last ? "roundEnd" : "sideStart" });
    if (last) { go({ type: "ROUND_END" }); round += 1; go({ type: "ROUND_BEGIN" }); }
    side = order[(i + 1) % order.length] ?? me; if (side === me) spent.clear(); go({ type: "SIDE_BEGIN" }); return false;
  };
  const landMove = (action        )          => {
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
  const pump = ()       => {
    while (queue.length > 0 && play.walk === null) {
      const action = queue.shift(); if (action === undefined) break;
      if (action.kind === "move" && landMove(action)) return;
      if (action.kind !== "move") submit(play.world, action);
    }
    if (queue.length === 0 && play.walk === null && side !== me && !finish() && side !== me) { queue = [...play.bot(play.world, side)]; pump(); }
  };
  /** Ability confirm lands in `resolving`. Walk the legal edges back to `idle` (or `play.result` on a wipe) so the player can select again and End turn. Talk stays on `actMenu` and does not take `UNIT_DONE`. */
  const settle = ()       => {
    if (play.world.phases.battle !== "resolving") return;
    if (play.selected !== null) spent.add(play.selected);
    go({ type: "RESOLVE_DONE" });
    const got = wiped?.(play.world, { round, side }) ?? null;
    if (got !== null) { go({ type: "CHECK_END", outcome: got }); outcome = got; return; }
    go({ type: "CHECK_NONE", next: "unitDone" });
    go({ type: "UNIT_DONE", next: "idle" });
    play.followId = null;
  };
  let tell                                     = null;
  play.landed(() => { if (side !== me) { go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); pump(); return; } const who = play.selected === null ? undefined : play.world.units.get(play.selected), hit = who === undefined ? null : linkAt(body.links ?? [], who.at); if (hit === null) return; const from = body.stage, id = typeof from === "object" && from !== null && "id" in from && typeof from.id === "string" ? from.id : null; if (id === null) throw new Error("play: stage id"); tell?.(linkEvent(hit, id, play.sides.contest && outcome === null)); });
  const wipe = ()       => { play.aims = []; talk = null; play.focus(null); play.followId = null; };
  const back = ()                                    => {
    if (play.world.phases.battle !== "targeting") return null;
    const from = armed === "unitSelected" ? "unitSelected" : "actMenu";
    baseIntend({ type: "Cancel" }); if (from === "unitSelected") go({ type: "UNDO_MOVE" }); armed = null; return from;
  };
  const spend = ()       => { if (play.world.phases.battle !== "actMenu") return; if (play.selected !== null) spent.add(play.selected); go({ type: "WAIT" }); go({ type: "UNIT_DONE", next: "idle" }); play.followId = null; };
  const api = Object.assign(play, {
    intend(intent            ) {
      const step = baseIntend(intent);
      if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "interact") {
        const target = step.action.target, id = target !== null && target.pipe === "unit" ? target.unitId : undefined, u = id === undefined ? undefined : play.world.units.get(id);
        const key = u === undefined ? "" : `talk-${u.unitId}`;
        const text = key !== "" && Object.hasOwn(lines, key) ? lines[key] ?? "" : "";
        talk = { name: u === undefined ? "" : names[u.unitId] ?? recipeIn(body.recipes, u.unitId).name, text };
        play.world.phases = { ...play.world.phases, battle: "actMenu" };
      } else if (typeof step === "object" && step !== null && "action" in step && step.action?.kind === "ability") settle();
      return step;
    },
    sync() { baseSync(); },
    choose(kind                            )                {
      const id = play.selected; if (id === null) return "noUnit";
      const list = kind === "spell" ? spellList(id) : targetsFor(play.world.grid, play.world.units, id, kind === "talk" ? "interact" : "basic", rules);
      if (list.length === 0) return "noTarget";
      const from = play.world.phases.battle;
      const step = baseIntend({ type: "ChooseAction", actionId: kind === "talk" ? "interact" : kind, unitId: id });
      if (!("reject" in step) || step.reject !== null) return "reject" in step && step.reject !== null ? step.reject : "illegal";
      armed = from === "unitSelected" ? "unitSelected" : "actMenu";
      play.aims = cells(list); play.aimKind = kind === "spell" ? "spell" : "basic"; return null;
    },
    wait() { spend(); },
    endTurn() {
      if (play.walk !== null || side !== me || outcome !== null) return;
      if (play.world.phases.battle === "targeting") back();
      const now = play.world.phases.battle;
      if (now === "actMenu") spend(); else if (now === "unitSelected") baseIntend({ type: "Cancel" });
      wipe(); turns += 1; if (finish()) return; if (side !== me) { queue = [...play.bot(play.world, side)]; pump(); }
    },
    closeTalk() { talk = null; if (play.world.phases.battle === "actMenu") spend(); play.focus(null); },
    onLink(fn                           )       { tell = fn; },
    party() { const rules = play.world.rules; if (rules === null) throw new Error("play: party needs rules"); const hp                         = Object.create(null); for (const row of rules.state().units) { const u = play.world.units.get(row.id); if (u !== undefined && u.alive && u.side === me && !Object.hasOwn(hp, u.unitId)) hp[u.unitId] = row.hp; } const levels = play.world.levels, got = partyOf(play.world.units.all(), hp, me, levels === null ? null : levels.state().bars), extra = (body.bench ?? []).filter((m) => !got.members.some((row) => row.unitId === m.unitId)); return extra.length === 0 ? got : { ...got, members: [...got.members, ...extra] }; },
    recentreTarget()            {
      const cur = play.selected === null ? undefined : play.world.units.get(play.selected);
      if (cur !== undefined && cur.alive) return { c: cur.at.c, r: cur.at.r };
      const own = play.world.units.all().find((u) => u.alive && u.side === me);
      return own === undefined ? null : { c: own.at.c, r: own.at.r };
    },
    restart: () => createMatch(docs, moveMs),
    view() {
      const id = play.selected, unit = id === null ? undefined : play.world.units.get(id), phase = play.world.phases.battle, on = unit !== undefined && unit.alive;
      const max = unit === undefined ? 0 : (Object.hasOwn(rules.stats, unit.unitId) ? rules.stats[unit.unitId]?.hp : rules.base.hp) ?? rules.base.hp;
      const hp = on ? play.world.rules?.state().units.find((u) => u.id === unit.id)?.hp ?? max : 0;
      const menu = on && (phase === "unitSelected" || phase === "actMenu" || phase === "targeting");
      const basic = on ? targetsFor(play.world.grid, play.world.units, unit.id, "basic", rules) : [], interact = on ? targetsFor(play.world.grid, play.world.units, unit.id, "interact", rules) : [], spells = on ? spellList(unit.id) : [];
      const btn = (show         , hot         )      => ({ show, on: hot });
      const spellOn = on && spellRef(rules, unit.unitId) !== undefined;
      const levels = play.world.levels, bars = levels === null ? null : levels.state().bars, bar = bars?.find((row) => row.id === me), at = levels === null ? undefined : levels.rules.thresholds[bar?.level ?? 0];
      const xp = levels === null ? null : { level: bar?.level ?? 0, now: bar?.xp ?? 0, need: typeof at === "number" ? at : 0, top: bar !== undefined && bar.level >= levels.rules.thresholds.length || typeof at !== "number" };
      return {
        turn: side === me ? "YOUR TURN" : "ENEMY TURN", side, mine: side === me, name: on ? names[unit.unitId] ?? recipeIn(body.recipes, unit.unitId).name : "", hp, max, selected: on, outcome, turns, talk, xp, note: body.bench === undefined || body.bench.length === 0 ? null : `Not placed: ${body.bench.length} of your team had no free cell. They stay with the party.`,
        actions: { basic: btn(menu, basic.length > 0), spell: btn(menu && spellOn, spells.length > 0), talk: btn(on && interact.length > 0, interact.length > 0), wait: btn(phase === "actMenu", phase === "actMenu"), end: btn(true, true) },
      };
    },
  });
  Object.defineProperty(api, "side", { get: () => side });
  Object.defineProperty(api, "outcome", { get: () => outcome });
  Object.defineProperty(api, "talk", { get: () => talk });
  Object.defineProperty(api, "done", { get: () => spent });
  const same = (a    , b    )          => a.c === b.c && a.r === b.r;
  const listed = (list               , at    )          => list.some((c) => same(c, at));
  const atOf = (intent            )            => {
    if (intent.type === "TargetCell") return intent.at;
    if (intent.type !== "SelectUnit") return null;
    const u = play.world.units.get(intent.unitId); return u === undefined ? null : u.at;
  };
  const ready = (id        )          => { const u = play.world.units.get(id); return u !== undefined && u.alive && u.side === me && !spent.has(id); };
  const commit = (at    )          => { const cell = { c: at.c, r: at.r }; api.intend({ type: "TargetCell", at: cell }); return api.intend({ type: "TargetCell", at: cell }); };
  play.feed = (intent            )          => {
    if (talk !== null || play.walk !== null || side !== me || outcome !== null) return undefined;
    const phase = play.world.phases.battle, at = atOf(intent);
    if (phase === "targeting" && at !== null && listed(play.aims, at)) return commit(at);
    if (phase === "targeting") {
      const from = back(); play.aims = []; talk = null; play.followId = null;
      if (intent.type === "SelectUnit" && ready(intent.unitId) && intent.unitId !== play.selected) { if (from !== "unitSelected") spend(); return api.intend(intent); }
      return undefined;
    }
    if (intent.type === "SelectUnit" && !ready(intent.unitId)) return undefined;
    if (phase === "unitSelected" && intent.type === "TargetCell") {
      if (at !== null && listed(play.reach, at)) return commit(at);
      baseIntend({ type: "Cancel" }); wipe(); return undefined;
    }
    if (phase === "actMenu" && intent.type === "SelectUnit" && intent.unitId !== play.selected) { spend(); return api.intend(intent); }
    if (phase === "actMenu" && intent.type === "SelectUnit") return undefined;
    return api.intend(intent);
  };
  return api                                                                                                                                                                               ;
}
