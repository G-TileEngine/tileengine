import { createRng, streamSeed } from "../../src/core/rng/index.ts";
import type { AiHook, SimInput, VictoryRule } from "../../src/sim/index.ts";
import { move } from "./input.ts";

export function forward(seed: number, durationMs = 200): AiHook {
  const rng = createRng(streamSeed(seed, "ai"));
  let n = 0;
  return (world, side, budget) => budget.units.flatMap((id) => {
    const u = world.units.get(id);
    if (u === undefined) return [];
    const s1 = rng.next() < 0.5 ? -1 : 1, dr = side === "player" ? -1 : 1;
    const ahead = { c: u.at.c, r: u.at.r + dr }, a = { c: u.at.c + s1, r: u.at.r }, b = { c: u.at.c - s1, r: u.at.r };
    const order = rng.next() < 1 / 3 ? [a, b, ahead] : [ahead, a, b];
    const at = order.find((sq) => world.grid.inBounds(sq) && world.grid.isOpen(sq) && world.units.occupantsAt(sq).length === 0);
    if (at === undefined) return [];
    return [move(`m${n += 1}`, id, at.c, at.r, durationMs)];
  });
}
export const reachFarRow: VictoryRule = (world) => {
  const last = world.grid.rows - 1;
  let win = false, lose = false;
  for (const u of world.units.all()) {
    if (!u.alive || u.side === "neutral") continue;
    if (u.side === "player" && u.at.r === 0) win = true;
    else if (u.side !== "player" && u.at.r === last) lose = true;
  }
  return win && lose ? "draw" : win ? "win" : lose ? "lose" : null;
};
export function seedless(src: SimInput): SimInput {
  const stage = JSON.parse(JSON.stringify(src.stage)) as { seed: number | null };
  return { ...src, stage: { ...stage, seed: null } };
}
