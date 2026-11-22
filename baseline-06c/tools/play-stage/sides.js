export const NEUTRAL = "neutral";
                                                   
const box = (v         )                                 => (typeof v === "object" && v !== null ? v                            : null);
export function sidesOf(stage         , units                                      )                                                                                        {
  const root = box(stage), sides = root !== null && Object.hasOwn(root, "sides") ? box(root["sides"]) : null;
  const load = sides !== null && Object.hasOwn(sides, "loadout") ? sides["loadout"] : undefined;
  const me = typeof load === "string" ? load : "player";
  const present           = [];
  for (const unit of units) if (unit.side !== NEUTRAL && !present.includes(unit.side)) present.push(unit.side);
  return { me, order: [me, ...present.filter((side) => side !== me)], contest: present.length >= 2 };
}
export const paintOf = (side        , me        )        => (side === me ? "player" : side === NEUTRAL ? "neutral" : "enemy");
