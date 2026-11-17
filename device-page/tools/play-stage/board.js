import { installOne } from "../../src/rules/behaviours/registry.js";
import { reachCells, walkTo } from "../../src/rules/move/path.js";
import { STEP_PATTERN } from "../../src/rules/move/step-pattern.js";
import { ACTION_BUDGET } from "../../src/rules/turns/action-budget.js";
import { botAbilityPriority } from "../../src/rules/turns/bot-ability-priority.js";
import { createGestureMapper } from "../../src/runtime/input/gestures.js";
                                                                      
                                                                
                                                               
                                                                         
import { createPlayer } from "../../src/sim/player.js";
                                                         
import { createWorld } from "../../src/sim/world.js";
import { xGo,            } from "../../src/state/index.js";
                                                        
import { DEMO_LOAD, DEMO_TALK, RECIPES, TEAM, TILE, docsToInput, recipeOf,               } from "./load.js";
import { createPlayFx, fxPx } from "./fx.js";
import { dress, dressPx, unitAsset } from "./looks.js";

export { recipeOf, TILE };
const FONT                                              = {
  A: [14, 17, 17, 31, 17, 17, 17], C: [14, 17, 16, 16, 16, 17, 14], K: [17, 18, 20, 24, 20, 18, 17],
  M: [17, 27, 21, 21, 17, 17, 17], V: [17, 17, 17, 17, 17, 10, 4], W: [17, 17, 17, 21, 21, 27, 17], "?": [14, 17, 2, 4, 4, 0, 4],
};
const cache = new Map                ();
const sheet = (id        )        => ({ id, columns: 1, fw: TILE, fh: TILE });
const REACH = sheet("play:reach-player"), PATH = sheet("play:path-player"), AIM_A = sheet("play:aim-attack"), AIM_S = sheet("play:aim-spell");
function bake(id        , rgb        , letter        )         {
  const hit = cache.get(id); if (hit !== undefined) return hit;
  const data = new Uint8ClampedArray(TILE * TILE * 4), r = (rgb >>> 16) & 255, g = (rgb >>> 8) & 255, b = rgb & 255;
  for (let i = 0; i < data.length; i += 4) { data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255; }
  const rows = letter === "" ? undefined : FONT[letter] ?? FONT["?"];
  if (rows !== undefined) for (let y = 0; y < rows.length; y += 1) { const bits = rows[y] ?? 0; for (let x = 0; x < 5; x += 1) if ((bits & (1 << (4 - x))) !== 0) { const o = ((y + 4) * TILE + (x + 5)) * 4; data[o] = 248; data[o + 1] = 244; data[o + 2] = 230; data[o + 3] = 255; } }
  const px = { w: TILE, h: TILE, data }; cache.set(id, px); return px;
}
export function pixelsOf(id        )                     {
  const dressed = dressPx(id); if (dressed !== undefined) return dressed;
  const sparked = fxPx(id); if (sparked !== undefined) return sparked;
  if (id === "play:floor") return bake(id, 0x243044, "");
  if (id === "play:reach-player") return bake(id, 0x3b82f6, "");
  if (id === "play:path-player") return bake(id, 0xf0c14a, "");
  if (id === "play:aim-attack") return bake(id, 0xe04848, "");
  if (id === "play:aim-spell") return bake(id, 0xf08a30, "");
  for (const recipe of Object.values(RECIPES)) if (recipe.id === id) return bake(id, TEAM[recipe.team], recipe.name.slice(0, 1));
  return id.startsWith("starter:unknown-") ? bake(id, TEAM.neutral, "?") : undefined;
}
export const MIN_CELL_CSS = 44;
export const HUD_TOP = 48, ROW_FOOT = 88, PLATE_H = 44, HUD_FOOT = ROW_FOOT + PLATE_H;
export const boardBox = (viewH        )                                  => ({ top: HUD_TOP, height: Math.max(0, viewH - HUD_TOP - HUD_FOOT) });
export function fit(devW        , devH        , cols        , rows        , dpr        )                                            {
  const mw = cols * TILE, mh = rows * TILE, fitted = Math.floor(Math.min(devW / mw, devH / mh)), minS = Math.ceil((MIN_CELL_CSS * dpr) / TILE);
  const s = Math.max(Number.isFinite(minS) && minS >= 1 ? minS : 1, Number.isFinite(fitted) && fitted >= 1 ? fitted : 1);
  return { s, padX: Math.floor((devW - Math.floor(devW / s) * s) / 2), padY: Math.floor((devH - Math.floor(devH / s) * s) / 2) };
}
/** Own ability rows only. A prototype key such as `constructor` is not a spell. */
export function spellRef(setup                                                                                              , id        )                     {
  const bag = setup.abilities; if (bag === undefined || !Object.hasOwn(bag, id)) return undefined; return bag[id]?.[0]?.effectRef;
}
                                                                       
