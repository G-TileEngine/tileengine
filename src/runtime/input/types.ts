import type { Sq } from "../../types/core-types.ts";

/** M7: what the player means, never raw DOM. Tap-tap and drag-to-target give the same intents. */
export type Intent =
  | { readonly type: "SelectUnit"; readonly unitId: string }
  | { readonly type: "TargetCell"; readonly at: Sq }
  | { readonly type: "Confirm" }
  | { readonly type: "Cancel" }
  | { readonly type: "BoxSelect"; readonly from: Sq; readonly to: Sq };

/** Plain pointer data from the host (touch first). x, y: px from the grid's top-left; ms: integer host ms. */
export type PointerSample = {
  readonly kind: "down" | "move" | "up" | "cancel";
  readonly id: number;
  readonly pointer: "touch" | "pen" | "mouse";
  readonly x: number;
  readonly y: number;
  readonly ms: number;
};

/** Every threshold is the caller's (project or user setting); src has no defaults. */
export type GestureOptions = {
  readonly cellPx: number;
  readonly tapMaxPx: number;
  readonly holdMs: number;
};

export type GestureBoard = { readonly cols: number; readonly rows: number; unitAt(at: Sq): string | undefined };
export type GestureMapper = (sample: PointerSample) => readonly Intent[];
