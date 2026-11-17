import type { Notice } from "../../core/notice.ts";

export const INTERACT_REFUSED_REASONS = Object.freeze(["unknownActor", "deadActor", "notUnitAim", "aimMissed", "selfTarget", "deadTarget", "notAdjacent", "foeTarget"] as const);
export type InteractRefusedReason = (typeof INTERACT_REFUSED_REASONS)[number];
export type InteractRefused = Notice & { readonly code: "interactRefused"; readonly reason: InteractRefusedReason };
export const interactRefused = (reason: InteractRefusedReason): InteractRefused => ({ code: "interactRefused", message: `interact refused (${reason})`, reason });
