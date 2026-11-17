import type { BattleSetup } from "../../src/rules/battle/battle.ts";
import type { SimInput } from "../../src/sim/types.ts";

export const TILE = 16;
export const TEAM = { player: 0x2f6fad, wolves: 0xb23b32, neutral: 0xc6a15a } as const;
export type Recipe = { readonly id: string; readonly name: string; readonly team: keyof typeof TEAM };
const fallback = (id: string): Recipe => ({ id: `starter:unknown-${id}`, name: "Unknown", team: "neutral" });
export const RECIPES: Readonly<Record<string, Recipe>> = {
  knight: { id: "starter:hero-sword", name: "Knight", team: "player" },
  archer: { id: "starter:hero-staff", name: "Archer", team: "player" },
  cleric: { id: "starter:hero-cleric", name: "Cleric", team: "player" },
  crate: { id: "starter:prop-crate", name: "Crate", team: "neutral" },
  merchant: { id: "starter:npc-merchant", name: "Merchant", team: "player" },
  villager: { id: "starter:npc-villager", name: "Villager", team: "neutral" },
  wolf: { id: "starter:enemy-wolf", name: "Wolf", team: "wolves" },
};
export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
export const DEMO_TALK: Readonly<Record<string, string>> = { "talk-villager": "Hello, traveler." };
export const DEMO_MANIFEST = { kind: "tile-project", formatVersion: 6, project: { id: "demo", rev: 1, catalogueRev: 1, settings: { wrapEdges: false }, stages: ["stage-demo"], rules: [] as string[], loadout: { roster: ["knight", "archer", "cleric"], size: 3, required: ["knight"] } } };
export const DEMO_MAP = { kind: "map", formatVersion: 5, id: "map-6x9", rev: 1, cols: 6, rows: 9, logic: { terrain: Array.from({ length: 54 }, () => 0), palette: { "0": "floor" }, edges: [] as const } };
export const DEMO_STAGE = {
  kind: "stage", formatVersion: 2, id: "stage-demo", rev: 1, mapRef: "map-6x9", seed: 24301, setupIds: ["talk-villager"],
  playerSpawns: [{ c: 0, r: 8, facing: "N" }, { c: 1, r: 8 }],
  neutrals: [{ unitId: "crate", at: { c: 3, r: 4 } }, { unitId: "merchant", at: { c: 4, r: 4 }, facing: "W", side: "player" }, { unitId: "villager", at: { c: 5, r: 4 }, facing: "S" }],
  sides: { enemyPool: "wolves" },
  enemyPool: { mode: "fixed" as const, entries: [{ unitId: "wolf", at: { c: 2, r: 0 }, facing: "S" }, { unitId: "wolf", at: { c: 3, r: 0 } }] },
  loadout: { roster: ["knight", "archer", "cleric"], size: 3, required: ["knight"] }, rules: [] as string[],
};
export const DEMO_SETUP: BattleSetup = { base: { hp: 9, atk: 1 }, stats: { knight: { hp: 9, atk: 1 }, archer: { hp: 6, atk: 2 }, wolf: { hp: 4, atk: 1 }, cleric: { hp: 7, atk: 1 }, villager: { hp: 4, atk: 0 }, crate: { hp: 3, atk: 0 }, merchant: { hp: 5, atk: 0 } }, hitClass: "basic" };
export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed: number; readonly talk?: Readonly<Record<string, string>> };
export const DEMO_LOAD: PlayDocs & { readonly talk: Readonly<Record<string, string>> } = { manifest: DEMO_MANIFEST, map: DEMO_MAP, stage: DEMO_STAGE, rules: DEMO_SETUP, talk: DEMO_TALK, hostSeed: 24301 };
const TILES = [{ id: "floor", open: true, push_can_enter: true }] as const;
export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>> }): { input: SimInput; talk: Readonly<Record<string, string>> } {
  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: TILES, chosen: ["knight", "archer"], stageLimits: { picks: 0, waveUnits: 0 }, hostSeed: docs.hostSeed, engineVersion: "0.0.0", projectHash: "demo" }, talk: docs.talk };
}
