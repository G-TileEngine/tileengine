import { readProject, type ProjectFiles, type ProjectStore } from "../../src/project/load/index.ts";
import { readMap, readStage } from "../../src/project/read/index.ts";
import { createGrid } from "../../src/core/grid/index.ts";
import { arrival } from "../../src/rules/session/links.ts";
import { carryInto } from "../../src/rules/session/party.ts";
import type { SessionParty } from "../../src/types/core-types.ts";
import { ruleOf } from "../../src/project/rule-of.ts";
import { WIN_CONDITION } from "../../src/rules/battle/win.ts";
import { XP_LEVELS } from "../../src/rules/behaviours/xp-levels.ts";
import { installOne } from "../../src/rules/behaviours/registry.ts";
import { TERRAIN } from "../../src/rules/behaviours/terrain.ts";
import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
import type { CoreTileType } from "../../src/types/core-types.ts";
import { docsToInput, RECIPES, type Looks, type PlayDocs, type Recipe } from "./load.ts";
import { HOUSE_ATTACK } from "./fx.ts";
import { backdropOf } from "./backdrop.ts";
import { DEMO_LOOKS } from "./looks.ts";
import project from "../../fixtures/demo.tileproj/project.json" with { type: "json" }; import slice from "../../fixtures/demo.tileproj/catalogue/slice.json" with { type: "json" }; import mapFile from "../../fixtures/demo.tileproj/maps/map_01JDAM00000000000000000001.json" with { type: "json" }; import stageFile from "../../fixtures/demo.tileproj/stages/stage_01JDAS00000000000000000001.json" with { type: "json" };
import u1 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000001.json" with { type: "json" }; import u2 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000002.json" with { type: "json" }; import u3 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000003.json" with { type: "json" }; import u4 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000004.json" with { type: "json" };
import u5 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000005.json" with { type: "json" }; import u6 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000006.json" with { type: "json" }; import u7 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000007.json" with { type: "json" };
import s1 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json" with { type: "json" }; import s2 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json" with { type: "json" }; import s3 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json" with { type: "json" }; import s4 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json" with { type: "json" }; import s5 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json" with { type: "json" };
type Obj = Record<string, unknown>;
export type PlayOut = PlayDocs & { readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[]; readonly names: Readonly<Record<string, string>>; readonly talk: Readonly<Record<string, string>> };
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v), num = (v: unknown): number | undefined => (typeof v === "number" && Number.isFinite(v) ? v : undefined), strs = (v: unknown): readonly string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const must = (v: number | undefined, why: string): number => { if (v === undefined) throw new Error(why); return v; };
function knob(setup: Obj, cat: Obj, behaviour: string, key: string): unknown {
  const answers = setup["answers"], row = isObj(answers) ? answers[key] : undefined;
  if (isObj(row) && row["source"] !== "default" && Object.hasOwn(row, "value")) return row["value"];
  const list = cat["behaviours"]; if (!Array.isArray(list)) return undefined;
  for (const b of list) if (isObj(b) && b["id"] === behaviour && Array.isArray(b["knobs"])) for (const k of b["knobs"]) if (isObj(k) && k["id"] === key) return k["default"];
  return undefined;
}
export const bundledFiles = (): ProjectFiles => ({
  "project.json": project, "catalogue/slice.json": slice, "maps/map_01JDAM00000000000000000001.json": mapFile, "stages/stage_01JDAS00000000000000000001.json": stageFile,
  "units/unit_01JDAN00000000000000000001.json": u1, "units/unit_01JDAN00000000000000000002.json": u2, "units/unit_01JDAN00000000000000000003.json": u3, "units/unit_01JDAN00000000000000000004.json": u4, "units/unit_01JDAN00000000000000000005.json": u5, "units/unit_01JDAN00000000000000000006.json": u6, "units/unit_01JDAN00000000000000000007.json": u7,
  "setups/setup_01JDAT00000000000000000001.json": s1, "setups/setup_01JDAT00000000000000000002.json": s2, "setups/setup_01JDAT00000000000000000003.json": s3, "setups/setup_01JDAT00000000000000000004.json": s4, "setups/setup_01JDAT00000000000000000005.json": s5,
});
function winOf(store: ProjectStore, stage: Obj): PlayOut["win"] {
  const id = typeof stage["id"] === "string" ? stage["id"] : "", hit = ruleOf({ manifest: store.manifest, stages: store.stages, setups: store.setups }, id, "win-condition"), setup = hit.setupId === "" ? undefined : store.setups[hit.setupId];
  if (hit.source !== "default" && !isObj(setup)) throw new Error("play: win-condition");
  if (hit.source === "default" && !(Array.isArray(store.slice["behaviours"]) && store.slice["behaviours"].some((row) => isObj(row) && row["id"] === "win-condition"))) return undefined;
  return WIN_CONDITION.install({ get: (key) => knob(isObj(setup) ? setup : {}, store.slice, "win-condition", key), unsupported(key, why) { throw new Error(why === undefined ? `play: win-condition ${key}` : `play: win-condition ${key} ${why}`); } });
}
function levelsOf(store: ProjectStore, stage: Obj): PlayOut["levels"] {
  const id = typeof stage["id"] === "string" ? stage["id"] : "", hit = ruleOf({ manifest: store.manifest, stages: store.stages, setups: store.setups }, id, "xp-levels"), setup = hit.setupId === "" ? undefined : store.setups[hit.setupId];
  if (hit.source === "default") return undefined;
  if (!isObj(setup)) throw new Error("play: xp-levels");
  const rules = XP_LEVELS.install({ get: (key) => knob(setup, store.slice, "xp-levels", key), unsupported(key, why) { throw new Error(why === undefined ? `play: xp-levels ${key}` : `play: xp-levels ${key} ${why}`); } });
  if (rules === null) throw new Error("play: xp-levels");
  return { rules, pools: {} };
}
function pickFx(store: ProjectStore, id: string, setup: Obj, fxOf: Record<string, string>): void {
  const behaviour = setup["behaviourId"] === "basic-attack" ? "basic-attack" : setup["behaviourId"] === "line-shot" ? "line-shot" : "", v = behaviour === "" ? undefined : knob(setup, store.slice, behaviour, "effect"); if (typeof v === "string" && Object.hasOwn(store.effects, v)) fxOf[`${id}|${behaviour === "basic-attack" ? HOUSE_ATTACK : "line-shot"}`] = v;
}
/** Adapter only. Document JSON is already read by readProject. */
export function playDocsOf(store: ProjectStore, stageId?: string): PlayOut {
  const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {}, sess = isObj(root["session"]) ? root["session"] : null, start = sess !== null && typeof sess["start"] === "string" ? sess["start"] : undefined;
  const stage = store.stages[stageId ?? start ?? strs(root["stages"])[0] ?? ""] ?? Object.values(store.stages)[0]; if (stage === undefined) throw new Error("play: stage");
  const core = readStage(stage, { picks: 0, waveUnits: 0 }); if (!core.ok) throw new Error("play: stage");
  const map = store.maps[typeof stage["mapRef"] === "string" ? stage["mapRef"] : ""]; if (map === undefined) throw new Error("play: map");
  const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
  const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
  const stepped = installOne(STEP_PATTERN, {}).out; if (stepped === null) throw new Error("play: step");
  const stats: Record<string, { hp: number; atk: number }> = {}, reach: Record<string, number> = {}, abilities: Record<string, { reach: number; damage: number; effectRef: string }[]> = {}, names: Record<string, string> = {}, fxOf: Record<string, string> = {};
  for (const [id, unit] of Object.entries(store.units)) {
    const st = isObj(unit["stats"]) ? unit["stats"] : {}, hpBag = st["unit_hp"], atkBag = st["unit_atk"], row = { hp: num(isObj(hpBag) ? hpBag["value"] : undefined) ?? hp0, atk: num(isObj(atkBag) ? atkBag["value"] : undefined) ?? atk0 };
    stats[id] = row; if (typeof unit["name"] === "string") names[id] = unit["name"];
    for (const sid of strs(unit["setupIds"])) {
      const setup = store.setups[sid]; if (setup === undefined) continue;
      if (setup["behaviourId"] === "basic-attack") { const mode = knob(setup, cat, "basic-attack", "reach_mode"), ns = num(knob(setup, cat, "basic-attack", "custom_ns")), ew = num(knob(setup, cat, "basic-attack", "custom_ew")), got = mode === "orth-only-1" ? 1 : mode === "custom-cross" ? Math.min(must(ns, "play: reach"), must(ew, "play: reach")) : mode === "same-as-step" ? stepped.reach : undefined; if (got !== undefined) reach[id] = got; }
      if (setup["behaviourId"] === "line-shot") abilities[id] = [...(abilities[id] ?? []), { reach: must(num(knob(setup, cat, "line-shot", "range")), "play: line-shot"), damage: must(num(knob(setup, cat, "line-shot", "damage")), "play: line-shot"), effectRef: "line-shot" }];
      pickFx(store, id, setup, fxOf);
    }
  }
  const gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(root["loadout"]) ? root["loadout"] : {}, chosen: string[] = [];
  for (const id of [...strs(gear["required"]), ...strs(gear["roster"])]) if (!chosen.includes(id)) chosen.push(id);
  const talk: Record<string, string> = {};
  for (const n of Array.isArray(stage["neutrals"]) ? stage["neutrals"] : []) if (isObj(n) && typeof n["unitId"] === "string") for (const sid of strs(n["setupIds"])) {
    const setup = store.setups[sid], key = `talk-${n["unitId"]}`; if (setup === undefined || setup["behaviourId"] !== "talk" || Object.hasOwn(talk, key)) continue;
    const line = knob(setup, cat, "talk", "line"); talk[key] = typeof line === "string" ? line : "";
  }
  const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
  const recipes: Record<string, Recipe> = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length), win = winOf(store, stage), levels = levelsOf(store, stage), backdrop = backdropOf(root, map);
  return { manifest: store.manifest, map, stage, links: core.doc.links ?? [], rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }), ...(levels === undefined ? {} : { levels }), ...(backdrop.length === 0 ? {} : { backdrop }), effects: Object.values(store.effects), ...(Object.keys(fxOf).length > 0 ? { fxOf } : {}) };
}
export function openProject(files: ProjectFiles, stageId?: string): { docs: (PlayOut & { readonly looks: Looks }) | null; error: string } {
  try {
    const load = readProject(files), error = load.report.map((r) => [r.code, r.path, r.detail].filter((part) => part !== undefined).join(" ")).join("\n");
    if (!load.ok || load.readOnly || load.project === null) return { docs: null, error };
    const looks: Looks = { canopy: [], braziers: [] }, docs = { ...playDocsOf(load.project, stageId), looks };
    docsToInput(docs);
    return { docs, error };
  } catch (e) { if (!(e instanceof Error)) throw e; return { docs: null, error: e.message }; }
}
export function openBundled(): ReturnType<typeof openProject> {
  const got = openProject(bundledFiles());
  if (got.docs === null) return got;
  return { docs: { ...got.docs, looks: DEMO_LOOKS }, error: got.error };
}
export const bundledDocs = (): NonNullable<ReturnType<typeof openBundled>["docs"]> => { const got = openBundled(); if (got.docs === null) throw new Error(got.error === "" ? "play: project" : got.error); return got.docs; };
export function arriveIn(files: ProjectFiles, fromId: string | null, toId: string, party: SessionParty): ReturnType<typeof openProject> {
  if (fromId === "") throw new Error("play: stage id");
  let path = ""; for (const [key, doc] of Object.entries(files)) if (key.startsWith("stages/") && isObj(doc) && doc["id"] === toId) path = key;
  const stage = path === "" ? undefined : files[path], read = stage === undefined ? null : readStage(stage, { picks: 0, waveUnits: 0 });
  if (read === null || !read.ok) return openProject(files, toId);
  let mapDoc: unknown; for (const [key, doc] of Object.entries(files)) if (key.startsWith("maps/") && isObj(doc) && doc["id"] === read.doc.mapRef) mapDoc = doc;
  const map = mapDoc === undefined ? null : readMap(mapDoc), tiles = installOne(TERRAIN, {}).out?.tiles, grid = map !== null && map.ok && tiles !== undefined ? createGrid(map.doc, tiles) : null;
  if (grid === null) return openProject(files, toId);
  const taken = new Set<string>(); for (const n of read.doc.neutrals) taken.add(`${n.at.c},${n.at.r}`); const pool = read.doc.enemyPool; if (pool.mode === "fixed") for (const e of pool.entries) taken.add(`${e.at.c},${e.at.r}`); else for (const s of pool.spawns) taken.add(`${s.c},${s.r}`);
  const free = (sq: { c: number; r: number }): boolean => !taken.has(`${sq.c},${sq.r}`) && grid.isOpen(sq), inside = (sq: { c: number; r: number }): boolean => grid.inBounds(sq), spots = read.doc.playerSpawns, next = arrival(read.doc.links ?? [], fromId ?? "\u0000", spots, party.members.length, free, inside);
  const playerSpawns = next.map((sq) => { const hit = spots.find((s) => s.c === sq.c && s.r === sq.r); return hit !== undefined && hit.facing !== undefined ? { c: sq.c, r: sq.r, facing: hit.facing } : { c: sq.c, r: sq.r }; });
  const opened = openProject({ ...files, [path]: { ...(isObj(stage) ? stage : {}), playerSpawns } }, toId); if (opened.docs === null) return opened;
  const side = read.doc.sides?.loadout ?? party.side, carried = carryInto(party, side), rules = { ...opened.docs.rules, carry: carried.carry }, levels = opened.docs.levels === undefined || carried.start === undefined ? opened.docs.levels : { ...opened.docs.levels, start: carried.start }, bench = party.members.slice(next.length); return { docs: { ...opened.docs, chosen: party.members.map((m) => m.unitId), rules, ...(levels === undefined ? {} : { levels }), ...(bench.length === 0 ? {} : { bench }) }, error: opened.error };
}
