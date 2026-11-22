                                                                                        
                                                     
                                                      
                                                   
import { NOT_PLAIN, isRecord, plainCopy } from "../../core/plain.js";
import { resolveAim } from "../../core/targeting/index.js";
                                                      
import { HIT_CLASSES,               } from "./damage.js";
import { interactRefused } from "./interact.js";
import { inOrthogonalReach, reachOf,                 } from "./range.js";
                                             

export const BATTLE_EVENTS                              = { mode: "battle", types: ["hit", "unit.died", "unit.interacted"] };
                                                                                                      
                                                                                                                                                                                                                                         
                                                                                                                               
export const HIT_REFUSED_REASONS = Object.freeze(["unknownActor", "deadActor", "notUnitAim", "aimMissed", "selfTarget", "deadTarget"]         );
export const HIT_FILTER_REASONS = Object.freeze(["outOfReach", "allyTarget"]         );
                                                                                  
                                                                  
                                                                                                                       
                                                                                    
                                                                                                                                                                                                                                                                                                                                                                     

const whole = (n         , min        )              => typeof n === "number" && Number.isInteger(n) && n >= min;
const pair = (v         )                 => isRecord(v) && whole(v.hp, 1) && whole(v.atk, 0);
function taken(setup             )              {
  const copy = plainCopy(setup, 4);
  if (copy === NOT_PLAIN || !isRecord(copy)) throw new RangeError("createBattle: bad setup");
  const klass = copy.hitClass, statsIn = copy.stats, reachIn = copy.reach, abilitiesIn = copy.abilities;
  if (!pair(copy.base) || !isRecord(statsIn) || typeof klass !== "string" || !(HIT_CLASSES                     ).includes(klass)) throw new RangeError("createBattle: bad setup");
  if (reachIn !== undefined && !isRecord(reachIn)) throw new RangeError("createBattle: bad setup");
  if (abilitiesIn !== undefined && !isRecord(abilitiesIn)) throw new RangeError("createBattle: bad setup");
  const stats                            = Object.create(null), reach                         = Object.create(null), abilities                            = Object.create(null);
  for (const key of Object.keys(statsIn)) { if (!Object.hasOwn(statsIn, key)) continue; const row = statsIn[key]; if (!pair(row)) throw new RangeError("createBattle: bad setup"); stats[key] = { hp: row.hp, atk: row.atk }; }
  if (isRecord(reachIn)) for (const key of Object.keys(reachIn)) { if (!Object.hasOwn(reachIn, key)) continue; const n = reachIn[key]; if (!whole(n, 1)) throw new RangeError("createBattle: bad setup"); reach[key] = n; }
  if (isRecord(abilitiesIn)) for (const key of Object.keys(abilitiesIn)) { if (!Object.hasOwn(abilitiesIn, key)) continue; const list = abilitiesIn[key]; if (!Array.isArray(list)) throw new RangeError("createBattle: bad setup"); const rows            = []; for (const row of list) { if (!isRecord(row) || !whole(row.reach, 1) || !whole(row.damage, 0) || typeof row.effectRef !== "string") throw new RangeError("createBattle: bad setup"); rows.push({ reach: row.reach, damage: row.damage, effectRef: row.effectRef }); } abilities[key] = rows; }
  return { base: { hp: copy.base.hp, atk: copy.base.atk }, stats, hitClass: klass            , ...(isRecord(reachIn) ? { reach } : {}), ...(isRecord(abilitiesIn) ? { abilities } : {}) };
}
export function createBattle(setup             , units       , grid      , emit                                         )         {
  const cfg = taken(setup), hp = new Map                ();
  const of = (id        )            => (Object.hasOwn(cfg.stats, id) ? cfg.stats[id] : cfg.base) ?? cfg.base;
  for (const u of units.all()) hp.set(u.id, of(u.unitId).hp);
  const hitNo = (reason                                    )             => ({ code: "hitRefused", message: `hit refused (${reason})`, reason });
  return {
    state: () => ({ units: units.all().flatMap((u) => { const n = hp.get(u.id); return n === undefined ? [] : [{ id: u.id, hp: n, alive: u.alive }]; }) }),
    act(action) {
      const talk = action.kind === "interact", spell = action.effects.length === 1 && action.effects[0] === "line-shot";
      if ((!talk && action.kind !== "ability") || (action.effects.length > 0 && !spell)) return { code: "actionUnsupported", message: "action unsupported" };
      const actor = units.get(action.actor);
      const no = (reason                                      )         => (talk ? interactRefused(reason) : hitNo(reason));
      if (actor === undefined) return no("unknownActor");
      if (!actor.alive) return no("deadActor");
      const target = action.target;
      if (target === null || target.pipe !== "unit") return no("notUnitAim");
      const res = resolveAim(target, units, grid);
      if (!res.hit) return no(units.get(target.unitId) === undefined || (target.fallbackAt !== undefined && !grid.inBounds(target.fallbackAt)) ? "aimMissed" : "deadTarget");
      if (res.unitId === action.actor) return no("selfTarget");
      const body = units.get(res.unitId);
      if (talk) { if (body === undefined || !inOrthogonalReach(actor.at, body.at, 1)) return interactRefused("notAdjacent"); if (body.side !== "neutral") return interactRefused("foeTarget"); emit({ type: "unit.interacted", by: action.actor, target: res.unitId }); return null; }
      if (body !== undefined && body.side === actor.side) return hitNo("allyTarget");
      const list = !spell || cfg.abilities === undefined || !Object.hasOwn(cfg.abilities, actor.unitId) ? undefined : cfg.abilities[actor.unitId];
      const row = list?.find((r) => r.effectRef === "line-shot");
      if (spell && row === undefined) return hitNo("noShotRow");
      const reachN = row?.reach ?? reachOf(cfg.reach, actor.unitId), atk = row?.damage ?? of(actor.unitId).atk;
      if (body === undefined || !inOrthogonalReach(actor.at, body.at, reachN)) return hitNo("outOfReach");
      const cur = hp.get(res.unitId) ?? 0, next = cur > atk ? cur - atk : 0;
      hp.set(res.unitId, next);
      emit({ type: "hit", unit: res.unitId, by: action.actor, amount: atk, hp: next, hitClass: spell ? "spell" : cfg.hitClass });
      if (next === 0 && atk > 0) { units.remove(res.unitId); emit({ type: "unit.died", unit: res.unitId, by: action.actor }); }
      return null;
    },
  };
}
