import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { createClock, type Clock } from "../../../src/core/clock/index.ts";
import { canvas2d } from "../../../src/runtime/canvas/canvas2d.ts";
import { createDriver, type HostEnv, type View } from "../../../src/runtime/host/raf-driver.ts";
import { buildDrawList, fitView, present, snapCamera, type RenderScene } from "../../../src/runtime/render/index.ts";
import { FakeCanvas, type Raster } from "../canvas/fake-canvas.ts";
const water = { name: "water", frames: [4, 5], ms: [200, 200] };
const argb = (n: number): number => ((0xff << 24) | n) >>> 0;
const solid = (c: number): Raster => ({ w: 64, h: 16, px: new Uint32Array(64 * 16).fill(argb(c)) });
const bank = new Map<string, Raster>([["g", solid(0x224466)], ["a", solid(0x88aa44)]]);
const cells = (at: (i: number) => number | null): (number | null)[] => Array.from({ length: 384 }, (_, i) => at(i));
const world = (salt = 0, anim = false): RenderScene => ({
  cols: 24, rows: 16, tileW: 16, tileH: 16, mapSeed: 1, standing: [], overlays: [],
  ground: [{ sheet: { id: "g", fw: 16, fh: 16, columns: 4 }, tiles: cells((i) => (anim && i === 0 ? 4 : 1 + (i + salt) % 3)), ...(anim ? { anims: { 4: water } } : {}) }],
  above: [{ sheet: { id: "a", fw: 16, fh: 16, columns: 4 }, tiles: cells((i) => ((i + salt) % 7 === 0 ? 2 : null)) }],
});
type Load = (id: string) => Promise<object>;
type Rig = { driver: ReturnType<typeof createDriver>; view: FakeCanvas; clock: Clock; made: FakeCanvas[]; boxes: string[]; offs: boolean; disconnects: () => number; docs: () => number; queued: () => number; run: (s: number, hz: number) => void; fire: (dt: number) => void; hide: () => void; show: () => void; resize: (w: number, h: number) => void; jump: (ms: number) => void };
function rig(over: { bare?: boolean; dpr?: number; cap?: number; builds?: number; x?: () => number; scene?: () => RenderScene; load?: Load; boom?: () => boolean; clock?: Clock; max?: number } = {}): Rig {
  const made: FakeCanvas[] = [], queue = new Map<number, (ts: number) => void>(), docs: { t: string; fn: () => void }[] = [], boxes: string[] = [];
  let seq = 1, ts = 1000, vis = "visible", cuts = 0, onResize: ((es: readonly { devicePixelContentBoxSize?: readonly { inlineSize: number; blockSize: number }[] }[]) => void) | undefined;
  const view = Object.assign(new FakeCanvas(), { clientWidth: 160, clientHeight: 96 });
  class Off extends FakeCanvas { constructor(w: number, h: number) { super(); this.width = w; this.height = h; made.push(this); } }
  class Watch { constructor(cb: NonNullable<typeof onResize>) { onResize = cb; } observe(_t: object, opts?: { box: string }): void { if (over.bare === true && opts?.box !== undefined) throw new Error("box"); boxes.push(opts?.box ?? ""); } disconnect(): void { cuts += 1; } }
  const env: HostEnv = {
    requestAnimationFrame: (cb) => { const id = seq++; queue.set(id, cb); return id; }, cancelAnimationFrame: (id) => { queue.delete(id); },
    devicePixelRatio: over.dpr ?? 1,
    document: { get visibilityState() { return vis; }, addEventListener: (t, fn) => { docs.push({ t, fn }); }, removeEventListener: (_t, fn) => { const i = docs.findIndex((d) => d.fn === fn); if (i >= 0) docs.splice(i, 1); }, createElement: () => { const c = new FakeCanvas(); made.push(c); return c; } },
    ResizeObserver: Watch, ...(over.bare === true ? {} : { OffscreenCanvas: Off }),
  };
  const scene = over.scene ?? ((): RenderScene => world());
  const clock = over.clock ?? createClock();
  const driver = createDriver({
    env, canvas: view, clock, view: (): View => { if (over.boom?.() === true) throw new Error("view"); return { scene: scene(), x: over.x?.() ?? 0, y: 0, s: 1 }; },
    load: over.load ?? ((id) => { const img = bank.get(id); return img === undefined ? Promise.reject(new Error(id)) : Promise.resolve(img); }),
    ...(over.cap === undefined ? {} : { capFps: over.cap }), ...(over.builds === undefined ? {} : { buildsPerFrame: over.builds }), ...(over.max === undefined ? {} : { imagesMax: over.max }),
  });
  const fire = (dt: number): boolean => { const id = queue.keys().next().value; if (id === undefined) return false; const cb = queue.get(id); queue.delete(id); if (cb === undefined) return false; ts += dt; cb(ts); return true; };
  const run = (s: number, hz: number): void => { const step = 1000 / hz, end = ts + s * 1000; while (ts + step <= end + 1e-6) { if (!fire(step)) break; } };
  const visib = (): void => { for (const d of [...docs]) if (d.t === "visibilitychange") d.fn(); };
  return { driver, view, clock, made, boxes, offs: over.bare !== true, disconnects: () => cuts, docs: () => docs.length, queued: () => queue.size, run, fire, hide: () => { vis = "hidden"; visib(); }, show: () => { vis = "visible"; visib(); }, resize: (w, h) => onResize?.([{ devicePixelContentBoxSize: [{ inlineSize: w, blockSize: h }] }]), jump: (ms) => { ts += ms; } };
}
const flush = (): Promise<void> => new Promise((done) => { setImmediate(done); });
const eq = (view: FakeCanvas, sc: RenderScene, x = 0): void => {
  const host = new FakeCanvas(), fit = fitView(view.width, view.height, 1, 16, 16), ref = canvas2d(host, { images: (id) => bank.get(id), makeCanvas: () => new FakeCanvas(), buildsPerFrame: 100 });
  ref.world(sc, 1); present(ref, fit, buildDrawList(sc, fit, snapCamera(x, 0, 1), 0, 10), "#000000");
  let n = view.px.length === host.px.length ? 0 : 1; for (let i = 0; i < view.px.length && i < host.px.length; i += 1) if (view.px[i] !== host.px[i]) n += 1; assert.equal(n, 0);
};
test("idle: a static scene draws once after its sheets load, then 0 a second; one water tile draws 5 a second (step 29)", async () => {
  const sc = world(), box = rig({ scene: () => sc });
  box.driver.start(); box.run(0.5, 60); await flush(); const a = box.driver.stats.draws; box.run(1, 60); assert.equal(box.driver.stats.draws - a, 1); eq(box.view, sc); const b = box.driver.stats.draws; box.run(1, 60); assert.equal(box.driver.stats.draws - b, 0);
  for (const hz of [60, 120]) { const wet = world(0, true), live = rig({ scene: () => wet }); live.driver.start(); const d = live.driver.stats.draws; live.run(1, hz); assert.equal(live.driver.stats.draws - d, 5, String(hz)); }
});
test("a 120 Hz panning view draws 120 a second, 60 with capFps 60, and the clock keeps time either way (step 29)", async () => {
  const pan = async (cap?: number): Promise<{ draws: number; moved: number }> => {
    let x = 0; const sc = world(), box = rig({ scene: () => sc, x: () => x++, ...(cap === undefined ? {} : { cap }) });
    box.driver.start(); box.run(0.2, 60); await flush(); const d = box.driver.stats.draws, t = box.clock.now(); box.run(1, 120); return { draws: box.driver.stats.draws - d, moved: box.clock.now() - t };
  };
  const open = await pan(), capped = await pan(60);
  assert.equal(open.draws, 120); assert.equal(capped.draws, 60); assert.ok(Math.abs(open.moved - 1000) <= 10 && Math.abs(capped.moved - 1000) <= 10);
  const sc = world(), box = rig({ scene: () => sc, cap: 60 }); box.driver.start(); box.run(0.2, 60); await flush(); const a = box.driver.stats.draws; box.run(1, 60); assert.equal(box.driver.stats.draws - a, 1); const b = box.driver.stats.draws; box.run(1, 60); assert.equal(box.driver.stats.draws - b, 0);
});
test("a sheet that never loads, or fails, settles to 0 draws a second; a late load bumps rev and redraws (step 29 must-fix)", async () => {
  const miss = async (load: Load): Promise<void> => {
    const calls: string[] = []; const sc = world(); const box = rig({ scene: () => sc, load: (id) => { calls.push(id); return load(id); } });
    box.driver.start(); box.run(1, 60); await flush(); box.run(1, 60); await flush(); const d = box.driver.stats.draws; box.run(1, 60);
    assert.equal(box.driver.stats.draws - d, 0); assert.equal(box.driver.backend.busy(), true); assert.equal(box.driver.backend.stats.missing, true); assert.equal(calls.length, 2);
  };
  await miss(() => new Promise(() => {})); await miss(() => Promise.reject(new Error("no"))); await miss((id) => id === "g" ? Promise.reject(new Error("g")) : Promise.resolve(bank.get(id) ?? solid(1)));
  const sc = world(), box = rig({ scene: () => sc, builds: 1, x: () => 200, load: (id) => id === "a" ? new Promise(() => {}) : Promise.resolve(bank.get(id) ?? solid(1)) });
  box.driver.start(); box.run(0.2, 60); await flush(); box.run(1, 60); assert.equal(box.driver.backend.stats.builds, 2); const d = box.driver.stats.draws; box.run(1, 60); assert.equal(box.driver.stats.draws - d, 0); assert.equal(box.driver.backend.stats.capped, false);
});
test("a late sheet load bumps rev and redraws the real picture (step 29)", async () => {
  let go: (img: object) => void = () => {}; const sc = world();
  const box = rig({ scene: () => sc, load: (id) => id === "g" ? new Promise((r) => { go = r; }) : Promise.resolve(bank.get(id) ?? solid(1)) });
  box.driver.start(); box.run(2, 60); await flush(); const rev = box.driver.stats.rev; go(bank.get("g") ?? solid(1)); await flush(); assert.equal(box.driver.stats.rev, rev + 1);
  const a = box.driver.stats.draws; box.run(1, 60); assert.equal(box.driver.stats.draws - a, 1); eq(box.view, sc); const b = box.driver.stats.draws; box.run(1, 60); assert.equal(box.driver.stats.draws - b, 0);
});
test("busy() is false while lost, even after restore-then-lose; a restore redraws, then settles (QA A-pick carry)", async () => {
  const sc = world(), box = rig({ scene: () => sc }); box.driver.start(); box.run(0.5, 60); await flush(); box.run(0.2, 60);
  box.view.fire("contextrestored"); box.view.fire("contextlost"); assert.equal(box.driver.backend.busy(), false); const a = box.driver.stats.draws; box.run(1, 60); assert.equal(box.driver.stats.draws - a, 0);
  box.view.fire("contextrestored"); assert.equal(box.driver.backend.busy(), true); box.run(1, 60); assert.ok(box.driver.stats.draws > a); const b = box.driver.stats.draws; box.run(1, 60); assert.equal(box.driver.stats.draws - b, 0); eq(box.view, sc);
  const still = world(), dead = rig({ scene: () => still, load: (id) => id === "g" ? new Promise(() => {}) : Promise.resolve(bank.get(id) ?? solid(1)) });
  dead.driver.start(); dead.run(0.5, 60); await flush(); dead.run(0.5, 60); dead.view.fire("contextlost"); dead.view.px.fill(0); dead.view.fire("contextrestored");
  const d = dead.driver.stats.draws; dead.run(1, 60); assert.equal(dead.driver.stats.draws - d, 1); const e = dead.driver.stats.draws; dead.run(1, 60); assert.equal(dead.driver.stats.draws - e, 0); assert.ok(dead.view.px.some((p) => p === argb(0x88aa44)));
});
test("world() runs before the plan: a new scene object bumps rev, and a replaced stale chunk canvas ends 0x0 (step 29, QA :63)", async () => {
  let sc = world(0); const box = rig({ scene: () => sc }); box.driver.start(); box.run(0.5, 60); await flush(); box.run(0.5, 60); const old = box.made.slice();
  sc = world(4); const a = box.driver.stats.draws; box.run(1, 60); assert.equal(box.driver.stats.draws - a, 1); eq(box.view, sc);
  assert.ok(old.length > 0 && old.every((c) => c.width === 0 && c.height === 0));
  assert.equal(box.driver.backend.stats.bytes, box.made.reduce((s, c) => s + c.width * c.height * 4, 0));
  const b = box.driver.stats.draws; box.driver.touch(); box.run(1, 60); assert.equal(box.driver.stats.draws - b, 1);
});
test("dispose removes every listener and stops the loop; canvas factory and sizing fall back cleanly (step 29)", async () => {
  const sc = world(), box = rig({ scene: () => sc }); box.driver.start(); box.run(0.4, 60); await flush(); box.run(0.4, 60);
  assert.equal(box.boxes[0], "device-pixel-content-box"); box.resize(333, 201); box.fire(16); assert.equal(box.view.width, 333); assert.equal(box.view.height, 201);
  assert.ok(box.offs && box.made.every((c) => c.constructor !== FakeCanvas)); assert.equal(box.view.listeners, 2); assert.equal(box.docs(), 1);
  const draws = box.driver.stats.draws; box.driver.dispose(); box.driver.dispose(); assert.equal(box.queued(), 0); box.run(1, 60);
  assert.equal(box.view.listeners, 0); assert.equal(box.docs(), 0); assert.equal(box.queued(), 0); assert.equal(box.disconnects(), 1); assert.equal(box.driver.backend.stats.bytes, 0); assert.ok(box.made.every((c) => c.width === 0 && c.height === 0)); assert.equal(box.driver.stats.draws, draws);
  const bare = rig({ bare: true, dpr: 2, scene: () => sc }); bare.driver.start(); bare.run(0.2, 60); await flush(); bare.run(0.4, 60);
  assert.deepEqual(bare.boxes, [""]); assert.equal(bare.view.width, 320); assert.equal(bare.view.height, 192); assert.ok(bare.made.every((c) => c.constructor === FakeCanvas));
  let reject: (err: Error) => void = () => {}; const late = rig({ load: () => new Promise((_r, rej) => { reject = rej; }) });
  late.driver.start(); late.fire(0); late.driver.dispose(); reject(new Error("late")); await flush(); assert.equal(late.driver.stats.failed, 0);
  let calls = 0; const bad = rig({ boom: () => { calls += 1; return true; }, scene: () => sc });
  bad.driver.start(); bad.run(3, 60); assert.ok(calls >= 3 && calls <= 4); assert.equal(bad.driver.stats.errors, calls); assert.equal(bad.driver.stats.draws, 0); const seen = calls; bad.driver.touch(); bad.fire(16); assert.equal(calls, seen + 1);
  let x = 0, arm = false, thrown = false; const wet = world(0, true); const heal = rig({ scene: () => wet, x: () => x++, boom: () => { if (!arm || thrown) return false; thrown = true; return true; } });
  heal.driver.start(); heal.run(0.3, 60); await flush(); const pace = heal.driver.stats.draws; heal.run(1, 60); const per = heal.driver.stats.draws - pace; const rev = heal.driver.stats.rev;
  arm = true; heal.fire(16); assert.equal(heal.driver.stats.errors, 1); heal.run(1.1, 60); const back = heal.driver.stats.draws; heal.run(1, 60); assert.equal(heal.driver.stats.draws - back, per); assert.equal(heal.driver.stats.errors, 1); assert.equal(heal.driver.stats.rev, rev);
});
test("hidden cancels rAF and freezes the clock; showing again does not replay the gap (step 29)", () => {
  const box = rig(); box.driver.start(); box.run(0.5, 60); const t = box.clock.now(); box.hide(); assert.equal(box.queued(), 0); box.jump(60000); box.show(); box.run(0.5, 60); assert.ok(box.clock.now() - t <= 510);
});
test("a rAF pile-up goes through one bulk clock.skip: no 100 ms clamp, timers fire in order (step 29)", () => {
  const box = rig(), log: number[] = []; const t0 = box.clock.now();
  box.clock.after(5000, () => log.push(box.clock.now())); box.clock.after(2000, () => log.push(box.clock.now()));
  box.driver.start(); box.fire(0); box.fire(9000); assert.ok(box.clock.now() - t0 >= 9000); assert.deepEqual(log, [t0 + 2000, t0 + 5000]);
  const mid = box.clock.now(); box.driver.catchUp(1000); assert.equal(box.clock.now() - mid, 1000);
  const a = box.clock.now(); box.fire(150); assert.ok(Math.abs(box.clock.now() - a - 150) < 10); const b = box.clock.now(); box.fire(200); assert.ok(Math.abs(box.clock.now() - b - 200) < 10);
});
test("clock.skip matches stepping tick for tick, honours timeScale and pause, and jumps big gaps fast up to the skip cap (step 29; G4 R1)", () => {
  const trace = (run: (c: Clock) => void): string[] => {
    const c = createClock(), log: string[] = [];
    c.after(35, () => log.push(`a@${c.now()}`));
    c.after(999, () => { log.push(`b@${c.now()}`); const off = c.onTick((info) => { log.push(`t@${info.simMs}`); if (info.simMs >= 1030) off(); }); });
    c.after(1500, () => { log.push(`c@${c.now()}`); c.after(10, () => log.push(`d@${c.now()}`)); });
    run(c); return log;
  };
  assert.deepEqual(trace((c) => c.skip(2000)), trace((c) => { for (let i = 0; i < 200; i += 1) c.step(); }));
  const slow = createClock(); slow.setTimeScale(0.5); slow.skip(2000); assert.equal(slow.now(), 1000);
  const held = createClock(); held.pause(); held.skip(2000); assert.equal(held.now(), 0);
  const big = createClock({ maxSkipMs: 86_400_000 }); let at = -1; big.after(5e7, () => { at = big.now(); }); const began = Date.now(); big.skip(1e8); assert.ok(Date.now() - began < 250); assert.equal(at, 5e7); assert.equal(big.now(), 86_400_000); // G4 R1: was after(5e8), skip(1e9) -> now 1e9 (no cap)
  const bad = createClock(); assert.throws(() => bad.skip(-1), RangeError); assert.throws(() => bad.skip(1.5), RangeError);
});
test("the host folder holds only the driver; it imports only the clock, backend and render index, and reads no wall time or globals (step 29)", () => {
  const dir = fileURLToPath(new URL("../../../src/runtime/host/", import.meta.url));
  assert.deepEqual(readdirSync(dir).filter((name) => name.endsWith(".ts")), ["raf-driver.ts"]);
  const keep = (text: string): string => text.replace(/("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|\/\*[\s\S]*?\*\/|\/\/.*$/gm, "$1");
  const banned = /\b(?:Date|performance|setTimeout|setInterval|setImmediate|queueMicrotask|globalThis|global|window|navigator|self|process|eval|Function|Intl|Temporal|require)\b|Math\.random|\bimport\s*\(/;
  const ok = /^(?:\.\.\/\.\.\/core\/clock\/index\.ts|\.\.\/canvas\/canvas2d\.ts|\.\.\/render\/index\.ts)$/;
  const check = (src: string): void => { assert.equal(banned.test(src), false); for (const hit of src.matchAll(/(?:from|import)\s*[`'"]([^`'"]+)[`'"]/g)) assert.match(hit[1] ?? "", ok); };
  const text = keep(readFileSync(`${dir}/raf-driver.ts`, "utf8")); check(text);
  for (const extra of ['const a = "//"; void globalThis;', 'const b = "//"; import "../input/index.ts";', "void new Intl.DateTimeFormat();"]) assert.throws(() => check(keep(`${text}\n${extra}`)));
});
test("step 30 driver and clock carries: no loop before start(), a backwards timestamp clears the view back-off, hide drops the sub-ms carry, skip reports its own dtMs and name", () => {
  let n = 0, boom = true; const early = rig({ boom: () => { n += 1; return boom; } }); early.show(); assert.equal(early.queued(), 0);
  early.driver.start(); early.fire(0); assert.equal(n, 1); boom = false; early.fire(-4984); assert.equal(n, 2);
  const clock = createClock({ stepMs: 1 }), box = rig({ clock }); box.driver.start(); box.fire(0); box.fire(25.7); box.hide(); box.show(); box.fire(0); box.fire(25.4); assert.equal(clock.now(), 50);
  const dts: number[] = []; clock.onRender((info) => { dts.push(info.dtMs); }); clock.skip(60000); assert.equal(dts.at(-1), 60000); assert.throws(() => clock.skip(-1), (err: unknown) => err instanceof RangeError && /skip:/.test(String(err)));
  const gone = rig(); gone.driver.dispose(); gone.driver.start(); gone.show(); assert.equal(gone.queued(), 0);
});
test("the image map is capped: an old sheet drops and reloads when asked again, a sheet the scene still names never drops, a load landing after its drop is not kept (step 34a)", async () => {
  const loads = new Map<string, number>(), held: (() => void)[] = []; let id = "s0", salt = 0, far = 1, last: RenderScene | undefined, lastId = "";
  const sheet = (k: string): { id: string; fw: number; fh: number; columns: number } => ({ id: k, fw: 16, fh: 16, columns: 4 });
  const sc = (): RenderScene => { box.driver.backend.frame("src", 0, 16, 16); if (last === undefined || lastId !== `${id}${salt}`) { lastId = `${id}${salt}`; last = { ...world(salt), standing: ["keep0", "keep1", "keep2", id, "far"].map((k, c) => ({ kind: "object" as const, sheet: sheet(k), c: k === "far" ? far : c, r: k === "far" ? 5 : 0 })) }; } return last; };
  const load: Load = (k) => { loads.set(k, (loads.get(k) ?? 0) + 1); const img = solid(0x336699); return k === "late" ? new Promise((done) => { held.push(() => done(img)); }) : Promise.resolve(img); };
  const box = rig({ scene: sc, load, max: 4 }); box.driver.start();
  const show = async (k: string): Promise<void> => { id = k; box.fire(16); await flush(); box.fire(16); await flush(); };
  await show("s0"); far = 20; for (let f = 1; f < 10; f += 1) await show(`s${f}`);
  for (const k of ["g", "a", "keep0", "keep1", "keep2", "s0"]) assert.equal(loads.get(k), 1, k);
  await show("s0"); assert.equal(loads.get("s0"), 2);
  await show("late"); for (let f = 20; f < 26; f += 1) await show(`s${f}`); for (const go of held) go(); await flush();
  await show("late"); assert.equal(loads.get("late"), 2); salt = 1; far = 1; await show("late"); for (const k of ["g", "a", "keep0", "keep1", "keep2", "src", "far"]) assert.equal(loads.get(k), 1, k); // src: read this frame by the scene's pixel source, not named by the scene
  box.driver.dispose();
  const loose = rig({ scene: sc, load }); loose.driver.start(); for (let f = 0; f < 300; f += 1) { id = `d${f}`; loose.fire(16); loose.fire(16); } await flush(); id = "d0"; loose.fire(16); await flush(); assert.equal(loads.get("d0"), 2, "default cap 256"); loose.driver.dispose();
  let cur: string[] = [], ov = 0; const lru = rig({ load, max: 5, scene: () => ({ ...world(), standing: cur.map((k, c) => ({ kind: "object" as const, sheet: sheet(k), c, r: 0 })), overlays: [{ band: "ui" as const, sheet: sheet("lov"), x: ov, y: 0 }] }) }), go = async (ks: string[], o: number): Promise<void> => { cur = ks; ov = o; lru.fire(16); await flush(); lru.fire(16); await flush(); }; lru.driver.start(); for (const [ks, o] of [[[], 0], [["lx"], 4000], [["ly"], 4000], [["lx"], 4000], [["lz"], 4000], [["lx"], 4000]] as const) await go([...ks], o); assert.equal(loads.get("lx"), 1, "LRU, down to the cap"); await go([], 0); assert.equal(loads.get("lov"), 1, "overlay sheet"); await go(["ly"], 4000); assert.equal(loads.get("ly"), 2); lru.driver.dispose(); // QA 34a: least recent first, only down to the cap; a named overlay sheet stays
});
test("lite: two slow 60-frame windows switch it on; 16 ms frames switch it off only after a 10 s hold that doubles; 20 ms frames and gaps never flip it either way; an override is never fought (step 34a)", () => {
  const box = rig(), run = (n: number, ms: number): void => { for (let i = 0; i < n; i += 1) box.fire(ms); }, lite = (): boolean => box.driver.stats.lite;
  box.driver.start(); box.fire(16); run(240, 20); run(5, 2000); assert.equal(lite(), false);
  run(60, 40); assert.equal(lite(), false); run(60, 40); assert.equal(lite(), true);
  run(600, 16); assert.equal(lite(), true); run(60, 16); assert.equal(lite(), false);
  run(120, 40); assert.equal(lite(), true); run(1200, 16); assert.equal(lite(), true); run(120, 20); assert.equal(lite(), true); run(60, 16); assert.equal(lite(), false);
  box.driver.lite("off"); run(240, 40); assert.equal(lite(), false); box.driver.lite("auto"); assert.equal(lite(), true);
  box.driver.lite("on"); run(6000, 16); assert.equal(lite(), true); box.driver.lite("auto"); assert.equal(lite(), false); box.driver.dispose();
});
test("a lite flip, by override or by auto, requests one draw of an idle scene; setting the same mode again does not (step 34a)", async () => {
  const sc = world(), box = rig({ scene: () => sc }), draws = (): number => box.driver.stats.draws; box.driver.start(); box.run(0.5, 60); await flush(); box.run(0.5, 60);
  const idle = draws(); box.run(0.5, 60); assert.equal(draws(), idle); box.driver.lite("on"); box.fire(16); assert.equal(draws(), idle + 1); box.driver.lite("on"); box.run(0.5, 60); assert.equal(draws(), idle + 1);
  box.driver.lite("auto"); box.fire(16); assert.equal(draws(), idle + 2); for (let i = 0; i < 120; i += 1) box.fire(40); assert.equal(box.driver.stats.lite, true); assert.equal(draws(), idle + 3); box.driver.dispose();
});
test("lite (QA 34a): only back-to-back slow windows switch it on; a window's p95 ignores three spikes; gaps never count toward the hold; the hold doubles up to its 5 min cap", () => {
  const box = rig(), run = (n: number, ms: number): void => { for (let i = 0; i < n; i += 1) box.fire(ms); }, lite = (): boolean => box.driver.stats.lite; box.driver.start(); box.fire(16); run(60, 40); run(60, 16); run(60, 40); assert.equal(lite(), false, "a fast window between"); for (let w = 0; w < 2; w += 1) { run(57, 16); run(3, 100); } assert.equal(lite(), false, "p95, not max"); run(120, 40); assert.equal(lite(), true); run(5, 2000); run(600, 16); assert.equal(lite(), true, "gaps are not frames"); run(60, 16); assert.equal(lite(), false); for (const h of [20, 40, 80, 160, 300, 300]) { run(120, 40); run((Math.ceil((h * 1000) / 960) - 1) * 60, 16); assert.equal(lite(), true, `hold ${h} s`); run(60, 16); assert.equal(lite(), false, `hold ${h} s`); } box.driver.dispose();
});
