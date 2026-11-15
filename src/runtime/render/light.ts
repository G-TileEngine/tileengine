import { createSight, openCell, type Blockers } from "./visibility.ts";
import type { Cam, Fit, Overlay, RenderScene, Sheet, Standing, TileLayer } from "./types.ts";

export type Light = { readonly x: number; readonly y: number; readonly radius: number; readonly fullyDark?: boolean; readonly colour?: string; readonly keepInDim?: boolean };
export type FxLit = { readonly lights: readonly Light[] };
export type LightWorld = Blockers & { readonly tileW: number; readonly tileH: number };
export type LightPlan = { readonly res: number; readonly w: number; readonly h: number; readonly dark: Uint8Array; readonly level: Uint8Array; readonly tint?: Uint8Array; readonly colours?: readonly string[] };
export type FillOp = { readonly x: number; readonly y: number; readonly w: number; readonly h: number; readonly colour: string; readonly op?: "add" };
export const BANDS_OF_LIGHT = 6, WASH_MAX = 0.62, DARK_CAP = 0.72, STEPS = 32;

export function darkness(wash: number, dim: number): number {
  const w = Number.isFinite(wash) ? Math.min(1, Math.max(0, wash)) : 0, d = Number.isFinite(dim) ? Math.min(1, Math.max(0, dim)) : 0, aWash = WASH_MAX * w, room = 1 - (1 - DARK_CAP) / (1 - aWash);
  return Math.floor((1 - (1 - aWash) * (1 - Math.min(d, room))) * STEPS);
}

export function createLighting(): { plan(world: LightWorld, lights: readonly Light[], wash: number, dim: number, res: number, fx?: FxLit, allDark?: boolean): LightPlan; readonly stats: { plans: number; squares: number; masks: { computed: number } } } { // squares (s34b R-d): squares the light boxes visit, for the bound test
  const sight = createSight(), stats = { plans: 0, squares: 0, masks: sight.stats };
  let prev: { world: LightWorld; lights: readonly Light[]; wash: number; dim: number; res: number; fx?: FxLit; allDark: boolean; plan: LightPlan } | undefined;
  const rgb = (hex: string | undefined): string => { const m = hex === undefined ? null : /^#([0-9a-f]{6})$/i.exec(hex); if (m === null || m[1] === undefined) return ""; const n = Number.parseInt(m[1], 16); return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`; };
  return {
    stats,
    plan(world, lights, wash, dim, res, fx, allDark) {
      const darken = allDark === true;
      if (prev !== undefined && prev.world === world && prev.lights === lights && Object.is(prev.wash, wash) && Object.is(prev.dim, dim) && prev.res === res && prev.fx === fx && prev.allDark === darken) return prev.plan;
      stats.plans += 1;
      const total = darkness(wash, dim), sw = Math.ceil(world.cols * world.tileW / res), sh = Math.ceil(world.rows * world.tileH / res);
      const level = new Uint8Array(sw * sh), dark = new Uint8Array(sw * sh), span = Math.min(world.tileW, world.tileH), blind = !Number.isFinite(wash) || !Number.isFinite(dim);
      dark.fill(Math.round((total * BANDS_OF_LIGHT) / BANDS_OF_LIGHT));
      const all = fx === undefined ? lights : [...lights, ...fx.lights], names: string[] = [], tint = all.some((l) => rgb(l.colour) !== "") ? new Uint8Array(sw * sh) : undefined;
      const tone = (colour: string | undefined): number => { const key = rgb(colour); if (key === "") return 0; let i = names.indexOf(key); if (i < 0) { names.push(key); i = names.length - 1; } return i + 1; };
      for (const light of all) {
        if (blind || (dim > 0 && light.keepInDim !== true && (darken || light.fullyDark === true))) continue;
        const radius = dim > 0 && light.keepInDim !== true ? light.radius / 2 : light.radius;
        if (!(radius > 0)) continue;
        const cell = openCell(world, Math.floor(light.x / world.tileW), Math.floor(light.y / world.tileH));
        if (cell === null) continue;
        const mask = sight.mask(world, cell.c, cell.r, Math.ceil(radius / span) + 1), ink = tone(light.colour);
        const x0 = Math.max(0, Math.floor((light.x - radius) / res)), x1 = Math.min(sw, Math.ceil((light.x + radius) / res)), y0 = Math.max(0, Math.floor((light.y - radius) / res)), y1 = Math.min(sh, Math.ceil((light.y + radius) / res));
        for (let y = y0; y < y1; y += 1) for (let x = x0; x < x1; x += 1) {
          stats.squares += 1;
          const cx = x * res + res / 2, cy = y * res + res / 2, sc = Math.floor(cx / world.tileW), sr = Math.floor(cy / world.tileH);
          if (sc < 0 || sr < 0 || sc >= world.cols || sr >= world.rows || mask[sr * world.cols + sc] !== 1) continue;
          const dx = cx - light.x, dy = cy - light.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= radius) continue;
          const lv = BANDS_OF_LIGHT - Math.floor((BANDS_OF_LIGHT * dist) / radius), i = y * sw + x;
          if (lv > (level[i] ?? 0)) { level[i] = lv; dark[i] = Math.round((total * (BANDS_OF_LIGHT - lv)) / BANDS_OF_LIGHT); if (tint !== undefined) tint[i] = ink; }
        }
      }
      const plan: LightPlan = tint === undefined ? { res, w: sw, h: sh, dark, level } : { res, w: sw, h: sh, dark, level, tint, colours: names };
      prev = { world, lights, wash, dim, res, ...(fx === undefined ? {} : { fx }), allDark: darken, plan };
      return plan;
    },
  };
}

