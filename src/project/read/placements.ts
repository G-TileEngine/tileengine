import type { CoreStage, Facing, ResolvedPlacement, SideId, SpawnSq, UnitId } from "../../types/core-types.ts";
import type { Notice } from "../../core/notice.ts";

/** Same shape as step 05's `Rng.weighted`: an index with a positive weight, or -1 when none is left. */
export type Picker = (weights: readonly number[]) => number;
export type MapSize = { readonly cols: number; readonly rows: number };
export type Placements = { readonly placements: readonly ResolvedPlacement[]; readonly notices: readonly Notice[] };
function push(out: ResolvedPlacement[], notes: Notice[], side: SideId, map: MapSize, unitId: string, c: number, r: number, facing: Facing | null): void {
  if (c < 0 || r < 0 || c >= map.cols || r >= map.rows) notes.push({ code: "spawnOffMap", message: "spawn off the map", at: { c, r } });
  else out.push({ unitId, side, at: { c, r }, facing });
}
function pour(ids: readonly string[], cells: readonly SpawnSq[], side: SideId, map: MapSize, out: ResolvedPlacement[], notes: Notice[]): void {
  for (let i = 0; i < ids.length && i < cells.length; i += 1) { const id = ids[i]; const cell = cells[i]; if (id !== undefined && cell !== undefined) push(out, notes, side, map, id, cell.c, cell.r, cell.facing ?? null); }
  if (ids.length > cells.length) notes.push({ code: "notPlaced", message: "not placed" });
}
export function resolvePlacements(stage: CoreStage, map: MapSize, chosen: readonly UnitId[], pick: Picker): Placements {
  const out: ResolvedPlacement[] = [];
  const notes: Notice[] = [];
  const sp = stage.playerSpawns;
  for (let i = 0; i < chosen.length && i < sp.length; i += 1) {
    const id = chosen[i]; const cell = sp[i];
    if (id !== undefined && cell !== undefined) push(out, notes, stage.sides?.loadout ?? "player", map, id, cell.c, cell.r, cell.facing ?? null);
  }
  if (chosen.length > sp.length) notes.push({ code: "notPlaced", message: "not placed" });
  const pool = stage.enemyPool;
  const enemy = stage.sides?.enemyPool ?? "rival";
  if (pool.mode === "fixed") for (const e of pool.entries) push(out, notes, enemy, map, e.unitId, e.at.c, e.at.r, e.facing ?? null);
  else {
    const ids: string[] = [];
    if (pool.mode === "waves") {
      for (const wave of pool.waves) if (wave.turn === 0) for (const e of wave.entries) for (let n = 0; n < e.count; n += 1) ids.push(e.unitId);
    } else {
      const w = pool.entries.map((e) => (Number.isFinite(e.weight) && e.weight > 0 ? e.weight : 0));
      for (let n = 0; n < pool.picks; n += 1) {
        const i = pick(w.slice()); const entry = pool.entries[i];
        if (!Number.isInteger(i) || entry === undefined || (w[i] ?? 0) <= 0) { notes.push({ code: "poolExhausted", message: "pool exhausted" }); break; }
        ids.push(entry.unitId); if (!pool.allowRepeats) w[i] = 0;
      }
    }
    pour(ids, pool.spawns, enemy, map, out, notes);
  }
  for (const e of stage.neutrals) push(out, notes, e.side ?? stage.sides?.neutrals ?? "neutral", map, e.unitId, e.at.c, e.at.r, e.facing ?? null);
  return { placements: out, notices: notes };
}
