                                                                      
import { fitView } from "../../src/runtime/render/index.js";
import { TILE } from "./board.js";
import { clamp, pan, zoomAt,              } from "./camera-touch.js";

                                                                                                                                                                                                                
                                                                                                                                                                
                                                           
                                                               

/** Pointer gestures for the play page. No DOM globals: the page owns capture. */
export function createTouch(o                                                                                   )   
                                                                                                                                                                  
  {
  const pts = new Map            ();
  let drag = false, pinch = false, armed                = null, base               = null, ax = 0, ay = 0, clock = 0;
  const ptr = (t        )                           => (t === "pen" || t === "touch" ? t : "mouse");
  const hit = (ox        , oy        )                           => {
    const b = o.box(), f = fitView(b.devW, b.devH, o.cam.s, TILE, TILE);
    return { x: (ox * b.kx - f.padX) / f.s + o.cam.x, y: (oy * b.ky - f.padY) / f.s + o.cam.y };
  };
  const send = (kind                       , e         , id = e.id)       => {
    const h = hit(e.offsetX, e.offsetY), ms = Math.max(clock, Math.max(0, Math.round(e.timeStamp))); clock = ms;
    o.match.pointer({ kind, id, pointer: ptr(e.pointerType), x: h.x, y: h.y, ms });
  };
  const put = (e         )       => { pts.set(e.id, { x: e.clientX, y: e.clientY, ox: e.offsetX, oy: e.offsetY }); };
  const pair = ()                  => { const v = [...pts.values()], a = v[0], b = v[1]; return a !== undefined && b !== undefined ? [a, b] : null; };
  const reset = (e         )       => { if (armed !== null) send("cancel", e, armed); pts.clear(); drag = false; pinch = false; armed = null; base = null; };
  return {
    hit,
    down(e) {
      put(e);
      if (pts.size === 1) { drag = false; pinch = false; base = null; armed = e.id; ax = e.clientX; ay = e.clientY; send("down", e); return; }
      if (armed !== null) send("cancel", e, armed);
      const pr = pair();
      pinch = true; drag = false; armed = null;
      base = { dist: pr === null ? 1 : Math.hypot(pr[0].x - pr[1].x, pr[0].y - pr[1].y) || 1, x: o.cam.x, y: o.cam.y, s: o.cam.s };
    },
    move(e) {
      if (pts.get(e.id) === undefined) return;
      const prev = pts.get(e.id);
      put(e);
      if (pinch && base !== null) {
        const pr = pair(); if (pr === null) return;
        const now = Math.hypot(pr[0].x - pr[1].x, pr[0].y - pr[1].y) || 1, b = o.box();
        o.cam.x = base.x; o.cam.y = base.y; o.cam.s = base.s;
        zoomAt(o.cam, base.s * (now / base.dist), b.devW, b.devH, b.cols * TILE, b.rows * TILE, ((pr[0].ox + pr[1].ox) / 2) * b.kx, ((pr[0].oy + pr[1].oy) / 2) * b.ky, b.kx);
        return;
      }
      const b = o.box();
      if (!drag && Math.hypot(e.clientX - ax, e.clientY - ay) >= 10) { drag = true; if (armed !== null) send("cancel", e, armed); armed = null; }
      if (drag && prev !== undefined) { const s = o.cam.s || 1; pan(o.cam, -((e.clientX - prev.x) * b.kx) / s, -((e.clientY - prev.y) * b.ky) / s); clamp(o.cam, fitView(b.devW, b.devH, o.cam.s, TILE, TILE), b.cols, b.rows); }
      else if (!drag) send("move", e);
    },
    up(e) {
      const wasP = pinch, wasD = drag; pts.delete(e.id);
      if (pts.size > 0) return;
      if (!wasP && !wasD && armed === e.id) send("up", e);
      pinch = false; drag = false; armed = null; base = null;
    },
    cancel(e) { if (pts.has(e.id)) reset(e); },
  };
}
