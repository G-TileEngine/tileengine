import type { BusEvent, EventRegistry, NoModeEvents } from "../../core/events/index.ts";
import { NOT_PLAIN, isRecord, plainCopy } from "../../core/plain.ts";
import type { Rng } from "../../core/rng/index.ts";
import type { AbilityPools, LevelRules, LevelSetup, Levels } from "./types.ts";

export const LEVEL_EVENTS: EventRegistry<NoModeEvents> = { mode: "levels", types: ["level.reached", "level.unlocked"] };

const ints = (xs: readonly number[], min: number): boolean => xs.every((n) => Number.isInteger(n) && n >= min);
function bad(rules: LevelRules, pools: AbilityPools): boolean {
  const top = rules.thresholds.length;
  return (rules.bar !== "side" && rules.bar !== "unit") || top < 1 || !ints(rules.thresholds, 1) || !rules.offerLevels.every((n) => Number.isInteger(n) && n >= 1 && n <= top) || !Number.isInteger(rules.offerSize) || rules.offerSize < 1 || !Number.isInteger(rules.xp.move) || rules.xp.move < 0 || Object.values(pools).some((pool) => !Array.isArray(pool) || pool.some((a) => typeof a !== "string" || a === ""));
}
type Live = { id: string; pool: string; xp: number; level: number; banked: number; offer: string[] | null; abilities: string[] };
function taken(setup: LevelSetup): { rules: LevelRules; pools: AbilityPools } {
  const copy = plainCopy(setup, 3);
  if (copy === NOT_PLAIN || !isRecord(copy) || !isRecord(copy.rules) || !isRecord(copy.pools)) throw new RangeError("createLevels: bad rules or pools");
  const rulesIn = copy.rules, poolsIn = copy.pools;
  const bar = rulesIn.bar, thresholds = rulesIn.thresholds, offerLevels = rulesIn.offerLevels, offerSize = rulesIn.offerSize, xpIn = rulesIn.xp;
  if (!Array.isArray(thresholds) || !Array.isArray(offerLevels) || !isRecord(xpIn)) throw new RangeError("createLevels: bad rules or pools");
  const pools: Record<string, readonly string[]> = {}, move = xpIn.move;
  for (const key of Object.keys(poolsIn)) { const pool = poolsIn[key]; if (!Array.isArray(pool)) throw new RangeError("createLevels: bad rules or pools"); pools[key] = pool as readonly string[]; }
  return { rules: Object.freeze({ bar, thresholds, offerLevels, offerSize, xp: Object.freeze({ move }) }) as LevelRules, pools: Object.freeze(pools) };
}

export function createLevels(setup: LevelSetup, rng: Rng, emit: (event: BusEvent<NoModeEvents>) => void): Levels {
  const { rules, pools } = taken(setup); if (bad(rules, pools)) throw new RangeError("createLevels: bad rules or pools");
  const bars = new Map<string, Live>();
  const poolOf = (key: string): readonly string[] => (Object.hasOwn(pools, key) ? pools[key] : undefined) ?? [];
  const draw = (have: readonly string[], key: string): string[] => {
    const cands: string[] = [];
    for (const a of poolOf(key)) if (!have.includes(a) && !cands.includes(a)) cands.push(a);
    if (cands.length <= rules.offerSize) return cands;
    for (let i = 0; i < rules.offerSize; i += 1) {
      const j = i + rng.int(cands.length - i), left = cands[i], right = cands[j];
      if (left !== undefined && right !== undefined) { cands[i] = right; cands[j] = left; }
    }
    return cands.slice(0, rules.offerSize);
  };
  const open = (bar: Live): readonly string[] => {
    if (!rules.offerLevels.includes(bar.level)) return [];
    const offer = draw(bar.abilities, bar.pool);
    if (offer.length > 0) bar.offer = offer;
    return offer;
  };
  const pay = (bar: Live, amount: number): void => {
    const top = rules.thresholds.length;
    let left = amount;
    while (left > 0 && bar.level < top) {
      if (bar.offer !== null) { bar.banked += left; return; }
      const need = (rules.thresholds[bar.level] ?? left) - bar.xp;
      const take = need < left ? need : left; bar.xp += take; left -= take;
      if (bar.xp < (rules.thresholds[bar.level] ?? 0)) return;
      bar.xp = 0; bar.level += 1;
      emit({ type: "level.reached", unit: bar.id, level: bar.level, offer: open(bar) });
    }
    if (bar.level >= top) bar.banked = 0;
  };
  const ensure = (id: string, pool: string): Live => {
    const found = bars.get(id); if (found !== undefined) return found;
    const made: Live = { id, pool, xp: 0, level: 0, banked: 0, offer: null, abilities: [] }; bars.set(id, made); return made;
  };
  return {
    rules,
    barOf(unit) { return rules.bar === "side" ? { id: unit.side, pool: unit.side } : { id: unit.id, pool: unit.unitId }; },
    gain(id, pool, amount) {
      if (!Number.isInteger(amount) || amount < 0) throw new RangeError("levels: amount must be an integer >= 0");
      pay(ensure(id, pool), amount);
    },
    offer(id) { const pending = bars.get(id)?.offer; return pending === undefined || pending === null ? null : pending.slice(); },
    choose(id, ability) {
      const bar = bars.get(id);
      if (bar === undefined || bar.offer === null || !bar.offer.includes(ability)) return false;
      const banked = bar.banked; bar.abilities.push(ability); bar.offer = null; bar.banked = 0;
      emit({ type: "level.unlocked", unit: id, ability }); pay(bar, banked);
      return true;
    },
    state: () => ({ rngState: rng.state(), bars: [...bars.values()].map((bar) => ({ id: bar.id, xp: bar.xp, level: bar.level, banked: bar.banked, offer: bar.offer === null ? null : bar.offer.slice(), abilities: bar.abilities.slice() })) }),
  };
}
