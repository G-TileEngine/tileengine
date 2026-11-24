                                                                                                                                                  
const isObj = (v         )                               => typeof v === "object" && v !== null && !Array.isArray(v);
/** Look data only. `fit` is ignored (cover/stretch read as none). No ext skips the layer. Depth clamps to 0..1; absent or not finite is 1. */
export function backdropOf(project         , map         )              {
  const root = isObj(project) ? project : {}, inner = isObj(root["project"]) ? root["project"] : root, assets = isObj(inner["assets"]) ? inner["assets"] : isObj(root["assets"]) ? root["assets"] : {};
  const bg = isObj(map) && isObj(map["background"]) ? map["background"] : {}, layers = Array.isArray(bg["layers"]) ? bg["layers"] : [], out              = [];
  for (const layer of layers) {
    if (!isObj(layer) || typeof layer["assetId"] !== "string") continue;
    const meta = assets[layer["assetId"]]; if (!isObj(meta) || typeof meta["ext"] !== "string") continue;
    const raw = layer["depth"], depth = typeof raw === "number" && Number.isFinite(raw) ? Math.min(1, Math.max(0, raw)) : 1, rep = layer["repeat"];
    out.push({ assetId: layer["assetId"], file: `assets/${layer["assetId"]}.${meta["ext"]}`, depth, repeat: rep === "x" || rep === "y" || rep === "both" || rep === "none" ? rep : "none" });
  }
  return out;
}
