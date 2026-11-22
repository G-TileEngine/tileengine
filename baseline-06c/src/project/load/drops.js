                                                 
                                   
const isObj = (v         )           => typeof v === "object" && v !== null && !Array.isArray(v);
const list = (v         )                     => (Array.isArray(v) ? v : []);
const warn = (path        , detail                             )            => ({ code: "placementDropped", severity: "warning", path, detail });
function closedIds(slice     )                      {
  const out = new Set        ();
  for (const b of list(slice["behaviours"])) if (isObj(b) && b["id"] === "terrain") for (const knob of list(b["knobs"])) if (isObj(knob) && knob["id"] === "tile_types") for (const item of list(knob["default"])) if (isObj(item) && typeof item["id"] === "string" && item["open"] === false) out.add(item["id"]);
  return out;
}
function why(map                 , c        , r        , closed                     )                                     {
  if (map === undefined || typeof map["cols"] !== "number" || typeof map["rows"] !== "number" || !Number.isInteger(c) || !Number.isInteger(r) || c < 0 || r < 0 || c >= map["cols"] || r >= map["rows"]) return "outsideMap";
  const logic = isObj(map["logic"]) ? map["logic"] : {}, terrain = Array.isArray(logic["terrain"]) ? logic["terrain"] : [], palette = isObj(logic["palette"]) ? logic["palette"] : {}, value = terrain[r * map["cols"] + c], id = typeof value === "number" ? palette[String(value)] : "floor";
  return typeof id === "string" && closed.has(id) ? "closedCell" : null;
}
function atOf(entry     , direct         )                                                    {
  const box = direct ? entry : entry["at"];
  return isObj(box) && typeof box["c"] === "number" && typeof box["r"] === "number" ? { c: box["c"], r: box["r"] } : null;
}
/** One warning per placement on a closed cell or off its map. Reads only. */
export function placementDrops(stages                               , stageAt                                  , maps                               , slice     )              {
  const closed = closedIds(isObj(slice) ? slice : {}), rows              = [];
  for (const [id, stage] of Object.entries(stages)) {
    const file = stageAt[id] ?? `stages/${id}.json`, map = typeof stage["mapRef"] === "string" ? maps[stage["mapRef"]] : undefined;
    const lists                                                   = [
      ["playerSpawns", true, list(stage["playerSpawns"])],
      ["neutrals", false, list(stage["neutrals"])],
      ["enemyPool/entries", false, isObj(stage["enemyPool"]) && stage["enemyPool"]["mode"] === "fixed" ? list(stage["enemyPool"]["entries"]) : []],
    ];
    for (const [name, direct, entries] of lists) for (let i = 0; i < entries.length; i += 1) {
      const entry = entries[i]; if (!isObj(entry)) continue;
      const at = atOf(entry, direct), drop = at === null ? "outsideMap" : why(map, at.c, at.r, closed);
      if (drop !== null) rows.push(warn(`${file}#/${name}/${i}`, drop));
    }
  }
  return rows;
}
/** One warning per logic.edges entry outside the map. Reads only. Lanes are not entries. */
export function mapEntryDrops(maps                               , mapAt                                  )              {
  const rows              = [];
  for (const [id, map] of Object.entries(maps)) {
    if (!isObj(map)) continue;
    const file = mapAt[id] ?? `maps/${id}.json`, cols = typeof map["cols"] === "number" ? map["cols"] : 0, rowsN = typeof map["rows"] === "number" ? map["rows"] : 0;
    const logic = isObj(map["logic"]) ? map["logic"] : {};
    list(logic["edges"]).forEach((edge, i) => {
      const c = isObj(edge) ? edge["c"] : undefined, r = isObj(edge) ? edge["r"] : undefined;
      if (typeof c !== "number" || typeof r !== "number" || !Number.isInteger(c) || !Number.isInteger(r) || c < 0 || r < 0 || c >= cols || r >= rowsN) rows.push({ code: "mapEntryDropped", severity: "warning", path: `${file}#/logic/edges/${i}`, detail: "outsideMap" });
    });
  }
  return rows;
}
