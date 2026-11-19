type Obj = Record<string, unknown>;
export type Cell = { readonly c: number; readonly r: number };
export type PlaceList = "spawn" | "npc" | "enemy";
export type PlaceRef = { readonly list: PlaceList; readonly index: number };
export type PlaceRow = { readonly id: PlaceList; readonly label: string };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const clone = (stage: Obj): Obj => structuredClone(stage) as Obj;
function bag(stage: Obj): Obj | null { return Object.hasOwn(stage, "sides") && isObj(stage["sides"]) ? stage["sides"] : null; }
/** `loadout` missing means the format default, the same one placements use. */
export function meOf(stage: Obj): string { const sides = bag(stage); if (sides === null || !Object.hasOwn(sides, "loadout") || typeof sides["loadout"] !== "string") return "player"; return sides["loadout"]; }
function neutralOf(stage: Obj): string { const sides = bag(stage); if (sides === null || !Object.hasOwn(sides, "neutrals") || typeof sides["neutrals"] !== "string") return "neutral"; return sides["neutrals"]; }
function resolved(stage: Obj, entry: Obj): string { return typeof entry["side"] === "string" ? entry["side"] : neutralOf(stage); }
export function placeRows(stage: Obj): readonly PlaceRow[] {
  const rows: PlaceRow[] = [{ id: "spawn", label: "Your team start" }, { id: "npc", label: "NPC" }];
  const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : null;
  if (pool !== null && pool["mode"] === "fixed") rows.push({ id: "enemy", label: "Enemy" });
  return rows;
}
export function hasPlayer(stage: Obj, chosen: number): boolean {
  const me = meOf(stage), spawns = list(stage["playerSpawns"]).filter(isObj).length;
  if (Math.min(chosen, spawns) > 0) return true;
  return list(stage["neutrals"]).some((entry) => isObj(entry) && resolved(stage, entry) === me);
}
export function hasEnemies(stage: Obj): boolean {
  const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : null;
  if (pool !== null && pool["mode"] === "fixed" && list(pool["entries"]).some(isObj)) return true;
  const me = meOf(stage);
  return list(stage["neutrals"]).some((entry) => isObj(entry) && resolved(stage, entry) !== "neutral" && resolved(stage, entry) !== me);
}
export function infoText(stage: Obj, chosen: number): readonly string[] {
  const out: string[] = [];
  if (!hasEnemies(stage)) out.push("No enemies: free roam.");
  if (!hasPlayer(stage, chosen)) out.push("No player side: Test never reaches an outcome.");
  return out;
}
export function addSpawn(stage: Obj, cell: Cell): Obj { const next = clone(stage), rows = [...list(next["playerSpawns"])]; rows.push({ c: cell.c, r: cell.r }); next["playerSpawns"] = rows; return next; }
export function addNeutral(stage: Obj, unitId: string, cell: Cell): Obj { const next = clone(stage), rows = [...list(next["neutrals"])]; rows.push({ unitId, at: { c: cell.c, r: cell.r } }); next["neutrals"] = rows; return next; }
export function addEnemy(stage: Obj, unitId: string, cell: Cell): Obj | null {
  const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : null;
  if (pool === null || pool["mode"] !== "fixed") return null;
  const next = clone(stage); next["enemyPool"] = { ...pool, entries: [...list(pool["entries"]), { unitId, at: { c: cell.c, r: cell.r } }] }; return next;
}
export function refuse(block: "closed" | "occupied" | null, label: string): string | null { return block === "occupied" ? "A unit stands here" : block === "closed" ? `${label} blocks units` : null; }
export function moveEntry(stage: Obj, ref: PlaceRef, cell: Cell): Obj {
  const next = clone(stage);
  if (ref.list === "spawn") { const rows = [...list(next["playerSpawns"])]; const cur = rows[ref.index]; if (isObj(cur)) rows[ref.index] = { ...cur, c: cell.c, r: cell.r }; next["playerSpawns"] = rows; return next; }
  const key = ref.list === "npc" ? "neutrals" : "enemyPool";
  if (key === "neutrals") { const rows = [...list(next["neutrals"])]; const cur = rows[ref.index]; if (isObj(cur)) rows[ref.index] = { ...cur, at: { c: cell.c, r: cell.r } }; next["neutrals"] = rows; return next; }
  const pool = isObj(next["enemyPool"]) ? next["enemyPool"] : {}; const rows = [...list(pool["entries"])]; const cur = rows[ref.index]; if (isObj(cur)) rows[ref.index] = { ...cur, at: { c: cell.c, r: cell.r } }; next["enemyPool"] = { ...pool, entries: rows }; return next;
}
export function removeEntry(stage: Obj, ref: PlaceRef): Obj {
  const next = clone(stage), drop = (rows: readonly unknown[]): unknown[] => rows.filter((_, i) => i !== ref.index);
  if (ref.list === "spawn") { next["playerSpawns"] = drop(list(next["playerSpawns"])); return next; }
  if (ref.list === "npc") { next["neutrals"] = drop(list(next["neutrals"])); return next; }
  const pool = isObj(next["enemyPool"]) ? next["enemyPool"] : {}; next["enemyPool"] = { ...pool, entries: drop(list(pool["entries"])) }; return next;
}
export function standHere(stage: Obj, index: number): Obj {
  const next = clone(stage), rows = [...list(next["neutrals"])], cur = rows[index];
  if (!isObj(cur)) return next;
  const copy = { ...cur }; delete copy["setupIds"]; rows[index] = copy; next["neutrals"] = rows; return next;
}
export function attachTalk(stage: Obj, index: number, setupId: string): Obj {
  const next = clone(stage), rows = [...list(next["neutrals"])], cur = rows[index];
  if (isObj(cur)) rows[index] = { ...cur, setupIds: [setupId] }; next["neutrals"] = rows; return next;
}
