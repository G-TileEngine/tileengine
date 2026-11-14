import { hash32 } from "./frames.ts";
import type { ParticleMotion } from "../../types/core-types.ts";
export const PARTICLES = { pool: 96, perEffect: 48, count: 12, lifeMin: 200, lifeMax: 3000, life: 800, pullMax: 2000, pull: 1000, sizes: [3, 2, 1], fades: [0.5, 0.25], reachPx: 24, colour: "#ffb048" } as const;
export const FX_BUDGET = { effect: 60, total: 120, frame: 300 } as const;
export const FX_GROUND_ORDER = ["shore", "pieces", "particles"] as const;
export type ParticleRead = { readonly motion: ParticleMotion; readonly count: number; readonly life: number; readonly pull: number; readonly bad: readonly string[] };
export type Dot = { readonly x: number; readonly y: number; readonly size: number; readonly colour: string; readonly alpha: number };
const MOTIONS: readonly ParticleMotion[] = ["burst", "attract", "spiral-in", "rise"];
const clamp = (stored: unknown, min: number, max: number, dflt: number): { n: number; bad: boolean } => {
  if (typeof stored !== "number" || !Number.isFinite(stored)) return { n: dflt, bad: stored !== undefined };
  const rounded = Math.round(stored), n = Math.min(max, Math.max(min, rounded)); return { n, bad: stored !== rounded || stored < min || stored > max };
};
export function particleRead(p: { readonly particle_motion?: unknown; readonly particle_count?: unknown; readonly particle_life_ms?: unknown; readonly particle_life?: unknown; readonly particle_pull?: unknown }): ParticleRead {
  const named = p.particle_motion, known = MOTIONS.find((m) => m === named), count = clamp(p.particle_count, 0, PARTICLES.perEffect, PARTICLES.count), life = clamp(p.particle_life_ms !== undefined ? p.particle_life_ms : p.particle_life, PARTICLES.lifeMin, PARTICLES.lifeMax, PARTICLES.life), pull = clamp(p.particle_pull, 0, PARTICLES.pullMax, PARTICLES.pull), bad: string[] = [];
  if (named !== undefined && known === undefined) bad.push("particle_motion"); if (count.bad) bad.push("particle_count"); if (life.bad) bad.push("particle_life_ms"); if (pull.bad) bad.push("particle_pull");
  return { motion: known ?? "burst", count: count.n, life: life.n, pull: pull.n, bad };
}
export function capCounts(counts: readonly number[]): { counts: number[]; over: number | null } {
  let left = PARTICLES.perEffect; const sum = counts.reduce((a, b) => a + b, 0);
  return { counts: counts.map((n) => { const k = Math.min(Math.max(0, n), Math.max(0, left)); left -= k; return k; }), over: sum > PARTICLES.perEffect ? sum : null };
}
const fp = (v: number): number => Math.floor(v * 256) >> 8;
export function particleAt(read: ParticleRead, i: number, seed: number, age: number, ramp: readonly string[] | null, reduce: boolean): Dot | null {
  if (!(age >= 0 && age < read.life)) return null;
  const shown = reduce ? (age * 2 < read.life ? 0 : read.life - 1) : age, u = shown / read.life, ease = 1 - (1 - u) * (1 - u);
  const h = hash32(seed, "dot", i, 0), reach = 8 + (h % 17), ang = ((h >>> 8) % 4096) / 4096 * Math.PI * 2, close = Math.min(1, u * (read.pull / 1000));
  const inward = read.motion === "attract" || read.motion === "spiral-in", rad = inward ? reach * (1 - close) : reach * ease, spin = read.motion === "spiral-in" ? ang + close * Math.PI * 2 : ang;
  const x = read.motion === "rise" ? fp(Math.cos(ang) * rad) : fp(Math.cos(spin) * rad), y = read.motion === "rise" ? fp(-rad) : fp(Math.sin(spin) * rad);
  const n = ramp?.length ?? 0, idx = n === 0 ? 0 : Math.min(n - 1, Math.floor(shown * n / read.life)), colour = n === 0 || ramp === null ? PARTICLES.colour : ramp[n - 1 - idx] ?? PARTICLES.colour;
  const alpha = n >= 3 && idx >= n - 2 ? (idx === n - 1 ? PARTICLES.fades[1] : PARTICLES.fades[0]) : 1, size = shown * 3 < read.life ? PARTICLES.sizes[0] : shown * 3 < read.life * 2 ? PARTICLES.sizes[1] : PARTICLES.sizes[2];
  return { x, y, size, colour, alpha };
}
