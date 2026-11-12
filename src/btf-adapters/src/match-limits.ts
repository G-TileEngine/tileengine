import { DEFAULT_MATCH_LIMITS, type MatchLimits } from "../../core/limits.ts";

/** BTF's own object, equal to the engine defaults today, so BTF can change its numbers without core. */
export const BTF_MATCH_LIMITS: MatchLimits = Object.freeze({ ...DEFAULT_MATCH_LIMITS });
