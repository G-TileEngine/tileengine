import { installOne } from "../../src/rules/behaviours/registry.ts";
import { reachCells, walkTo } from "../../src/rules/move/path.ts";
import { STEP_PATTERN } from "../../src/rules/move/step-pattern.ts";
import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.ts";
import { botAbilityPriority } from "../../src/rules/turns/bot-ability-priority.ts";
import { createGestureMapper } from "../../src/runtime/input/gestures.ts";
import type { PointerSample } from "../../src/runtime/input/types.ts";
import type { Pixels } from "../../src/runtime/render/bakes.ts";
import type { Sheet } from "../../src/runtime/render/types.ts";
import type { SceneAsset } from "../../src/runtime/scene/world-scene.ts";
import { createPlayer } from "../../src/sim/player.ts";
import type { DoorIntent } from "../../src/sim/types.ts";
import { createWorld } from "../../src/sim/world.ts";
import { xGo, type Event } from "../../src/state/index.ts";
import type { Sq } from "../../src/types/core-types.ts";
import { RECIPES, TEAM, TILE, docsToInput, recipeIn, recipeOf, type PlayDocs } from "./load.ts";
import { bundledDocs } from "./project.ts";
import { createPlayFx, fxPx } from "./fx.ts";
import { dress, dressPx, unitAsset } from "./looks.ts";
import { paintOf, sidesOf } from "./sides.ts";

