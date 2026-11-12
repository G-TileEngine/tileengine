import type { SpriteRecipeLimits } from "../../paint/recipe/index.ts";

/** BTF sprite recipe caps (CEO 2026-11-12, docs/sprite-recipe-architecture.md §1.1): what one BTF recipe may hold before the excess is warned and not drawn. */
export const BTF_SPRITE_RECIPE_LIMITS: SpriteRecipeLimits = { side: 256, parts: 256, points: 256, runs: 16384, joints: 64, anims: 32, frames: 64, variants: 32, historyBatches: 2000, historyBytes: 1000000 };
