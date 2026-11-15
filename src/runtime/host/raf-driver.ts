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
  readonly imagesMax?: number; // a6 (s34): loaded or asked ids kept (default 256); never drops one drawn this frame or named by the scene
};
export type Driver = { start(): void; touch(): void; catchUp(ms: number): void; dispose(): void; lite(mode: "auto" | "on" | "off"): void; readonly backend: Canvas2D; readonly stats: { frames: number; draws: number; rev: number; failed: number; errors: number; lite: boolean } };
const LITE = { frames: 60, onMs: 25, offMs: 18, holdMs: 10_000, holdMaxMs: 300_000, gapMs: 1000 } as const;

export function createDriver(o: DriverOptions): Driver {
  const stall = o.stallMs ?? 100, clear = o.clear ?? "#000000", max = o.imagesMax ?? 256, stats = { frames: 0, draws: 0, rev: 0, failed: 0, errors: 0, lite: false };
  const images = new Map<string, object>(), asked = new Set<string>(), recent = new Map<string, number>(), flight = new Map<string, { ok: boolean }>();
  const slot = [new Float64Array(LITE.frames), new Float64Array(LITE.frames)];
  let disposed = false, handle = 0, lastTs: number | null = null, frac = 0, lastDraw = Number.NEGATIVE_INFINITY, live = false, exact: { w: number; h: number } | undefined;
  let scene: RenderScene | null = null, prev: FrameStamp | null = null, due = Infinity, broken = Number.NaN, brokeAt = 0, ro: { disconnect(): void } | undefined, lit: LightPlan | undefined;
  let tick = 0, fillN = 0, which = 0, prevP = 0, have = false, heldMs = 0, hold: number = LITE.holdMs, auto = false, mode: "auto" | "on" | "off" = "auto";
  const show = (next: boolean): void => { if (stats.lite !== next) { stats.lite = next; prev = null; } };
  const evict = (): void => { const keep = new Set<string>(); for (const [id, at] of recent) if (at === tick) keep.add(id); const cur = scene; if (cur !== null) { for (const layer of cur.ground) keep.add(layer.sheet.id); for (const layer of cur.above) keep.add(layer.sheet.id); for (const st of cur.standing) keep.add(st.sheet.id); for (const ov of cur.overlays) keep.add(ov.sheet.id); } while (asked.size > max) { let old = "", age = Infinity; for (const id of asked) { if (keep.has(id)) continue; const at = recent.get(id) ?? 0; if (at < age) { age = at; old = id; } } if (old === "") break; const mark = flight.get(old); if (mark !== undefined) mark.ok = false; flight.delete(old); asked.delete(old); images.delete(old); recent.delete(old); } };
  const watch = (gap: number): void => {
    if (!(gap > 0) || gap > LITE.gapMs) return; const buf = slot[which]; if (buf === undefined) return; buf[fillN] = gap; if (++fillN < LITE.frames) return; const p = Array.from(buf).sort((a, b) => a - b)[Math.ceil(0.95 * LITE.frames) - 1] ?? 0; let sum = 0; for (let i = 0; i < LITE.frames; i += 1) sum += buf[i] ?? 0; fillN = 0; which ^= 1;
    if (auto) { heldMs += sum; if (p < LITE.offMs && heldMs >= hold) { auto = false; hold = Math.min(hold * 2, LITE.holdMaxMs); heldMs = 0; have = false; if (mode === "auto") show(false); } } else if (have && p > LITE.onMs && prevP > LITE.onMs) { auto = true; heldMs = 0; have = false; if (mode === "auto") show(true); } else { have = true; prevP = p; }
  };
  const backend = canvas2d(o.canvas, {
    images(id) {
      recent.set(id, tick); const got = images.get(id); if (got !== undefined) return got;
      if (!asked.has(id)) { asked.add(id); const mark = { ok: true }; flight.set(id, mark); o.load(id).then((img) => { if (disposed || !mark.ok || !asked.has(id)) return; flight.delete(id); images.set(id, img); stats.rev += 1; }, () => { if (!disposed && mark.ok && asked.has(id)) stats.failed += 1; flight.delete(id); }); }
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
      const gap = ts - lastTs, span = gap + frac, whole = Math.floor(span); frac = span - whole; lastTs = ts;
      if (whole > stall) o.clock.skip(whole); else o.clock.advance(whole > 0 ? whole : 0); watch(gap);
    }
    if (o.capFps !== undefined && ts - lastDraw < 1000 / o.capFps - 2) return;
    tick += 1;
    let view: View;
    try { if (broken === stats.rev && ts >= brokeAt && ts - brokeAt < 1000) return; view = o.view(); broken = Number.NaN; }
    catch { stats.errors += 1; broken = stats.rev; brokeAt = ts; return; }
    if (view.scene !== scene || view.lights !== lit) { scene = view.scene; lit = view.lights; stats.rev += 1; }
    evict();
    const current = scene; if (current === null) return;
    const dev = exact === undefined ? backingSize(o.canvas.clientWidth, o.canvas.clientHeight, o.env.devicePixelRatio) : backingSize(o.canvas.clientWidth, o.canvas.clientHeight, o.env.devicePixelRatio, exact);
    const fit = fitView(dev.w, dev.h, view.s, current.tileW, current.tileH), base = snapCamera(view.x, view.y, fit.s);
    const cam = shakeCam(base, (view.shake?.x ?? 0) * fit.s, (view.shake?.y ?? 0) * fit.s, current.cols * current.tileW, current.rows * current.tileH, fit);
    const stamp: FrameStamp = { rev: stats.rev, tMs: o.clock.now(), s: fit.s, devW: fit.devW, devH: fit.devH, camDevX: cam.devX, camDevY: cam.devY };
    if (!needsDraw(prev, due, stamp) && !(backend.busy() && (!backend.stats.missing || backend.stats.capped))) return;
    backend.world(current, stats.rev);
    const list = steadyUi(chunkedList(current, fit, cam, o.clock.now(), o.clock.stepMs), cam.devX - base.devX, cam.devY - base.devY);
    prev = stamp; due = list.dueMs; stats.draws += 1; lastDraw = ts;
    present(backend, fit, list, clear, view.lights === undefined ? undefined : () => { if (view.lights !== undefined) backend.lights(view.lights, fit, cam); });
    evict();
  }
  return {
    stats, backend,
    start() { if (disposed) return; live = true; if (handle === 0) handle = o.env.requestAnimationFrame(frame); },
    touch() { stats.rev += 1; },
    catchUp(ms) { o.clock.skip(ms); },
    lite(next) { mode = next; show(next === "on" || (next === "auto" && auto)); },
    dispose() {
      if (disposed) return;
      disposed = true; if (handle !== 0) o.env.cancelAnimationFrame(handle); handle = 0;
      o.env.document.removeEventListener("visibilitychange", onVis); ro?.disconnect(); backend.dispose(); images.clear(); asked.clear(); recent.clear(); flight.clear();
    },
  };
}
