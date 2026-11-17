import type { CoreTerrainKnobs, CoreTileType } from "../../types/core-types.ts";
import { isRecord } from "../../core/plain.ts";
import type { BehaviourDef, KnobReader } from "./types.ts";
import { TERRAIN_KNOBS } from "./catalogue.ts";

export type TerrainOut = { readonly tiles: readonly CoreTileType[]; readonly terrain: Pick<CoreTerrainKnobs, "push_into_walls"> };

const FLAGS = ["kills_on_landing", "slows_move", "trips", "buildable"] as const;

function install(k: KnobReader): TerrainOut {
  const list = k.get("tile_types");
  const rows = Array.isArray(list) ? list.filter(isRecord) : [];
  for (const tile of rows) for (const flag of FLAGS) if (tile[flag] === true) k.unsupported("tile_types", `${String(tile.id)}.${flag}`);
  if (k.get("lanes_enabled") === true) k.unsupported("lanes_enabled", "lanes");
  return {
    tiles: rows.map((tile) => ({ id: String(tile.id), open: tile.open === true, push_can_enter: tile.push_can_enter === true })),
    terrain: { push_into_walls: k.get("push_into_walls") === true },
  };
}

export const TERRAIN: BehaviourDef<TerrainOut> = Object.freeze({ id: "terrain", knobs: TERRAIN_KNOBS, install });
