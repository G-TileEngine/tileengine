import type { CoreEnemyPool, CoreLoadout, CoreStage, Facing, SpawnSq } from "../../types/core-types.ts";
import { CURRENT_FORMAT_VERSIONS, bad, checkVersion, isInt, isObj, isStr, strs, type ReadFail, type ReadResult } from "./guard.ts";
import { UINT32_MAX, docLimits, fitted, overCap, tooMany, type DocLimits } from "./limits.ts";

function face(v: unknown): { readonly ok: true; readonly facing?: Facing | null } | { readonly ok: false } {
  return v === undefined ? { ok: true } : v === null || v === "N" || v === "E" || v === "S" || v === "W" ? { ok: true, facing: v } : { ok: false };
}
function cell(v: unknown): { c: number; r: number } | null {
  return isObj(v) && isInt(v.c) && isInt(v.r) ? { c: v.c, r: v.r } : null;
}
function spawns(v: unknown): SpawnSq[] | null {
  if (!Array.isArray(v)) return null;
  const out: SpawnSq[] = [];
  for (const x of v) { const at = cell(x); const f = isObj(x) ? face(x.facing) : { ok: false as const }; if (at === null || !f.ok) return null; out.push(f.facing === undefined ? at : { ...at, facing: f.facing }); }
  return out;
}
function loadout(v: unknown): CoreLoadout | null {
  const roster = isObj(v) ? strs(v.roster) : null; const required = isObj(v) ? strs(v.required) : null;
  if (!isObj(v) || roster === null || required === null || !isInt(v.size, 0)) return null;
  return { roster, size: v.size, required };
}
function optStr(v: unknown): string | null | undefined {
  return v === undefined ? undefined : isStr(v) ? v : null;
}
function sidesOf(v: unknown): NonNullable<CoreStage["sides"]> | null {
  if (!isObj(v)) return null;
  const loadoutSide = optStr(v.loadout); const enemyPool = optStr(v.enemyPool); const neutralSide = optStr(v.neutrals);
  if (loadoutSide === null || enemyPool === null || neutralSide === null) return null;
  return { ...(loadoutSide === undefined ? {} : { loadout: loadoutSide }), ...(enemyPool === undefined ? {} : { enemyPool }), ...(neutralSide === undefined ? {} : { neutrals: neutralSide }) };
}
function neutrals(v: unknown): CoreStage["neutrals"] | null {
  if (!Array.isArray(v)) return null;
  const out: CoreStage["neutrals"][number][] = [];
  for (const x of v) { if (!isObj(x) || !isStr(x.unitId)) return null; const at = cell(x.at); const f = face(x.facing); const side = optStr(x.side); if (at === null || !f.ok || side === null) return null; out.push({ unitId: x.unitId, at, ...(f.facing === undefined ? {} : { facing: f.facing }), ...(side === undefined ? {} : { side }) }); }
  return out;
}
function pool(v: unknown): CoreEnemyPool | null {
  if (!isObj(v)) return null;
  if (v.mode === "fixed") {
    if (!Array.isArray(v.entries)) return null;
    const entries: Extract<CoreEnemyPool, { mode: "fixed" }>["entries"][number][] = [];
    for (const e of v.entries) { const at = isObj(e) ? cell(e.at) : null; const f = isObj(e) ? face(e.facing) : { ok: false as const }; if (!isObj(e) || !isStr(e.unitId) || at === null || !f.ok) return null; entries.push(f.facing === undefined ? { unitId: e.unitId, at } : { unitId: e.unitId, at, facing: f.facing }); }
    return { mode: "fixed", entries };
  }
  if (v.mode !== "weighted" && v.mode !== "waves") return null;
  const spots = spawns(v.spawns);
  if (spots === null) return null;
  if (v.mode === "weighted") {
    if (!isInt(v.picks, 0) || typeof v.allowRepeats !== "boolean" || !Array.isArray(v.entries)) return null;
    const entries: Extract<CoreEnemyPool, { mode: "weighted" }>["entries"][number][] = [];
    for (const e of v.entries) { if (!isObj(e) || !isStr(e.unitId) || typeof e.weight !== "number") return null; entries.push({ unitId: e.unitId, weight: e.weight }); }
    return { mode: "weighted", picks: v.picks, allowRepeats: v.allowRepeats, spawns: spots, entries };
  }
  if (!Array.isArray(v.waves)) return null;
  const waves: Extract<CoreEnemyPool, { mode: "waves" }>["waves"][number][] = [];
  for (const w of v.waves) { if (!isObj(w) || !isInt(w.turn) || !Array.isArray(w.entries)) return null; const entries: { unitId: string; count: number }[] = []; for (const e of w.entries) { if (!isObj(e) || !isStr(e.unitId) || !isInt(e.count, 0)) return null; entries.push({ unitId: e.unitId, count: e.count }); } waves.push({ turn: w.turn, entries }); }
  return { mode: "waves", spawns: spots, waves };
}
/** Caller caps on loop-driving counts (step 16), no defaults: weighted `picks`, and the units one wave adds (its counts summed). */
export type StageLimits = { readonly picks: number; readonly waveUnits: number } & Partial<DocLimits>;
function capped(pool: CoreEnemyPool, picks: number, waveUnits: number, turn0: number): boolean {
  if (pool.mode === "weighted") return pool.picks > picks || pool.entries.some((e) => !Number.isFinite(e.weight));
  if (pool.mode !== "waves") return false;
  let t0 = 0; for (const w of pool.waves) { const n = w.entries.reduce((s, e) => s + e.count, 0); if (n > waveUnits) return true; if (w.turn === 0) t0 += n; } return t0 > turn0;
}
function take(limits: StageLimits): { picks: number; waveUnits: number; doc: DocLimits } {
  try { const picks = limits.picks, waveUnits = limits.waveUnits, doc = docLimits(limits); if (doc === null || !Number.isInteger(picks) || picks < 0 || !Number.isInteger(waveUnits) || waveUnits < 0) throw new Error("bad"); return { picks, waveUnits, doc }; }
  catch { throw new RangeError("readStage: limits must be integers >= 0"); }
}
function countOf(json: Record<string, unknown>, lim: DocLimits): ReadFail | null {
  if (tooMany(json.neutrals, lim.spots)) return overCap("neutrals");
  if (tooMany(json.playerSpawns, lim.spots)) return overCap("playerSpawns");
  const pool = json.enemyPool; if (!isObj(pool)) return null; const list = pool.mode === "fixed" ? pool.entries : pool.spawns;
  if ((pool.mode === "fixed" || pool.mode === "weighted" || pool.mode === "waves") && tooMany(list, lim.spots)) return overCap("enemyPool");
  return pool.mode === "waves" && tooMany(pool.waves, lim.waves) ? overCap("enemyPool") : null;
}
export function stageSeed(stage: CoreStage): number | null {
  return typeof stage.seed === "number" ? stage.seed : null;
}
export function readStage(json: unknown, limits: StageLimits): ReadResult<CoreStage> {
  const lim = take(limits);
  const ver = checkVersion(json, "stage");
  if (ver !== null) return ver;
  if (!isObj(json) || !isStr(json.id)) return bad("id");
  if (!isInt(json.rev, 0)) return bad("rev");
  if (!isStr(json.mapRef)) return bad("mapRef");
  const early = countOf(json, lim.doc); if (early !== null) return early;
  const playerSpawns = spawns(json.playerSpawns); if (playerSpawns === null) return bad("playerSpawns");
  const neutral = neutrals(json.neutrals); if (neutral === null) return bad("neutrals");
  const rawSeed = json.seed;
  const seed = rawSeed === undefined ? undefined : rawSeed === null ? null : typeof rawSeed === "number" && Number.isInteger(rawSeed) && rawSeed >= 0 && rawSeed <= UINT32_MAX ? rawSeed : undefined;
  if (rawSeed !== undefined && seed === undefined) return bad("seed");
  const sides = json.sides === undefined ? undefined : sidesOf(json.sides); if (sides === null) return bad("sides");
  const enemyPool = pool(json.enemyPool); if (enemyPool === null || capped(enemyPool, lim.picks, lim.waveUnits, lim.doc.turn0)) return bad("enemyPool");
  const gear = json.loadout === null ? null : loadout(json.loadout);
  if (json.loadout !== null && gear === null) return bad("loadout");
  const rules = strs(json.rules); if (rules === null) return bad("rules");
  return fitted({
    kind: "stage", formatVersion: CURRENT_FORMAT_VERSIONS.stage, id: json.id, rev: json.rev, mapRef: json.mapRef,
    playerSpawns, neutrals: neutral, enemyPool, loadout: gear, rules,
    ...(seed === undefined ? {} : { seed }), ...(sides === undefined ? {} : { sides }),
  }, lim.doc, []);
}
