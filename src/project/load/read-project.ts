import { readManifest, readMap, readSetup, readStage, readUnit, type ReadResult } from "../read/index.ts";
import { mapEntryDrops, placementDrops } from "./drops.ts";
import { migrateProject, versionRows } from "./migrate.ts";
import { knownKind, type Doc, type ProjectFiles, type ProjectLoad, type ProjectStore, type ReportRow, type Severity } from "./types.ts";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const LIMITS = { picks: 8, waveUnits: 16 } as const;
const row = (code: string, severity: Severity, path: string, detail?: string): ReportRow => (detail === undefined ? { code, severity, path } : { code, severity, path, detail });
const sort = (rows: readonly ReportRow[]): ReportRow[] => [...rows].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : a.code < b.code ? -1 : a.code > b.code ? 1 : 0));
const idOf = (doc: Obj): string | null => (typeof doc["id"] === "string" ? doc["id"] : null);
const list = (v: unknown): readonly unknown[] => (Array.isArray(v) ? v : []);

function note(res: ReadResult<unknown>, path: string, rows: ReportRow[]): void {
  if (res.ok) return;
  const stats = !res.needsMigration && res.error === "bad field stats";
  rows.push(row("invalidValue", "hard", stats ? `${path}#/stats` : path, res.needsMigration ? "needsMigration" : res.error));
}
function has(bag: Readonly<Record<string, unknown>>, id: unknown, path: string, rows: ReportRow[]): void {
  if (typeof id === "string" && !Object.hasOwn(bag, id)) rows.push(row("brokenRef", "hard", path, id));
}

function refs(manifest: Obj, at: Readonly<Record<string, string>>, maps: Readonly<Record<string, Doc>>, stages: Readonly<Record<string, Doc>>, units: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
  const project = isObj(manifest["project"]) ? manifest["project"] : {};
  const gear = isObj(project["loadout"]) ? project["loadout"] : {};
  list(project["stages"]).forEach((id, i) => has(stages, id, `project.json#/project/stages/${i}`, rows));
  list(project["rules"]).forEach((id, i) => has(setups, id, `project.json#/project/rules/${i}`, rows));
  if (isObj(project["session"])) has(stages, project["session"]["start"], "project.json#/project/session/start", rows);
  list(gear["roster"]).forEach((id, i) => has(units, id, `project.json#/project/loadout/roster/${i}`, rows));
  list(gear["required"]).forEach((id, i) => has(units, id, `project.json#/project/loadout/required/${i}`, rows));
  for (const [id, stage] of Object.entries(stages)) {
    const path = at[id] ?? `stages/${id}.json`;
    const pool = isObj(stage["enemyPool"]) ? stage["enemyPool"] : {};
    has(maps, stage["mapRef"], `${path}#/mapRef`, rows);
    list(stage["rules"]).forEach((sid, i) => has(setups, sid, `${path}#/rules/${i}`, rows));
    list(stage["neutrals"]).forEach((n, i) => { if (!isObj(n)) return; has(units, n["unitId"], `${path}#/neutrals/${i}/unitId`, rows); list(n["setupIds"]).forEach((sid, j) => has(setups, sid, `${path}#/neutrals/${i}/setupIds/${j}`, rows)); });
    list(pool["entries"]).forEach((e, i) => { if (isObj(e)) has(units, e["unitId"], `${path}#/enemyPool/entries/${i}/unitId`, rows); });
    list(stage["links"]).forEach((l, i) => { if (!isObj(l)) return; const where = `${path}#/links/${i}/to`; if (l["to"] === id) rows.push(row("brokenRef", "hard", where, id)); else has(stages, l["to"], where, rows); });
  }
  for (const [id, unit] of Object.entries(units)) list(unit["setupIds"]).forEach((sid, i) => has(setups, sid, `units/${id}.json#/setupIds/${i}`, rows));
  const assets = isObj(project["assets"]) ? project["assets"] : {}; for (const [id, map] of Object.entries(maps)) list(isObj(map["background"]) ? map["background"]["layers"] : undefined).forEach((layer, i) => { if (isObj(layer)) has(assets, layer["assetId"], `maps/${id}.json#/background/layers/${i}/assetId`, rows); });
}

