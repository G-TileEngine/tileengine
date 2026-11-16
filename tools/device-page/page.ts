import { createClock } from "../../src/core/clock/index.ts";
import { createDriver, type Driver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
import { createSceneLink, type SceneUnit } from "../../src/runtime/scene/world-scene.ts";
import { CAMS, L1, RASTERS, SCENE, VIEW } from "../pixel-suite/fixture.ts";
import { l2 } from "../pixel-suite/l2.ts";
import { AB, blockAt, canvasMb, createAB, hashCheck, hashPass, parseFlags, pool, readout, type Hash } from "./bold.ts";
import { applyStubs, createBake, RAMPS, stressDocs, type Ctx } from "./bold-stubs.ts";
import { panelRows } from "./bold-swatch.ts";
const canvas = document.querySelector<HTMLCanvasElement>("#view"), read = document.querySelector<HTMLElement>("#read");
if (canvas === null || read === null) throw new Error("phone page");
const q = new URLSearchParams(location.search), fix = q.get("fixture"), ps = Number(q.get("ps") ?? 1), sFix = fix === null ? undefined : Number(fix);
const cam = CAMS.find((c) => c[2] === sFix) ?? ([0, 0, sFix ?? 1] as const);
const link = createSceneLink(), clock = createClock(), hero = { id: "a", fw: 16, fh: 16, columns: 4 }, sheet = { id: "g", fw: 16, fh: 16, columns: 4 };
const clip = { name: "move-right", frames: [0, 1, 2, 3], ms: [80, 80, 80, 80] }, piece = { at: 0, ms: 480, sheet: hero, clip, anchor: "target" as const };
const units0: SceneUnit[] = Array.from({ length: 40 }, (_, i) => ({ id: `u${i}`, sprite: "hero", at: { c: 2 + (i % 10) * 5, r: 2 + Math.floor(i / 10) * 8 }, offset: null, facing: "E", alive: true, action: "move" }));
const effects = [0, 1, 2, 3].map((i) => ({ id: `e${i}`, castMs: 0, loopMs: 480, caster: `u${i}`, target: `u${i + 10}`, pieces: [piece], ...(ps > 1 ? { pixel_scale: ps } : {}) })); // ?ps=2..6: pixel_scale case (G5b)
const tiles = Array.from({ length: 64 * 64 }, (_, i) => i % 4), world = { cols: 64, rows: 64, tileW: 16, tileH: 16, mapSeed: 1, overlays: [], objects: [], assets: { g: { sheet }, hero: { sheet: hero, clips: [clip, { name: "idle-down", frames: [0, 1], ms: [120, 120] }] } }, layers: [{ tileset: "g", aboveUnits: false, visible: true, tiles }], effects };
const made = new Map<string, HTMLCanvasElement>();
const load = (id: string): Promise<HTMLCanvasElement> => { const hit = made.get(id); if (hit !== undefined) return Promise.resolve(hit); const r = RASTERS[id]; if (r === undefined) return Promise.reject(new Error(id)); const c = document.createElement("canvas"); c.width = r.w; c.height = r.h; const g = c.getContext("2d"); if (g === null) return Promise.reject(new Error(id)); const d = g.createImageData(r.w, r.h); r.px.forEach((p, i) => d.data.set([(p >>> 16) & 255, (p >>> 8) & 255, p & 255, 255], i * 4)); g.putImageData(d, 0, 0); made.set(id, c); return Promise.resolve(c); };
const flags = parseFlags(q.has("bold") ? q.get("bold") ?? "" : null, q.has("seed") ? q.get("seed") ?? "" : null), bold = flags.present, stress = stressDocs(hero, clip);
const ctxAt = (tMs: number, block: number, ageMs: number): Ctx => ({ seed: flags.seed, tMs, block, ageMs, units: units0, cols: 64, rows: 64, sheet });
let driver: Driver | undefined, mode: "auto" | "off" | "on" = "auto", cap = false, switches = 0, prevLite = false, t0 = 0, prevAt = 0, pix = "—", done = false, lock = "";
let ab = createAB(), bake = createBake(), hash: Hash = "pending", hashOf = "", canvasPeak = 0, heapPeak: number | null = null, hashed = false;
const ring = new Float64Array(3600); let rn = 0, rw = 0; const gaps: number[] = [];
const samples = (): number[] => { if (sFix === undefined) return gaps; const o: number[] = []; const z = rn < 3600 ? 0 : rw; for (let i = 0; i < rn; i += 1) o.push(ring[(z + i) % 3600] ?? 0); return o; };
const heapOf = (): number | null => { const mem = (performance as unknown as { memory?: { usedJSHeapSize?: number } }).memory?.usedJSHeapSize; if (typeof mem !== "number") return heapPeak; const m = mem / 1048576; heapPeak = heapPeak === null ? m : Math.max(heapPeak, m); return heapPeak; };
const finger = (sceneLink: ReturnType<typeof createSceneLink>, T: number): unknown => { const b = blockAt(T), out = applyStubs(flags.on, b.on, stress, ctxAt(T, b.i, T - b.i * AB.blockMs)), local = T % AB.blockMs; const scene = sceneLink.scene({ ...world, style: { ramps: RAMPS }, overlays: [...out.overlays], effects: [...out.effects], units: units0.map((u, i) => ({ ...u, offset: { dx: ((local / 180 + i) % 16) / 16 - 0.5, dy: 0 } })) }, { tMs: T, stepMs: 10 }); return { standing: scene.standing, overlays: scene.overlays, dots: scene.dots, lit: sceneLink.lit, notes: out.notes }; };
const show = (): void => { if (lock !== "") { read.textContent = lock.replace(/pixels \S+/, `pixels ${pix}`); return; }
  const el = performance.now() - t0, list = samples(), s = [...list].sort((a, b) => a - b), at = (q: number): number => s[Math.floor(s.length * q)] ?? 0;
  let slow = 0, bad = 0; for (const v of list) { if (v > 25) slow += 1; if (v > 50) bad += 1; }
  const lit = driver?.stats.lite === true; if (driver !== undefined && lit !== prevLite) { switches += 1; prevLite = lit; }
  if (sFix === undefined && el >= (bold ? AB.visitMs : 60_000)) done = true;
  const side = !bold && sFix === undefined && !done && el >= 38_000 && el < 45_000, mbN = canvasMb(driver?.backend.stats.bytes ?? 0, canvas.width, canvas.height), mb = mbN.toFixed(1);
  if (mbN > canvasPeak) canvasPeak = mbN; heapOf();
  if (bold) {
    if (done && !hashed) { hashed = true; const linkA = createSceneLink(), linkB = createSceneLink(), a = hashPass((T) => finger(linkA, T)), b = hashPass((T) => finger(linkB, T)); hash = hashCheck(a, b); if (flags.on.includes("export") && !bake.equal) hash = "FAIL"; let h = 2166136261; for (const row of [...a, ...b]) for (let i = 0; i < row.length; i += 1) h = Math.imul(h ^ row.charCodeAt(i), 16777619) >>> 0; hashOf = h.toString(16); }
    const block = blockAt(Math.min(el, AB.visitMs));
    read.textContent = readout({ flags, block, off: pool(ab.off), on: pool(ab.on), canvasPeak, heapPeak, hash, hashOf, cap, lite: mode, switches, extra: [`dpr ${devicePixelRatio}`, `pixels ${pix}`, ...(flags.on.includes("export") ? [`export bake MB ${bake.mb.toFixed(1)} peak ${bake.peakMb.toFixed(1)} · bakes equal ${bake.equal ? "yes" : "no"}`] : [])] }); if (done) lock = read.textContent; return;
  }
  read.textContent = `${done ? "DONE\n" : ""}${side ? "TURN THE PHONE SIDEWAYS NOW\n" : ""}frame ms p50 ${at(0.5).toFixed(1)} p95 ${at(0.95).toFixed(1)} max ${(s[s.length - 1] ?? 0).toFixed(1)} / dropped (>25 ms) ${slow} over 50 ms ${bad} of ${list.length} / draws ${driver?.stats.draws ?? 0} canvas MB ${mb} pixels ${pix} / lite ${lit ? "on" : "off"} (${mode}, ${switches} switches)`; if (done) lock = read.textContent;
};
const note = (): void => { const t = performance.now(); if (prevAt === 0) { prevAt = t; show(); return; } const g = t - prevAt; prevAt = t; if (sFix !== undefined) { ring[rw] = g; rw = (rw + 1) % 3600; if (rn < 3600) rn += 1; } else if (bold) ab.add(t - t0, g); else if (t - t0 < 60_000) gaps.push(g); show(); };
const env = { requestAnimationFrame: (cb: (ts: number) => void): number => window.requestAnimationFrame((ts) => { note(); cb(ts); }), cancelAnimationFrame: (id: number): void => { window.cancelAnimationFrame(id); }, document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return devicePixelRatio; } } as unknown as HostEnv;
const boot = (reset: boolean): void => {
  driver?.dispose(); if (reset) { gaps.length = 0; switches = 0; done = false; lock = ""; prevAt = 0; t0 = performance.now(); rn = 0; rw = 0; ab = createAB(); bake = createBake(); hash = "pending"; hashOf = ""; canvasPeak = 0; heapPeak = null; hashed = false; }
  const live = createDriver({ env, canvas: canvas as unknown as HostCanvas, clock, clear: VIEW.clear, load, ...(cap ? { capFps: 60 } : {}), view: () => {
    if (sFix !== undefined) return { scene: SCENE, x: cam[0], y: cam[1], s: cam[2] };
    if (bold) { const t = Math.min(AB.visitMs, performance.now() - t0), b = blockAt(t), local = (b.done ? AB.visitMs - 1 : t) % AB.blockMs, out = applyStubs(flags.on, b.on, stress, ctxAt(clock.now(), b.i, (b.done ? AB.visitMs - 1 : t) - b.i * AB.blockMs)); bake.step(flags.seed, stress[0], flags.on.includes("export") && b.on); return { scene: link.scene({ ...world, style: { ramps: RAMPS }, overlays: [...out.overlays], effects: out.effects, units: units0.map((u, i) => ({ ...u, offset: { dx: ((local / 180 + i) % 16) / 16 - 0.5, dy: 0 } })) }, { tMs: clock.now(), stepMs: clock.stepMs, lite: driver?.stats.lite === true }), x: (local / 40) % 480, y: 64, s: 1 }; }
    const t = Math.min(60_000, performance.now() - t0), s = Math.min(4, 1 + Math.floor(t / 15_000));
    return { scene: link.scene({ ...world, units: units0.map((u, i) => ({ ...u, offset: { dx: ((t / 180 + i) % 16) / 16 - 0.5, dy: 0 } })) }, { tMs: clock.now(), stepMs: clock.stepMs, lite: driver?.stats.lite === true }), x: (t / 40) % 480, y: 64, s };
  } });
  driver = live; live.lite(mode); prevLite = live.stats.lite; show(); requestAnimationFrame(() => { if (driver === live) live.start(); });
};
Object.assign(window, { l3: (): { backingW: number; backingH: number; cssW: number; cssH: number; dpr: number; rendering: string; transform: string; draws: number } => ({ backingW: canvas.width, backingH: canvas.height, cssW: canvas.clientWidth, cssH: canvas.clientHeight, dpr: devicePixelRatio, rendering: getComputedStyle(canvas).imageRendering, transform: getComputedStyle(canvas).transform, draws: driver?.stats.draws ?? 0 }), overlay: show });
const btn = (id: string): HTMLButtonElement => { const el = document.querySelector(`#${id}`); if (!(el instanceof HTMLButtonElement)) throw new Error(id); return el; };
btn("cap").addEventListener("click", () => { cap = !cap; btn("cap").textContent = `60 fps cap: ${cap ? "on" : "off"}`; boot(true); });
btn("lite").addEventListener("click", () => { mode = mode === "auto" ? "off" : mode === "off" ? "on" : "auto"; driver?.lite(mode); btn("lite").textContent = `lite: ${mode}`; show(); });
btn("again").addEventListener("click", () => boot(true));
btn("pixels").addEventListener("click", () => { void l2().then(({ hashes }) => { pix = hashes.length === L1.length && hashes.every((h, i) => h === L1[i]) ? "PASS" : "FAIL"; show(); }); });
if (bold) { const dev = document.querySelector("#dev"), colour = document.createElement("button"), panel = document.createElement("div"); colour.type = "button"; colour.textContent = "colour stops"; panel.hidden = true; for (const row of panelRows()) { const line = document.createElement("div"); for (const stop of row.stops) { const box = document.createElement("button"); box.type = "button"; box.style.cssText = `background:${stop};width:18px;height:18px;padding:0`; line.append(box); } panel.append(line); } colour.addEventListener("click", () => { panel.hidden = !panel.hidden; }); dev?.append(colour, panel); }
boot(true);
