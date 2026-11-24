                                                              
                                                     
                                                                                        
                                                                                                                                                                                          
                                 
export function partyOf(units                 , hp                                  , side        , bars                       )        {
  const seen = new Set        (), members                                   = [];
  for (const u of units) { if (!u.alive || u.side !== side || seen.has(u.unitId)) continue; if (!Object.hasOwn(hp, u.unitId)) throw new Error("partyOf: no hp"); const n = hp[u.unitId]; if (n === undefined) throw new Error("partyOf: no hp"); seen.add(u.unitId); members.push({ unitId: u.unitId, hp: n }); }
  const bar = bars === null ? undefined : bars.find((row) => row.id === side);
  return { side, members, bar: bar === undefined ? null : { xp: bar.xp, level: bar.level, banked: bar.banked, offer: bar.offer, abilities: bar.abilities } };
}
export function carryInto(party       , side        )                                                                                                                                        {
  const hp                         = Object.create(null); for (const m of party.members) hp[m.unitId] = m.hp;
  const bar = party.bar;
  return { carry: { side, hp }, ...(bar === null ? {} : { start: [{ id: side, xp: bar.xp, level: bar.level, banked: bar.banked, offer: bar.offer, abilities: bar.abilities }] }) };
}
