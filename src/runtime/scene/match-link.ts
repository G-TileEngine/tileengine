import type { Notice } from "../../core/notice.ts";
import type { SceneAsset, SceneLayer, SceneObject, SceneUnit, SceneWorld } from "./world-scene.ts";
export const MATCH = { units: 1024, patch: 16, board: { cols: 3, rows: 2 } } as const;
export type MatchArt = {
  readonly cols: number; readonly rows: number; readonly tileW: number; readonly tileH: number; readonly mapSeed: number;
  readonly assets: Readonly<Record<string, SceneAsset>>; readonly layers: readonly SceneLayer[]; readonly sprites: Readonly<Record<string, string>>;
  readonly objects?: readonly SceneObject[]; readonly style?: SceneWorld["style"]; readonly waterTiles?: SceneWorld["waterTiles"];
};
export type MatchScene = { readonly world: SceneWorld; readonly notes: readonly Notice[] };
export type MatchLink = { world(snap: unknown, art: MatchArt): SceneWorld; readonly notes: readonly Notice[]; readonly builds: number };
export type MatchPatch = { readonly c: number; readonly r: number; readonly cols: number; readonly rows: number; readonly x: number; readonly y: number; readonly w: number; readonly h: number };
const NO_OBJECTS: readonly SceneObject[] = [], NO_OVERLAYS: SceneWorld["overlays"] = [];
const FACING = ["N", "E", "S", "W"] as const;
const rec = (v: unknown): Record<string, unknown> | null => (v !== null && typeof v === "object" && !Array.isArray(v) ? v as Record<string, unknown> : null);
const cellOf = (v: unknown): { readonly c: number; readonly r: number } | null => { const o = rec(v), c = o?.["c"], r = o?.["r"]; return typeof c === "number" && typeof r === "number" && Number.isInteger(c) && Number.isInteger(r) ? { c, r } : null; };
export function sceneFromMatch(snap: unknown, art: MatchArt): MatchScene {
  const world = { cols: art.cols, rows: art.rows, tileW: art.tileW, tileH: art.tileH, mapSeed: art.mapSeed, assets: art.assets, layers: art.layers, objects: art.objects ?? NO_OBJECTS, overlays: NO_OVERLAYS, ...(art.style === undefined ? {} : { style: art.style }), ...(art.waterTiles === undefined ? {} : { waterTiles: art.waterTiles }) };
  const list = rec(snap)?.["units"];
  if (!Array.isArray(list)) return { world: { ...world, units: [] }, notes: [{ code: "invalidValue", message: "snapshot.units" }] };
  const notes: Notice[] = [], units: SceneUnit[] = [], seen = new Set<string>(), missed = new Set<string>(), rows = list.slice(0, MATCH.units);
  for (let i = 0; i < rows.length; i += 1) {
    const s = rec(rows[i]), id = s?.["id"], unitId = s?.["unitId"], at = cellOf(s?.["at"]);
    if (s === null || typeof id !== "string" || typeof unitId !== "string" || typeof s["alive"] !== "boolean" || at === null) { notes.push({ code: "invalidValue", message: `units[${i}]` }); continue; }
    if (seen.has(id)) { notes.push({ code: "invalidValue", message: `units[${i}].id` }); continue; }
    seen.add(id);
    if (at.c < 0 || at.r < 0 || !(at.c < art.cols) || !(at.r < art.rows)) { notes.push({ code: "outOfRange", message: `units[${i}].at` }); continue; }
    const sprite = Object.hasOwn(art.sprites, unitId) ? art.sprites[unitId] : undefined;
    if (typeof sprite !== "string") { if (!missed.has(unitId)) { missed.add(unitId); notes.push({ code: "unknownRef", message: `units[${i}].unitId` }); } continue; }
    let facing: SceneUnit["facing"] = null; const rawFace = s["facing"];
    if (rawFace !== undefined && rawFace !== null) { if (typeof rawFace === "string" && (FACING as readonly string[]).includes(rawFace)) facing = rawFace as SceneUnit["facing"]; else notes.push({ code: "invalidValue", message: `units[${i}].facing` }); }
    let offset: SceneUnit["offset"] = null; const rawOff = s["offset"], o = rawOff === null || rawOff === undefined ? null : rec(rawOff), dx = o?.["dx"], dy = o?.["dy"];
    if (rawOff !== undefined && rawOff !== null && !(typeof dx === "number" && typeof dy === "number" && Number.isFinite(dx) && Number.isFinite(dy))) notes.push({ code: "invalidValue", message: `units[${i}].offset` });
    else if (typeof dx === "number" && typeof dy === "number") offset = { dx, dy };
    units.push({ id, sprite, at: { c: at.c, r: at.r }, offset, facing, alive: s["alive"], action: offset === null ? "idle" : "move" });
  }
  if (list.length > MATCH.units) notes.push({ code: "overCap", message: "snapshot.units" });
  return { world: { ...world, units }, notes };
}
export function createMatchLink(): MatchLink {
  let snap: unknown, art: MatchArt | undefined, world: SceneWorld | undefined, notes: readonly Notice[] = [], builds = 0;
  return { get notes() { return notes; }, get builds() { return builds; }, world(next, nextArt) { if (world !== undefined && snap === next && art === nextArt) return world; const built = sceneFromMatch(next, nextArt); builds += 1; snap = next; art = nextArt; notes = built.notes; world = { ...built.world, rev: builds }; return world; } };
}
const spanOf = (n: number, fallback: number, map: number): number => Math.max(1, Math.min(MATCH.patch, Number.isFinite(n) ? Math.floor(n) : fallback, map));
export function matchPatch(world: SceneWorld, focus: { readonly caster: string; readonly target?: string | null }, want: { readonly cols: number; readonly rows: number }): MatchPatch | null {
  if (!(world.cols >= 1) || !(world.rows >= 1)) return null;
  const mapC = Math.floor(world.cols), mapR = Math.floor(world.rows), me = world.units.find((u) => u.id === focus.caster); if (me === undefined) return null;
  const cols = spanOf(want.cols, MATCH.board.cols, mapC), rows = spanOf(want.rows, MATCH.board.rows, mapR), other = focus.target === undefined || focus.target === null ? undefined : world.units.find((u) => u.id === focus.target);
  const both = other !== undefined && Math.abs(other.at.c - me.at.c) < cols && Math.abs(other.at.r - me.at.r) < rows;
  const place = (a: number, b: number | undefined, n: number, map: number): number => { const lo = b === undefined ? a : Math.min(a, b), span = b === undefined ? 1 : Math.abs(b - a) + 1; return Math.max(0, Math.min(map - n, lo - Math.floor((n - span) / 2))); };
  const c = place(me.at.c, both ? other.at.c : undefined, cols, mapC), r = place(me.at.r, both ? other.at.r : undefined, rows, mapR);
  return { c, r, cols, rows, x: c * world.tileW, y: r * world.tileH, w: cols * world.tileW, h: rows * world.tileH };
}
export function nearestFoe(snap: unknown, caster: string, foes: readonly string[]): string | null {
  if (!Array.isArray(foes)) return null;
  const list = rec(snap)?.["units"]; if (!Array.isArray(list)) return null;
  const rows = list.slice(0, MATCH.units); let home: { c: number; r: number; side: string } | null = null;
  for (const item of rows) { const s = rec(item); if (s === null || s["id"] !== caster) continue; const at = cellOf(s["at"]); if (at === null || typeof s["side"] !== "string") return null; home = { c: at.c, r: at.r, side: s["side"] }; break; }
  if (home === null) return null;
  let best: string | null = null, dist = 0;
  for (const item of rows) {
    const s = rec(item); if (s === null || s["alive"] !== true) continue;
    const id = s["id"], side = s["side"], at = cellOf(s["at"]);
    if (typeof id !== "string" || id === caster || typeof side !== "string" || side === home.side || !foes.includes(side) || at === null) continue;
    const d = Math.abs(at.c - home.c) + Math.abs(at.r - home.r);
    if (best === null || d < dist || (d === dist && id < best)) { best = id; dist = d; }
  }
  return best;
}
