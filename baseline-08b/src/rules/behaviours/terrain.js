                                                                                
import { isRecord } from "../../core/plain.js";
                                                           
import { TERRAIN_KNOBS } from "./catalogue.js";

                                                                                                                                  

const FLAGS = ["kills_on_landing", "slows_move", "trips", "buildable"]         ;

function install(k            )             {
  const list = k.get("tile_types");
  const rows = Array.isArray(list) ? list.filter(isRecord) : [];
  for (const tile of rows) for (const flag of FLAGS) if (tile[flag] === true) k.unsupported("tile_types", `${String(tile.id)}.${flag}`);
  if (k.get("lanes_enabled") === true) k.unsupported("lanes_enabled", "lanes");
  return {
    tiles: rows.map((tile) => ({ id: String(tile.id), open: tile.open === true, push_can_enter: tile.push_can_enter === true })),
    terrain: { push_into_walls: k.get("push_into_walls") === true },
  };
}

export const TERRAIN                           = Object.freeze({ id: "terrain", knobs: TERRAIN_KNOBS, install });