export function createPlay(docs           , moveMs = 200, autoWait = true) {
  const talk = docs?.talk ?? DEMO_TALK;
  const body = docs === undefined ? DEMO_LOAD : { ...docs, talk };
  const world = createWorld(docsToInput(body).input);
  const go = (e       )       => { const from = world.phases.battle; if (from === undefined) throw new Error("play: phase"); world.phases = { ...world.phases, battle: xGo(from, e) }; };
  go({ type: "BATTLE_READY" }); go({ type: "DEPLOY_DONE" }); go({ type: "ROUND_BEGIN" }); go({ type: "SIDE_BEGIN" });
  const installed = installOne(STEP_PATTERN, {});
  if (installed.out === null) throw new Error("play: step-pattern");
  const step = installed.out;
  let n = 0;
  const spent = installOne(ACTION_BUDGET, {});
  if (spent.out === null) throw new Error("play: action-budget");
  const budget = spent.out;
  const player = createPlayer(world, { side: "player", moveMs, nextId: () => `p${n += 1}`, step, spellOf: (id) => { const u = world.units.get(id); return u === undefined ? undefined : spellRef(body.rules, u.unitId); } });
  const bot = botAbilityPriority({ setup: body.rules, stepReach: step.reach, actionsPerTurn: budget.actionsPerTurn });
  const gestures = createGestureMapper({ cellPx: TILE, tapMaxPx: 12, holdMs: 500 }, { cols: world.grid.cols, rows: world.grid.rows, unitAt: (at) => world.units.occupantAt(at) });
  const fx = createPlayFx(body.effects), looks = dress(world.grid, body.looks), worn = new Map                    ();
  let selected                = null, pending            = null, reach       = [], preview       = [], walk              = null, aims       = [], aimKind                    = "basic", followId                = null, onLand                      = null;
  const mark = ()       => { reach = selected === null ? [] : reachCells(world.grid, world.units, selected, step.reach); };
  const sync = ()       => {
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
  const intend = (intent            ) => {
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
    if (!same && !on) { pending = null; preview = []; return { reject: "notReachable"         , preview: []                  }; }
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
    world, step, intend, sync, bot, pixels: pixelsOf, autoWait, go, fx, looks,
    focus(id               )       { selected = id; pending = null; preview = []; mark(); },
    arm(next      )       { walk = next; sync(); },
    landed(fn                     )       { onLand = fn; },
    get aims() { return aims; }, set aims(v               ) { aims = v.map((c) => ({ c: c.c, r: c.r })); },
    get aimKind() { return aimKind; }, set aimKind(v                   ) { aimKind = v; },
    get followId() { return followId; }, set followId(v               ) { followId = v; },
    get selected() { return selected; }, get reach() { return reach; }, get pending() { return pending; }, get walk() { return walk; },
    pointer(sample               )       { for (const intent of gestures(sample)) intend(intent); },
    scene() {
      sync();
      const aimSheet = aimKind === "spell" ? AIM_S : AIM_A, aimOver = world.phases.battle === "targeting" ? aims.map((c) => ({ band: "fxGround"         , sheet: aimSheet, x: c.c * TILE, y: c.r * TILE })) : [];
      const overlays = selected === null ? aimOver : [...reach.map((c) => ({ band: "fxGround"         , sheet: REACH, x: c.c * TILE, y: c.r * TILE })), ...preview.map((c) => ({ band: "fxGround"         , sheet: PATH, x: c.c * TILE, y: c.r * TILE })), ...aimOver];
      const assets                             = { ...looks.assets, "play:fx": { sheet: { id: "play:fx", columns: 4, fw: TILE, fh: TILE } } };
      const units = world.units.all().map((u) => { const id = recipeOf(u.unitId).id; const asset = worn.get(id) ?? unitAsset(id); worn.set(id, asset); assets[id] = asset; return { id: u.id, sprite: id, at: { c: u.at.c, r: u.at.r }, offset: u.offset, facing: u.facing, alive: u.alive }; });
      return { cols: world.grid.cols, rows: world.grid.rows, tileW: TILE, tileH: TILE, mapSeed: world.seed, assets, layers: looks.layers, units, objects: looks.objects, overlays, effects: fx.ingest(world.log, world.clock.stepMs, world.clock.now()), style: looks.style, waterTiles: looks.waterTiles, seeThroughCanopy: true          };
    },
  };
}
