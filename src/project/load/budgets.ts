import type { ProjectStore, ReportRow } from "./types.ts";
/** Local copies of CN-029's three types. They become one import from core-types when CN-029 lands. */
export type BudgetKey = "units" | "activeAi" | "effects" | "stageTiles";
export type BudgetLimit = { readonly warn: number; readonly limit: number };
export type ProjectBudgets = Partial<Readonly<Record<BudgetKey, BudgetLimit>>>;
export type BudgetUse = { readonly stageId: string; readonly budget: BudgetKey; readonly used: number; readonly warn: number; readonly limit: number; readonly w?: number; readonly h?: number };
const KEYS: readonly BudgetKey[] = ["units", "activeAi", "effects", "stageTiles"];
type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);
const objs = (v: unknown): readonly Obj[] => list(v).filter(isObj);
const bad = (path: string, value: unknown): ReportRow => ({ code: "budgetInvalid", severity: "warning", path, detail: JSON.stringify(value) });
const whole = (v: unknown, min: number): v is number => typeof v === "number" && Number.isInteger(v) && v >= min;
function limitsOf(project: Obj): { readonly limits: ProjectBudgets; readonly rows: readonly ReportRow[] } {
  const settings = isObj(project["settings"]) ? project["settings"] : undefined;
  if (settings === undefined || !Object.hasOwn(settings, "budgets")) return { limits: {}, rows: [] };
  const value = settings["budgets"];
  if (!isObj(value)) return { limits: {}, rows: [bad("project.json#/project/settings/budgets", value)] };
  const rows: ReportRow[] = [];
  const pairs: [BudgetKey, BudgetLimit][] = [];
  for (const key of KEYS) {
    if (!Object.hasOwn(value, key)) continue;
    const entry = value[key];
    const warn = isObj(entry) ? entry["warn"] : undefined;
    const limit = isObj(entry) ? entry["limit"] : undefined;
    if (!whole(warn, 1) || !whole(limit, warn)) rows.push(bad(`project.json#/project/settings/budgets/${key}`, entry));
    else pairs.push([key, { warn, limit }]);
  }
  return { limits: Object.fromEntries(pairs), rows };
}
function placed(pool: Obj): number {
  if (pool["mode"] === "fixed") return objs(pool["entries"]).length;
  if (pool["mode"] === "weighted") return Math.min(typeof pool["picks"] === "number" ? pool["picks"] : 0, list(pool["spawns"]).length, pool["allowRepeats"] === false ? list(pool["entries"]).length : Number.POSITIVE_INFINITY);
  if (pool["mode"] !== "waves") return 0;
  let best = 0;
  for (const wave of objs(pool["waves"])) {
    let sum = 0;
    for (const entry of objs(wave["entries"])) if (typeof entry["count"] === "number") sum += entry["count"];
    if (sum > best) best = sum;
  }
  return best;
}
function fx(setup: Obj, store: ProjectStore): string | null {
  const slice = isObj(store.slice) ? store.slice : {};
  const hit = isObj(setup["answers"]) ? setup["answers"]["effect"] : undefined;
  const direct = isObj(hit) && hit["source"] !== "default" && Object.hasOwn(hit, "value");
  let value: unknown = direct && isObj(hit) ? hit["value"] : undefined;
  if (!direct) for (const item of objs(slice["behaviours"])) if (item["id"] === setup["behaviourId"]) for (const spec of objs(item["knobs"])) if (spec["id"] === "effect" && value === undefined) value = spec["default"];
  if (typeof value !== "string" || value === "none") return null;
  if (Object.hasOwn(store.effects, value)) return value;
  const id = value.startsWith("builtin:effect/") ? value.slice("builtin:effect/".length) : value;
  for (const item of objs(slice["behaviours"])) if (item["id"] === "effect") for (const preset of objs(item["presets"])) if (preset["id"] === id) return id;
  return null;
}
function effectCount(store: ProjectStore, stage: Obj, gear: Obj, team: number, pool: Obj, n: number): number {
  const units = new Set<string>();
  const add = (id: unknown): void => { if (typeof id === "string") units.add(id); };
  if (team > 0) for (const id of [...list(gear["roster"]), ...list(gear["required"])]) add(id);
  if (n > 0 && (pool["mode"] === "fixed" || pool["mode"] === "weighted")) for (const entry of objs(pool["entries"])) add(entry["unitId"]);
  if (n > 0 && pool["mode"] === "waves") for (const wave of objs(pool["waves"])) for (const entry of objs(wave["entries"])) add(entry["unitId"]);
  const neutrals = objs(stage["neutrals"]);
  for (const neutral of neutrals) add(neutral["unitId"]);
  const setups = new Set<string>();
  for (const id of units) for (const sid of list(store.units[id]?.["setupIds"])) if (typeof sid === "string") setups.add(sid);
  for (const neutral of neutrals) for (const sid of list(neutral["setupIds"])) if (typeof sid === "string") setups.add(sid);
  const found = new Set<string>();
  for (const sid of setups) {
    const setup = store.setups[sid];
    const id = setup === undefined ? null : fx(setup, store);
    if (id !== null) found.add(id);
  }
  return found.size;
}
export function budgetUse(store: ProjectStore): BudgetUse[] {
  const project = isObj(store.manifest["project"]) ? store.manifest["project"] : {};
  const { limits } = limitsOf(project);
  const out: BudgetUse[] = [];
  for (const [stageId, stage] of Object.entries(store.stages)) {
    const gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(project["loadout"]) ? project["loadout"] : {};
    const team = Math.min(typeof gear["size"] === "number" ? gear["size"] : 0, list(stage["playerSpawns"]).length);
    const sides = isObj(stage["sides"]) ? stage["sides"] : {};
    const me = typeof sides["loadout"] === "string" ? sides["loadout"] : "player";
    const poolSide = typeof sides["enemyPool"] === "string" ? sides["enemyPool"] : "rival";
    const neutralSide = typeof sides["neutrals"] === "string" ? sides["neutrals"] : "neutral";
    const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : {};
    const n = placed(pool);
    const neutrals = objs(stage["neutrals"]);
    let activeAi = poolSide !== me && poolSide !== "neutral" ? n : 0;
    for (const neutral of neutrals) if ((typeof neutral["side"] === "string" ? neutral["side"] : neutralSide) !== me && (typeof neutral["side"] === "string" ? neutral["side"] : neutralSide) !== "neutral") activeAi += 1;
    const units = team + n + neutrals.length;
    const effects = effectCount(store, stage, gear, team, pool, n);
    const map = typeof stage["mapRef"] === "string" ? store.maps[stage["mapRef"]] : undefined;
    const w = map !== undefined && typeof map["cols"] === "number" ? map["cols"] : undefined;
    const h = map !== undefined && typeof map["rows"] === "number" ? map["rows"] : undefined;
    for (const key of KEYS) {
      const lim = limits[key];
      if (lim === undefined || (key === "stageTiles" && (w === undefined || h === undefined))) continue;
      if (key === "stageTiles" && w !== undefined && h !== undefined) out.push({ stageId, budget: key, used: w * h, warn: lim.warn, limit: lim.limit, w, h });
      if (key !== "stageTiles") out.push({ stageId, budget: key, used: key === "units" ? units : key === "activeAi" ? activeAi : effects, warn: lim.warn, limit: lim.limit });
    }
  }
  return out;
}
export function budgetRows(store: ProjectStore): ReportRow[] {
  const rows: ReportRow[] = [...limitsOf(isObj(store.manifest["project"]) ? store.manifest["project"] : {}).rows];
  for (const use of budgetUse(store)) {
    if (use.used < use.warn) continue;
    const over = use.used > use.limit;
    rows.push({ code: over ? "budgetOver" : "budgetNear", severity: over ? "hard" : "warning", path: `stages/${use.stageId}.json#`, detail: use.w === undefined || use.h === undefined ? JSON.stringify({ budget: use.budget, used: use.used, limit: use.limit }) : JSON.stringify({ budget: use.budget, used: use.used, limit: use.limit, w: use.w, h: use.h }) });
  }
  return rows;
}
