import { knownKind,                                   } from "./types.js";
                                   
const isObj = (v         )           => typeof v === "object" && v !== null && !Array.isArray(v);
const CUR                                                      = { "tile-project": [4, 6], map: [4, 5], stage: [2, 2], unit: [2, 2], "behaviour-setup": [3, 3], "catalogue-slice": [1, 1] };
const push = (rows             , code        , severity                       , path        , detail        )       => { rows.push({ code, severity, path, detail }); };

/** Hard refusal rows. Empty means every known document has an accepted version. */
export function versionRows(files              )              {
  const rows              = [];
  for (const path of Object.keys(files)) {
    const span = CUR[knownKind(path) ?? ""]; if (span === undefined) continue;
    const doc = files[path], ver = isObj(doc) ? doc["formatVersion"] : undefined, where = `${path}#/formatVersion`, detail = `found ${ver === undefined ? "missing" : JSON.stringify(ver)}, reads ≤ ${span[1]}`;
    if (typeof ver !== "number" || !Number.isInteger(ver)) push(rows, "invalidValue", "hard", where, detail);
    else if (ver > span[1]) push(rows, "formatNewer", "hard", where, detail);
    else if (ver < span[0]) push(rows, "formatOlder", "hard", where, detail);
  }
  return rows;
}
function layersOf(bg     )      {
  const colour = typeof bg["colour"] === "string" ? { colour: bg["colour"] } : {}, fit = bg["fit"], tile = fit === "tile";
  if (bg["mode"] === "none" || bg["mode"] === "colour") return { ...colour, layers: [] };
  return { ...colour, layers: [{ assetId: bg["assetId"], depth: bg["mode"] === "parallax" && typeof bg["scroll"] === "number" ? bg["scroll"] : 1, repeat: tile ? "both" : "none", fit: tile ? "none" : typeof fit === "string" ? fit : "none" }] };
}

/** §12 in memory: tile-project 004, 005-lite, map 004. Deep copy. Never writes. */
export function migrateProject(files              )                                                        {
  const copy = structuredClone(files)                           , report              = [];
  for (const path of Object.keys(copy)) {
    const doc = copy[path]; if (!isObj(doc)) continue;
    const ver = doc["formatVersion"], project = isObj(doc["project"]) ? doc["project"] : null, assets = project?.["assets"];
    if (path === "project.json" && ver === 4 && project !== null && isObj(project["render"])) { const render = project["render"]; if (render["proceduralShip"] === undefined) render["proceduralShip"] = "auto"; if (render["credits"] === undefined) render["credits"] = true; }
    if (path === "project.json" && ver === 4) { doc["formatVersion"] = 5; push(report, "migrated", "info", path, "tile-project 4→5"); }
    if (path === "project.json" && doc["formatVersion"] === 5) {
      if (isObj(assets) && Object.values(assets).some((a) => isObj(a) && isObj(a["origin"]) && a["origin"]["kind"] === "procedural" && "terrains" in a && a["paintStyle"] === undefined)) push(report, "migrationDeferred", "warning", path, "tile-project 005");
      doc["formatVersion"] = 6; push(report, "migrated", "info", path, "tile-project 5→6");
    }
    if (knownKind(path) === "map" && ver === 4) { if (isObj(doc["background"]) && typeof doc["background"]["mode"] === "string") doc["background"] = layersOf(doc["background"]); doc["formatVersion"] = 5; push(report, "migrated", "info", path, "map 4→5"); }
  }
  return { files: copy, report };
}
