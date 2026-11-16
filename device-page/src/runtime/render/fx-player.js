import { anchorPx } from "./draw-list.js";
import { clipMs, footAt, frameAt } from "./frames.js";
                                                                 
                                                                             
export const FX_PLAYER = { eventCap: 16, frameCap: 64, lagMaxMs: 500, gridMs: 30, liteGridMs: 60 }         ;
                                                                         
                                                                          
                                                            
                                                                                                     
                                                           
                                                                             
                                                                                                                                                                 
                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
const note = (code        )         => ({ code, message: code });
const NAMES = ["hand", "tip", "head", "centre"]         ;
const centreOf = (box     )     => ({ x: box.x + Math.floor(box.w / 2), y: box.y + Math.floor(box.h / 2) });
export const toTick = (ms        , stepMs        )         => (stepMs > 0 ? Math.ceil(ms / stepMs) * stepMs : ms);
export function clipEvents(stored         , frames        , poseDelta                    = [])                                           {
  const derive = ()              => {
    let best = 0, at = -1;
    for (let i = 0; i < frames; i += 1) { const d = poseDelta[i] ?? 0; if (d > best) { best = d; at = i; } }
    const frame = at < 0 ? Math.floor(frames / 2) : at;
    return [{ frame, name: "release" }, { frame, name: "contact" }];
  };
  if (!Array.isArray(stored)) return { events: derive(), notes: stored == null ? [] : [note("clipEventInvalid")] };
  const events              = [], notes           = [];
  let over = false;
  for (const entry of stored) {
    const row = entry !== null && typeof entry === "object" && !Array.isArray(entry) ? entry                                        : null;
    const frame = row?.frame, name = row?.name;
    if (typeof frame === "number" && Number.isInteger(frame) && frame >= 0 && frame < frames && typeof name === "string" && name.length >= 1 && name.length <= FX_PLAYER.eventCap) {
      if (events.length < FX_PLAYER.eventCap) events.push({ frame, name });
      else if (!over) { notes.push(note("clipEventsOverCap")); over = true; }
    } else notes.push(note("clipEventInvalid"));
  }
  return { events: events.length > 0 ? events : derive(), notes };
}
export function clipPoints(stored         , frames        , fw        , fh        )                                          {
  const points                                                                                          = { hand: [], tip: [], head: [], centre: [] };
  const notes           = [];
  if (stored == null) return { points, notes };
  if (typeof stored !== "object" || Array.isArray(stored)) return { points, notes: [note("clipPointsInvalid")] };
  const body = stored                           ;
  for (const key of Object.keys(body)) {
    if (!(NAMES                     ).includes(key)) { notes.push(note("clipPointsInvalid")); continue; }
    const list = body[key];
    if (!Array.isArray(list)) { notes.push(note("clipPointsInvalid")); continue; }
    const parsed = list.map((entry)            => {
      if (entry === null) return null;
      const x = Array.isArray(entry) ? entry[0] : undefined, y = Array.isArray(entry) ? entry[1] : undefined;
      if (!Array.isArray(entry) || entry.length !== 2 || !Number.isInteger(x) || !Number.isInteger(y) || x < 0 || y < 0 || x >= fw || y >= fh) { notes.push(note("clipPointsInvalid")); return null; }
      return { x, y };
    });
    const name = key             ;
    if (parsed.length === 1) points[name] = Array.from({ length: frames }, () => parsed[0] ?? null);
    else if (parsed.length === frames) points[name] = parsed;
    else { notes.push(note("clipPointsInvalid")); const last = parsed[parsed.length - 1] ?? null; points[name] = parsed.length > frames ? parsed.slice(0, frames) : [...parsed, ...Array.from({ length: frames - parsed.length }, () => last)]; }
  }
  return { points, notes };
}
export function pointAt(points            , name           , frame        , box     , fw        , flipX         )     {
  const stored = points[name][frame];
  const mid = points.centre[frame];
  const pt = stored != null ? stored : name === "head" ? { x: box.x + Math.floor(box.w / 2), y: box.y } : name === "centre" || mid == null ? centreOf(box) : mid;
  return flipX ? { x: fw - 1 - pt.x, y: pt.y } : pt;
}
export const frameStart = (clip      , frame        , stepMs        )         => clipMs(clip, stepMs).slice(0, frame).reduce((sum, n) => sum + n, 0);
export function startMs(startOn                    , castMs        , clip                  , events                      , stepMs        )         {
  const ev = clip !== undefined && (startOn === "release" || startOn === "contact") ? events.find((e) => e.name === startOn) : undefined;
  return toTick(castMs + (ev === undefined || clip === undefined ? 0 : frameStart(clip, ev.frame, stepMs)), stepMs);
}
export function hitAt(castMs        , stepMs        , o                                                                                               )         {
  return toTick(o.effectHitMs ?? o.contactMs ?? o.lungePeakMs ?? castMs, stepMs);
}
export const viewHitMs = (commitMs        , hitMs        , effectMs        )         => { const cap = commitMs + Math.min(effectMs, FX_PLAYER.lagMaxMs), at = Math.max(commitMs, hitMs); return Math.min(at, cap); };
export function crossed(list                    , t1        , t2        , loop                                                    )            {
  const hit = list.map((e, i) => ({ e, i, loop: 0 })).filter(({ e }) => t1 < e.at && e.at <= t2);
  const laps                                            = [];
  if (loop !== undefined && loop.lapMs > 0) {
    for (let k = Math.max(1, Math.floor((t1 - loop.from) / loop.lapMs) + 1); k <= Math.floor((t2 - loop.from) / loop.lapMs) && k < 2 ** 53; k += 1) laps.push({ e: { type: "fx:loop", at: loop.from + k * loop.lapMs }, i: k, loop: 1 });
  }
  return [...hit, ...laps].sort((a, b) => a.e.at - b.e.at || a.loop - b.loop || a.i - b.i).map(({ e }) => e);
}
export const poseMs = (tMs        , lite         )         => { const g = lite ? FX_PLAYER.liteGridMs : FX_PLAYER.gridMs; return Math.floor(tMs / g) * g; };
export const nextChangeMs = (tMs        , lite         , ...others                   )         => { const g = lite ? FX_PLAYER.liteGridMs : FX_PLAYER.gridMs; return others.reduce((min, n) => (n < min ? n : min), Math.floor(tMs / g) * g + g); };
export const stripNote = (clip                  , assetId        )                => { const n = clip?.frames.length ?? 0; return n > FX_PLAYER.frameCap ? { code: "fxTooManyFrames", message: `{subject: strip, count: ${n}, limit: ${FX_PLAYER.frameCap}, assetId: ${assetId}}` } : null; };
export const ownLight = (p         )          => p.lit !== "scene";
export function placeStep(p         , effectStart        , tMs        , hitMs        , unitAt                                 , tile    , tileW        , tileH        , stepMs        )                            {
  const start = effectStart + p.at;
  if (!(Number.isFinite(stepMs) && tMs >= start && tMs < start + p.ms) || stripNote(p.clip, p.sheet.id) !== null) return null;
  const markFx = anchorPx(p.sheet), tileDraw = { x: tile.x - markFx.x, y: tile.y - markFx.y }, frame = frameAt(p.clip, tMs - start, stepMs).frame;
  const layer = p.draw_layer, unitLayer = layer === "behind-unit" || layer === "front-unit";
  const band                  = layer === "ground" ? "fxGround" : layer === "overlay" ? "flash" : "fxAir";
  const named = p.anchor_point === "hand" || p.anchor_point === "tip" || p.anchor_point === "head" || p.anchor_point === "centre" || p.anchor_point === "foot";
  if (p.anchor === "screen" || !named) return { band: unitLayer ? "fxAir" : band, sheet: p.sheet, x: tileDraw.x, y: tileDraw.y, frame };
  const sample = p.attach === "follow" ? (p.detach === "hit" ? hitMs : tMs) : start;
  const unit = unitAt(sample) ?? (sample === start ? null : unitAt(start));
  if (unit === null) return { band: unitLayer ? "fxAir" : band, sheet: p.sheet, x: tileDraw.x, y: tileDraw.y, frame };
  const pt = p.anchor_point === "foot" ? anchorPx(unit.sheet) : pointAt(unit.points, p.anchor_point             , unit.frame, unit.box, unit.sheet.fw, unit.flipX === true);
  const mark = anchorPx(unit.sheet);
  const foot = footAt(unit.c, unit.r, tileW, tileH, unit.dx ?? 0, unit.dy ?? 0), ux = foot.x - mark.x, uy = foot.y - mark.y;
  if (!unitLayer) return { band, sheet: p.sheet, x: ux + pt.x - markFx.x, y: uy + pt.y - markFx.y, frame };
  const ox = pt.x - mark.x, oy = pt.y - mark.y, faceSwap = layer === "front-unit" && p.depth_by_facing !== false && unit.facesAway === true;
  return { kind: layer === "behind-unit" ? "fxBehind" : "fxFront", sheet: p.sheet, c: unit.c, r: unit.r, frame, ...(unit.dx === undefined ? {} : { dx: unit.dx }), ...(unit.dy === undefined ? {} : { dy: unit.dy }), ...(ox === 0 ? {} : { ox }), ...(oy === 0 ? {} : { oy }), ...(faceSwap ? { faceSwap: true } : {}) };
}
