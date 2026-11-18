import { createDriver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
import { createLighting, fitView } from "../../src/runtime/render/index.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { boardBox, fit, TILE } from "./board.ts";
import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
import { createHud } from "./hud.ts";
import { litPlan, picturesOf, sourceOf } from "./looks.ts";
import { createMatch } from "./match.ts";
import { openBundled } from "./project.ts";
import { createTouch } from "./touch.ts";
import { DEV } from "./dev.ts"; // dev-only

const canvas = document.querySelector("#board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
const opened = openBundled();
if (opened.docs === null) document.body.textContent = opened.error;
else {
const match = createMatch(opened.docs);
const link = createSceneLink(sourceOf((id) => match.pixels(id))), lighting = createLighting(), pixels = picturesOf((id) => match.pixels(id), link);
const cam: PlayCam = createCam(1);
let seated = false;
const dpr = (): number => devicePixelRatio || 1;
const band = (): { s: number; padX: number; padY: number; devW: number; devH: number } => {
  const ratio = dpr(), devW = canvas.clientWidth * ratio, devH = canvas.clientHeight * ratio;
  return { ...fit(devW, devH, match.world.grid.cols, match.world.grid.rows, ratio), devW, devH };
};
const seat = (): void => { const box = band(); if (canvas.clientWidth > 0) { seatCam(cam, box.s, dpr()); seated = true; } };
const env = { requestAnimationFrame: (cb: (ts: number) => void) => requestAnimationFrame(cb), cancelAnimationFrame: (id: number) => cancelAnimationFrame(id), document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return devicePixelRatio; } } as HostEnv;
const load = (id: string): Promise<OffscreenCanvas> => {
  const px = pixels(id);
  if (px === undefined) return Promise.reject(new Error(id));
  const baked = new OffscreenCanvas(px.w, px.h), g = baked.getContext("2d");
  if (g === null) return Promise.reject(new Error(id));
  const image = new ImageData(new Uint8ClampedArray(px.data), px.w, px.h);
  g.putImageData(image, 0, 0);
  return Promise.resolve(baked);
};
const hud = createHud({
  choose: (kind) => match.choose(kind), wait: () => match.wait(), endTurn: () => match.endTurn(), menu: () => undefined,
  restart: () => location.reload(), closeTalk: () => match.closeTalk(), recentre: () => { const at = match.recentreTarget(); if (at === null) return; const b = band(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, at, f, 0, TILE, 0); clamp(cam, f, match.world.grid.cols, match.world.grid.rows); },
});
const driver = createDriver({
  env, canvas: canvas as HostCanvas, clock: match.world.clock, clear: "#0d1220", load, pixels,
  view: () => {
    if (!seated) seat();
    const box = band(), shown = fitView(box.devW, box.devH, cam.s, TILE, TILE);
    if (match.followId !== null) { const u = match.world.units.get(match.followId); if (u !== undefined) tickCam(cam, 16, u.at, shown); }
    hud.render(match.view());
    return { scene: link.scene(match.scene(), { tMs: match.world.clock.now(), stepMs: match.world.clock.stepMs }), lights: litPlan(lighting, match.looks, link.lit), shake: link.shake, x: cam.x, y: cam.y, s: cam.s };
  },
});
const touch = createTouch({ match, cam, box: () => { const ratio = dpr(), rect = canvas.getBoundingClientRect(), raw = canvas.width === 300 && canvas.height === 150, devW = !raw && canvas.width > 0 ? canvas.width : canvas.clientWidth * ratio, devH = !raw && canvas.height > 0 ? canvas.height : canvas.clientHeight * ratio; return { devW, devH, kx: rect.width > 0 && !raw && canvas.width > 0 ? canvas.width / rect.width : ratio, ky: rect.height > 0 && !raw && canvas.height > 0 ? canvas.height / rect.height : ratio, cols: match.world.grid.cols, rows: match.world.grid.rows }; } });
for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType }; if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
const place = (): void => { const box = boardBox(innerHeight); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px` }); };
place(); addEventListener("resize", () => { place(); seated = false; });
seat();
if (DEV) Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud, __fx: match.fx, __link: link }); // dev-only
driver.start();
}
