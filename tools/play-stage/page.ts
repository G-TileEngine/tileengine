import { createDriver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
import { createPlay, fit } from "./board.ts";

const canvas = document.querySelector("#board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
const play = createPlay();
const env = { requestAnimationFrame: (cb: (ts: number) => void) => requestAnimationFrame(cb), cancelAnimationFrame: (id: number) => cancelAnimationFrame(id), document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return devicePixelRatio; } } as HostEnv;
const load = (id: string): Promise<OffscreenCanvas> => {
  const px = play.pixels(id);
  if (px === undefined) return Promise.reject(new Error(id));
  const baked = new OffscreenCanvas(px.w, px.h), g = baked.getContext("2d");
  if (g === null) return Promise.reject(new Error(id));
  const image = new ImageData(new Uint8ClampedArray(px.data), px.w, px.h);
  g.putImageData(image, 0, 0);
  return Promise.resolve(baked);
};
const placed = (): { s: number; padX: number; padY: number } => fit(canvas.clientWidth * devicePixelRatio, canvas.clientHeight * devicePixelRatio, play.world.grid.cols, play.world.grid.rows, devicePixelRatio || 1);
const driver = createDriver({
  env, canvas: canvas as HostCanvas, clock: play.world.clock, clear: "#0d1220", load, pixels: (id) => play.pixels(id),
  view: () => ({ scene: play.scene(), x: 0, y: 0, s: placed().s }),
});
const send = (kind: "down" | "move" | "up" | "cancel", e: PointerEvent): void => {
  const box = placed(), dpr = devicePixelRatio || 1;
  const pointer = e.pointerType === "pen" ? "pen" : e.pointerType === "touch" ? "touch" : "mouse";
  play.pointer({ kind, id: e.pointerId, pointer, x: (e.offsetX * dpr - box.padX) / box.s, y: (e.offsetY * dpr - box.padY) / box.s, ms: Math.max(0, Math.round(e.timeStamp)) });
};
canvas.addEventListener("pointerdown", (e) => send("down", e));
canvas.addEventListener("pointermove", (e) => send("move", e));
canvas.addEventListener("pointerup", (e) => send("up", e));
canvas.addEventListener("pointercancel", (e) => send("cancel", e));
Object.assign(window, { __play: play, __driver: driver });
driver.start();
