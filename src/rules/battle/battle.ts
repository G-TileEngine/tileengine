import type { BusEvent, EventRegistry, NoModeEvents } from "../../core/events/index.ts";
import type { Grid } from "../../core/grid/index.ts";
import type { Action } from "../../core/log/index.ts";
import type { Notice } from "../../core/notice.ts";
import { NOT_PLAIN, isRecord, plainCopy } from "../../core/plain.ts";
import { resolveAim } from "../../core/targeting/index.ts";
import type { Units } from "../../core/unit/index.ts";
import { HIT_CLASSES, type HitClass } from "./damage.ts";
import type { UnitStats } from "./roster.ts";

export const BATTLE_EVENTS: EventRegistry<NoModeEvents> = { mode: "battle", types: ["hit", "unit.died"] };
export type BattleSetup = { readonly base: UnitStats; readonly stats: Readonly<Record<string, UnitStats>>; readonly hitClass: HitClass };
export type BattleState = { readonly units: readonly { readonly id: string; readonly hp: number; readonly alive: boolean }[] };
export const HIT_REFUSED_REASONS = Object.freeze(["unknownActor", "deadActor", "notUnitAim", "aimMissed", "selfTarget", "deadTarget"] as const);
export type HitRefusedReason = (typeof HIT_REFUSED_REASONS)[number];
export type HitRefused = Notice & { readonly code: "hitRefused"; readonly reason: HitRefusedReason };
export interface Battle { act(action: Action): Notice | null; state(): BattleState }
declare module "../../types/core-types.ts" { interface ModeEventMap { readonly hit: { readonly unit: string; readonly by: string; readonly amount: number; readonly hp: number; readonly hitClass: HitClass }; readonly "unit.died": { readonly unit: string; readonly by: string } } }

const whole = (n: unknown, min: number): n is number => typeof n === "number" && Number.isInteger(n) && n >= min;
const pair = (v: unknown): v is UnitStats => isRecord(v) && whole(v.hp, 1) && whole(v.atk, 0);
function taken(setup: BattleSetup): BattleSetup {
  const copy = plainCopy(setup, 4);
  if (copy === NOT_PLAIN || !isRecord(copy)) throw new RangeError("createBattle: bad setup");
  const klass = copy.hitClass, statsIn = copy.stats;
  if (!pair(copy.base) || !isRecord(statsIn) || typeof klass !== "string" || !(HIT_CLASSES as readonly string[]).includes(klass)) throw new RangeError("createBattle: bad setup");
  const stats: Record<string, UnitStats> = {};
  for (const key of Object.keys(statsIn)) { const row = statsIn[key]; if (!pair(row)) throw new RangeError("createBattle: bad setup"); stats[key] = { hp: row.hp, atk: row.atk }; }
  return { base: { hp: copy.base.hp, atk: copy.base.atk }, stats, hitClass: klass as HitClass };
}
export function createBattle(setup: BattleSetup, units: Units, grid: Grid, emit: (event: BusEvent<NoModeEvents>) => void): Battle {
  const cfg = taken(setup), hp = new Map<string, number>();
  const of = (id: string): UnitStats => (Object.hasOwn(cfg.stats, id) ? cfg.stats[id] : cfg.base) ?? cfg.base;
  for (const u of units.all()) hp.set(u.id, of(u.unitId).hp);
  const refuse = (reason: HitRefusedReason): HitRefused => ({ code: "hitRefused", message: `hit refused (${reason})`, reason });
  return {
    state: () => ({ units: units.all().flatMap((u) => { const n = hp.get(u.id); return n === undefined ? [] : [{ id: u.id, hp: n, alive: u.alive }]; }) }),
    act(action) {
      if (action.kind !== "ability" || action.effects.length > 0) return { code: "actionUnsupported", message: "action unsupported" };
      const actor = units.get(action.actor);
      if (actor === undefined) return refuse("unknownActor");
      if (!actor.alive) return refuse("deadActor");
      const target = action.target;
      if (target === null || target.pipe !== "unit") return refuse("notUnitAim");
      const res = resolveAim(target, units, grid);
      if (!res.hit) return refuse(units.get(target.unitId) === undefined || (target.fallbackAt !== undefined && !grid.inBounds(target.fallbackAt)) ? "aimMissed" : "deadTarget");
      if (res.unitId === action.actor) return refuse("selfTarget");
      const atk = of(actor.unitId).atk, cur = hp.get(res.unitId) ?? 0, next = cur > atk ? cur - atk : 0;
      hp.set(res.unitId, next);
      emit({ type: "hit", unit: res.unitId, by: action.actor, amount: atk, hp: next, hitClass: cfg.hitClass });
      if (next === 0 && atk > 0) { units.remove(res.unitId); emit({ type: "unit.died", unit: res.unitId, by: action.actor }); }
      return null;
    },
  };
}
