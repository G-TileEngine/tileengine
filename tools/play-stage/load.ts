import type { BattleSetup } from "../../src/rules/battle/battle.ts";
import type { WinRule } from "../../src/rules/battle/win.ts";
import type { LevelSetup } from "../../src/rules/levels/index.ts";
import type { SimInput } from "../../src/sim/types.ts";
import type { CoreLink, CoreTileType } from "../../src/types/core-types.ts";

export const TILE = 16;
export const TEAM = { player: 0x2f6fad, enemy: 0xb23b32, neutral: 0xc6a15a } as const;
export type Recipe = { readonly id: string; readonly name: string };
const fallback = (id: string): Recipe => ({ id: `starter:unknown-${id}`, name: "Unknown" });
export const RECIPES: Readonly<Record<string, Recipe>> = Object.freeze({
  knight: { id: "starter:hero-sword", name: "Knight" },
  archer: { id: "starter:hero-staff", name: "Archer" },
  cleric: { id: "starter:hero-cleric", name: "Cleric" },
  crate: { id: "starter:prop-crate", name: "Crate" },
  merchant: { id: "starter:npc-merchant", name: "Merchant" },
  villager: { id: "starter:npc-villager", name: "Villager" },
  wolf: { id: "starter:enemy-wolf", name: "Wolf" },
});
export const recipeIn = (map: Readonly<Record<string, Recipe>>, id: string): Recipe => (Object.hasOwn(map, id) ? map[id] ?? fallback(id) : fallback(id));
export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly links?: readonly CoreLink[]; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly bench?: readonly { readonly unitId: string; readonly hp: number }[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>>; readonly recipes: Readonly<Record<string, Recipe>>; readonly win?: WinRule; readonly levels?: LevelSetup };
export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
  const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
  if (hostSeed === undefined) throw new Error("play: seed");
  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: { picks: 0, waveUnits: 0 }, hostSeed, engineVersion: "0.0.0", projectHash: "demo", ...(docs.levels === undefined ? {} : { levels: docs.levels }) }, talk: docs.talk };
}
