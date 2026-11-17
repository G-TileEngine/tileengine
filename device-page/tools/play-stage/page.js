import { createDriver,                               } from "../../src/runtime/host/raf-driver.js";
import { createLighting, fitView } from "../../src/runtime/render/index.js";
import { createSceneLink } from "../../src/runtime/scene/world-scene.js";
import { boardBox, fit, TILE } from "./board.js";
import { centreOn, createCam, pan, seatCam, tickCam, zoomAt,              } from "./camera-touch.js";
import { createHud } from "./hud.js";
import { litPlan, picturesOf, sourceOf } from "./looks.js";
import { createMatch } from "./match.js";

const canvas = document.querySelector("#board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
const match = createMatch();
const link = createSceneLink(sourceOf((id) => match.pixels(id))), lighting = createLighting(), pixels = picturesOf((id) => match.pixels(id), link);
const cam          = createCam(1);
let seated = false;
const dpr = ()         => devicePixelRatio || 1;
const band = ()                                                                        => {
  const ratio = dpr(), devW = canvas.clientWidth * ratio, devH = canvas.clientHeight * ratio;
  return { ...fit(devW, devH, match.world.grid.cols, match.world.grid.rows, ratio), devW, devH };
};
const seat = ()       => { const box = band(); if (canvas.clientWidth > 0) { seatCam(cam, box.s, dpr()); seated = true; } };
const env = { requestAnimationFrame: (cb                      ) => requestAnimationFrame(cb), cancelAnimationFrame: (id        ) => cancelAnimationFrame(id), document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return devicePixelRatio; } }           ;
const load = (id        )                           => {
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
  restart: () => location.reload(),
});
const placed = ()                                            => { const box = band(); return { s: cam.s, padX: box.padX, padY: box.padY }; };
const driver = createDriver({
  env, canvas: canvas              , clock: match.world.clock, clear: "#0d1220", load, pixels,
  view: () => {
    if (!seated) seat();
    const box = band(), shown = fitView(box.devW, box.devH, cam.s, TILE, TILE);
    if (match.followId !== null) { const u = match.world.units.get(match.followId); if (u !== undefined) tickCam(cam, 16, u.at, shown); }
    hud.render(match.view());
    return { scene: link.scene(match.scene(), { tMs: match.world.clock.now(), stepMs: match.world.clock.stepMs }), lights: litPlan(lighting, match.looks, link.lit), shake: link.shake, x: cam.x, y: cam.y, s: cam.s };
  },
});
const send = (kind                                   , e              )       => {
  const box = placed(), ratio = dpr();
  const pointer = e.pointerType === "pen" ? "pen" : e.pointerType === "touch" ? "touch" : "mouse";
  match.pointer({ kind, id: e.pointerId, pointer, x: (e.offsetX * ratio - box.padX) / box.s, y: (e.offsetY * ratio - box.padY) / box.s, ms: Math.max(0, Math.round(e.timeStamp)) });
};
const pts = new Map                                  ();
let drag = false, anchor = { x: 0, y: 0 }, lastTap = 0;
const centre = (e              )       => {
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
const place = ()       => { const box = boardBox(innerHeight); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px` }); };
place(); addEventListener("resize", () => { place(); seated = false; });
seat();
driver.start();
