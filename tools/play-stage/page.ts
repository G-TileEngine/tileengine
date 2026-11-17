import { createDriver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
import { fitView } from "../../src/runtime/render/index.ts";
import { fit, TILE } from "./board.ts";
import { centreOn, createCam, pan, seatCam, tickCam, zoomAt, type PlayCam } from "./camera-touch.ts";
import { createHud } from "./hud.ts";
import { createMatch } from "./match.ts";

const canvas = document.querySelector("#board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
const match = createMatch();
const cam: PlayCam = createCam(1);
let seated = false;
const dpr = (): number => devicePixelRatio || 1;
const band = (): { s: number; padX: number; padY: number; devW: number; devH: number } => {
  const ratio = dpr(), cssH = Math.max(TILE, canvas.clientHeight - 176), devW = canvas.clientWidth * ratio, devH = cssH * ratio;
  return { ...fit(devW, devH, match.world.grid.cols, match.world.grid.rows, ratio), devW, devH };
};
const seat = (): void => { const box = band(); if (canvas.clientWidth > 0) { seatCam(cam, box.s, dpr()); seated = true; } };
const env = { requestAnimationFrame: (cb: (ts: number) => void) => requestAnimationFrame(cb), cancelAnimationFrame: (id: number) => cancelAnimationFrame(id), document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return devicePixelRatio; } } as HostEnv;
const load = (id: string): Promise<OffscreenCanvas> => {
  const px = match.pixels(id);
  if (px === undefined) return Promise.reject(new Error(id));
  const baked = new OffscreenCanvas(px.w, px.h), g = baked.getContext("2d");
  if (g === null) return Promise.reject(new Error(id));
  const image = new ImageData(new Uint8ClampedArray(px.data), px.w, px.h);
  g.putImageData(image, 0, 0);
  return Promise.resolve(baked);
};
const hud = createHud({
  choose: (kind) => match.choose(kind), wait: () => match.wait(), endTurn: () => match.endTurn(), menu: () => undefined,
  restart: () => location.reload(),
});
const placed = (): { s: number; padX: number; padY: number } => { const box = band(); return { s: cam.s, padX: box.padX, padY: box.padY }; };
const driver = createDriver({
  env, canvas: canvas as HostCanvas, clock: match.world.clock, clear: "#0d1220", load, pixels: (id) => match.pixels(id),
  view: () => {
    if (!seated) seat();
    const box = band(), shown = fitView(box.devW, box.devH, cam.s, TILE, TILE);
    if (match.followId !== null) { const u = match.world.units.get(match.followId); if (u !== undefined) tickCam(cam, 16, u.at, shown); }
    hud.render(match.view());
    return { scene: match.scene(), x: cam.x, y: cam.y, s: cam.s };
  },
});
const send = (kind: "down" | "move" | "up" | "cancel", e: PointerEvent): void => {
  const box = placed(), ratio = dpr();
  const pointer = e.pointerType === "pen" ? "pen" : e.pointerType === "touch" ? "touch" : "mouse";
  match.pointer({ kind, id: e.pointerId, pointer, x: (e.offsetX * ratio - box.padX) / box.s, y: (e.offsetY * ratio - box.padY) / box.s, ms: Math.max(0, Math.round(e.timeStamp)) });
};
const pts = new Map<number, { x: number; y: number }>();
let drag = false, anchor = { x: 0, y: 0 }, lastTap = 0;
const centre = (e: PointerEvent): void => {
  const box = band(), ratio = dpr(), x = (e.offsetX * ratio - box.padX) / cam.s, y = (e.offsetY * ratio - box.padY) / cam.s;
  const unit = match.world.units.all().find((u) => u.alive && u.at.c === Math.floor(x / TILE) && u.at.r === Math.floor(y / TILE));
  if (unit !== undefined) { centreOn(cam, unit.at, fitView(box.devW, box.devH, cam.s, TILE, TILE), 0, TILE, 0); match.followId = unit.id; }
};
canvas.addEventListener("pointerdown", (e) => { pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); drag = false; anchor = { x: e.clientX, y: e.clientY }; if (pts.size === 1) send("down", e); });
canvas.addEventListener("pointermove", (e) => {
  const prev = pts.get(e.pointerId); if (prev === undefined) return;
  if (pts.size >= 2) {
    const before = [...pts.values()]; pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); const after = [...pts.values()];
    const a = before[0], b = before[1], c = after[0], d = after[1];
    if (a !== undefined && b !== undefined && c !== undefined && d !== undefined) { const was = Math.hypot(a.x - b.x, a.y - b.y) || 1, now = Math.hypot(c.x - d.x, c.y - d.y) || 1, box = band(); zoomAt(cam, cam.s * (now / was), box.devW, box.devH, match.world.grid.cols * TILE, match.world.grid.rows * TILE, e.offsetX * dpr(), e.offsetY * dpr(), dpr()); }
    return;
  }
  const dx = e.clientX - prev.x, dy = e.clientY - prev.y; pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (!drag && Math.hypot(e.clientX - anchor.x, e.clientY - anchor.y) > 8) { drag = true; send("cancel", e); }
  if (drag) pan(cam, -dx, -dy); else send("move", e);
});
canvas.addEventListener("pointerup", (e) => { pts.delete(e.pointerId); if (!drag && e.timeStamp - lastTap < 280) { lastTap = 0; centre(e); } else if (!drag) { lastTap = e.timeStamp; send("up", e); } drag = false; });
canvas.addEventListener("pointercancel", (e) => { pts.delete(e.pointerId); send("cancel", e); });
seat();
Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud });
driver.start();
