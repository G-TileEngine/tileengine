import { createSight, openCell, type Blockers } from "./visibility.ts";
import type { Cam, Fit, Overlay, RenderScene, Sheet, Standing, TileLayer } from "./types.ts";

export type Light = { readonly x: number; readonly y: number; readonly radius: number; readonly fullyDark?: boolean };
export type LightWorld = Blockers & { readonly tileW: number; readonly tileH: number };
export type LightPlan = { readonly res: number; readonly w: number; readonly h: number; readonly dark: Uint8Array; readonly level: Uint8Array };
export type FillOp = { readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly colour: string };
export const BANDS_OF_LIGHT = 6, WASH_MAX = 0.62, DARK_CAP = 0.72, STEPS = 32;

export function darkness(wash: number, dim: number): number {
  const w = Math.min(1, Math.max(0, wash)), d = Math.min(1, Math.max(0, dim)), aWash = WASH_MAX * w, room = 1 - (1 - DARK_CAP) / (1 - aWash);
  return Math.floor((1 - (1 - aWash) * (1 - Math.min(d, room))) * STEPS);
}

export function createLighting(): { plan(world: LightWorld, lights: readonly Light[], wash: number, dim: number, res: number): LightPlan; readonly stats: { plans: number; masks: { computed: number } } } {
  const sight = createSight(), stats = { plans: 0, masks: sight.stats };
  let prev: { world: LightWorld; lights: readonly Light[]; wash: number; dim: number; res: number; plan: LightPlan } | undefined;
  return {
    stats,
    plan(world, lights, wash, dim, res) {
      if (prev !== undefined && prev.world === world && prev.lights === lights && prev.wash === wash && prev.dim === dim && prev.res === res) return prev.plan;
      stats.plans += 1;
      const total = darkness(wash, dim), sw = Math.ceil(world.cols * world.tileW / res), sh = Math.ceil(world.rows * world.tileH / res);
      const level = new Uint8Array(sw * sh), dark = new Uint8Array(sw * sh), span = Math.min(world.tileW, world.tileH);
      for (const light of lights) {
        if (dim > 0 && light.fullyDark === true) continue;
        const radius = dim > 0 ? light.radius / 2 : light.radius;
        if (!(radius > 0)) continue;
        const cell = openCell(world, Math.floor(light.x / world.tileW), Math.floor(light.y / world.tileH));
        if (cell === null) continue;
        const mask = sight.mask(world, cell.c, cell.r, Math.ceil(radius / span) + 1);
        for (let y = 0; y < sh; y += 1) for (let x = 0; x < sw; x += 1) {
          const cx = x * res + res / 2, cy = y * res + res / 2, sc = Math.floor(cx / world.tileW), sr = Math.floor(cy / world.tileH);
          if (sc < 0 || sr < 0 || sc >= world.cols || sr >= world.rows || mask[sr * world.cols + sc] !== 1) continue;
          const dx = cx - light.x, dy = cy - light.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= radius) continue;
          const lv = BANDS_OF_LIGHT - Math.floor((BANDS_OF_LIGHT * dist) / radius), i = y * sw + x;
          if (lv > (level[i] ?? 0)) level[i] = lv;
        }
      }
      for (let i = 0; i < dark.length; i += 1) dark[i] = Math.round((total * (BANDS_OF_LIGHT - (level[i] ?? 0))) / BANDS_OF_LIGHT);
      const plan = { res, w: sw, h: sh, dark, level };
      prev = { world, lights, wash, dim, res, plan };
      return plan;
    },
  };
}

export function lightOps(plan: LightPlan, fit: Fit, cam: Cam, glow = "255,176,72"): FillOp[] {
  const ops: FillOp[] = [], s = fit.s, res = plan.res, ox = fit.padX - cam.devX, oy = fit.padY - cam.devY;
  const x0 = cam.devX / s, y0 = cam.devY / s, x1 = x0 + fit.artW + res, y1 = y0 + fit.artH + res;
  const on = (ix: number, iy: number): boolean => (ix + 1) * res > x0 && ix * res < x1 && (iy + 1) * res > y0 && iy * res < y1;
  const paint = (iy: number, at: (ix: number) => string): void => {
    let from = -1, ink = "";
    const flush = (to: number): void => { if (from >= 0) ops.push({ x: from * res * s + ox, y: iy * res * s + oy, w: (to - from) * res * s, h: res * s, colour: ink }); };
    for (let ix = 0; ix <= plan.w; ix += 1) {
      const colour = ix < plan.w && on(ix, iy) ? at(ix) : "";
      if (colour === ink) continue;
      flush(ix); from = colour === "" ? -1 : ix; ink = colour;
    }
  };
  for (let y = 0; y < plan.h; y += 1) paint(y, (x) => { const k = plan.dark[y * plan.w + x] ?? 0; return k === 0 ? "" : `rgba(3,8,26,${k / STEPS})`; });
  for (let y = 0; y < plan.h; y += 1) paint(y, (x) => { const lv = plan.level[y * plan.w + x] ?? 0; return lv < 4 ? "" : `rgba(${glow},${((lv - 3) * 2) / STEPS})`; });
  return ops;
}

const nightOf = (sheet: Sheet, swap: ReadonlyMap<string, string>): Sheet => { const id = swap.get(sheet.id); return id === undefined || id === sheet.id ? sheet : { ...sheet, id }; };
const lay = (layer: TileLayer, swap: ReadonlyMap<string, string>): TileLayer => { const sheet = nightOf(layer.sheet, swap); return sheet === layer.sheet ? layer : { ...layer, sheet }; };
const prop = (st: Standing, swap: ReadonlyMap<string, string>): Standing => { const sheet = nightOf(st.sheet, swap); return sheet === st.sheet ? st : { ...st, sheet }; };
const over = (o: Overlay, swap: ReadonlyMap<string, string>): Overlay => { const sheet = nightOf(o.sheet, swap); return sheet === o.sheet ? o : { ...o, sheet }; };

export function createMoonlit(): (scene: RenderScene, swap: ReadonlyMap<string, string>) => RenderScene {
  let scene: RenderScene | undefined, swap: ReadonlyMap<string, string> | undefined, prev: RenderScene | undefined;
  return (next, map) => {
    if (prev !== undefined && scene === next && swap === map) return prev;
    prev = { ...next, ground: next.ground.map((layer) => lay(layer, map)), above: next.above.map((layer) => lay(layer, map)), standing: next.standing.map((st) => prop(st, map)), overlays: next.overlays.map((o) => over(o, map)) };
    scene = next; swap = map;
    return prev;
  };
}