export { recipeOf, TILE };
const FONT: Readonly<Record<string, readonly number[]>> = {
  A: [14, 17, 17, 31, 17, 17, 17], C: [14, 17, 16, 16, 16, 17, 14], K: [17, 18, 20, 24, 20, 18, 17],
  M: [17, 27, 21, 21, 17, 17, 17], V: [17, 17, 17, 17, 17, 10, 4], W: [17, 17, 17, 21, 21, 27, 17], "?": [14, 17, 2, 4, 4, 0, 4],
};
const cache = new Map<string, Pixels>();
const sheet = (id: string): Sheet => ({ id, columns: 1, fw: TILE, fh: TILE });
const REACH = sheet("play:reach-player"), PATH = sheet("play:path-player"), AIM_A = sheet("play:aim-attack"), AIM_S = sheet("play:aim-spell");
function bake(id: string, rgb: number, letter: string): Pixels {
  const hit = cache.get(id); if (hit !== undefined) return hit;
  const data = new Uint8ClampedArray(TILE * TILE * 4), r = (rgb >>> 16) & 255, g = (rgb >>> 8) & 255, b = rgb & 255;
  for (let i = 0; i < data.length; i += 4) { data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255; }
  const rows = letter === "" ? undefined : FONT[letter] ?? FONT["?"];
  if (rows !== undefined) for (let y = 0; y < rows.length; y += 1) { const bits = rows[y] ?? 0; for (let x = 0; x < 5; x += 1) if ((bits & (1 << (4 - x))) !== 0) { const o = ((y + 4) * TILE + (x + 5)) * 4; data[o] = 248; data[o + 1] = 244; data[o + 2] = 230; data[o + 3] = 255; } }
  const px = { w: TILE, h: TILE, data }; cache.set(id, px); return px;
}
const SHAPE: Readonly<Record<string, readonly number[]>> = {
  stairs: [0, 0, 0, 15360, 15360, 15360, 0, 16320, 16320, 16320, 0, 16380, 16380, 16380, 0, 0],
  door: [0, 0, 4080, 4080, 3120, 3120, 3120, 3120, 4080, 4080, 4080, 4080, 4080, 4080, 0, 0],
  gate: [0, 0, 0, 8184, 4680, 4680, 4680, 4680, 4680, 4680, 4680, 4680, 8184, 0, 0, 0],
  link: [0, 0, 0, 128, 448, 992, 2032, 4088, 2032, 992, 448, 128, 0, 0, 0, 0],
};
function linkPx(kind: string): Pixels | undefined {
  const rows = Object.hasOwn(SHAPE, kind) ? SHAPE[kind] : undefined; if (rows === undefined) return undefined;
  const id = `play:link-${kind}`, hit = cache.get(id); if (hit !== undefined) return hit;
  const data = new Uint8ClampedArray(16 * 16 * 4), bit = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < 16 && y < 16 && ((rows[y] ?? 0) & (1 << x)) !== 0;
  for (let y = 0; y < 16; y += 1) for (let x = 0; x < 16; x += 1) {
    const lit = bit(x, y); let edge = false; if (!lit) for (let dy = -1; dy <= 1 && !edge; dy += 1) for (let dx = -1; dx <= 1; dx += 1) if ((dx !== 0 || dy !== 0) && bit(x + dx, y + dy)) edge = true;
    if (!lit && !edge) continue; const o = (y * 16 + x) * 4; data[o] = lit ? 248 : 16; data[o + 1] = lit ? 244 : 20; data[o + 2] = lit ? 230 : 28; data[o + 3] = 255;
  }
  const px = { w: 16, h: 16, data }; cache.set(id, px); return px;
}
export function pixelsOf(id: string): Pixels | undefined {
  if (id.startsWith("play:link-")) return linkPx(id.slice(10));
  const dressed = dressPx(id); if (dressed !== undefined) return dressed;
  const sparked = fxPx(id); if (sparked !== undefined) return sparked;
  if (id === "play:floor") return bake(id, 0x243044, "");
  if (id === "play:reach-player") return bake(id, 0x3b82f6, "");
  if (id === "play:path-player") return bake(id, 0xf0c14a, "");
  if (id === "play:aim-attack") return bake(id, 0xe04848, "");
  if (id === "play:aim-spell") return bake(id, 0xf08a30, "");
  for (const recipe of Object.values(RECIPES)) if (recipe.id === id) return bake(id, TEAM.neutral, recipe.name.slice(0, 1));
  return id.startsWith("starter:unknown-") ? bake(id, TEAM.neutral, "?") : undefined;
}
export const MIN_CELL_CSS = 44;
export const HUD_TOP = 48, ROW_FOOT = 88, PLATE_H = 44, HUD_FOOT = ROW_FOOT + PLATE_H;
export const boardBox = (viewH: number): { top: number; height: number } => ({ top: HUD_TOP, height: Math.max(0, viewH - HUD_TOP - HUD_FOOT) });
export function fit(devW: number, devH: number, cols: number, rows: number, dpr: number): { s: number; padX: number; padY: number } {
  const mw = cols * TILE, mh = rows * TILE, fitted = Math.floor(Math.min(devW / mw, devH / mh)), minS = Math.ceil((MIN_CELL_CSS * dpr) / TILE);
  const s = Math.max(Number.isFinite(minS) && minS >= 1 ? minS : 1, Number.isFinite(fitted) && fitted >= 1 ? fitted : 1);
  return { s, padX: Math.floor((devW - Math.floor(devW / s) * s) / 2), padY: Math.floor((devH - Math.floor(devH / s) * s) / 2) };
}
/** Own ability rows only. A prototype key such as `constructor` is not a spell. */
export function spellRef(setup: { readonly abilities?: Readonly<Record<string, readonly { readonly effectRef: string }[]>> }, id: string): string | undefined {
  const bag = setup.abilities; if (bag === undefined || !Object.hasOwn(bag, id)) return undefined; return bag[id]?.[0]?.effectRef;
}
type Walk = { path: readonly Sq[]; from: Sq; t0: number; dur: number };
export function createPlay(docs?: PlayDocs, moveMs = 200, autoWait = true) {
  const body = docs ?? bundledDocs(), talk = body.talk ?? {}, chosen = body.chosen ?? [], tiles = body.tiles ?? [];
  const world = createWorld(docsToInput({ ...body, talk, chosen, tiles }).input);
  const sides = sidesOf(body.stage, world.units.all());
  const go = (e: Event): void => { const from = world.phases.battle; if (from === undefined) throw new Error("play: phase"); world.phases = { ...world.phases, battle: xGo(from, e) }; };
  go({ type: "BATTLE_READY" }); go({ type: "DEPLOY_DONE" }); go({ type: "ROUND_BEGIN" }); go({ type: "SIDE_BEGIN" });
  const installed = installOne(STEP_PATTERN, {});
  if (installed.out === null) throw new Error("play: step-pattern");
  const step = installed.out;
  let n = 0;
  const spent = installOne(ACTION_BUDGET, {});
  if (spent.out === null) throw new Error("play: action-budget");
  const budget = spent.out;
  const player = createPlayer(world, { side: sides.me, moveMs, nextId: () => `p${n += 1}`, step, spellOf: (id) => { const u = world.units.get(id); return u === undefined ? undefined : spellRef(body.rules, u.unitId); } });
  const bot = botAbilityPriority({ setup: body.rules, stepReach: step.reach, actionsPerTurn: budget.actionsPerTurn });
  const gestures = createGestureMapper({ cellPx: TILE, tapMaxPx: 12, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (at) => world.units.occupantAt(at) });
  const fx = createPlayFx(body.effects), paint = new Map<string, { readonly sprite: string; readonly asset: SceneAsset }>(), seen = new Map<string, string>();
  let looks = dress(world.grid, body.looks), artBox: Record<string, SceneAsset> | null = null, artKey = "";
  const marks = (body.links ?? []).map((link) => ({ band: "fxGround" as const, sheet: { id: `play:link-${Object.hasOwn(SHAPE, link.type) ? link.type : "link"}`, columns: 1, fw: 16, fh: 16 }, x: link.at.c * TILE, y: link.at.r * TILE }));
  for (const u of world.units.all()) { const recipeId = recipeIn(body.recipes, u.unitId).id, tone = paintOf(u.side, sides.me), prior = seen.get(recipeId); if (prior === undefined) seen.set(recipeId, tone); paint.set(u.id, { sprite: prior === undefined || prior === tone ? recipeId : `${recipeId}@${tone}`, asset: unitAsset(`${recipeId}@${tone}`) }); }
  let selected: string | null = null, pending: Sq | null = null, reach: Sq[] = [], preview: Sq[] = [], walk: Walk | null = null, aims: Sq[] = [], aimKind: "basic" | "spell" = "basic", followId: string | null = null, onLand: (() => void) | null = null;
  let route: (intent: DoorIntent) => unknown = (intent) => intend(intent);
  const mark = (): void => { reach = selected === null ? [] : reachCells(world.grid, world.units, selected, step.reach); };
  const sync = (): void => {
    if (walk === null || selected === null) return;
    const t = walk.dur <= 0 ? 1 : (world.clock.now() - walk.t0) / walk.dur;
    if (t >= 1) {
      world.units.setOffset(selected, null);
      const from = world.phases.battle;
      if (from === "moving") { let phase = xGo(from, { type: "MOVE_DONE" }); if (autoWait) { phase = xGo(phase, { type: "WAIT" }); phase = xGo(phase, { type: "UNIT_DONE", next: "idle" }); } world.phases = { ...world.phases, battle: phase }; }
      walk = null; pending = null; preview = []; mark(); onLand?.(); return;
    }
    const steps = walk.path.length, f = t * steps, i = Math.min(steps - 1, Math.floor(f)), a = i === 0 ? walk.from : walk.path[i - 1], b = walk.path[i];
    if (a === undefined || b === undefined) return;
    world.units.setOffset(selected, { dx: (b.c - a.c) * (f - i), dy: (b.r - a.r) * (f - i) });
  };
  const intend = (intent: DoorIntent) => {
    if (intent.type === "SelectUnit") {
      const stepped = player.feed(intent);
      pending = null; preview = [];
      selected = stepped.reject === null ? intent.unitId : selected;
      if (stepped.reject !== null) selected = null;
      mark(); return stepped;
    }
    if (intent.type === "Cancel") { pending = null; preview = []; return player.feed(intent); }
    if (intent.type !== "TargetCell") return player.feed(intent);
    const at = intent.at, same = pending !== null && pending.c === at.c && pending.r === at.r, targeting = world.phases.battle === "targeting";
    const on = (targeting ? aims : reach).some((c) => c.c === at.c && c.r === at.r);
    if (!same && !on) { pending = null; preview = []; return { reject: "notReachable" as const, preview: [] as readonly Sq[] }; }
    if (!same) { pending = { c: at.c, r: at.r }; preview = targeting ? [pending] : (selected === null ? [] : walkTo(world.grid, world.units, selected, step.reach, at) ?? []); return { preview }; }
    const stepped = player.feed(intent);
    pending = null; preview = [];
    if (stepped.action?.kind === "move" && stepped.path !== undefined && selected !== null) {
      const u = world.units.get(selected);
      walk = { path: stepped.path, from: { c: u?.at.c ?? at.c, r: u?.at.r ?? at.r }, t0: world.clock.now(), dur: stepped.action.durationMs ?? 0 };
      followId = selected; sync();
    }
    return stepped;
  };
  return {
    world, step, intend, sync, bot, pixels: pixelsOf, autoWait, go, fx, looks, sides,
    bare(): void { looks = dress(world.grid, body.looks, true); artBox = null; },
    focus(id: string | null): void { selected = id; pending = null; preview = []; mark(); },
    arm(next: Walk): void { walk = next; sync(); },
    landed(fn: (() => void) | null): void { onLand = fn; },
    get aims() { return aims; }, set aims(v: readonly Sq[]) { aims = v.map((c) => ({ c: c.c, r: c.r })); },
    get aimKind() { return aimKind; }, set aimKind(v: "basic" | "spell") { aimKind = v; },
    get followId() { return followId; }, set followId(v: string | null) { followId = v; },
    get selected() { return selected; }, get reach() { return reach; }, get pending() { return pending; }, get walk() { return walk; },
    get feed() { return route; }, set feed(fn: (intent: DoorIntent) => unknown) { route = fn; },
    pointer(sample: PointerSample): void { for (const intent of gestures(sample)) route(intent); },
    scene() {
      sync();
      const aimSheet = aimKind === "spell" ? AIM_S : AIM_A, aimOver = world.phases.battle === "targeting" ? aims.map((c) => ({ band: "fxGround" as const, sheet: aimSheet, x: c.c * TILE, y: c.r * TILE })) : [];
      const overlays = selected === null && world.phases.battle !== "targeting" ? marks : [...(selected === null ? [] : reach.map((c) => ({ band: "fxGround" as const, sheet: REACH, x: c.c * TILE, y: c.r * TILE }))), ...(selected === null ? [] : preview.map((c) => ({ band: "fxGround" as const, sheet: PATH, x: c.c * TILE, y: c.r * TILE }))), ...aimOver, ...marks];
      const key = world.units.all().map((u) => paint.get(u.id)?.sprite ?? "").join("\0"); if (artBox === null || artKey !== key) { artKey = key; artBox = { ...looks.assets, "play:fx": { sheet: { id: "play:fx", columns: 4, fw: TILE, fh: TILE } } }; }
      const assets = artBox;
      const units = world.units.all().map((u) => { const row = paint.get(u.id); if (row === undefined) throw new Error("play: paint"); assets[row.sprite] = row.asset; return { id: u.id, sprite: row.sprite, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
      return { cols: world.grid.cols, rows: world.grid.rows, tileW: TILE, tileH: TILE, mapSeed: world.seed, assets, layers: looks.layers, units, objects: looks.objects, overlays, effects: fx.ingest(world.log, world.clock.stepMs, world.clock.now()), style: looks.style, waterTiles: looks.waterTiles, seeThroughCanopy: true as const };
    },
  };
}
