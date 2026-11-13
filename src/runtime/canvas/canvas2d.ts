import { CHUNK, isStatic, type DrawOp, type Fit, type RenderScene, type Renderer, type Sheet, type TileLayer } from "../render/index.ts";

export type Ctx2D = {
  imageSmoothingEnabled: boolean; globalCompositeOperation: string; fillStyle: unknown;
  save(): void; restore(): void; beginPath(): void; rect(x: number, y: number, w: number, h: number): void; clip(): void;
  fillRect(x: number, y: number, w: number, h: number): void; translate(x: number, y: number): void; scale(x: number, y: number): void;
  drawImage(img: object, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
};
export type CanvasLike = { width: number; height: number; getContext(id: "2d"): Ctx2D | null; addEventListener?(type: string, fn: () => void): void };
export type Canvas2DOptions = { readonly images: (id: string) => object | undefined; readonly makeCanvas: (w: number, h: number) => CanvasLike; readonly buildsPerFrame?: number; readonly budgetBytes?: number };
export type Canvas2D = Renderer & { world(scene: RenderScene, rev: number): void; busy(): boolean; readonly stats: { builds: number; bytes: number; lost: boolean } };
type Entry = { id: string; canvas: CanvasLike; sig: string; img: object | undefined; frame: number; bytes: number; stale: boolean };
type Box = { layer: TileLayer; c0: number; r0: number; cw: number; ch: number };

export function canvas2d(canvas: CanvasLike, opts: Canvas2DOptions): Canvas2D {
  const ctx = canvas.getContext("2d");
  if (ctx === null) throw new Error("canvas2d: no 2d context");
  const budget = opts.budgetBytes ?? 32 * 2 ** 20, limit = opts.buildsPerFrame ?? 2, stats = { builds: 0, bytes: 0, lost: false }, lru: Entry[] = [];
  let scene: RenderScene | null = null, rev = Number.NaN, frame = 0, built = 0, open = false, lost = false, missing = false, capped = false, hold = false;
  const tileAt = (layer: TileLayer, c: number, r: number): number | null | undefined => layer.tiles[r * (scene?.cols ?? 0) + c];
  const sigOf = (layer: TileLayer, c0: number, r0: number, cw: number, ch: number): string => {
    let sig = `${layer.sheet.id}/${layer.sheet.columns}`;
    for (let r = r0; r < r0 + ch; r += 1) for (let c = c0; c < c0 + cw; c += 1) { const tile = tileAt(layer, c, r); sig += isStatic(layer, tile) ? `:${tile}` : ":."; }
    return sig;
  };
  const boxOf = (id: string): Box | null => {
    const hit = /^chunk:([ag])(\d+):(\d+),(\d+)$/.exec(id);
    const layer = hit === null || scene === null ? undefined : (hit[1] === "a" ? scene.above : scene.ground)[Number(hit[2] ?? 0)];
    if (hit === null || scene === null || layer === undefined) return null;
    const c0 = Number(hit[3]) * CHUNK, r0 = Number(hit[4]) * CHUNK;
    return c0 >= scene.cols || r0 >= scene.rows ? null : { layer, c0, r0, cw: Math.min(CHUNK, scene.cols - c0), ch: Math.min(CHUNK, scene.rows - r0) };
  };
  const drop = (entry: Entry): void => { const at = lru.indexOf(entry); if (at >= 0) lru.splice(at, 1); stats.bytes -= entry.bytes; entry.canvas.width = 0; entry.canvas.height = 0; };
  const touch = (entry: Entry): void => { const at = lru.indexOf(entry); if (at >= 0) lru.splice(at, 1); lru.push(entry); entry.frame = frame; };
  const tileBlit = (onto: Ctx2D, img: object, sheet: Sheet, tile: number, dx: number, dy: number, dw: number, dh: number): void => {
    const cols = Math.max(1, sheet.columns);
    onto.drawImage(img, (tile % cols) * sheet.fw, Math.floor(tile / cols) * sheet.fh, sheet.fw, sheet.fh, dx, dy, dw, dh);
  };
  const paint = (img: object, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number, op: DrawOp, flipX: boolean): void => {
    const add = op === "add";
    if (add) ctx.globalCompositeOperation = "lighter";
    try {
      if (!flipX) ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      else { ctx.save(); try { ctx.translate(dx + dw, dy); ctx.scale(-1, 1); ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh); } finally { ctx.restore(); } }
    } finally { if (add) ctx.globalCompositeOperation = "source-over"; }
  };
  const eachStatic = (box: Box, draw: (tile: number, c: number, r: number) => void): void => {
    for (let r = box.r0; r < box.r0 + box.ch; r += 1) for (let c = box.c0; c < box.c0 + box.cw; c += 1) { const tile = tileAt(box.layer, c, r); if (isStatic(box.layer, tile)) draw(tile, c, r); }
  };
  const bake = (id: string, box: Box): Entry | null => {
    const img = opts.images(box.layer.sheet.id), map = scene;
    if (img === undefined || map === null) { missing = true; return null; }
    const w = box.cw * map.tileW, h = box.ch * map.tileH, made = opts.makeCanvas(w, h), bctx = made.getContext("2d");
    if (bctx === null) { missing = true; return null; }
    bctx.imageSmoothingEnabled = false;
    eachStatic(box, (tile, c, r) => tileBlit(bctx, img, box.layer.sheet, tile, (c - box.c0) * map.tileW, (r - box.r0) * map.tileH, box.layer.sheet.fw, box.layer.sheet.fh));
    const entry: Entry = { id, canvas: made, sig: sigOf(box.layer, box.c0, box.r0, box.cw, box.ch), img, frame, bytes: w * h * 4, stale: false };
    stats.builds += 1; stats.bytes += entry.bytes; built += 1; lru.push(entry);
    return entry;
  };
  canvas.addEventListener?.("contextlost", () => { lost = true; stats.lost = true; });
  canvas.addEventListener?.("contextrestored", () => { lost = false; stats.lost = false; hold = true; for (const entry of [...lru]) drop(entry); });
  return {
    stats,
    world(next, nextRev) {
      scene = next;
      if (nextRev === rev) return;
      rev = nextRev;
      for (const entry of [...lru]) {
        const box = boxOf(entry.id);
        if (box === null) { drop(entry); continue; }
        if (entry.sig !== sigOf(box.layer, box.c0, box.r0, box.cw, box.ch) || opts.images(box.layer.sheet.id) !== entry.img) entry.stale = true;
      }
    },
    busy: () => hold || missing || capped,
    beginFrame(fit: Fit, clear: string) {
      frame += 1; built = 0; missing = false; capped = false;
      if (open) { ctx.restore(); open = false; }
      if (lost) return;
      if (canvas.width !== fit.devW) canvas.width = fit.devW;
      if (canvas.height !== fit.devH) canvas.height = fit.devH;
      ctx.imageSmoothingEnabled = false; ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = clear; ctx.fillRect(0, 0, fit.devW, fit.devH);
      ctx.save(); open = true; ctx.beginPath(); ctx.rect(fit.padX, fit.padY, fit.artW * fit.s, fit.artH * fit.s); ctx.clip();
    },
    drawImage(id, sx, sy, sw, sh, dx, dy, dw, dh, op, flipX) {
      if (lost) return;
      if (!id.startsWith("chunk:")) {
        const img = opts.images(id);
        if (img === undefined) missing = true; else paint(img, sx, sy, sw, sh, dx, dy, dw, dh, op, flipX);
        return;
      }
      const box = boxOf(id), map = scene;
      if (box === null || map === null) { missing = true; return; }
      const hit = lru.find((entry) => entry.id === id);
      if (hit !== undefined && !hit.stale) { touch(hit); paint(hit.canvas, sx, sy, sw, sh, dx, dy, dw, dh, op, flipX); return; }
      if (built < limit) { if (hit !== undefined) drop(hit); const made = bake(id, box); if (made !== null) paint(made.canvas, sx, sy, sw, sh, dx, dy, dw, dh, op, flipX); return; }
      capped = true;
      const img = opts.images(box.layer.sheet.id), scaleX = dw / (box.cw * map.tileW || 1), scaleY = dh / (box.ch * map.tileH || 1);
      if (img === undefined) { missing = true; return; }
      eachStatic(box, (tile, c, r) => tileBlit(ctx, img, box.layer.sheet, tile, dx + (c - box.c0) * map.tileW * scaleX, dy + (r - box.r0) * map.tileH * scaleY, box.layer.sheet.fw * scaleX, box.layer.sheet.fh * scaleY));
    },
    fillRect(x, y, w, h, colour) { if (lost) return; ctx.fillStyle = colour; ctx.fillRect(x, y, w, h); },
    endFrame() {
      if (open) { ctx.restore(); open = false; }
      if (!lost) while (stats.bytes > budget) { const oldest = lru[0]; if (oldest === undefined || oldest.frame === frame) break; drop(oldest); }
      if (!lost && !missing && !capped) hold = false;
    },
  };
}
