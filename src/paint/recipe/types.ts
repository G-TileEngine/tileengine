import type { Notice } from "../../core/notice.ts";

export type PartKind = "rect" | "ellipse" | "capsule" | "blob" | "polygon" | "line" | "strokePath" | "pixelRun";
export type Run = readonly [y: number, x: number, len: number, step: number];
export type Json = Readonly<Record<string, unknown>>;
export type Outline = { readonly on: boolean; readonly px: number; readonly colour: string; readonly sides: "all" | "outer" };
export type Shade = { readonly angle?: number; readonly steps: number; readonly strength: number; readonly highlight: boolean; readonly dither: "none" | "checker" | "bayer4" };
export type Slot = { readonly id: string; readonly ramp: readonly string[]; readonly base: number; readonly team?: boolean };
export type RecipePart = {
  readonly id: string; readonly kind: PartKind; readonly slot: string; readonly z: number; readonly joint: string; readonly mirror: "none" | "x";
  readonly visible: boolean; readonly locked?: boolean; readonly geom?: Readonly<Record<string, number | readonly (readonly [number, number])[] | string>>;
  readonly outline?: Outline; readonly shade?: Shade; readonly runs?: readonly Run[]; readonly promotedFrom?: { readonly runs: readonly Run[] };
};
export type Pose = Readonly<Record<string, { readonly dx: number; readonly dy: number; readonly rot: number }>>;
export type Frame = { readonly ms: number; readonly pose: Pose; readonly parts?: Readonly<Record<string, { readonly visible?: boolean; readonly slot?: string; readonly geom?: Json }>>; readonly runs?: Readonly<Record<string, readonly Run[]>> };
export type Anim = { readonly name: string; readonly loop: boolean; readonly gen?: { readonly kind: "walk"; readonly style: "bob" | "4" | "6"; readonly stride: number; readonly bob: number; readonly arm: number }; readonly frames: readonly Frame[] };
export type Facing = { readonly parts: Readonly<Record<string, { readonly visible?: boolean; readonly z?: number; readonly geom?: Json }>>; readonly pose?: Pose };
export type SpriteRecipe = {
  readonly kind: "sprite-recipe"; readonly formatVersion: number; readonly id: string; readonly rev?: number; readonly name?: string; readonly raster: number;
  readonly size: { readonly w: number; readonly h: number }; readonly light: number; readonly palette: { readonly slots: readonly Slot[] };
  readonly defaults: { readonly outline: Outline; readonly shade: Shade }; readonly parts: readonly RecipePart[];
  readonly skeleton: { readonly joints: readonly { readonly id: string; readonly parent: string | null; readonly at: { readonly x: number; readonly y: number } }[] };
  readonly anims: readonly Anim[]; readonly facings?: { readonly down: Facing; readonly up: Facing; readonly side: Facing; readonly sideMirror: "side" | null };
  readonly variants: readonly { readonly id: string; readonly swap: Readonly<Record<string, readonly string[] | string>> }[];
  readonly code: { readonly lang: "js"; readonly src?: string; readonly out?: readonly unknown[]; readonly outHash?: string } | null;
  readonly history?: { readonly cap: number; readonly baseSeq: number; readonly ops: readonly unknown[] };
};
export type RecipeRead =
  | { readonly ok: true; readonly doc: SpriteRecipe; readonly stored: Json; readonly notices: readonly Notice[]; readonly readOnly: boolean }
  | { readonly ok: false; readonly needsMigration: true; readonly kind: "sprite-recipe"; readonly found: number }
  | { readonly ok: false; readonly needsMigration: false; readonly error: string };
