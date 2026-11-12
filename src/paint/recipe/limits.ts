/** Caller-set caps on everything that drives paint work (SE-01; step-16 `StageLimits` pattern), no defaults. `side` caps `size.w` and `size.h`;
 *  `points` and `runs` cap each list; `frames` caps each anim; `historyBytes` is the UTF-8 length of the stored `history` as JSON. */
export type SpriteRecipeLimits = { readonly side: number; readonly parts: number; readonly points: number; readonly runs: number; readonly joints: number; readonly anims: number; readonly frames: number; readonly variants: number; readonly historyBatches: number; readonly historyBytes: number; readonly totalRuns?: number; readonly totalPoints?: number; readonly totalTweaks?: number; readonly bytes?: number; readonly notices?: number };
export const RECIPE_CAPS = { side: [null, 4096], parts: [null, 1048576], points: [null, 1048576], runs: [null, 1048576], joints: [null, 1048576], anims: [null, 1048576], frames: [null, 1048576], variants: [null, 1048576], historyBatches: [null, 1048576], historyBytes: [null, 16777216], totalRuns: [32768, 1048576], totalPoints: [32768, 1048576], totalTweaks: [32768, 1048576], bytes: [2097152, 16777216], notices: [256, 2147483647] } as const;
type CapKey = keyof typeof RECIPE_CAPS;
export type CheckedRecipeLimits = { readonly [K in CapKey]: number };

export function checkLimits(limits: SpriteRecipeLimits): CheckedRecipeLimits {
  if (typeof limits !== "object" || limits === null) throw new RangeError("readSpriteRecipe: limits must be integers >= 0");
  const out: Record<string, number> = {};
  try {
    for (const key of Object.keys(RECIPE_CAPS) as CapKey[]) {
      const raw = limits[key], n = raw === undefined ? RECIPE_CAPS[key][0] : raw;
      if (typeof n !== "number" || !Number.isInteger(n) || n < 0 || n > RECIPE_CAPS[key][1]) throw new Error("bad");
      out[key] = n;
    }
  } catch { throw new RangeError("readSpriteRecipe: limits must be integers >= 0"); }
  return Object.freeze(out) as CheckedRecipeLimits;
}
