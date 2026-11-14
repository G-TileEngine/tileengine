import { px } from "./camera.ts";
import { anchorPx } from "./draw-list.ts";
import { clipMs, hash32, instanceOffset } from "./frames.ts";
import { playerPx, shakeAt, shakeLen, shakePx, stopMs, warp, type Kick, type ShakeSetting } from "./feel.ts";
import { FX_LIGHT, lightColour, lightMode, lightRadius, litTiles, popIsFlash, type Ramps } from "./fx-light.ts";
import { clipEvents, clipPoints, frameStart, hitAt, nextChangeMs, ownLight, placeStep, poseMs, startMs, stripNote, viewHitMs, type Box, type FxActor, type FxEvent, type FxNote, type FxPiece, type PointTable } from "./fx-player.ts";
import type { FxLit, Light } from "./light.ts";
import type { Clip, Overlay, Standing } from "./types.ts";
export type LiveFx = { readonly id: string; readonly castMs: number; readonly caster: string; readonly target?: string; readonly at?: { readonly c: number; readonly r: number }; readonly start_on?: string; readonly hitOffsetMs?: number; readonly lungePeakMs?: number; readonly loopMs?: number; readonly commitMs?: number; readonly pieces: readonly FxPiece[]; readonly hit_stop_ms?: number; readonly shake?: number; readonly shake_ms?: number; readonly shake_dir?: string; readonly squash?: boolean; readonly tint_ramp?: string };
export type LiveUnit = { readonly actor: FxActor; readonly clip?: Clip };
export type LiveEvent = FxEvent & { readonly fx: string };
export type LiveGrid = { readonly tileW: number; readonly tileH: number; readonly stepMs: number; readonly lite?: boolean; readonly mapSeed: number; readonly reduce?: boolean; readonly flashes?: boolean; readonly shake?: ShakeSetting; readonly ramps?: Ramps };
export type LiveHold = { readonly at: number; readonly ms: number; readonly ox: number; readonly squash: boolean };
export type LiveOut = { readonly standing: Standing[]; readonly overlays: Overlay[]; readonly fired: LiveEvent[]; readonly views: Record<string, number>; readonly notes: FxNote[]; readonly dueMs: number; readonly holds: Readonly<Record<string, LiveHold>>; readonly shake: { readonly x: number; readonly y: number }; readonly lit: FxLit };
export type FxLive = { frame(list: readonly LiveFx[], unitOf: (id: string, tMs?: number) => LiveUnit | null, t1: number, t2: number, grid: LiveGrid): LiveOut; unit(st: Standing, facing: string | null, box: Box | undefined, tMs: number, grid: LiveGrid): LiveUnit; readonly held: () => number };
const blank = (): PointTable => ({ hand: [], tip: [], head: [], centre: [] }), NO_LIT: FxLit = { lights: [] };
type Mem = { readonly lap: number; readonly at: Map<string, FxActor> };
export function clipIndex(clip: Clip, tMs: number, stepMs: number, offsetMs: number): number {
  const n = clip.frames.length;
  if (!(n > 1 && Number.isFinite(tMs))) return 0;
  const ms = clipMs(clip, stepMs), total = ms.reduce((sum, v) => sum + v, 0);
  let t = tMs + offsetMs, at = 0;
  if (clip.loop !== false) t = ((t % total) + total) % total; else if (t >= total) return n - 1;
  for (let i = 0; i < n; i += 1) { const d = ms[i] ?? 0; if (t < at + d) return i; at += d; }
  return n - 1;
}
export function createFxLive(): FxLive {
  const tables = new WeakMap<Clip, PointTable>(), strips = new WeakMap<Clip, { ids: Set<string>; full: boolean }>(), store = new Map<string, Mem>();
  let shown: FxLit = NO_LIT, shownAt = Number.NEGATIVE_INFINITY; const slot = { actor: null as FxActor | null, mem: null as Mem | null, i: 0, spawn: false, freeze: false, pose: 0, hit: 0 };
  const atUnit = (sample: number): FxActor | null => {
    const actor = slot.actor, mem = slot.mem; if (actor === null || mem === null) return null;
    const key = `${slot.spawn ? "s" : "h"}${slot.i}`, got = mem.at.get(key);
    if (got !== undefined && (slot.spawn || slot.freeze)) return got;
    if (slot.freeze && !(slot.pose >= slot.hit && sample === slot.hit)) return sample === slot.hit ? null : actor;
    if (slot.spawn || slot.freeze) mem.at.set(key, actor); return actor;
  };
  const table = (clip: Clip | undefined, fw: number, fh: number): PointTable => { if (clip === undefined || clip.frames.length < 1) return blank(); const hit = tables.get(clip); if (hit !== undefined) return hit; const made = clipPoints(clip.points, clip.frames.length, fw, fh).points; tables.set(clip, made); return made; };
  return {
    held: () => store.size,
    unit(st, facing, box, tMs, grid) {
      const clip = st.clip, id = st.key === undefined ? st.sheet.id : `${st.sheet.id}#${st.key}`, actor: FxActor = { c: st.c, r: st.r, sheet: st.sheet, facesAway: facing === "N", points: table(clip, st.sheet.fw, st.sheet.fh), box: box ?? { x: 0, y: 0, w: st.sheet.fw, h: st.sheet.fh }, frame: clip === undefined ? st.frame ?? 0 : clipIndex(clip, tMs - (st.lagMs ?? 0), grid.stepMs, instanceOffset(clip, grid.stepMs, grid.mapSeed, id, st.key === undefined ? st.c : 0, st.key === undefined ? st.r : 0)), ...(st.dx === undefined ? {} : { dx: st.dx }), ...(st.dy === undefined ? {} : { dy: st.dy }), ...(st.flipX === true ? { flipX: true } : {}) };
      return clip === undefined ? { actor } : { actor, clip };
    },
    frame(list, unitOf, t1, t2, grid) {
      const lite = grid.lite === true, pose = poseMs(t2, lite), standing: Standing[] = [], overlays: Overlay[] = [], fired: LiveEvent[] = [], views: Record<string, number> = {}, notes: FxNote[] = [], keep = new Set<string>(), kicks: Kick[] = [], holds: Record<string, LiveHold> = {}, want: Light[] = [];
      const see = (id: string, at: number, type: FxEvent["type"], name?: string): void => { if (t1 < at && at <= t2) fired.push(name === undefined ? { type, at, fx: id } : { type, at, name, fx: id }); };
      let playing = false;
      for (const e of list) {
        if (!Number.isFinite(e.castMs)) continue; keep.add(e.id);
        const caster = unitOf(e.caster), clip = caster?.clip, n = clip?.frames.length ?? 0, ev = n >= 1 && clip !== undefined ? clipEvents(clip.events, n).events : [];
        const start = startMs(e.start_on, e.castMs, n >= 1 ? clip : undefined, ev, grid.stepMs);
        const contact = ev.find((row) => row.name === "contact"), release = ev.find((row) => row.name === "release"), contactMs = contact !== undefined && clip !== undefined ? e.castMs + frameStart(clip, contact.frame, grid.stepMs) : undefined;
        const off = e.hitOffsetMs, peak = e.lungePeakMs, loopMs = e.loopMs, commit = e.commitMs;
        const hit = hitAt(e.castMs, grid.stepMs, { ...(off !== undefined && Number.isFinite(off) ? { effectHitMs: start + off } : {}), ...(contactMs === undefined ? {} : { contactMs }), ...(peak === undefined ? {} : { lungePeakMs: peak }) });
        const stop = stopMs(e.hit_stop_ms, grid.stepMs, grid.reduce === true, grid.flashes === true), sp = shakePx(e.shake), sl = shakeLen(e.shake_ms, sp.px), aim = e.target === undefined ? null : unitOf(e.target);
        if (sp.bad) notes.push({ code: "outOfRange", message: "shake" }); if (sl.bad) notes.push({ code: "outOfRange", message: "shake_ms" });
        const pp = playerPx(sp.px, grid.shake, grid.reduce === true);
        if (pp > 0) kicks.push({ at: hit, px: pp, ms: sl.ms, dx: e.shake_dir === "none" || caster === null || aim === null ? 0 : aim.actor.c - caster.actor.c, dy: e.shake_dir === "none" || caster === null || aim === null ? 0 : aim.actor.r - caster.actor.r, seed: hash32(grid.mapSeed, e.id, 0, 0) });
        let span = 0; for (const p of e.pieces) if (Number.isFinite(p.at) && Number.isFinite(p.ms) && p.at + p.ms > span) span = p.at + p.ms;
        const loop = loopMs !== undefined && Number.isFinite(loopMs) && loopMs > 0 ? loopMs : 0, end = start + span; see(e.id, start, "fx:start");
        if (clip !== undefined) for (const row of ev) see(e.id, e.castMs + frameStart(clip, row.frame, grid.stepMs), "clip:event", row.name);
        if (release !== undefined && clip !== undefined) see(e.id, e.castMs + frameStart(clip, release.frame, grid.stepMs), "fx:release");
        see(e.id, hit, "fx:hit"); if (loop === 0) see(e.id, end, "fx:end");
        if (loop > 0) { const k = Math.floor((t2 - start) / loop), at = start + k * loop; if (k >= 1 && Number.isFinite(at) && t1 < at && at <= t2) fired.push({ type: "fx:loop", at, fx: e.id }); }
        if (commit !== undefined && Number.isFinite(commit) && Number.isFinite(hit)) { const view = viewHitMs(commit, hit, span); if (Number.isFinite(view)) views[e.id] = view; }
        if (loop > 0 ? t2 >= start : t2 >= start && t2 < end + stop) playing = true;
        const lap = loop > 0 && pose >= start ? Math.floor((pose - start) / loop) : 0, prev = store.get(e.id), mem: Mem = prev !== undefined && prev.lap === lap ? prev : { lap, at: new Map() };
        if (mem !== prev) store.set(e.id, mem); if (!(pose >= start)) continue;
        const clockT = warp(pose, stop > 0 ? { from: hit, to: hit + stop } : null), drawT = loop > 0 ? start + ((clockT - start) % loop + loop) % loop : clockT, target = aim;
        let used = 0, warned = false, rampNoted = false;
        for (const [i, p] of e.pieces.entries()) {
          if (!Number.isFinite(p.at) || !Number.isFinite(p.ms)) continue;
          const warn = p.clip === undefined ? null : stripNote(p.clip, p.sheet.id);
          if (warn !== null && p.clip !== undefined) { const box = strips.get(p.clip) ?? { ids: new Set<string>(), full: false }; strips.set(p.clip, box); if (!box.full && !box.ids.has(p.sheet.id)) { notes.push(warn); if (box.ids.size < 64) box.ids.add(p.sheet.id); else box.full = true; } }
          const aimed = (p.anchor ?? "caster") === "target" ? target : caster, cell = aimed !== null ? aimed.actor : e.at ?? null, actor = aimed === null ? null : aimed.actor;
          const mode0 = lightMode(p);
          if (cell === null) { if (mode0 !== "off") { used += 1; if (used > (lite ? 1 : FX_LIGHT.perEffect) && !warned) { notes.push({ code: "fxLightsOverCap", message: e.id }); warned = true; } } continue; }
          slot.actor = actor; slot.mem = mem; slot.i = i; slot.spawn = p.attach !== "follow"; slot.freeze = !slot.spawn && p.detach === "hit"; slot.pose = pose; slot.hit = hit;
          const placed = placeStep(p, start, drawT, hit, atUnit, { x: cell.c * grid.tileW + Math.round(grid.tileW / 2), y: (cell.r + 1) * grid.tileH }, grid.tileW, grid.tileH, grid.stepMs);
          if (placed !== null && "kind" in placed) standing.push(ownLight(p) ? placed : Object.assign(placed, { sceneLit: true }));
          else if (placed !== null) overlays.push(ownLight(p) ? Object.assign(placed, { selfLit: true }) : placed);
          if (mode0 === "off") continue;
          used += 1; if (used > (lite ? 1 : FX_LIGHT.perEffect)) { if (!warned) { notes.push({ code: "fxLightsOverCap", message: e.id }); warned = true; } continue; }
          const rad = lightRadius(p.light_radius); if (rad.bad) notes.push({ code: "outOfRange", message: "light_radius" });
          const steady = lite || (grid.flashes === true && mode0 === "pop" && popIsFlash(rad.tiles, FX_LIGHT.flashTilePx)), tiles = litTiles(steady ? "steady" : mode0, rad.tiles, drawT, start + p.at, p.ms), col = lightColour(p, e.tint_ramp, grid.ramps);
          if (col.missing.length > 0 && !rampNoted) { notes.push({ code: "fxRampMissing", message: e.id }); rampNoted = true; }
          if (!(tiles > 0) || placed === null || want.length >= FX_LIGHT.onScreen) continue;
          want.push({ x: "kind" in placed ? placed.c * grid.tileW + px(grid.tileW / 2) + (placed.dx ?? 0) - anchorPx(placed.sheet).x + (placed.ox ?? 0) + placed.sheet.fw / 2 : placed.x + placed.sheet.fw / 2, y: "kind" in placed ? (placed.r + 1) * grid.tileH + (placed.dy ?? 0) - anchorPx(placed.sheet).y + (placed.oy ?? 0) + placed.sheet.fh / 2 : placed.y + placed.sheet.fh / 2, radius: tiles * grid.tileW, colour: col.colour, keepInDim: true });
        }
      }
      for (const id of store.keys()) if (!keep.has(id)) store.delete(id);
      fired.sort((a, b) => a.at - b.at); // stable: ties keep effect order, then timeline order, laps last (ruling 5)
      const same = want.length === shown.lights.length && want.every((l, i) => { const o = shown.lights[i]; return o !== undefined && o.x === l.x && o.y === l.y && o.radius === l.radius && o.colour === l.colour && o.keepInDim === l.keepInDim; });
      let gateDue = Infinity;
      if (!same) { if (t2 < shownAt || t2 >= shownAt + FX_LIGHT.replanMs) { shown = want.length === 0 ? NO_LIT : { lights: want }; shownAt = t2; } else gateDue = shownAt + FX_LIGHT.replanMs; }
      const shake = shakeAt(kicks, t2);
      return { standing, overlays, fired, views, notes, holds, lit: shown, shake: { x: shake.x, y: shake.y }, dueMs: Math.min(playing ? nextChangeMs(t2, lite) : Infinity, shake.nextMs, gateDue) };
    },
  };
}
