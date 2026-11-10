import type { CoreMap, CoreTileType, Sq } from "../../types/core-types.ts";
import type { Notice } from "../notice.ts";
import { DIRS, type Dir, type ForceCheck, type Grid, type GridOptions } from "./types.ts";

const BIT: Record<Dir, number> = { n: 1, e: 2, s: 4, w: 8 };
const OPP: Record<Dir, Dir> = { n: "s", e: "w", s: "n", w: "e" };
const DC: Record<Dir, number> = { n: 0, e: 1, s: 0, w: -1 };
const DR: Record<Dir, number> = { n: -1, e: 0, s: 1, w: 0 };
const OPEN_FLOOR: CoreTileType = { id: "floor", open: true, push_can_enter: true };

function note(list: Notice[], code: string, message: string, at?: Sq): void {
  list.push(at === undefined ? { code, message } : { code, message, at });
}

export function createGrid(map: CoreMap, tileTypes: readonly CoreTileType[], opts?: GridOptions): Grid {
  const { cols, rows } = map;
  if (!Number.isInteger(cols) || cols < 1 || !Number.isInteger(rows) || rows < 1) {
    throw new RangeError("createGrid: cols and rows must be integers >= 1");
  }
  const n = cols * rows;
  const notices: Notice[] = [];
  if (opts?.wrapEdges === true) note(notices, "wrapEdgesIgnored", "wrapEdges is ignored");
  const byId = new Map<string, CoreTileType>();
  for (const tile of tileTypes) byId.set(tile.id, tile);
  let floor = byId.get("floor");
  if (floor === undefined) {
    floor = OPEN_FLOOR;
    byId.set("floor", floor);
    note(notices, "floorMissing", "no floor tile type");
  }
  const terrain = map.logic.terrain;
  if (terrain.length !== n) note(notices, "terrainLength", "terrain length does not match the map");
  const types: CoreTileType[] = [];
  for (let i = 0; i < n; i += 1) {
    const c = i % cols;
    const r = (i - c) / cols;
    const value = i < terrain.length ? terrain[i] : undefined;
    const id = value === undefined ? undefined : map.logic.palette[String(value)];
    const found = id === undefined ? undefined : byId.get(id);
    if (value === undefined || found === undefined) {
      types.push(floor);
      if (value !== undefined) note(notices, "unknownTerrain", "unknown terrain", { c, r });
    } else {
      types.push(found);
    }
  }
  const walls = new Uint8Array(n);
  const shut = new Uint8Array(n);
  const inBounds = (at: Sq): boolean =>
    Number.isInteger(at.c) && Number.isInteger(at.r) && at.c >= 0 && at.c < cols && at.r >= 0 && at.r < rows;
  const index = (at: Sq): number => at.r * cols + at.c;
  const place = (c: number, r: number): boolean => c >= 0 && r >= 0 && c < cols && r < rows;
  for (const edge of map.logic.edges) {
    if (!inBounds(edge)) {
      note(notices, "edgeOffMap", "edge off the map", { c: edge.c, r: edge.r });
      continue;
    }
    const i = index(edge);
    const side = edge.side;
    walls[i] = (walls[i] ?? 0) | (BIT[side] ?? 0);
    const nc = edge.c + (DC[side] ?? 0);
    const nr = edge.r + (DR[side] ?? 0);
    if (place(nc, nr)) {
      const j = nr * cols + nc;
      walls[j] = (walls[j] ?? 0) | (BIT[OPP[side]] ?? 0);
    }
  }
  for (const obj of map.objects ?? []) {
    if (!inBounds(obj.at)) {
      note(notices, "objectOffMap", "object off the map", obj.at);
      continue;
    }
    const fp = obj.footprint;
    if (fp !== undefined && (fp.w !== 1 || fp.h !== 1)) note(notices, "footprintIgnored", "footprint plays 1x1", obj.at);
    if (obj.blocks === true) shut[index(obj.at)] = 1;
  }
  const openAt = (i: number): boolean => types[i]?.open === true && shut[i] !== 1;
  const hasWall = (at: Sq, dir: Dir): boolean => inBounds(at) && ((walls[index(at)] ?? 0) & BIT[dir]) !== 0;
  const step = (at: Sq, dir: Dir): Sq | null => {
    if (!inBounds(at)) return null;
    const next = { c: at.c + DC[dir], r: at.r + DR[dir] };
    return inBounds(next) ? next : null;
  };
  const canStep = (at: Sq, dir: Dir): boolean => {
    const next = step(at, dir);
    return next !== null && !hasWall(at, dir) && openAt(index(next));
  };
  const grid: Grid = {
    cols, rows, notices: Object.freeze(notices), inBounds, index,
    sqAt(i: number): Sq { const c = i % cols; return { c, r: (i - c) / cols }; },
    tileTypeAt(at: Sq): CoreTileType { return inBounds(at) ? (types[index(at)] ?? floor) : floor; },
    isOpen: (at) => inBounds(at) && openAt(index(at)),
    hasWall, step, canStep,
    canForceInto(at: Sq, dir: Dir): ForceCheck {
      const next = step(at, dir);
      if (next === null || hasWall(at, dir)) return { ok: false, blocker: "edge" };
      const tile = types[index(next)];
      if (tile === undefined || !openAt(index(next)) || !tile.push_can_enter) return { ok: false, blocker: "wall-block" };
      return { ok: true };
    },
    neighbours(at: Sq): readonly Sq[] {
      const out: Sq[] = [];
      for (const dir of DIRS) {
        const next = canStep(at, dir) ? step(at, dir) : null;
        if (next !== null) out.push(next);
      }
      return out;
    },
    reachable(from, maxSteps, isBlocked): ReadonlyMap<number, number> {
      const out = new Map<number, number>();
      if (!inBounds(from) || isBlocked?.(from) === true) return out;
      out.set(index(from), 0);
      const queue: Sq[] = [from];
      for (let q = 0; q < queue.length; q += 1) {
        const at = queue[q];
        if (at === undefined) break;
        const dist = out.get(index(at));
        if (dist === undefined || dist >= maxSteps) continue;
        for (const dir of DIRS) {
          if (!canStep(at, dir)) continue;
          const next = step(at, dir);
          if (next === null || out.has(index(next)) || isBlocked?.(next) === true) continue;
          out.set(index(next), dist + 1);
          queue.push(next);
        }
      }
      return out;
    },
  };
  return grid;
}
