export type { BehaviourDef, Installed, KnobReader, KnobSpec, KnobUnsupported, Layer, Registry, Resolved, SetupIn, SetupLayers } from "./types.ts";
export { CATALOGUE, GATE_DEFAULTS, TERRAIN_KNOBS, TILE_TYPES, XP_LEVELS_KNOBS } from "./catalogue.ts";
export { createRegistry, installOne, installSetups, outOf, resolveKnob } from "./registry.ts";
export { XP_LEVELS } from "./xp-levels.ts";
export { TERRAIN, type TerrainOut } from "./terrain.ts";
export { WIRED } from "./wired.ts";
