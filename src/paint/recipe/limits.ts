/** Caller-set caps on everything that drives paint work (SE-01; step-16 `StageLimits` pattern), no defaults. `side` caps `size.w` and `size.h`;
 *  `points` and `runs` cap each list; `frames` caps each anim; `historyBytes` is the UTF-8 length of the stored `history` as JSON. */
export type SpriteRecipeLimits = { readonly side: number; readonly parts: number; readonly points: number; readonly runs: number; readonly joints: number; readonly anims: number; readonly frames: number; readonly variants: number; readonly historyBatches: number; readonly historyBytes: number };

const KEYS = ["side", "parts", "points", "runs", "joints", "anims", "frames", "variants", "historyBatches", "historyBytes"] as const;

export function checkLimits(limits: SpriteRecipeLimits): void {
  const badLim = typeof limits !== "object" || limits === null || KEYS.some((key) => { const v = limits[key]; return typeof v !== "number" || !Number.isInteger(v) || v < 0; });
  if (badLim) throw new RangeError("readSpriteRecipe: limits must be integers >= 0");
}
