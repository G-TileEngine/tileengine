import { createClock } from "../../src/core/clock/index.ts";
import { createDriver, type Driver, type HostCanvas, type HostEnv } from "../../src/runtime/host/raf-driver.ts";
import { createSceneLink, type SceneUnit } from "../../src/runtime/scene/world-scene.ts";
import { CAMS, L1, RASTERS, SCENE, VIEW } from "../pixel-suite/fixture.ts";
import { l2 } from "../pixel-suite/l2.ts";
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
let driver: Driver | undefined, mode: "auto" | "off" | "on" = "auto", cap = false, switches = 0, prevLite = false, t0 = 0, prevAt = 0, pix = "—", done = false, lock = "";
const ring = new Float64Array(3600); let rn = 0, rw = 0; const gaps: number[] = [];
const samples = (): number[] => { if (sFix === undefined) return gaps; const o: number[] = []; const z = rn < 3600 ? 0 : rw; for (let i = 0; i < rn; i += 1) o.push(ring[(z + i) % 3600] ?? 0); return o; };
const show = (): void => { if (lock !== "") { read.textContent = lock.replace(/pixels \S+/, `pixels ${pix}`); return; }
  const el = performance.now() - t0, list = samples(), s = [...list].sort((a, b) => a - b), at = (q: number): number => s[Math.floor(s.length * q)] ?? 0;
  let slow = 0, bad = 0; for (const v of list) { if (v > 25) slow += 1; if (v > 50) bad += 1; }
  const lit = driver?.stats.lite === true; if (driver !== undefined && lit !== prevLite) { switches += 1; prevLite = lit; }
  if (sFix === undefined && el >= 60_000) done = true;
  const side = sFix === undefined && !done && el >= 38_000 && el < 45_000, mb = (((driver?.backend.stats.bytes ?? 0) + canvas.width * canvas.height * 4) / 1048576).toFixed(1); // offscreen layers + the main canvas
  read.textContent = `${done ? "DONE\n" : ""}${side ? "TURN THE PHONE SIDEWAYS NOW\n" : ""}frame ms p50 ${at(0.5).toFixed(1)} p95 ${at(0.95).toFixed(1)} max ${(s[s.length - 1] ?? 0).toFixed(1)} / dropped (>25 ms) ${slow} over 50 ms ${bad} of ${list.length} / draws ${driver?.stats.draws ?? 0} canvas MB ${mb} pixels ${pix} / lite ${lit ? "on" : "off"} (${mode}, ${switches} switches)`; if (done) lock = read.textContent;
};
const note = (): void => { const t = performance.now(); if (prevAt === 0) { prevAt = t; show(); return; } const g = t - prevAt; prevAt = t; if (sFix !== undefined) { ring[rw] = g; rw = (rw + 1) % 3600; if (rn < 3600) rn += 1; } else if (t - t0 < 60_000) gaps.push(g); show(); };
const env = { requestAnimationFrame: (cb: (ts: number) => void): number => window.requestAnimationFrame((ts) => { note(); cb(ts); }), cancelAnimationFrame: (id: number): void => { window.cancelAnimationFrame(id); }, document, OffscreenCanvas, ResizeObserver, get devicePixelRatio() { return devicePixelRatio; } } as unknown as HostEnv;
const boot = (reset: boolean): void => {
  driver?.dispose(); if (reset) { gaps.length = 0; switches = 0; done = false; lock = ""; prevAt = 0; t0 = performance.now(); rn = 0; rw = 0; }
  const live = createDriver({ env, canvas: canvas as unknown as HostCanvas, clock, clear: VIEW.clear, load, ...(cap ? { capFps: 60 } : {}), view: () => {
    if (sFix !== undefined) return { scene: SCENE, x: cam[0], y: cam[1], s: cam[2] };
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
boot(true);
