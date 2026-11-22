import { readProject,                                      } from "../../src/project/load/index.js";
import { ruleOf } from "../../src/project/rule-of.js";
import { WIN_CONDITION } from "../../src/rules/battle/win.js";
import { XP_LEVELS } from "../../src/rules/behaviours/xp-levels.js";
import { installOne } from "../../src/rules/behaviours/registry.js";
import { TERRAIN } from "../../src/rules/behaviours/terrain.js";
import { STEP_PATTERN } from "../../src/rules/move/step-pattern.js";
                                                                  
import { docsToInput, RECIPES,                                        } from "./load.js";
import { DEMO_LOOKS } from "./looks.js";
import project from "../../fixtures/demo.tileproj/project.json.js"; import slice from "../../fixtures/demo.tileproj/catalogue/slice.json.js"; import mapFile from "../../fixtures/demo.tileproj/maps/map_01JDAM00000000000000000001.json.js"; import stageFile from "../../fixtures/demo.tileproj/stages/stage_01JDAS00000000000000000001.json.js";
import u1 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000001.json.js"; import u2 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000002.json.js"; import u3 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000003.json.js"; import u4 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000004.json.js";
import u5 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000005.json.js"; import u6 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000006.json.js"; import u7 from "../../fixtures/demo.tileproj/units/unit_01JDAN00000000000000000007.json.js";
import s1 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000001.json.js"; import s2 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000002.json.js"; import s3 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000003.json.js"; import s4 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000004.json.js"; import s5 from "../../fixtures/demo.tileproj/setups/setup_01JDAT00000000000000000005.json.js";
                                   
                                                                                                                                                                                                                    
const isObj = (v         )           => typeof v === "object" && v !== null && !Array.isArray(v), num = (v         )                     => (typeof v === "number" && Number.isFinite(v) ? v : undefined), strs = (v         )                    => (Array.isArray(v) ? v.filter((x)              => typeof x === "string") : []);
const must = (v                    , why        )         => { if (v === undefined) throw new Error(why); return v; };
function knob(setup     , cat     , behaviour        , key        )          {
  const answers = setup["answers"], row = isObj(answers) ? answers[key] : undefined;
  if (isObj(row) && row["source"] !== "default" && Object.hasOwn(row, "value")) return row["value"];
  const list = cat["behaviours"]; if (!Array.isArray(list)) return undefined;
  for (const b of list) if (isObj(b) && b["id"] === behaviour && Array.isArray(b["knobs"])) for (const k of b["knobs"]) if (isObj(k) && k["id"] === key) return k["default"];
  return undefined;
}
export const bundledFiles = ()               => ({
  "project.json": project, "catalogue/slice.json": slice, "maps/map_01JDAM00000000000000000001.json": mapFile, "stages/stage_01JDAS00000000000000000001.json": stageFile,
  "units/unit_01JDAN00000000000000000001.json": u1, "units/unit_01JDAN00000000000000000002.json": u2, "units/unit_01JDAN00000000000000000003.json": u3, "units/unit_01JDAN00000000000000000004.json": u4, "units/unit_01JDAN00000000000000000005.json": u5, "units/unit_01JDAN00000000000000000006.json": u6, "units/unit_01JDAN00000000000000000007.json": u7,
  "setups/setup_01JDAT00000000000000000001.json": s1, "setups/setup_01JDAT00000000000000000002.json": s2, "setups/setup_01JDAT00000000000000000003.json": s3, "setups/setup_01JDAT00000000000000000004.json": s4, "setups/setup_01JDAT00000000000000000005.json": s5,
});
function winOf(store              , stage     )                 {
  const id = typeof stage["id"] === "string" ? stage["id"] : "", hit = ruleOf({ manifest: store.manifest, stages: store.stages, setups: store.setups }, id, "win-condition"), setup = hit.setupId === "" ? undefined : store.setups[hit.setupId];
  if (hit.source !== "default" && !isObj(setup)) throw new Error("play: win-condition");
  if (hit.source === "default" && !(Array.isArray(store.slice["behaviours"]) && store.slice["behaviours"].some((row) => isObj(row) && row["id"] === "win-condition"))) return undefined;
  return WIN_CONDITION.install({ get: (key) => knob(isObj(setup) ? setup : {}, store.slice, "win-condition", key), unsupported(key, why) { throw new Error(why === undefined ? `play: win-condition ${key}` : `play: win-condition ${key} ${why}`); } });
}
function levelsOf(store              , stage     )                    {
  const id = typeof stage["id"] === "string" ? stage["id"] : "", hit = ruleOf({ manifest: store.manifest, stages: store.stages, setups: store.setups }, id, "xp-levels"), setup = hit.setupId === "" ? undefined : store.setups[hit.setupId];
  if (hit.source === "default") return undefined;
  if (!isObj(setup)) throw new Error("play: xp-levels");
  const rules = XP_LEVELS.install({ get: (key) => knob(setup, store.slice, "xp-levels", key), unsupported(key, why) { throw new Error(why === undefined ? `play: xp-levels ${key}` : `play: xp-levels ${key} ${why}`); } });
  if (rules === null) throw new Error("play: xp-levels");
  return { rules, pools: {} };
}
/** Adapter only. Document JSON is already read by readProject. */
export function playDocsOf(store              , stageId         )          {
  const cat = store.slice, root = isObj(store.manifest["project"]) ? store.manifest["project"] : {};
  const stage = store.stages[stageId ?? strs(root["stages"])[0] ?? ""] ?? Object.values(store.stages)[0]; if (stage === undefined) throw new Error("play: stage");
  const map = store.maps[typeof stage["mapRef"] === "string" ? stage["mapRef"] : ""]; if (map === undefined) throw new Error("play: map");
  const army = Object.values(store.setups).find((s) => s["behaviourId"] === "unit-roster"); if (army === undefined) throw new Error("play: army");
  const hp0 = must(num(knob(army, cat, "unit-roster", "unit_hp")), "play: army"), atk0 = must(num(knob(army, cat, "unit-roster", "unit_atk")), "play: army");
  const stepped = installOne(STEP_PATTERN, {}).out; if (stepped === null) throw new Error("play: step");
  const stats                                              = {}, reach                         = {}, abilities                                                                         = {}, names                         = {};
  for (const [id, unit] of Object.entries(store.units)) {
    const st = isObj(unit["stats"]) ? unit["stats"] : {}, hpBag = st["unit_hp"], atkBag = st["unit_atk"], row = { hp: num(isObj(hpBag) ? hpBag["value"] : undefined) ?? hp0, atk: num(isObj(atkBag) ? atkBag["value"] : undefined) ?? atk0 };
    stats[id] = row; if (typeof unit["name"] === "string") names[id] = unit["name"];
    for (const sid of strs(unit["setupIds"])) {
      const setup = store.setups[sid]; if (setup === undefined) continue;
      if (setup["behaviourId"] === "basic-attack") { const mode = knob(setup, cat, "basic-attack", "reach_mode"), ns = num(knob(setup, cat, "basic-attack", "custom_ns")), ew = num(knob(setup, cat, "basic-attack", "custom_ew")), got = mode === "orth-only-1" ? 1 : mode === "custom-cross" ? Math.min(must(ns, "play: reach"), must(ew, "play: reach")) : mode === "same-as-step" ? stepped.reach : undefined; if (got !== undefined) reach[id] = got; }
      if (setup["behaviourId"] === "line-shot") abilities[id] = [...(abilities[id] ?? []), { reach: must(num(knob(setup, cat, "line-shot", "range")), "play: line-shot"), damage: must(num(knob(setup, cat, "line-shot", "damage")), "play: line-shot"), effectRef: "line-shot" }];
    }
  }
  const gear = isObj(stage["loadout"]) ? stage["loadout"] : isObj(root["loadout"]) ? root["loadout"] : {}, chosen           = [];
  for (const id of [...strs(gear["required"]), ...strs(gear["roster"])]) if (!chosen.includes(id)) chosen.push(id);
  const talk                         = {};
  for (const n of Array.isArray(stage["neutrals"]) ? stage["neutrals"] : []) if (isObj(n) && typeof n["unitId"] === "string") for (const sid of strs(n["setupIds"])) {
    const setup = store.setups[sid], key = `talk-${n["unitId"]}`; if (setup === undefined || setup["behaviourId"] !== "talk" || Object.hasOwn(talk, key)) continue;
    const line = knob(setup, cat, "talk", "line"); talk[key] = typeof line === "string" ? line : "";
  }
  const tiles = installOne(TERRAIN, {}).out?.tiles; if (tiles === undefined) throw new Error("play: terrain");
  const recipes                         = { ...RECIPES }; for (const [id, name] of Object.entries(names)) { const hit = Object.values(RECIPES).find((r) => r.name === name); if (hit !== undefined) recipes[id] = hit; }
  const host = typeof stage["seed"] === "number" ? stage["seed"] : undefined, cap = Math.min(typeof gear["size"] === "number" ? gear["size"] : chosen.length, Array.isArray(stage["playerSpawns"]) ? stage["playerSpawns"].length : chosen.length), win = winOf(store, stage), levels = levelsOf(store, stage);
  return { manifest: store.manifest, map, stage, rules: { base: { hp: hp0, atk: atk0 }, stats, hitClass: "basic", ...(Object.keys(reach).length > 0 ? { reach } : {}), ...(Object.keys(abilities).length > 0 ? { abilities } : {}) }, ...(host === undefined ? {} : { hostSeed: host }), talk, chosen: chosen.slice(0, cap), tiles, names, recipes, ...(win === undefined ? {} : { win }), ...(levels === undefined ? {} : { levels }) };
}
export function openProject(files              , stageId         )                                                                        {
  try {
    const load = readProject(files), error = load.report.map((r) => [r.code, r.path, r.detail].filter((part) => part !== undefined).join(" ")).join("\n");
    if (!load.ok || load.readOnly || load.project === null) return { docs: null, error };
    const looks        = { canopy: [], braziers: [] }, docs = { ...playDocsOf(load.project, stageId), looks };
    docsToInput(docs);
    return { docs, error };
  } catch (e) { if (!(e instanceof Error)) throw e; return { docs: null, error: e.message }; }
}
export function openBundled()                                 {
  const got = openProject(bundledFiles());
  if (got.docs === null) return got;
  return { docs: { ...got.docs, looks: DEMO_LOOKS }, error: got.error };
}
export const bundledDocs = ()                                                      => { const got = openBundled(); if (got.docs === null) throw new Error(got.error === "" ? "play: project" : got.error); return got.docs; };
