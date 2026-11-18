import type { BattleSetup } from "../../src/rules/battle/battle.ts";
import type { SimInput } from "../../src/sim/types.ts";
import type { CoreTileType } from "../../src/types/core-types.ts";

export const TILE = 16;
export const TEAM = { player: 0x2f6fad, wolves: 0xb23b32, neutral: 0xc6a15a } as const;
export type Recipe = { readonly id: string; readonly name: string; readonly team: keyof typeof TEAM };
const fallback = (id: string): Recipe => ({ id: `starter:unknown-${id}`, name: "Unknown", team: "neutral" });
export const RECIPES: Record<string, Recipe> = {
  knight: { id: "starter:hero-sword", name: "Knight", team: "player" },
  archer: { id: "starter:hero-staff", name: "Archer", team: "player" },
  cleric: { id: "starter:hero-cleric", name: "Cleric", team: "player" },
  crate: { id: "starter:prop-crate", name: "Crate", team: "neutral" },
  merchant: { id: "starter:npc-merchant", name: "Merchant", team: "player" },
  villager: { id: "starter:npc-villager", name: "Villager", team: "neutral" },
  wolf: { id: "starter:enemy-wolf", name: "Wolf", team: "wolves" },
};
export const recipeOf = (id: string): Recipe => (Object.hasOwn(RECIPES, id) ? RECIPES[id] ?? fallback(id) : fallback(id));
export type Looks = { readonly canopy: readonly (readonly [number, number])[]; readonly braziers: readonly (readonly [number, number])[] };
export type PlayDocs = { readonly manifest: unknown; readonly map: unknown; readonly stage: unknown; readonly rules: BattleSetup; readonly hostSeed?: number; readonly talk?: Readonly<Record<string, string>>; readonly effects?: readonly unknown[]; readonly looks?: Looks; readonly chosen?: readonly string[]; readonly tiles?: readonly CoreTileType[]; readonly names?: Readonly<Record<string, string>> };
export function docsToInput(docs: PlayDocs & { readonly talk: Readonly<Record<string, string>>; readonly chosen: readonly string[]; readonly tiles: readonly CoreTileType[] }): { input: SimInput; talk: Readonly<Record<string, string>> } {
  const stage = docs.stage, fromStage = typeof stage === "object" && stage !== null && "seed" in stage && typeof stage.seed === "number" ? stage.seed : undefined, hostSeed = docs.hostSeed ?? fromStage;
  if (hostSeed === undefined) throw new Error("play: seed");
  return { input: { manifest: docs.manifest, map: docs.map, stage: docs.stage, rules: docs.rules, tiles: docs.tiles, chosen: docs.chosen, stageLimits: { picks: 0, waveUnits: 0 }, hostSeed, engineVersion: "0.0.0", projectHash: "demo" }, talk: docs.talk };
}
