import type { Ctx2D } from "../../../src/runtime/canvas/canvas2d.ts";

export type Raster = { w: number; h: number; px: Uint32Array; throws?: number };
type Snap = { x: number; y: number; w: number; h: number; a: number; d: number; e: number; f: number; op: string; smoothing: boolean; fill: unknown };
const rgba = (c: unknown): number => { const n = Number.parseInt(String(c).slice(1), 16); return (0xff << 24) | (Number.isFinite(n) ? n : 0); };
const mix = (d: number, s: number): number => { const ch = (k: number): number => Math.min(255, ((d >>> k) & 255) + ((s >>> k) & 255)); return (0xff << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0); };

export class FakeCanvas {
  px = new Uint32Array(0); readonly log: { smoothing: boolean; op: string }[] = []; unbalanced = 0;
  private w = 0; private h = 0; private readonly ctx = new Ctx(this); private readonly on: Record<string, (() => void)[]> = {};
  get width(): number { return this.w; }
  set width(v: number) { this.w = v; this.px = new Uint32Array(this.w * this.h); this.ctx.reset(); }
  get height(): number { return this.h; }
  set height(v: number) { this.h = v; this.px = new Uint32Array(this.w * this.h); this.ctx.reset(); }
  getContext(id: "2d"): Ctx | null { return id === "2d" ? this.ctx : null; }
  addEventListener(type: string, fn: () => void): void { (this.on[type] ??= []).push(fn); }
  fire(type: string): void { for (const fn of this.on[type] ?? []) fn(); }
  get state(): { smoothing: boolean; op: string } { return { smoothing: this.ctx.imageSmoothingEnabled, op: this.ctx.globalCompositeOperation }; }
}

class Ctx implements Ctx2D {
  imageSmoothingEnabled = true; globalCompositeOperation = "source-over"; fillStyle: unknown = "#000000";
  private stack: Snap[] = []; private crop = { x: 0, y: 0, w: 0, h: 0 }; private a = 1; private d = 1; private e = 0; private f = 0; private rx = 0; private ry = 0; private rw = 0; private rh = 0;
  private readonly canvas: FakeCanvas;
  constructor(canvas: FakeCanvas) { this.canvas = canvas; }
  reset(): void { this.stack.length = 0; this.imageSmoothingEnabled = true; this.globalCompositeOperation = "source-over"; this.a = 1; this.d = 1; this.e = 0; this.f = 0; this.crop = { x: 0, y: 0, w: this.canvas.width, h: this.canvas.height }; }
  save(): void { this.stack.push({ x: this.crop.x, y: this.crop.y, w: this.crop.w, h: this.crop.h, a: this.a, d: this.d, e: this.e, f: this.f, op: this.globalCompositeOperation, smoothing: this.imageSmoothingEnabled, fill: this.fillStyle }); }
  restore(): void { const s = this.stack.pop(); if (s === undefined) { this.canvas.unbalanced += 1; return; } this.crop = { x: s.x, y: s.y, w: s.w, h: s.h }; this.a = s.a; this.d = s.d; this.e = s.e; this.f = s.f; this.globalCompositeOperation = s.op; this.imageSmoothingEnabled = s.smoothing; this.fillStyle = s.fill; }
  beginPath(): void { this.rw = 0; }
  rect(x: number, y: number, w: number, h: number): void { this.rx = x; this.ry = y; this.rw = w; this.rh = h; }
  clip(): void { const x0 = Math.min(this.a * this.rx + this.e, this.a * (this.rx + this.rw) + this.e), y0 = Math.min(this.d * this.ry + this.f, this.d * (this.ry + this.rh) + this.f), x1 = Math.max(this.a * this.rx + this.e, this.a * (this.rx + this.rw) + this.e), y1 = Math.max(this.d * this.ry + this.f, this.d * (this.ry + this.rh) + this.f), nx = Math.max(this.crop.x, x0), ny = Math.max(this.crop.y, y0); this.crop = { x: nx, y: ny, w: Math.min(this.crop.x + this.crop.w, x1) - nx, h: Math.min(this.crop.y + this.crop.h, y1) - ny }; }
  translate(x: number, y: number): void { this.e += this.a * x; this.f += this.d * y; }
  scale(x: number, y: number): void { this.a *= x; this.d *= y; }
  fillRect(x: number, y: number, w: number, h: number): void { const colour = rgba(this.fillStyle), x0 = Math.floor(Math.min(this.a * x + this.e, this.a * (x + w) + this.e)), x1 = Math.ceil(Math.max(this.a * x + this.e, this.a * (x + w) + this.e)), y0 = Math.floor(Math.min(this.d * y + this.f, this.d * (y + h) + this.f)), y1 = Math.ceil(Math.max(this.d * y + this.f, this.d * (y + h) + this.f)); for (let py = y0; py < y1; py += 1) for (let px = x0; px < x1; px += 1) this.put(px, py, colour, false); }
  drawImage(img: object, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void {
    const src = img as Raster;
    if ((src.throws ?? 0) > 0) { src.throws = (src.throws ?? 0) - 1; throw new Error("draw"); }
    this.canvas.log.push({ smoothing: this.imageSmoothingEnabled, op: this.globalCompositeOperation });
    if (dw === 0 || dh === 0 || sw === 0 || sh === 0) return;
    const lighter = this.globalCompositeOperation === "lighter";
    for (let ly = 0; ly < dh; ly += 1) for (let lx = 0; lx < dw; lx += 1) this.put(Math.floor(Math.min(this.a * (dx + lx) + this.e, this.a * (dx + lx + 1) + this.e)), Math.floor(Math.min(this.d * (dy + ly) + this.f, this.d * (dy + ly + 1) + this.f)), src.px[(sy + Math.min(sh - 1, Math.floor((ly * sh) / dh))) * src.w + sx + Math.min(sw - 1, Math.floor((lx * sw) / dw))] ?? 0, lighter);
  }
  private put(x: number, y: number, sample: number, lighter: boolean): void { if (sample === 0 || x < this.crop.x || y < this.crop.y || x >= this.crop.x + this.crop.w || y >= this.crop.y + this.crop.h || x < 0 || y < 0 || x >= this.canvas.width || y >= this.canvas.height) return; const i = y * this.canvas.width + x; this.canvas.px[i] = lighter ? mix(this.canvas.px[i] ?? 0, sample) : sample; }
}
