export const NEUTRAL = "neutral";
export type Paint = "player" | "enemy" | "neutral";
const box = (v: unknown): Record<string, unknown> | null => (typeof v === "object" && v !== null ? v as Record<string, unknown> : null);
export function sidesOf(stage: unknown, units: readonly { readonly side: string }[]): { readonly me: string; readonly order: readonly string[]; readonly contest: boolean } {
  const root = box(stage), sides = root !== null && Object.hasOwn(root, "sides") ? box(root["sides"]) : null;
  const load = sides !== null && Object.hasOwn(sides, "loadout") ? sides["loadout"] : undefined;
  const me = typeof load === "string" ? load : "player";
  const present: string[] = [];
  for (const unit of units) if (unit.side !== NEUTRAL && !present.includes(unit.side)) present.push(unit.side);
  return { me, order: [me, ...present.filter((side) => side !== me)], contest: present.length >= 2 };
}
export const paintOf = (side: string, me: string): Paint => (side === me ? "player" : side === NEUTRAL ? "neutral" : "enemy");
