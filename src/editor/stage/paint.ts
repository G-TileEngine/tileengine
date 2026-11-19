type Obj = Record<string, unknown>;
type Cell = { readonly c: number; readonly r: number };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
function keyFor(palette: Obj, typeId: string): { readonly key: string; readonly added: boolean } {
  let best: number | null = null;
  for (const [k, v] of Object.entries(palette)) {
    const n = Number(k);
    if (v === typeId && Number.isInteger(n) && n >= 0 && String(n) === k && (best === null || n < best)) best = n;
  }
  if (best !== null) return { key: String(best), added: false };
  const used = new Set<number>();
  for (const k of Object.keys(palette)) { const n = Number(k); if (Number.isInteger(n) && n >= 0 && String(n) === k) used.add(n); }
  let n = 0; while (used.has(n)) n += 1;
  return { key: String(n), added: true };
}
export function paintCells(map: Obj, cells: readonly Cell[], typeId: string): Obj {
  const next = structuredClone(map) as Obj;
  const cols = typeof next["cols"] === "number" && Number.isInteger(next["cols"]) ? next["cols"] : 0;
  const logic = isObj(next["logic"]) ? next["logic"] : {};
  const terrain = Array.isArray(logic["terrain"]) ? [...logic["terrain"]] : [];
  const palette: Obj = isObj(logic["palette"]) ? { ...logic["palette"] } : {};
  const got = keyFor(palette, typeId);
  if (got.added) palette[got.key] = typeId;
  const int = Number(got.key);
  for (const cell of cells) { const i = cell.r * cols + cell.c; if (Number.isInteger(i) && i >= 0 && i < terrain.length) terrain[i] = int; }
  next["logic"] = { ...logic, terrain, palette };
  return next;
}
export function clearGround(map: Obj): Obj {
  const cols = typeof map["cols"] === "number" && Number.isInteger(map["cols"]) && map["cols"] > 0 ? map["cols"] : 1;
  const logic = isObj(map["logic"]) ? map["logic"] : {};
  const terrain = Array.isArray(logic["terrain"]) ? logic["terrain"] : [];
  const cells = terrain.map((_, i) => ({ c: i % cols, r: Math.floor(i / cols) }));
  return paintCells(map, cells, "floor");
}
export function startNew(map: Obj, stage: Obj): { readonly map: Obj; readonly stage: Obj } {
  const next = structuredClone(stage) as Obj, pool = isObj(next["enemyPool"]) ? { ...next["enemyPool"] } : null;
  next["neutrals"] = [];
  if (pool !== null && pool["mode"] === "fixed") next["enemyPool"] = { ...pool, entries: [] };
  return { map: clearGround(map), stage: next };
}
