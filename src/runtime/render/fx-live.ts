import { clipMs, instanceOffset } from "./frames.ts";
import { clipEvents, clipPoints, crossed, frameStart, hitAt, nextChangeMs, placeStep, poseMs, startMs, stripNote, viewHitMs, type Box, type FxActor, type FxEvent, type FxNote, type FxPiece, type PointTable } from "./fx-player.ts";
import type { Clip, Overlay, Standing } from "./types.ts";
export type LiveFx = { readonly id: string; readonly castMs: number; readonly caster: string; readonly target?: string; readonly at?: { readonly c: number; readonly r: number }; readonly start_on?: string; readonly hitOffsetMs?: number; readonly lungePeakMs?: number; readonly loopMs?: number; readonly commitMs?: number; readonly pieces: readonly FxPiece[] };
export type LiveUnit = { readonly actor: FxActor; readonly clip?: Clip };
export type LiveEvent = FxEvent & { readonly fx: string };
export type LiveGrid = { readonly tileW: number; readonly tileH: number; readonly stepMs: number; readonly lite?: boolean; readonly mapSeed: number };
export type LiveOut = { readonly standing: Standing[]; readonly overlays: Overlay[]; readonly fired: LiveEvent[]; readonly views: Record<string, number>; readonly notes: FxNote[]; readonly dueMs: number };
export type FxLive = { frame(list: readonly LiveFx[], unitOf: (id: string) => LiveUnit | null, t1: number, t2: number, grid: LiveGrid): LiveOut; unit(st: Standing, facing: string | null, box: Box | undefined, tMs: number, grid: LiveGrid): LiveUnit; readonly held: () => number };
const blank = (): PointTable => ({ hand: [], tip: [], head: [], centre: [] });
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
  const table = (clip: Clip | undefined, fw: number, fh: number): PointTable => { if (clip === undefined || clip.frames.length < 1) return blank(); const hit = tables.get(clip); if (hit !== undefined) return hit; const made = clipPoints(clip.points, clip.frames.length, fw, fh).points; tables.set(clip, made); return made; };
  return {
    held: () => store.size,
    unit(st, facing, box, tMs, grid) {
      const clip = st.clip, id = st.key === undefined ? st.sheet.id : `${st.sheet.id}#${st.key}`, actor: FxActor = { c: st.c, r: st.r, sheet: st.sheet, facesAway: facing === "N", points: table(clip, st.sheet.fw, st.sheet.fh), box: box ?? { x: 0, y: 0, w: st.sheet.fw, h: st.sheet.fh }, frame: clip === undefined ? 0 : clipIndex(clip, tMs, grid.stepMs, instanceOffset(clip, grid.stepMs, grid.mapSeed, id, st.key === undefined ? st.c : 0, st.key === undefined ? st.r : 0)), ...(st.dx === undefined ? {} : { dx: st.dx }), ...(st.dy === undefined ? {} : { dy: st.dy }), ...(st.flipX === true ? { flipX: true } : {}) };
      return clip === undefined ? { actor } : { actor, clip };
    },
    frame(list, unitOf, t1, t2, grid) {
      const lite = grid.lite === true, pose = poseMs(t2, lite), standing: Standing[] = [], overlays: Overlay[] = [], fired: LiveEvent[] = [], views: Record<string, number> = {}, notes: FxNote[] = [], keep = new Set<string>();
      let playing = false;
      for (const e of list) {
        if (!Number.isFinite(e.castMs)) continue; keep.add(e.id);
        const caster = unitOf(e.caster), clip = caster?.clip, n = clip?.frames.length ?? 0, ev = n >= 1 && clip !== undefined ? clipEvents(clip.events, n).events : [];
        const start = startMs(e.start_on, e.castMs, n >= 1 ? clip : undefined, ev, grid.stepMs);
        const contact = ev.find((row) => row.name === "contact"), release = ev.find((row) => row.name === "release"), contactMs = contact !== undefined && clip !== undefined ? e.castMs + frameStart(clip, contact.frame, grid.stepMs) : undefined;
        const off = e.hitOffsetMs, peak = e.lungePeakMs, loopMs = e.loopMs, commit = e.commitMs;
        const hit = hitAt(e.castMs, grid.stepMs, { ...(off !== undefined && Number.isFinite(off) ? { effectHitMs: start + off } : {}), ...(contactMs === undefined ? {} : { contactMs }), ...(peak === undefined ? {} : { lungePeakMs: peak }) });
        let span = 0; for (const p of e.pieces) if (Number.isFinite(p.at) && Number.isFinite(p.ms) && p.at + p.ms > span) span = p.at + p.ms;
        const loop = loopMs !== undefined && Number.isFinite(loopMs) && loopMs > 0 ? loopMs : 0, end = start + span, line: FxEvent[] = [{ type: "fx:start", at: start }];
        if (clip !== undefined) for (const row of ev) line.push({ type: "clip:event", at: e.castMs + frameStart(clip, row.frame, grid.stepMs), name: row.name });
        if (release !== undefined && clip !== undefined) line.push({ type: "fx:release", at: e.castMs + frameStart(clip, release.frame, grid.stepMs) });
        line.push({ type: "fx:hit", at: hit }); if (loop === 0) line.push({ type: "fx:end", at: end });
        for (const row of crossed(line, t1, t2)) fired.push({ ...row, fx: e.id });
        if (loop > 0) { const k = Math.floor((t2 - start) / loop), at = start + k * loop; if (k >= 1 && Number.isFinite(at) && t1 < at && at <= t2) fired.push({ type: "fx:loop", at, fx: e.id }); }
        if (commit !== undefined && Number.isFinite(commit) && Number.isFinite(hit)) { const view = viewHitMs(commit, hit, span); if (Number.isFinite(view)) views[e.id] = view; }
        if (loop > 0 ? t2 >= start : t2 >= start && t2 < end) playing = true;
        const lap = loop > 0 && pose >= start ? Math.floor((pose - start) / loop) : 0, prev = store.get(e.id), mem: Mem = prev !== undefined && prev.lap === lap ? prev : { lap, at: new Map() };
        if (mem !== prev) store.set(e.id, mem); if (!(pose >= start)) continue;
        const drawT = loop > 0 ? start + ((pose - start) % loop + loop) % loop : pose, target = e.target === undefined ? null : unitOf(e.target);
        for (const [i, p] of e.pieces.entries()) {
          if (!Number.isFinite(p.at) || !Number.isFinite(p.ms)) continue;
          const warn = p.clip === undefined ? null : stripNote(p.clip, p.sheet.id);
          if (warn !== null && p.clip !== undefined) { const box = strips.get(p.clip) ?? { ids: new Set<string>(), full: false }; strips.set(p.clip, box); if (!box.full && !box.ids.has(p.sheet.id)) { notes.push(warn); if (box.ids.size < 64) box.ids.add(p.sheet.id); else box.full = true; } }
          const aimed = (p.anchor ?? "caster") === "target" ? target : caster, cell = aimed !== null ? aimed.actor : e.at ?? null, actor = aimed === null ? null : aimed.actor;
          if (cell === null) continue;
          const placed = placeStep(p, start, drawT, hit, (sample) => {
            if (actor === null) return null;
            const spawn = p.attach !== "follow", freeze = !spawn && p.detach === "hit", key = `${spawn ? "s" : "h"}${i}`, got = mem.at.get(key);
            if (got !== undefined && (spawn || freeze)) return got;
            if (freeze && !(pose >= hit && sample === hit)) return sample === hit ? null : actor;
            if (spawn || freeze) mem.at.set(key, actor);
            return actor;
          }, { x: cell.c * grid.tileW + Math.round(grid.tileW / 2), y: (cell.r + 1) * grid.tileH }, grid.tileW, grid.tileH, grid.stepMs);
          if (placed !== null && "kind" in placed) standing.push(placed); else if (placed !== null) overlays.push(placed);
        }
      }
      for (const id of store.keys()) if (!keep.has(id)) store.delete(id);
      fired.sort((a, b) => a.at - b.at); // stable: ties keep effect order, then timeline order, laps last (ruling 5)
      return { standing, overlays, fired, views, notes, dueMs: playing ? nextChangeMs(t2, lite) : Infinity };
    },
  };
}