export function lightOps(plan: LightPlan, fit: Fit, cam: Cam, glow = "255,176,72", walked?: { squares: number }): FillOp[] { // walked (s34b R-d): squares the walk visits, for the bound test
  const ops: FillOp[] = [], s = fit.s, res = plan.res, w = plan.w, h = plan.h, ox = fit.padX - cam.devX, oy = fit.padY - cam.devY;
  const x0 = cam.devX / s, y0 = cam.devY / s, x1 = x0 + fit.artW + res, y1 = y0 + fit.artH + res;
  const ix0 = Math.max(0, Math.floor(x0 / res) - 1), iy0 = Math.max(0, Math.floor(y0 / res) - 1), ix1 = Math.min(w, Math.ceil(x1 / res) + 1), iy1 = Math.min(h, Math.ceil(y1 / res) + 1);
  const on = (ix: number, iy: number): boolean => (ix + 1) * res > x0 && ix * res < x1 && (iy + 1) * res > y0 && iy * res < y1;
  const paint = (iy: number, at: (ix: number) => string, add: boolean): void => {
    let from = -1, ink = "";
    const flush = (to: number): void => { if (from >= 0) ops.push(add ? { x: from * res * s + ox, y: iy * res * s + oy, w: (to - from) * res * s, h: res * s, colour: ink, op: "add" } : { x: from * res * s + ox, y: iy * res * s + oy, w: (to - from) * res * s, h: res * s, colour: ink }); };
    for (let ix = ix0; ix <= ix1; ix += 1) { if (walked !== undefined) walked.squares += 1;
      const colour = ix < ix1 && on(ix, iy) ? at(ix) : "";
      if (colour === ink) continue;
      flush(ix); from = colour === "" ? -1 : ix; ink = colour;
    }
  };
  for (let y = iy0; y < iy1; y += 1) paint(y, (x) => { const k = plan.dark[y * w + x] ?? 0; return k === 0 ? "" : `rgba(3,8,26,${k / STEPS})`; }, false);
  for (let y = iy0; y < iy1; y += 1) paint(y, (x) => { const lv = plan.level[y * w + x] ?? 0; if (lv < 4) return ""; const idx = plan.tint?.[y * w + x] ?? 0; const ink = idx > 0 ? plan.colours?.[idx - 1] ?? glow : glow; return `rgba(${ink},${((lv - 3) * 2) / STEPS})`; }, true);
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
