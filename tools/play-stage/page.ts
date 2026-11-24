import { createDriver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
import { createLighting, fitView } from "../../src/runtime/render/index.ts";
import { createSceneLink } from "../../src/runtime/scene/world-scene.ts";
import { inOrthogonalReach } from "../../src/rules/battle/range.ts";
import type { LinkEvent } from "../../src/rules/session/links.ts";
import type { SessionParty } from "../../src/types/core-types.ts";
import { boardBox, fit, TILE } from "./board.ts";
import { centreOn, clamp, createCam, seatCam, tickCam, type PlayCam } from "./camera-touch.ts";
import { createHud, XP_H } from "./hud.ts";
import { litPlan, picturesOf, sourceOf } from "./looks.ts";
import { createMatch, DEFAULT_SPELL_REACH } from "./match.ts";
import { openBundled } from "./project.ts";
import { createTouch } from "./touch.ts";
import { DEV } from "./dev.ts"; // dev-only

export type StartAim = { readonly unitId?: string; readonly abilityId?: string; readonly aim?: "basic" | "spell" };
export function startMatch(docs: NonNullable<ReturnType<typeof openBundled>["docs"]>, back?: () => void, aim?: StartAim, travel?: (link: LinkEvent, party: SessionParty) => void): void {
const canvas = document.querySelector("#board");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("play: #board");
const match = createMatch(docs);
const link = createSceneLink(sourceOf((id) => match.pixels(id))), lighting = createLighting(), pixels = picturesOf((id) => match.pixels(id), link);
const sheets = new Map<string, OffscreenCanvas>(), misses: string[] = [];
type BackSheet = { readonly sheet: { readonly id: string; readonly columns: number; readonly fw: number; readonly fh: number }; readonly depth: number; readonly repeat: "none" | "x" | "y" | "both" };
let painted: BackSheet[] | null = null, held: { src: object; list: BackSheet[] | null; scene: ReturnType<typeof link.scene> } | null = null;
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
  const ready = sheets.get(id); if (ready !== undefined) return Promise.resolve(ready);
  const px = pixels(id);
  if (px === undefined) return Promise.reject(new Error(id));
  const baked = new OffscreenCanvas(px.w, px.h), g = baked.getContext("2d");
  if (g === null) return Promise.reject(new Error(id));
  const image = new ImageData(new Uint8ClampedArray(px.data), px.w, px.h);
  g.putImageData(image, 0, 0);
  return Promise.resolve(baked);
};
const end = { go(): void { location.reload(); } };
const hud = createHud({
  choose: (kind) => match.choose(kind), wait: () => match.wait(), endTurn: () => match.endTurn(), menu: () => undefined,
  restart: () => { if (back !== undefined) end.go(); else location.reload(); }, closeTalk: () => match.closeTalk(), recentre: () => { const at = match.recentreTarget(); if (at === null) return; const b = band(), f = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, at, f, 0, TILE, 0); clamp(cam, f, match.world.grid.cols, match.world.grid.rows); },
});
const driver = createDriver({
  env, canvas: canvas as HostCanvas, clock: match.world.clock, clear: "#0d1220", load, pixels,
  view: () => {
    if (!seated) seat();
    const box = band(), shown = fitView(box.devW, box.devH, cam.s, TILE, TILE);
    if (match.followId !== null) { const u = match.world.units.get(match.followId); if (u !== undefined) tickCam(cam, 16, u.at, shown); }
    const seen = match.view(), note = misses.length === 0 ? seen.note : seen.note === null ? misses.join("\n") : `${seen.note}\n${misses.join("\n")}`; hud.render({ ...seen, note });
    const base = link.scene(match.scene(), { tMs: match.world.clock.now(), stepMs: match.world.clock.stepMs }), scene = painted === null || painted.length === 0 ? base : held !== null && held.src === base && held.list === painted ? held.scene : (held = { src: base, list: painted, scene: { ...base, backdrop: painted } }).scene;
    return { scene, lights: litPlan(lighting, match.looks, link.lit), shake: link.shake, x: cam.x, y: cam.y, s: cam.s };
  },
});
void Promise.all((docs.backdrop ?? []).map(async (layer) => {
  try {
    const blob = docs.art === undefined ? null : await docs.art(layer.file);
    if (blob === null) { misses.push(`Background picture missing: ${layer.file}`); driver.stats.failed += 1; return null; }
    const bmp = await createImageBitmap(blob), canvas = new OffscreenCanvas(bmp.width, bmp.height), g = canvas.getContext("2d"); if (g === null) throw new Error(layer.file); g.imageSmoothingEnabled = false; g.drawImage(bmp, 0, 0); sheets.set(layer.assetId, canvas); return { sheet: { id: layer.assetId, columns: 1, fw: bmp.width, fh: bmp.height }, depth: layer.depth, repeat: layer.repeat };
  } catch { misses.push(`Background picture ${layer.file} couldn't be opened`); driver.stats.failed += 1; return null; }
})).then((rows) => { const list = rows.flatMap((row) => row === null ? [] : [row]); painted = list; held = null; if (list.length > 0) match.bare(); });
const touch = createTouch({ match, cam, box: () => { const ratio = dpr(), rect = canvas.getBoundingClientRect(), raw = canvas.width === 300 && canvas.height === 150, devW = !raw && canvas.width > 0 ? canvas.width : canvas.clientWidth * ratio, devH = !raw && canvas.height > 0 ? canvas.height : canvas.clientHeight * ratio; return { devW, devH, kx: rect.width > 0 && !raw && canvas.width > 0 ? canvas.width / rect.width : ratio, ky: rect.height > 0 && !raw && canvas.height > 0 ? canvas.height / rect.height : ratio, cols: match.world.grid.cols, rows: match.world.grid.rows }; } });
for (const k of ["pointerdown", "pointermove", "pointerup", "pointercancel", "lostpointercapture"] as const) canvas.addEventListener(k, (e) => { const p = { id: e.pointerId, offsetX: e.offsetX, offsetY: e.offsetY, clientX: e.clientX, clientY: e.clientY, timeStamp: e.timeStamp, pointerType: e.pointerType }; if (k === "pointerdown") { canvas.setPointerCapture(e.pointerId); touch.down(p); } else if (k === "pointermove") touch.move(p); else if (k === "pointerup") touch.up(p); else touch.cancel(p); });
const place = (): void => { const box = boardBox(innerHeight - (match.view().xp === null ? 0 : XP_H)); Object.assign(canvas.style, { position: "fixed", left: "0", right: "0", width: "100%", top: `${box.top}px`, height: `${box.height}px`, touchAction: "none" }); };
const onResize = (): void => { place(); seated = false; };
place(); addEventListener("resize", onResize);
const stop = (): void => { driver.dispose(); removeEventListener("resize", onResize); };
end.go = (): void => { stop(); if (back !== undefined) back(); };
seat();
if (aim?.unitId !== undefined) {
  const mine = match.world.units.all().find((u) => u.alive && u.unitId === aim.unitId && u.side === match.sides.me);
  if (mine === undefined) {
    const body = match.world.units.all().find((u) => u.alive && u.unitId === aim.unitId);
    if (body !== undefined) { const b = band(), shown = fitView(b.devW, b.devH, cam.s, TILE, TILE); centreOn(cam, body.at, shown, 0, TILE, 0); clamp(cam, shown, match.world.grid.cols, match.world.grid.rows); }
  } else {
    match.feed({ type: "SelectUnit", unitId: mine.id });
    if (aim.aim === "basic" || aim.aim === "spell") {
      const kind = aim.aim;
      if (match.choose(kind) !== null) match.intend({ type: "ChooseAction", actionId: kind, unitId: mine.id });
      const table = kind === "spell" ? docs.rules.abilities?.[mine.unitId]?.[0]?.reach : docs.rules.reach?.[mine.unitId];
      const reach = typeof table === "number" && Number.isInteger(table) && table >= 1 ? table : kind === "spell" ? DEFAULT_SPELL_REACH : match.step.reach;
      const cells: { c: number; r: number }[] = [];
      for (let r = 0; r < match.world.grid.rows; r += 1) for (let c = 0; c < match.world.grid.cols; c += 1) if (inOrthogonalReach(mine.at, { c, r }, reach)) cells.push({ c, r });
      match.aims = cells; match.aimKind = kind;
    }
  }
}
if (DEV) Object.assign(window, { __play: match, __driver: driver, __cam: cam, __hud: hud, __fx: match.fx, __link: link, __docs: docs }); // dev-only
if (travel !== undefined) match.onLink((link) => { const party = match.party(); stop(); travel(link, party); });
if (back !== undefined) { const btn = document.createElement("button"); btn.id = "back-maker"; btn.type = "button"; btn.textContent = "Back to maker"; btn.addEventListener("click", () => { stop(); back(); }); const top = document.querySelector("#top"); if (top !== null) top.prepend(btn); }
driver.start();
}
const bootCanvas = document.querySelector("#board");
if (bootCanvas instanceof HTMLCanvasElement) { const opened = openBundled(); if (opened.docs === null) document.body.textContent = opened.error; else startMatch(opened.docs); }