function knobAt(slice: Obj, behaviourId: unknown, key: string): Obj | null {
  if (typeof behaviourId !== "string") return null;
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === behaviourId) for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === key) return knob;
  return null;
}
function warns(slice: Obj, project: Obj, maps: Readonly<Record<string, Doc>>, setups: Readonly<Record<string, Doc>>, rows: ReportRow[]): void {
  const projectRev = project["catalogueRev"], settings = isObj(project["settings"]) ? project["settings"] : {}, advanced = settings["advancedRender"] === true, camera = isObj(settings["camera"]) ? settings["camera"] : {};
  if (!advanced && camera["pixelPerfect"] === false) rows.push(row("advancedRenderInactive", "info", "project.json#/project/settings/camera/pixelPerfect", "pixelPerfect"));
  const known = new Set(list(slice["behaviours"]).filter(isObj).map((b) => b["id"]));
  const tiles = new Set<string>();
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "terrain") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === "tile_types") for (const item of list(knob["default"])) if (isObj(item) && typeof item["id"] === "string") tiles.add(item["id"]);
  if (slice["catalogue_rev"] !== undefined && slice["catalogue_rev"] !== projectRev) rows.push(row("catalogueRevMismatch", "warning", "catalogue/slice.json#/catalogue_rev"));
  for (const [id, setup] of Object.entries(setups)) {
    const path = `setups/${id}.json`, answers = isObj(setup["answers"]) ? setup["answers"] : {};
    if (isObj(setup["catalogue"]) && setup["catalogue"]["rev"] !== projectRev) rows.push(row("catalogueRevMismatch", "warning", `${path}#/catalogue/rev`));
    if (known.size > 0 && typeof setup["behaviourId"] === "string" && !known.has(setup["behaviourId"])) rows.push(row("unknownRef", "warning", `${path}#/behaviourId`, setup["behaviourId"]));
    const ns = isObj(answers["custom_ns"]) ? answers["custom_ns"]["value"] : undefined, ew = isObj(answers["custom_ew"]) ? answers["custom_ew"]["value"] : undefined, mode = isObj(answers["reach_mode"]) ? answers["reach_mode"]["value"] : undefined;
    if (setup["behaviourId"] === "basic-attack" && mode === "custom-cross" && typeof ns === "number" && typeof ew === "number" && ns !== ew) rows.push(row("layerNotApplied", "warning", `${path}#/answers/custom_ns`, "min(ns,ew)"));
    if (setup["behaviourId"] === "basic-attack" && isObj(answers["damage"]) && answers["damage"]["source"] !== "default" && answers["damage"]["source"] !== undefined) rows.push(row("layerNotApplied", "warning", `${path}#/answers/damage`, "unit_atk"));
    for (const key of Object.keys(answers)) {
      const ans = answers[key]; if (!isObj(ans) || !Object.hasOwn(ans, "value")) continue;
      const knob = knobAt(slice, setup["behaviourId"], key); if (knob === null) continue;
      const value = ans["value"], type = knob["type"], where = `${path}#/answers/${key}/value`;
      const bad = type === "slider" ? typeof value !== "number" || !Number.isFinite(value) : type === "toggle" ? typeof value !== "boolean" : type === "text" || type === "ref" ? typeof value !== "string" : type === "picker" ? typeof value !== "string" || (Array.isArray(knob["options"]) && !knob["options"].some((opt) => (isObj(opt) && Object.hasOwn(opt, "value") ? opt["value"] : opt) === value)) : type === "list" ? !Array.isArray(value) || value.some((item) => !isObj(item) || typeof item["id"] !== "string" || typeof item["label"] !== "string") : false;
      if (bad) rows.push(row("invalidValue", "hard", where));
      if (type === "text" && typeof value === "string" && typeof knob["max_len"] === "number" && [...value].length > knob["max_len"]) rows.push(row("outOfRange", "warning", where));
      if (type === "slider" && typeof value === "number" && ((typeof knob["min"] === "number" && value < knob["min"]) || (typeof knob["max"] === "number" && value > knob["max"]))) rows.push(row("outOfRange", "warning", where));
    }
  }
  for (const [id, map] of Object.entries(maps)) {
    const palette = isObj(map["logic"]) && isObj(map["logic"]["palette"]) ? map["logic"]["palette"] : {};
    for (const key of Object.keys(palette)) { const name = palette[key]; if (tiles.size > 0 && typeof name === "string" && !tiles.has(name)) rows.push(row("unknownRef", "warning", `maps/${id}.json#/logic/palette/${key}`, name)); }
    const layers = list(isObj(map["background"]) ? map["background"]["layers"] : undefined); if (layers.length > 3) rows.push(row("overCap", "warning", `maps/${id}.json#/background/layers`, String(layers.length)));
    layers.forEach((layer, i) => { if (!isObj(layer)) return; const depth = layer["depth"]; if (typeof depth === "number" && (depth < 0 || depth > 1)) rows.push(row("outOfRange", "warning", `maps/${id}.json#/background/layers/${i}/depth`)); if (!advanced && (layer["fit"] === "cover" || layer["fit"] === "stretch")) rows.push(row("advancedRenderInactive", "info", `maps/${id}.json#/background/layers/${i}/fit`, "fit")); });
  }
}

