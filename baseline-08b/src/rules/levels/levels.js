                                                                                        
import { NOT_PLAIN, isRecord, plainCopy } from "../../core/plain.js";
                                                   
                                                                                            

export const LEVEL_EVENTS                              = { mode: "levels", types: ["level.reached", "level.unlocked"] };
export const LEVEL_CEILINGS              = Object.freeze({ levels: 1024, pool: 4096, offer: 64, pools: 4096 }), DEFAULT_LEVEL_LIMITS              = Object.freeze({ levels: 64, pool: 128, offer: 8, pools: 256 });
const LKEYS = ["levels", "pool", "offer", "pools"]         ;

const ints = (xs                   , min        )          => xs.every((n) => Number.isInteger(n) && n >= min && n <= 2147483647);
function bad(rules            , pools              )          {
  const top = rules.thresholds.length;
  return (rules.bar !== "side" && rules.bar !== "unit") || top < 1 || !ints(rules.thresholds, 1) || !rules.offerLevels.every((n) => Number.isInteger(n) && n >= 1 && n <= top) || !Number.isInteger(rules.offerSize) || rules.offerSize < 1 || !Number.isInteger(rules.xp.move) || rules.xp.move < 0 || rules.xp.move > 2147483647 || Object.values(pools).some((pool) => !Array.isArray(pool) || pool.some((a) => typeof a !== "string" || a === ""));
}
                                                                                                                                 
function taken(setup            )                                                                              {
  const copy = plainCopy(setup, 4);
  if (copy === NOT_PLAIN || !isRecord(copy) || !isRecord(copy.rules) || !isRecord(copy.pools)) throw new RangeError("createLevels: bad rules or pools");
  const rulesIn = copy.rules, poolsIn = copy.pools;
  const bar = rulesIn.bar, thresholds = rulesIn.thresholds, offerLevels = rulesIn.offerLevels, offerSize = rulesIn.offerSize, xpIn = rulesIn.xp;
  if (!Array.isArray(thresholds) || !Array.isArray(offerLevels) || !isRecord(xpIn)) throw new RangeError("createLevels: bad rules or pools");
  const pools                                    = {}, move = xpIn.move;
  for (const key of Object.keys(poolsIn)) { const pool = poolsIn[key]; if (!Array.isArray(pool)) throw new RangeError("createLevels: bad rules or pools"); pools[key] = pool                     ; }
  return { rules: Object.freeze({ bar, thresholds, offerLevels, offerSize, xp: Object.freeze({ move }) })              , pools: Object.freeze(pools), limits: copy.limits, start: copy.start };
}
function levelLimits(v         )                     {
  const src = v === undefined ? DEFAULT_LEVEL_LIMITS : v; if (!isRecord(src)) return null; const out                         = {};
  for (const key of LKEYS) { const n = src[key]; if (typeof n !== "number" || !Number.isInteger(n) || n < 1 || n > LEVEL_CEILINGS[key]) return null; out[key] = n; }
  return Object.freeze(out)               ;
}
function over(rules            , pools              , lim             )          {
  return rules.thresholds.length > lim.levels || rules.offerLevels.length > lim.levels || rules.offerSize > lim.offer || Object.keys(pools).length > lim.pools || Object.values(pools).some((pool) => pool.length > lim.pool);
}

export function createLevels(setup            , rng     , emit                                         )         {
  const { rules, pools, limits, start } = taken(setup); if (bad(rules, pools)) throw new RangeError("createLevels: bad rules or pools");
  const top = rules.thresholds.length, badStart = !Array.isArray(start) ? start !== undefined : start.some((row) => !isRecord(row) || typeof row.id !== "string" || !Number.isInteger(row.xp) || (row.xp          ) < 0 || !Number.isInteger(row.level) || (row.level          ) < 0 || (row.level          ) > top || !Number.isInteger(row.banked) || (row.banked          ) < 0 || (row.offer !== null && (!Array.isArray(row.offer) || row.offer.some((a) => typeof a !== "string"))) || !Array.isArray(row.abilities) || row.abilities.some((a) => typeof a !== "string"));
  if (badStart) throw new RangeError("createLevels: bad start");
  const lim = levelLimits(limits); if (lim === null) throw new RangeError("createLevels: limits must be whole numbers from 1 to their ceilings"); if (over(rules, pools, lim)) throw new RangeError("createLevels: over the level caps");
  const bars = new Map              ();
  if (Array.isArray(start)) for (const row of start) { if (!isRecord(row) || typeof row.id !== "string" || typeof row.xp !== "number" || typeof row.level !== "number" || typeof row.banked !== "number") continue; const offer = row.offer === null ? null : Array.isArray(row.offer) ? row.offer.filter((a)              => typeof a === "string") : null; const abilities = Array.isArray(row.abilities) ? row.abilities.filter((a)              => typeof a === "string") : []; bars.set(row.id, { id: row.id, pool: row.id, xp: row.xp, level: row.level, banked: row.banked, offer, abilities }); }
  const poolOf = (key        )                    => (Object.hasOwn(pools, key) ? pools[key] : undefined) ?? [];
  const draw = (have                   , key        )           => {
    const cands           = [], seen = new Set        (have);
    for (const a of poolOf(key)) if (!seen.has(a)) { seen.add(a); cands.push(a); }
    if (cands.length <= rules.offerSize) return cands;
    for (let i = 0; i < rules.offerSize; i += 1) {
      const j = i + rng.int(cands.length - i), left = cands[i], right = cands[j];
      if (left !== undefined && right !== undefined) { cands[i] = right; cands[j] = left; }
    }
    return cands.slice(0, rules.offerSize);
  };
  const open = (bar      )                    => {
    if (!rules.offerLevels.includes(bar.level)) return [];
    const offer = draw(bar.abilities, bar.pool);
    if (offer.length > 0) bar.offer = offer;
    return offer;
  };
  const pay = (bar      , amount        )       => {
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
  const ensure = (id        , pool        )       => {
    const found = bars.get(id); if (found !== undefined) return found;
    const made       = { id, pool, xp: 0, level: 0, banked: 0, offer: null, abilities: [] }; bars.set(id, made); return made;
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
