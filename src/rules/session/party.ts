import type { SessionParty } from "../../types/core-types.ts";
import type { LevelSetup } from "../levels/types.ts";
type Body = { readonly unitId: string; readonly side: string; readonly alive: boolean };
type Bar = { readonly id: string; readonly xp: number; readonly level: number; readonly banked: number; readonly offer: readonly string[] | null; readonly abilities: readonly string[] };
export type Party = SessionParty;
export function partyOf(units: readonly Body[], hp: Readonly<Record<string, number>>, side: string, bars: readonly Bar[] | null): Party {
  const seen = new Set<string>(), members: { unitId: string; hp: number }[] = [];
  for (const u of units) { if (!u.alive || u.side !== side || seen.has(u.unitId)) continue; if (!Object.hasOwn(hp, u.unitId)) throw new Error("partyOf: no hp"); const n = hp[u.unitId]; if (n === undefined) throw new Error("partyOf: no hp"); seen.add(u.unitId); members.push({ unitId: u.unitId, hp: n }); }
  const bar = bars === null ? undefined : bars.find((row) => row.id === side);
  return { side, members, bar: bar === undefined ? null : { xp: bar.xp, level: bar.level, banked: bar.banked, offer: bar.offer, abilities: bar.abilities } };
}
export function carryInto(party: Party, side: string): { readonly carry: { readonly side: string; readonly hp: Record<string, number> }; readonly start?: NonNullable<LevelSetup["start"]> } {
  const hp: Record<string, number> = Object.create(null); for (const m of party.members) hp[m.unitId] = m.hp;
  const bar = party.bar;
  return { carry: { side, hp }, ...(bar === null ? {} : { start: [{ id: side, xp: bar.xp, level: bar.level, banked: bar.banked, offer: bar.offer, abilities: bar.abilities }] }) };
}
