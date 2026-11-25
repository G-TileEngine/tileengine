import { fits, readPicture } from "./picture.ts";
export type BackLayer = { readonly assetId: string; readonly file: string; readonly depth: number; readonly repeat: "none" | "x" | "y" | "both" };
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
/** Look data only. `fit` is ignored (cover/stretch read as none). No ext skips the layer. Depth clamps to 0..1; absent or not finite is 1. */
export function backdropOf(project: unknown, map: unknown): BackLayer[] {
  const root = isObj(project) ? project : {}, inner = isObj(root["project"]) ? root["project"] : root, assets = isObj(inner["assets"]) ? inner["assets"] : isObj(root["assets"]) ? root["assets"] : {};
  const bg = isObj(map) && isObj(map["background"]) ? map["background"] : {}, layers = Array.isArray(bg["layers"]) ? bg["layers"] : [], out: BackLayer[] = [];
  for (const layer of layers) {
    if (!isObj(layer) || typeof layer["assetId"] !== "string") continue;
    const meta = assets[layer["assetId"]]; if (!isObj(meta) || typeof meta["ext"] !== "string") continue;
    const raw = layer["depth"], depth = typeof raw === "number" && Number.isFinite(raw) ? Math.min(1, Math.max(0, raw)) : 1, rep = layer["repeat"];
    out.push({ assetId: layer["assetId"], file: `assets/${layer["assetId"]}.${meta["ext"]}`, depth, repeat: rep === "x" || rep === "y" || rep === "both" || rep === "none" ? rep : "none" });
  }
  return out;
}
export type Bitmap = { readonly width: number; readonly height: number; close(): void };
export type Loaded = { readonly miss: string | null; readonly row: { readonly sheet: { readonly id: string; readonly columns: number; readonly fw: number; readonly fh: number }; readonly depth: number; readonly repeat: BackLayer["repeat"] } | null };
const missed = (file: string): Loaded => ({ miss: `Background picture missing: ${file}`, row: null });
const bad = (file: string): Loaded => ({ miss: `Background picture ${file} couldn't be opened`, row: null });
export async function loadLayer(layer: BackLayer, art: ((file: string) => Promise<Blob | null>) | undefined, open: (blob: Blob) => Promise<Bitmap>, keep: (bmp: Bitmap) => void): Promise<Loaded> {
  const file = layer.file;
  if (art === undefined) return missed(file);
  let bmp: Bitmap | null = null;
  try {
    const blob = await art(file); if (blob === null) return missed(file);
    const pic = readPicture(new Uint8Array(await blob.arrayBuffer())); if (!pic.ok) return bad(file);
    if (!fits(pic.w, pic.h)) return { miss: `Background picture ${file} is too big to open (${pic.w} × ${pic.h} px)`, row: null };
    bmp = await open(blob); const fw = bmp.width, fh = bmp.height; keep(bmp);
    return { miss: null, row: { sheet: { id: layer.assetId, columns: 1, fw, fh }, depth: layer.depth, repeat: layer.repeat } };
  } catch { return bad(file); } finally { bmp?.close(); }
}
