import { anchorPx } from "./draw-list.ts";
import { clipMs, footAt, hash32, instanceOffset } from "./frames.ts";
import { playerPx, shakeAt, shakeLen, shakePx, stopMs, warp, type Kick, type ShakeSetting } from "./feel.ts";
import { pieceLook } from "./fx-look.ts";
import { FX_LIGHT, hitWhiteArg, hitWhiteMs, lightColour, lightMode, lightRadius, litTiles, popIsFlash, rampOf, type Ramps } from "./fx-light.ts";
import { FX_BUDGET, PARTICLES, capCounts, particleAt, particleRead, variantSeed } from "./fx-particles.ts";
import { isTravel, pathAt } from "./fx-path.ts";
import { clipEvents, clipPoints, frameStart, hitAt, nextChangeMs, ownLight, placeStep, poseMs, startMs, stripNote, viewHitMs, type Box, type FxActor, type FxEvent, type FxNote, type FxPiece, type PointTable } from "./fx-player.ts";
import type { FxLit, Light } from "./light.ts";
import type { Clip, Overlay, SceneDot, Standing } from "./types.ts";
export type LiveFx = { readonly id: string; readonly castMs: number; readonly caster: string; readonly target?: string; readonly at?: { readonly c: number; readonly r: number }; readonly start_on?: string; readonly hitOffsetMs?: number; readonly lungePeakMs?: number; readonly loopMs?: number; readonly commitMs?: number; readonly pieces: readonly FxPiece[]; readonly hit_stop_ms?: number; readonly shake?: number; readonly shake_ms?: number; readonly shake_dir?: string; readonly squash?: boolean; readonly tint_ramp?: string; readonly pixel_scale?: unknown; readonly hit_white_ms?: unknown; readonly hit_white_target?: string; readonly hit_white_mode?: string; readonly impact_colour?: string; readonly variant_seed?: unknown };
export type LiveUnit = { readonly actor: FxActor; readonly clip?: Clip };
export type LiveEvent = FxEvent & { readonly fx: string };
export type LiveGrid = { readonly tileW: number; readonly tileH: number; readonly stepMs: number; readonly lite?: boolean; readonly mapSeed: number; readonly reduce?: boolean; readonly flashes?: boolean; readonly shake?: ShakeSetting; readonly ramps?: Ramps };
export type LiveOut = { readonly standing: Standing[]; readonly overlays: Overlay[]; readonly fired: LiveEvent[]; readonly views: Record<string, number>; readonly notes: FxNote[]; readonly dueMs: number; readonly shake: { readonly x: number; readonly y: number }; readonly lit: FxLit; readonly dots: SceneDot[] };
export type FxLive = { frame(list: readonly LiveFx[], unitOf: (id: string, tMs?: number) => LiveUnit | null, t1: number, t2: number, grid: LiveGrid): LiveOut; unit(st: Standing, facing: string | null, box: Box | undefined, tMs: number, grid: LiveGrid): LiveUnit; readonly held: () => number };
const blank = (): PointTable => ({ hand: [], tip: [], head: [], centre: [] }), NO_LIT: FxLit = { lights: [] };
const mid = (p: Standing | Overlay, tileW: number, tileH: number): { x: number; y: number } => {
  if (!("kind" in p)) return { x: p.x + p.sheet.fw / 2, y: p.y + p.sheet.fh / 2 };
  const foot = footAt(p.c, p.r, tileW, tileH, p.dx ?? 0, p.dy ?? 0), mark = anchorPx(p.sheet);
  return { x: foot.x - mark.x + (p.ox ?? 0) + p.sheet.fw / 2, y: foot.y - mark.y + (p.oy ?? 0) + p.sheet.fh / 2 };
};
const pixScale = (s: unknown): { k: number; bad: boolean } => { if (s === undefined || s === null || s === "match-sprite") return { k: 1, bad: false }; if (typeof s === "string") return /^[1-6]$/.test(s) ? { k: Number(s), bad: false } : { k: 1, bad: true }; if (typeof s !== "number" || !Number.isFinite(s)) return { k: 1, bad: true }; const n = Math.round(s); return { k: Math.min(6, Math.max(1, n)), bad: n !== s || s < 1 || s > 6 }; };
const litAt = (p: Standing | Overlay, g: LiveGrid, k: number): { x: number; y: number } => { if (k === 1) return mid(p, g.tileW, g.tileH); const ax = anchorPx(p.sheet), x0 = "kind" in p ? footAt(p.c, p.r, g.tileW, g.tileH, p.dx ?? 0, p.dy ?? 0).x - ax.x + (p.ox ?? 0) : p.x, y0 = "kind" in p ? footAt(p.c, p.r, g.tileW, g.tileH, p.dx ?? 0, p.dy ?? 0).y - ax.y + (p.oy ?? 0) : p.y; return { x: x0 + ax.x + (p.sheet.fw / 2 - ax.x) * k, y: y0 + ax.y + (p.sheet.fh / 2 - ax.y) * k }; };
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
      const lite = grid.lite === true, pose = poseMs(t2, lite), standing: Standing[] = [], overlays: Overlay[] = [], fired: LiveEvent[] = [], views: Record<string, number> = {}, notes: FxNote[] = [], keep = new Set<string>(), kicks: Kick[] = [], want: Light[] = [], bag: { born: number; ei: number; si: number; pi: number; dot: SceneDot }[] = [], spent: number[] = [];
      let fxDraws = 0;
      const see = (id: string, at: number, type: FxEvent["type"], name?: string): void => { if (t1 < at && at <= t2) fired.push(name === undefined ? { type, at, fx: id } : { type, at, name, fx: id }); };
      let playing = false;
      for (const [ei, e] of list.entries()) {
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
        let used = 0, warned = false, rampNoted = false, drew = 0;
        const scale = pixScale(e.pixel_scale); if (scale.bad) notes.push({ code: "outOfRange", message: "pixel_scale" }); const white = hitWhiteMs(e.hit_white_ms); if (white.bad) notes.push({ code: "outOfRange", message: "hit_white_ms" });
        const seeded = variantSeed(e.variant_seed); if (seeded.bad !== null) notes.push({ code: seeded.bad, message: "variant_seed" });
        const stamp = e.hit_white_target === "stamp" ? hitWhiteArg(e, hit, pose, grid.ramps) : null, reads = e.pieces.map((p) => (p.kind === "particles" ? particleRead(p) : null)), caps = capCounts(reads.map((r) => r?.count ?? 0)), seen = new Set<string>();
        if (caps.over !== null) notes.push({ code: "fxParticlesOverCap", message: JSON.stringify({ count: caps.over, limit: PARTICLES.perEffect }) }); for (const r of reads) for (const f of r?.bad ?? []) if (!seen.has(f)) { seen.add(f); notes.push({ code: "outOfRange", message: f }); }
        for (const [i, p] of e.pieces.entries()) {
          if (!Number.isFinite(p.at) || !Number.isFinite(p.ms)) continue;
          const warn = p.clip === undefined ? null : stripNote(p.clip, p.sheet.id);
          if (warn !== null && p.clip !== undefined) { const box = strips.get(p.clip) ?? { ids: new Set<string>(), full: false }; strips.set(p.clip, box); if (!box.full && !box.ids.has(p.sheet.id)) { notes.push(warn); if (box.ids.size < 64) box.ids.add(p.sheet.id); else box.full = true; } }
          const aimed = (p.anchor ?? "caster") === "target" ? target : caster, cell = aimed !== null ? aimed.actor : e.at ?? null, actor = aimed === null ? null : aimed.actor;
          const mode0 = lightMode(p);
          if (cell === null) { if (mode0 !== "off") { used += 1; if (used > (lite ? 1 : FX_LIGHT.perEffect) && !warned) { notes.push({ code: "fxLightsOverCap", message: e.id }); warned = true; } } continue; }
          slot.actor = actor; slot.mem = mem; slot.i = i; slot.spawn = p.attach !== "follow"; slot.freeze = !slot.spawn && p.detach === "hit"; slot.pose = pose; slot.hit = hit;
          let placed = placeStep(p, start, drawT, hit, atUnit, footAt(cell.c, cell.r, grid.tileW, grid.tileH), grid.tileW, grid.tileH, grid.stepMs);
          let ang = p.angle; const ac = caster?.actor ?? e.at, bc = target?.actor ?? e.at;
          if (placed !== null && p.path !== undefined && ac !== undefined && bc !== undefined) {
            const named = p.anchor !== "screen" && (p.anchor_point === "hand" || p.anchor_point === "tip" || p.anchor_point === "head" || p.anchor_point === "centre" || p.anchor_point === "foot"), held = named ? atUnit(drawT) : null, A = footAt(ac.c, ac.r, grid.tileW, grid.tileH), B = footAt(bc.c, bc.r, grid.tileW, grid.tileH), H = footAt((held ?? cell).c, (held ?? cell).r, grid.tileW, grid.tileH), spot = pathAt(p.path, drawT - start, A, B, grid.tileW, grid.tileH), dx = spot.x - H.x, dy = spot.y - H.y;
            if ("kind" in placed) placed = { ...placed, ...(dx === 0 ? {} : { ox: (placed.ox ?? 0) + dx }), ...(dy === 0 ? {} : { oy: (placed.oy ?? 0) + dy }) }; else placed = { ...placed, x: placed.x + dx, y: placed.y + dy };
            if (isTravel(p.kind) && spot.deg !== null) ang = (p.angle ?? 0) + spot.deg;
          }
          const parts = reads[i];
          if (parts != null && placed !== null) { const seed = hash32(grid.mapSeed, e.id, i, seeded.seed), ramp = rampOf([p.tint_ramp, e.tint_ramp], grid.ramps).ramp, centre = mid(placed, grid.tileW, grid.tileH), band = "kind" in placed ? "fxAir" as const : placed.band === "ui" ? "flash" as const : placed.band; for (let n = 0, nCap = caps.counts[i] ?? 0; n < (lite ? Math.ceil(nCap / 2) : nCap); n += 1) { const dot = particleAt(parts, n, seed, drawT - (start + p.at), ramp, grid.reduce === true, grid.tileW); if (dot !== null) bag.push({ born: start + p.at, ei, si: i, pi: n, dot: { band, x: centre.x + dot.x * scale.k, y: centre.y + dot.y * scale.k, size: dot.size * scale.k, colour: dot.colour, alpha: dot.alpha } }); } }
          else if (placed !== null && drew < FX_BUDGET.effect && fxDraws < FX_BUDGET.total) { drew += 1; fxDraws += 1; const look = pieceLook(p.sheet.fw, p.sheet.fh, p.outline, p.blend, ang, rampOf([p.tint_ramp, e.tint_ramp], grid.ramps).ramp, lite, p.kind === "stamp" ? stamp : null); const extra = { ...(look === undefined ? {} : { look }), ...(scale.k > 1 ? { scale: scale.k } : {}), ...(p.blend === "add" ? { op: "add" as const } : {}) }; if ("kind" in placed) standing.push(Object.assign(placed, ownLight(p) ? extra : { sceneLit: true as const, ...extra })); else overlays.push(Object.assign(placed, ownLight(p) ? { selfLit: true as const, ...extra } : extra)); }
          if (mode0 === "off") continue;
          used += 1; if (used > (lite ? 1 : FX_LIGHT.perEffect)) { if (!warned) { notes.push({ code: "fxLightsOverCap", message: e.id }); warned = true; } continue; }
          const rad = lightRadius(p.light_radius); if (rad.bad) notes.push({ code: "outOfRange", message: "light_radius" });
          const steady = lite || (grid.flashes === true && mode0 === "pop" && popIsFlash(rad.tiles, FX_LIGHT.flashTilePx)), tiles = litTiles(steady ? "steady" : mode0, rad.tiles, drawT, start + p.at, p.ms), col = lightColour(p, e.tint_ramp, grid.ramps);
          if (col.missing.length > 0 && !rampNoted) { notes.push({ code: "fxRampMissing", message: e.id }); rampNoted = true; }
          if (!(tiles > 0) || placed === null || want.length >= FX_LIGHT.onScreen) continue;
          const centre = litAt(placed, grid, scale.k); want.push({ x: centre.x, y: centre.y, radius: tiles * grid.tileW, colour: col.colour, keepInDim: true });
        }
        spent[ei] = drew;
      }
      bag.sort((a, b) => a.born - b.born || a.ei - b.ei || a.si - b.si || a.pi - b.pi);
      const kept = bag.length > PARTICLES.pool ? bag.slice(bag.length - PARTICLES.pool) : bag;
      kept.sort((a, b) => a.ei - b.ei || a.si - b.si || a.pi - b.pi);
      const dots: SceneDot[] = [];
      for (const row of kept) { const n = spent[row.ei] ?? 0; if (n >= FX_BUDGET.effect || fxDraws >= FX_BUDGET.total) continue; spent[row.ei] = n + 1; fxDraws += 1; dots.push(row.dot); }
      for (const id of store.keys()) if (!keep.has(id)) store.delete(id);
      fired.sort((a, b) => a.at - b.at); // stable: ties keep effect order, then timeline order, laps last (ruling 5)
      const same = want.length === shown.lights.length && want.every((l, i) => { const o = shown.lights[i]; return o !== undefined && o.x === l.x && o.y === l.y && o.radius === l.radius && o.colour === l.colour && o.keepInDim === l.keepInDim; });
      let gateDue = Infinity;
      if (!same) { if (t2 < shownAt || t2 >= shownAt + FX_LIGHT.replanMs) { shown = want.length === 0 ? NO_LIT : { lights: want }; shownAt = t2; } else gateDue = shownAt + FX_LIGHT.replanMs; }
      const shake = shakeAt(kicks, t2);
      return { standing, overlays, dots, fired, views, notes, lit: shown, shake: { x: shake.x, y: shake.y }, dueMs: Math.min(playing ? nextChangeMs(t2, lite) : Infinity, shake.nextMs, gateDue) };
    },
  };
}
