type Obj = Record<string, unknown>;
type Sq = { readonly c: number; readonly r: number };
export type PlaceDrop = { readonly code: "placementDropped"; readonly stageId: string; readonly list: "playerSpawns" | "neutrals" | "enemyPool"; readonly index: number; readonly reason: "outsideMap"; readonly path: string; readonly sq: Sq | null; readonly unitId?: string };
export type EdgeDrop = { readonly code: "mapEntryDropped"; readonly mapId: string; readonly field: "edges"; readonly index: number; readonly reason: "outsideMap"; readonly path: string };
export type Drop = PlaceDrop | EdgeDrop;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const clone = <T>(v: T): T => structuredClone(v);
const inside = (c: number, r: number, cols: number, rows: number): boolean => Number.isInteger(c) && Number.isInteger(r) && c >= 0 && r >= 0 && c < cols && r < rows;
function atOf(entry: Obj, direct: boolean): Sq | null {
  const box = direct ? entry : entry["at"];
  return isObj(box) && typeof box["c"] === "number" && typeof box["r"] === "number" ? { c: box["c"], r: box["r"] } : null;
}
function floorKey(palette: Obj): number {
  let best: number | null = null; const used = new Set<number>();
  for (const [k, v] of Object.entries(palette)) { const n = Number(k); if (!Number.isInteger(n) || n < 0 || String(n) !== k) continue; used.add(n); if (v === "floor" && (best === null || n < best)) best = n; }
  if (best !== null) return best;
  let n = 0; while (used.has(n)) n += 1; palette[String(n)] = "floor"; return n;
}
function crop<T>(src: readonly T[], oldC: number, oldR: number, nextC: number, nextR: number, fill: T): T[] {
  const out: T[] = [];
  for (let r = 0; r < nextR; r += 1) for (let c = 0; c < nextC; c += 1) { const value = c < oldC && r < oldR ? src[r * oldC + c] : undefined; out.push(value === undefined ? fill : value); }
  return out;
}
function trim(entries: readonly unknown[], direct: boolean, cols: number, rows: number, path: string, listName: PlaceDrop["list"], stageId: string): { readonly kept: unknown[]; readonly drops: PlaceDrop[]; readonly changed: boolean } {
  const kept: unknown[] = [], drops: PlaceDrop[] = []; let changed = false;
  entries.forEach((entry, i) => {
    if (!isObj(entry)) { kept.push(entry); return; }
    const at = atOf(entry, direct);
    if (at !== null && inside(at.c, at.r, cols, rows)) { kept.push(entry); return; }
    changed = true; const unitId = typeof entry["unitId"] === "string" ? entry["unitId"] : undefined;
    drops.push({ code: "placementDropped", stageId, list: listName, index: i, reason: "outsideMap", path: `${path}#/${listName === "enemyPool" ? "enemyPool/entries" : listName}/${i}`, sq: at, ...(unitId === undefined ? {} : { unitId }) });
  });
  return { kept, drops, changed };
}
export function resizeMap(mapPath: string, map: Obj, stages: readonly { readonly path: string; readonly doc: Obj }[], cols: number, rows: number): { readonly map: Obj; readonly stages: readonly { readonly path: string; readonly doc: Obj }[]; readonly rows: readonly Drop[] } {
  const oldC = typeof map["cols"] === "number" ? map["cols"] : 0, oldR = typeof map["rows"] === "number" ? map["rows"] : 0, mapId = typeof map["id"] === "string" ? map["id"] : "", drops: Drop[] = [];
  const nextStages = stages.map(({ path, doc }) => {
    if (doc["mapRef"] !== mapId) return { path, doc };
    const stageId = typeof doc["id"] === "string" ? doc["id"] : ""; let next: Obj | null = null;
    const put = (key: string, value: unknown): void => { next ??= clone(doc); next[key] = value; };
    const cut = (key: string, direct: boolean, pool: boolean): void => {
      const bag = pool && isObj(doc["enemyPool"]) ? doc["enemyPool"] : null;
      const entries = pool ? (bag !== null && bag["mode"] === "fixed" ? list(bag["entries"]) : []) : list(doc[key]);
      if (pool && (bag === null || bag["mode"] !== "fixed")) return;
      const got = trim(entries, direct, cols, rows, path, pool ? "enemyPool" : key === "neutrals" ? "neutrals" : "playerSpawns", stageId);
      drops.push(...got.drops); if (!got.changed) return;
      if (pool && bag !== null) put("enemyPool", { ...bag, entries: got.kept }); else put(key, got.kept);
    };
    cut("playerSpawns", true, false); cut("neutrals", false, false); cut("enemyPool", false, true); return { path, doc: next ?? doc };
  });
  const logic = isObj(map["logic"]) ? map["logic"] : {}, palette = isObj(logic["palette"]) ? { ...logic["palette"] } : {}, edges = list(logic["edges"]), keptEdges: unknown[] = [];
  edges.forEach((edge, i) => {
    if (isObj(edge) && typeof edge["c"] === "number" && typeof edge["r"] === "number" && inside(edge["c"], edge["r"], cols, rows)) keptEdges.push(edge);
    else drops.push({ code: "mapEntryDropped", mapId, field: "edges", index: i, reason: "outsideMap", path: `${mapPath}#/logic/edges/${i}` });
  });
  const floor = floorKey(palette);
  const nextLogic: Obj = { ...logic, terrain: crop(list(logic["terrain"]), oldC, oldR, cols, rows, floor), palette, edges: keptEdges };
  if (Array.isArray(logic["lanes"])) nextLogic["lanes"] = crop(logic["lanes"], oldC, oldR, cols, rows, 0);
  const next = clone(map); next["cols"] = cols; next["rows"] = rows; next["logic"] = nextLogic;
  if (Array.isArray(map["layers"])) next["layers"] = list(map["layers"]).map((layer) => (isObj(layer) && Array.isArray(layer["tiles"]) ? { ...layer, tiles: crop(layer["tiles"], oldC, oldR, cols, rows, null) } : layer));
  return { map: next, stages: nextStages, rows: drops };
}
