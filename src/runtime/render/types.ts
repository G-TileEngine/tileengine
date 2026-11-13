/** Render core types (step 27). Pure data: the renderer reads these and never mutates engine state. */
/** One clip, in the project-format §6.2 AssetMeta `clips[]` shape. */
export type Clip = { readonly name: string; readonly frames: readonly number[]; readonly fps?: number; readonly ms?: readonly number[]; readonly loop?: boolean };
/** AssetMeta `anchor` (§6.2). Absent, or "auto" until slice 30 resolves it, means bottom-centre. */
export type Anchor = { readonly x: number; readonly y: number; readonly units: "px" | "norm" } | "auto";
/** A frame sheet: an asset id plus its grid. `fw`/`fh` are the frame (or tile) size in art px. */
export type Sheet = { readonly id: string; readonly columns: number; readonly fw: number; readonly fh: number; readonly anchor?: Anchor };
export type Fit = { readonly s: number; readonly devW: number; readonly devH: number; readonly artW: number; readonly artH: number; readonly padX: number; readonly padY: number; readonly tilesW: number; readonly tilesH: number };
export type Cam = { readonly x: number; readonly y: number; readonly devX: number; readonly devY: number };
/** Fixed bands, drawn in this order. `fxGround` sits on the ground; `flash` sits over the glow. "wash" holds the night wash and stage dim (slice 31). */
export const BANDS = ["base", "fxGround", "wash", "fxAir", "glow", "flash", "ui"] as const;
export type Band = (typeof BANDS)[number];
export type DrawOp = "normal" | "add";
export type DrawCmd = { readonly band: Band; readonly sheet: string; readonly sx: number; readonly sy: number; readonly sw: number; readonly sh: number; readonly dx: number; readonly dy: number; readonly dw: number; readonly dh: number; readonly op: DrawOp; readonly flipX: boolean };
/** A tile layer. `anims` is `tileProps.anim` resolved to clips: tile index → clip. Tiles share one offsetMs. */
export type TileLayer = { readonly sheet: Sheet; readonly tiles: readonly (number | null)[]; readonly anims?: Readonly<Record<number, Clip>> };
/** A unit, prop, or effect anchored on a unit. `ox`/`oy` move the drawing, never the sort. `flipX` comes from the clip fallback (slice 30, `noMirror`). */
export type Standing = { readonly kind: "object" | "unit" | "fxBehind" | "fxFront"; readonly sheet: Sheet; readonly c: number; readonly r: number; readonly dx?: number; readonly dy?: number; readonly ox?: number; readonly oy?: number; readonly z?: number; readonly frame?: number; readonly clip?: Clip; readonly flipX?: boolean; readonly faceSwap?: boolean; readonly key?: string };
/** Anything drawn above the world: wash, effect air, glow or UI. `x`/`y` are top-left in world art px. */
export type Overlay = { readonly band: Exclude<Band, "base">; readonly sheet: Sheet; readonly x: number; readonly y: number; readonly frame?: number; readonly clip?: Clip; readonly startMs?: number; readonly op?: DrawOp };
export type RenderScene = { readonly cols: number; readonly rows: number; readonly tileW: number; readonly tileH: number; readonly mapSeed: number; readonly ground: readonly TileLayer[]; readonly above: readonly TileLayer[]; readonly standing: readonly Standing[]; readonly overlays: readonly Overlay[] };
export type DrawList = { readonly cmds: readonly DrawCmd[]; readonly dueMs: number };
/** The draw adapter (ARCH §12.4). Canvas2D (step 28) and WebGL2 (later) implement it; the test backend lives in tests/. */
export interface Renderer {
  beginFrame(fit: Fit, clear: string): void;
  drawImage(sheet: string, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, op: DrawOp, flipX: boolean): void;
  fillRect(x: number, y: number, w: number, h: number, colour: string): void;
  endFrame(): void;
}
/** What the last drawn frame depended on. `rev` is the host's world/project revision. */
export type FrameStamp = { readonly rev: number; readonly tMs: number; readonly s: number; readonly devW: number; readonly devH: number; readonly camDevX: number; readonly camDevY: number };
