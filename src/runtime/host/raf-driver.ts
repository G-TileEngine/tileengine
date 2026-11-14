import { type Clock } from "../../core/clock/index.ts";
import { canvas2d, type Canvas2D, type CanvasLike } from "../canvas/canvas2d.ts";
import { backingSize, chunkedList, fitView, needsDraw, present, shakeCam, snapCamera, steadyUi, type FrameStamp, type LightPlan, type Pixels, type RenderScene } from "../render/index.ts";

type Listen = { addEventListener(type: string, fn: () => void): void; removeEventListener(type: string, fn: () => void): void };
type Resized = { readonly devicePixelContentBoxSize?: readonly { readonly inlineSize: number; readonly blockSize: number }[] };
export type HostCanvas = CanvasLike & { readonly clientWidth: number; readonly clientHeight: number };
export type HostEnv = {
  requestAnimationFrame(cb: (ts: number) => void): number;
  cancelAnimationFrame(id: number): void;
  readonly devicePixelRatio: number;
  readonly document: Listen & { readonly visibilityState: string; createElement(tag: "canvas"): CanvasLike };
  readonly OffscreenCanvas?: new (w: number, h: number) => CanvasLike;
  readonly ResizeObserver?: new (cb: (entries: readonly Resized[]) => void) => { observe(target: object, opts?: { box: string }): void; disconnect(): void };
};
export type View = { readonly scene: RenderScene; readonly x: number; readonly y: number; readonly s: number; readonly lights?: LightPlan; readonly shake?: { readonly x: number; readonly y: number } };
export type DriverOptions = {
  readonly env: HostEnv; readonly canvas: HostCanvas; readonly clock: Clock; readonly view: () => View;
  readonly load: (id: string) => Promise<object>;
  readonly clear?: string; readonly buildsPerFrame?: number; readonly budgetBytes?: number;
  readonly capFps?: number;
  readonly stallMs?: number;
  readonly pixels?: (id: string) => Pixels | undefined;
};
export type Driver = { start(): void; touch(): void; catchUp(ms: number): void; dispose(): void; readonly backend: Canvas2D; readonly stats: { frames: number; draws: number; rev: number; failed: number; errors: number } };

export function createDriver(o: DriverOptions): Driver {
  const stall = o.stallMs ?? 100, clear = o.clear ?? "#000000", stats = { frames: 0, draws: 0, rev: 0, failed: 0, errors: 0 };
  const images = new Map<string, object>(), asked = new Set<string>();
  let disposed = false, handle = 0, lastTs: number | null = null, frac = 0, lastDraw = Number.NEGATIVE_INFINITY, live = false, exact: { w: number; h: number } | undefined;
  let scene: RenderScene | null = null, prev: FrameStamp | null = null, due = Infinity, broken = Number.NaN, brokeAt = 0, ro: { disconnect(): void } | undefined, lit: LightPlan | undefined;
  const backend = canvas2d(o.canvas, {
    images(id) {
      const got = images.get(id); if (got !== undefined) return got;
      if (!asked.has(id)) { asked.add(id); o.load(id).then((img) => { if (disposed) return; images.set(id, img); stats.rev += 1; }, () => { if (!disposed) stats.failed += 1; }); }
      return undefined;
    },
    makeCanvas(w, h) { const Off = o.env.OffscreenCanvas; if (Off !== undefined) return new Off(w, h); const el = o.env.document.createElement("canvas"); el.width = w; el.height = h; return el; },
    ...(o.buildsPerFrame === undefined ? {} : { buildsPerFrame: o.buildsPerFrame }),
    ...(o.budgetBytes === undefined ? {} : { budgetBytes: o.budgetBytes }),
    ...(o.pixels === undefined ? {} : { pixels: o.pixels }),
  });
  const onVis = (): void => {
    if (o.env.document.visibilityState === "hidden") { if (handle !== 0) o.env.cancelAnimationFrame(handle); handle = 0; lastTs = null; frac = 0; return; }
    if (live && !disposed && handle === 0) handle = o.env.requestAnimationFrame(frame);
  };
  const Watch = o.env.ResizeObserver;
  if (Watch !== undefined) {
    const apply = (entries: readonly Resized[]): void => { const box = entries[0]?.devicePixelContentBoxSize?.[0]; if (box !== undefined) exact = { w: box.inlineSize, h: box.blockSize }; };
    try { const watch = new Watch(apply); watch.observe(o.canvas, { box: "device-pixel-content-box" }); ro = watch; }
    catch { const watch = new Watch(apply); watch.observe(o.canvas); ro = watch; }
  }
  o.env.document.addEventListener("visibilitychange", onVis);
  function frame(ts: number): void {
    handle = 0; if (disposed) return;
    handle = o.env.requestAnimationFrame(frame); stats.frames += 1;
    if (lastTs === null) lastTs = ts;
    else {
      const span = ts - lastTs + frac, whole = Math.floor(span); frac = span - whole; lastTs = ts;
      if (whole > stall) o.clock.skip(whole); else o.clock.advance(whole > 0 ? whole : 0);
    }
    if (o.capFps !== undefined && ts - lastDraw < 1000 / o.capFps - 2) return;
    let view: View;
    try { if (broken === stats.rev && ts >= brokeAt && ts - brokeAt < 1000) return; view = o.view(); broken = Number.NaN; }
    catch { stats.errors += 1; broken = stats.rev; brokeAt = ts; return; }
    if (view.scene !== scene || view.lights !== lit) { scene = view.scene; lit = view.lights; stats.rev += 1; }
    const current = scene; if (current === null) return;
    const dev = exact === undefined ? backingSize(o.canvas.clientWidth, o.canvas.clientHeight, o.env.devicePixelRatio) : backingSize(o.canvas.clientWidth, o.canvas.clientHeight, o.env.devicePixelRatio, exact);
    const fit = fitView(dev.w, dev.h, view.s, current.tileW, current.tileH), base = snapCamera(view.x, view.y, fit.s);
    const cam = shakeCam(base, (view.shake?.x ?? 0) * fit.s, (view.shake?.y ?? 0) * fit.s, current.cols * current.tileW, current.rows * current.tileH, fit);
    const stamp: FrameStamp = { rev: stats.rev, tMs: o.clock.now(), s: fit.s, devW: fit.devW, devH: fit.devH, camDevX: cam.devX, camDevY: cam.devY };
    if (!needsDraw(prev, due, stamp) && !(backend.busy() && (!backend.stats.missing || backend.stats.capped))) return;
    backend.world(current, stats.rev);
    const list = steadyUi(chunkedList(current, fit, cam, o.clock.now(), o.clock.stepMs), cam.devX - base.devX, cam.devY - base.devY);
    prev = stamp; due = list.dueMs; stats.draws += 1; lastDraw = ts;
    present(backend, fit, list, clear, () => { if (view.lights !== undefined) backend.lights(view.lights, fit, cam); });
  }
  return {
    stats, backend,
    start() { if (disposed) return; live = true; if (handle === 0) handle = o.env.requestAnimationFrame(frame); },
    touch() { stats.rev += 1; },
    catchUp(ms) { o.clock.skip(ms); },
    dispose() {
      if (disposed) return;
      disposed = true; if (handle !== 0) o.env.cancelAnimationFrame(handle); handle = 0;
      o.env.document.removeEventListener("visibilitychange", onVis); ro?.disconnect(); backend.dispose(); images.clear(); asked.clear();
    },
  };
}
