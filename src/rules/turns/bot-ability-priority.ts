import type { Action } from "../../core/log/index.ts";
import type { Grid } from "../../core/grid/index.ts";
import type { Sq } from "../../types/core-types.ts";
import type { BattleSetup } from "../battle/index.ts";
import { inOrthogonalReach, reachOf } from "../battle/range.ts";

type HookWorld = {
  readonly grid: Grid;
  readonly units: { all(): readonly { readonly id: string; readonly unitId: string; readonly side: string; readonly at: Sq; readonly alive: boolean }[] };
  readonly rules: { state(): { readonly units: readonly { readonly id: string; readonly hp: number }[] } } | null;
};

type Opt = { readonly actionsPerTurn: number; readonly setup: BattleSetup; readonly stepReach?: number };
type Body = { id: string; unitId: string; side: string; c: number; r: number; hp: number; alive: boolean; order: number };
type Cand = { dist: number; hp: number; foe: number; actor: number; who: Body; target: Body; kind: "spell" | "basic" | "step"; damage: number; at?: Sq };

const key = (c: number, r: number): string => `${c},${r}`;
const foeOf = (a: Body, b: Body): boolean => b.alive && b.side !== a.side && b.side !== "neutral";
function stats(setup: BattleSetup | undefined, id: string): { hp: number; atk: number } {
  if (setup === undefined) throw new Error("botAbilityPriority: setup and actionsPerTurn required");
  if (Object.hasOwn(setup.stats, id)) return setup.stats[id] ?? setup.base;
  return setup.base;
}
/** Own keys only. A prototype-key unit id is not a spell row. */
function shotRow(setup: BattleSetup | undefined, id: string): { reach: number; damage: number } | undefined {
  const table = setup?.abilities;
  if (table === undefined || !Object.hasOwn(table, id)) return undefined;
  const row = table[id]?.find((r) => r.effectRef === "line-shot");
  return row === undefined ? undefined : { reach: row.reach, damage: row.damage };
}
function bookOf(world: HookWorld, setup: BattleSetup | undefined): Body[] {
  const live = new Map((world.rules?.state().units ?? []).map((u) => [u.id, u]));
  return world.units.all().map((u, order) => {
    const row = live.get(u.id), hp = row?.hp ?? stats(setup, u.unitId).hp;
    return { id: u.id, unitId: u.unitId, side: u.side, c: u.at.c, r: u.at.r, hp, alive: u.alive && hp > 0, order };
  });
}
function pathTo(grid: Grid, blocked: ReadonlySet<string>, from: Sq, goal: Sq): Sq[] | null {
  const start = key(from.c, from.r), end = key(goal.c, goal.r);
  if (start === end) return [];
  const q: Sq[] = [from], prev = new Map<string, string>(), seen = new Set<string>([start]);
  for (let i = 0; i < q.length; i += 1) {
    const at = q[i]; if (at === undefined) break;
    for (const next of grid.neighbours(at)) {
      const cell = key(next.c, next.r);
      if (seen.has(cell) || (cell !== end && blocked.has(cell))) continue;
      seen.add(cell); prev.set(cell, key(at.c, at.r));
      if (cell === end) {
        const cells: Sq[] = [];
        let cur = cell;
        while (cur !== start) { const [c, r] = cur.split(","); cells.push({ c: Number(c), r: Number(r) }); cur = prev.get(cur) ?? start; }
        return cells.reverse();
      }
      q.push(next);
    }
  }
  return null;
}
const rank = (a: Cand, b: Cand): number => a.dist - b.dist || a.hp - b.hp || a.foe - b.foe || a.actor - b.actor;
function best(list: Cand[]): Cand | undefined { return list.slice().sort(rank)[0]; }
function shots(book: Body[], side: string, setup: BattleSetup | undefined, kind: "spell" | "basic"): Cand[] {
  const out: Cand[] = [];
  for (const actor of book) {
    if (!actor.alive || actor.side !== side) continue;
    const spell = kind === "spell" ? shotRow(setup, actor.unitId) : undefined;
    if (kind === "spell" && spell === undefined) continue;
    const reach = kind === "spell" ? spell?.reach ?? 0 : reachOf(setup?.reach, actor.unitId);
    const damage = kind === "spell" ? spell?.damage ?? 0 : stats(setup, actor.unitId).atk;
    for (const foe of book) {
      if (!foeOf(actor, foe) || !inOrthogonalReach({ c: actor.c, r: actor.r }, { c: foe.c, r: foe.r }, reach)) continue;
      out.push({ dist: Math.abs(actor.c - foe.c) + Math.abs(actor.r - foe.r), hp: foe.hp, foe: foe.order, actor: actor.order, who: actor, target: foe, kind, damage });
    }
  }
  return out;
}
function steps(grid: Grid, book: Body[], side: string, stepReach: number): Cand[] {
  const out: Cand[] = [];
  for (const actor of book) {
    if (!actor.alive || actor.side !== side) continue;
    const blocked = new Set(book.filter((b) => b.alive && b.id !== actor.id).map((b) => key(b.c, b.r)));
    for (const foe of book) {
      if (!foeOf(actor, foe)) continue;
      const cells = pathTo(grid, blocked, { c: actor.c, r: actor.r }, { c: foe.c, r: foe.r });
      if (cells === null || cells.length < 2) continue;
      const hop = Math.min(stepReach, cells.length - 1), at = cells[hop - 1];
      if (at === undefined) continue;
      out.push({ dist: cells.length, hp: foe.hp, foe: foe.order, actor: actor.order, who: actor, target: foe, kind: "step", damage: 0, at });
    }
  }
  return out;
}
function act(pick: Cand, n: number): Action {
  const id = `b${n}`;
  if (pick.kind === "step" && pick.at !== undefined) return { id, kind: "move", actor: pick.who.id, target: { pipe: "tile", at: { c: pick.at.c, r: pick.at.r } }, durationMs: null, turns: null, effects: [] };
  return { id, kind: "ability", actor: pick.who.id, target: { pipe: "unit", unitId: pick.target.id }, durationMs: null, turns: null, effects: pick.kind === "spell" ? ["line-shot"] : [] };
}
function apply(book: Body[], pick: Cand): void {
  if (pick.kind === "step" && pick.at !== undefined) { pick.who.c = pick.at.c; pick.who.r = pick.at.r; return; }
  pick.target.hp -= pick.damage;
  if (pick.target.hp <= 0) pick.target.alive = false;
}
/** P1-5 bot step cap when the host omits stepReach. Not an engine rule. */
export const DEFAULT_STEP_REACH = 2;
/** Spell in reach, else a basic in reach, else an orthogonal BFS step (cap `stepReach`, else DEFAULT_STEP_REACH). Ties: path length, lowest HP, placement. No RNG. */
export function botAbilityPriority(opts: Opt): (world: HookWorld, side: string) => readonly Action[] {
  if (opts.setup === undefined || !Number.isInteger(opts.actionsPerTurn) || opts.actionsPerTurn < 1) throw new Error("botAbilityPriority: setup and actionsPerTurn required");
  const turns = opts.actionsPerTurn, stepReach = opts.stepReach ?? DEFAULT_STEP_REACH, setup = opts.setup;
  return (world, side) => {
    const book = bookOf(world, setup), out: Action[] = [];
    for (let n = 1; n <= turns; n += 1) {
      const pick = best(shots(book, side, setup, "spell")) ?? best(shots(book, side, setup, "basic")) ?? best(steps(world.grid, book, side, stepReach));
      if (pick === undefined) break;
      out.push(act(pick, n));
      apply(book, pick);
    }
    return out;
  };
}
