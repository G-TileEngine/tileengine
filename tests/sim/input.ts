import { readFileSync } from "node:fs";
import type { Action } from "../../src/core/log/index.ts";
import type { SimInput } from "../../src/sim/index.ts";

const load = (name: string): unknown => JSON.parse(readFileSync(new URL(`../fixtures/project/${name}.json`, import.meta.url), "utf8"));
const manifest = { kind: "tile-project", formatVersion: 6, project: { id: "p", rev: 1, catalogueRev: 1, settings: { wrapEdges: false }, stages: ["a"], rules: [], loadout: { roster: ["knight"], size: 1, required: [] } } };
const tiles = [{ id: "floor", open: true, push_can_enter: true }, { id: "wall-block", open: false, push_can_enter: false }];

export function input(stage: "stage-fixed" | "stage-weighted", hostSeed = 7): SimInput {
  return { manifest, map: load(stage === "stage-fixed" ? "map-6x9" : "map-12x12"), stage: load(stage), tiles, chosen: ["knight", "archer"], hostSeed, engineVersion: "0.0.0", projectHash: "test" };
}
export function move(id: string, actor: string, c: number, r: number, durationMs: number | null = 200): Action {
  return { id, kind: "move", actor, target: { pipe: "tile", at: { c, r } }, durationMs, turns: null, effects: [] };
}