/** Pure project read. Never throws, never writes, never mutates `files`. */
export function readProject(files: ProjectFiles): ProjectLoad {
  if (!isObj(files) || !isObj(files["project.json"])) return { ok: false, readOnly: true, project: null, report: [row("notAProject", "hard", "project.json", "missing project.json")] };
  const gate = versionRows(files);
  if (gate.length > 0) return { ok: false, readOnly: true, project: null, report: sort(gate) };
  let migrated: { files: ProjectFiles; report: readonly ReportRow[] };
  try { migrated = migrateProject(files); } catch { return { ok: false, readOnly: true, project: null, report: [row("invalidValue", "hard", "project.json", "unreadable")] }; }
  const docs = migrated.files, rows: ReportRow[] = [...migrated.report];
  const maps: Record<string, Doc> = {}, stages: Record<string, Doc> = {}, units: Record<string, Doc> = {}, setups: Record<string, Doc> = {}, unknownFiles: Record<string, unknown> = {}, stageAt: Record<string, string> = {}, mapAt: Record<string, string> = {};
  let slice: Doc = {}, manifest: Doc = {};
  for (const path of Object.keys(docs)) {
    const doc = docs[path], slot = knownKind(path);
    if (slot === null) { unknownFiles[path] = doc; rows.push(row("unknownFile", "warning", path)); continue; }
    if (!isObj(doc)) { rows.push(row("invalidValue", "hard", path, "not an object")); continue; }
    const id = idOf(doc);
    if (slot === "tile-project") { manifest = doc; if ("index" in doc) rows.push(row("indexIgnored", "info", `${path}#/index`)); note(readManifest(doc), path, rows); }
    else if (slot === "catalogue-slice") slice = doc;
    else if (slot === "map") {
      if (id !== null) { maps[id] = doc; mapAt[id] = path; }
      const n = typeof doc["cols"] === "number" && typeof doc["rows"] === "number" ? doc["cols"] * doc["rows"] : -1;
      const terrain = isObj(doc["logic"]) && Array.isArray(doc["logic"]["terrain"]) ? doc["logic"]["terrain"] : null;
      const badLen = terrain !== null && terrain.length !== n;
      if (badLen && terrain !== null) rows.push(row("terrainLength", "hard", `${path}#/logic/terrain`, `found ${terrain.length}`));
      if (list(doc["layers"]).some((layer) => isObj(layer) && Array.isArray(layer["tiles"]) && layer["tiles"].length !== n)) rows.push(row("terrainLength", "hard", `${path}#/layers`));
      if (!badLen) note(readMap(doc), path, rows);
    } else if (slot === "stage") { if (id !== null) { stages[id] = doc; stageAt[id] = path; } note(readStage(doc, LIMITS), path, rows); }
    else if (slot === "unit") { if (id !== null) units[id] = doc; note(readUnit(doc), path, rows); }
    else { if (id !== null) setups[id] = doc; note(readSetup(doc), path, rows); }
  }
  if (!Object.hasOwn(docs, "catalogue/slice.json")) rows.push(row("invalidValue", "hard", "catalogue/slice.json", "missing"));
  const manifestDoc = docs["project.json"];
  const project = isObj(manifestDoc) && isObj(manifestDoc["project"]) ? manifestDoc["project"] : {};
  refs(isObj(manifestDoc) ? manifestDoc : {}, stageAt, maps, stages, units, setups, rows);
  warns(slice, project, maps, setups, rows);
  rows.push(...placementDrops(stages, stageAt, maps, slice), ...mapEntryDrops(maps, mapAt));
  const hard = rows.some((r) => r.severity === "hard");
  const store: ProjectStore = { manifest, slice, maps, stages, units, setups, unknownFiles };
  return { ok: !hard, readOnly: false, project: store, report: sort(rows) };
}
