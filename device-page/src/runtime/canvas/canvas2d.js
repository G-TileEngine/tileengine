import { CHUNK, LOOK, STEPS, isStatic,                                                                                                                           } from "../render/index.js";

                     
                                                                                       
                                                                                                                         
                                                                                                                                                      
                                                                                                                                                                                                                                                                                                                                                                          
  
                                                                                                                                                                                                                
                                                                                                                                                                                                                                                                        
                                                                                                                                                                                                                                                                                                                                                                                
                                                                                                                                    
                                                                                

export function canvas2d(canvas            , opts                 )           {
  const ctx = canvas.getContext("2d");
  if (ctx === null) throw new Error("canvas2d: no 2d context");
  const budget = opts.budgetBytes ?? 32 * 2 ** 20, limit = opts.buildsPerFrame ?? 2, stats = { builds: 0, bytes: 0, lost: false, missing: false, capped: false, lightBuilds: 0 }, lru          = [], gen = new Map               ();
  let scene                     = null, rev = Number.NaN, frame = 0, built = 0, open = false, lost = false, missing = false, capped = false, hold = false;
  let lightsKey                   = null, lightMiss                   = null, darkC                    = null, glowC                    = null, lightBytes = 0, genBytes = 0;
  const tileAt = (layer           , c        , r        )                            => layer.tiles[r * (scene?.cols ?? 0) + c];
  const sigOf = (layer           , c0        , r0        , cw        , ch        )         => {
    let sig = `${layer.sheet.id}/${layer.sheet.columns}`;
    for (let r = r0; r < r0 + ch; r += 1) for (let c = c0; c < c0 + cw; c += 1) { const tile = tileAt(layer, c, r); sig += isStatic(layer, tile) ? `:${tile}` : ":."; }
    return sig;
  };
  const boxOf = (id        )             => {
    const hit = /^chunk:([ag])(\d+):(\d+),(\d+)$/.exec(id);
    const layer = hit === null || scene === null ? undefined : (hit[1] === "a" ? scene.above : scene.ground)[Number(hit[2] ?? 0)];
    if (hit === null || scene === null || layer === undefined) return null;
    const c0 = Number(hit[3]) * CHUNK, r0 = Number(hit[4]) * CHUNK;
    return c0 >= scene.cols || r0 >= scene.rows ? null : { layer, c0, r0, cw: Math.min(CHUNK, scene.cols - c0), ch: Math.min(CHUNK, scene.rows - r0) };
  };
  const drop = (entry       )       => { const at = lru.indexOf(entry); if (at >= 0) lru.splice(at, 1); stats.bytes -= entry.bytes; entry.canvas.width = 0; entry.canvas.height = 0; };
  const touch = (entry       )       => { const at = lru.indexOf(entry); if (at >= 0) lru.splice(at, 1); lru.push(entry); entry.frame = frame; };
  const tileBlit = (onto       , img        , sheet       , tile        , dx        , dy        , dw        , dh        )       => {
    const cols = Math.max(1, sheet.columns);
    onto.drawImage(img, (tile % cols) * sheet.fw, Math.floor(tile / cols) * sheet.fh, sheet.fw, sheet.fh, dx, dy, dw, dh);
  };
  const paint = (img        , sx        , sy        , sw        , sh        , dx        , dy        , dw        , dh        , op        , flipX         )       => {
    const add = op === "add";
    if (add) ctx.globalCompositeOperation = "lighter";
    try {
      if (!flipX) ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      else { ctx.save(); try { ctx.translate(dx + dw, dy); ctx.scale(-1, 1); ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh); } finally { ctx.restore(); } }
    } finally { if (add) ctx.globalCompositeOperation = "source-over"; }
  };
  const eachStatic = (box     , draw                                              )       => {
    for (let r = box.r0; r < box.r0 + box.ch; r += 1) for (let c = box.c0; c < box.c0 + box.cw; c += 1) { const tile = tileAt(box.layer, c, r); if (isStatic(box.layer, tile)) draw(tile, c, r); }
  };
  const bake = (id        , box     )               => {
    const img = opts.images(box.layer.sheet.id), map = scene;
    if (img === undefined || map === null) { missing = true; return null; }
    const w = box.cw * map.tileW, h = box.ch * map.tileH, made = opts.makeCanvas(w, h), bctx = made.getContext("2d");
    if (bctx === null) { missing = true; return null; }
    bctx.imageSmoothingEnabled = false;
    eachStatic(box, (tile, c, r) => tileBlit(bctx, img, box.layer.sheet, tile, (c - box.c0) * map.tileW, (r - box.r0) * map.tileH, box.layer.sheet.fw, box.layer.sheet.fh));
    const entry        = { id, canvas: made, sig: sigOf(box.layer, box.c0, box.r0, box.cw, box.ch), img, frame, bytes: w * h * 4, stale: false };
    stats.builds += 1; stats.bytes += entry.bytes; built += 1; lru.push(entry);
    return entry;
  };
  const freeLights = ()       => { stats.bytes -= lightBytes; lightBytes = 0; lightsKey = null; if (darkC !== null) { darkC.width = 0; darkC.height = 0; } if (glowC !== null) { glowC.width = 0; glowC.height = 0; } darkC = null; glowC = null; };
  const dropGen = (entry       )       => { gen.delete(entry.id); stats.bytes -= entry.bytes; genBytes -= entry.bytes; entry.canvas.width = 0; entry.canvas.height = 0; };
  const onLost = ()       => { lost = true; stats.lost = true; }, onRestored = ()       => { lost = false; stats.lost = false; hold = true; stats.missing = false; lightMiss = null; freeLights(); for (const entry of [...lru]) drop(entry); for (const entry of [...gen.values()]) dropGen(entry); };
  canvas.addEventListener?.("contextlost", onLost); canvas.addEventListener?.("contextrestored", onRestored);
  return {
    stats,
    world(next, nextRev) {
      scene = next;
      if (nextRev === rev) return;
      rev = nextRev;
      for (const entry of [...lru]) {
        const box = boxOf(entry.id);
        if (box === null) { drop(entry); continue; }
        if (entry.sig !== sigOf(box.layer, box.c0, box.r0, box.cw, box.ch) || opts.images(box.layer.sheet.id) !== entry.img) entry.stale = true;
      }
    },
    busy: () => !lost && (hold || missing || capped),
    dispose() { canvas.removeEventListener?.("contextlost", onLost); canvas.removeEventListener?.("contextrestored", onRestored); for (const entry of [...lru]) drop(entry); for (const entry of [...gen.values()]) dropGen(entry); freeLights(); lightMiss = null; scene = null; },
    lights(plan, fit, cam) {
      if (!open || lost) return;
      if (lightMiss === plan) return;
      if (lightsKey !== plan) {
        const same = darkC !== null && glowC !== null && darkC.width === plan.w && darkC.height === plan.h;
        if (!same) freeLights();
        const dark = same && darkC !== null ? darkC : opts.makeCanvas(plan.w, plan.h), glow = same && glowC !== null ? glowC : opts.makeCanvas(plan.w, plan.h);
        if (same) { dark.width = plan.w; glow.width = plan.w; }
        const dctx = dark.getContext("2d"), gctx = glow.getContext("2d");
        if (dctx === null || gctx === null) { dark.width = 0; dark.height = 0; glow.width = 0; glow.height = 0; freeLights(); lightMiss = plan; missing = true; return; }
        const put = (onto       , colour                       )       => { onto.imageSmoothingEnabled = false; for (let y = 0; y < plan.h; y += 1) { let from = -1, ink = ""; for (let x = 0; x <= plan.w; x += 1) { const c = x < plan.w ? colour(y * plan.w + x) : ""; if (c === ink) continue; if (from >= 0) { onto.fillStyle = ink; onto.fillRect(from, y, x - from, 1); } from = c === "" ? -1 : x; ink = c; } } };
        put(dctx, (i) => { const k = plan.dark[i] ?? 0; return k === 0 ? "" : `rgba(3,8,26,${k / STEPS})`; });
        put(gctx, (i) => { const lv = plan.level[i] ?? 0; if (lv < 4) return ""; const idx = plan.tint?.[i] ?? 0; const ink = idx > 0 ? plan.colours?.[idx - 1] ?? "255,176,72" : "255,176,72"; return `rgba(${ink},${((lv - 3) * 2) / STEPS})`; });
        if (!same) { lightBytes = plan.w * plan.h * 8; stats.bytes += lightBytes; darkC = dark; glowC = glow; }
        lightsKey = plan; stats.lightBuilds += 1;
      }
      if (darkC === null || glowC === null) return;
      const dx = fit.padX - cam.devX, dy = fit.padY - cam.devY, dw = plan.w * plan.res * fit.s, dh = plan.h * plan.res * fit.s;
      ctx.imageSmoothingEnabled = false; ctx.drawImage(darkC, 0, 0, plan.w, plan.h, dx, dy, dw, dh);
      ctx.globalCompositeOperation = "lighter"; ctx.drawImage(glowC, 0, 0, plan.w, plan.h, dx, dy, dw, dh); ctx.globalCompositeOperation = "source-over";
    },
    beginFrame(fit     , clear        ) {
      frame += 1; built = 0; missing = false; capped = false;
      if (open) { ctx.restore(); open = false; }
      if (lost) return;
      if (canvas.width !== fit.devW) canvas.width = fit.devW;
      if (canvas.height !== fit.devH) canvas.height = fit.devH;
      ctx.imageSmoothingEnabled = false; ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = clear; ctx.fillRect(0, 0, fit.devW, fit.devH);
      ctx.save(); open = true; ctx.beginPath(); ctx.rect(fit.padX, fit.padY, fit.artW * fit.s, fit.artH * fit.s); ctx.clip();
    },
    frame(id, index, fw, fh) {
      const img = opts.images(id); if (img === undefined) return undefined;
      const cols = Math.max(1, Math.floor(((img                      ).width ?? fw) / fw) || 1), bctx = opts.makeCanvas(fw, fh).getContext("2d");
      if (bctx?.getImageData === undefined) return undefined;
      bctx.drawImage(img, (index % cols) * fw, Math.floor(index / cols) * fh, fw, fh, 0, 0, fw, fh); return { w: fw, h: fh, data: bctx.getImageData(0, 0, fw, fh).data };
    },
    drawImage(id, sx, sy, sw, sh, dx, dy, dw, dh, op, flipX) {
      if (lost) return;
      if (!id.startsWith("chunk:")) {
        const hit = gen.get(id);
        if (hit !== undefined) { gen.delete(id); hit.frame = frame; gen.set(id, hit); paint(hit.canvas, sx, sy, sw, sh, dx, dy, dw, dh, op, flipX); return; }
        const px = opts.pixels?.(id);
        if (px !== undefined) {
          const made = opts.makeCanvas(px.w, px.h), bctx = made.getContext("2d");
          if (bctx?.createImageData === undefined || bctx.putImageData === undefined) { missing = true; return; }
          const image = bctx.createImageData(px.w, px.h); image.data.set(px.data); bctx.putImageData(image, 0, 0);
          gen.set(id, { id, canvas: made, sig: "", img: undefined, frame, bytes: px.w * px.h * 4, stale: false }); stats.bytes += px.w * px.h * 4; genBytes += px.w * px.h * 4; paint(made, sx, sy, sw, sh, dx, dy, dw, dh, op, flipX); return;
        }
        const img = opts.images(id);
        if (img === undefined) missing = true; else paint(img, sx, sy, sw, sh, dx, dy, dw, dh, op, flipX);
        return;
      }
      const box = boxOf(id), map = scene;
      if (box === null || map === null) { missing = true; return; }
      const hit = lru.find((entry) => entry.id === id);
      if (hit !== undefined && !hit.stale) { touch(hit); paint(hit.canvas, sx, sy, sw, sh, dx, dy, dw, dh, op, flipX); return; }
      if (built < limit) { if (hit !== undefined) drop(hit); const made = bake(id, box); if (made !== null) paint(made.canvas, sx, sy, sw, sh, dx, dy, dw, dh, op, flipX); return; }
      const img = opts.images(box.layer.sheet.id), scaleX = dw / (box.cw * map.tileW || 1), scaleY = dh / (box.ch * map.tileH || 1);
      if (img === undefined) { missing = true; return; }
      capped = true;
      eachStatic(box, (tile, c, r) => tileBlit(ctx, img, box.layer.sheet, tile, dx + (c - box.c0) * map.tileW * scaleX, dy + (r - box.r0) * map.tileH * scaleY, box.layer.sheet.fw * scaleX, box.layer.sheet.fh * scaleY));
    },
    fillRect(x, y, w, h, colour) { if (lost) return; ctx.fillStyle = colour; ctx.fillRect(x, y, w, h); },
    fillRects(rects, colour) { if (lost) return; ctx.beginPath(); ctx.fillStyle = colour; for (let i = 0; i < rects.length; i += 4) ctx.rect(rects[i] ?? 0, rects[i + 1] ?? 0, rects[i + 2] ?? 0, rects[i + 3] ?? 0); ctx.fill?.(); },
    endFrame() {
      if (open) { ctx.restore(); open = false; }
      if (!lost) { while (genBytes + lightBytes > LOOK.cacheBytes) { const oldest = gen.values().next().value; if (oldest === undefined || oldest.frame === frame) break; dropGen(oldest); } while (stats.bytes > budget) { const oldest = lru[0]; if (oldest === undefined || oldest.frame === frame) break; drop(oldest); } for (const entry of [...gen.values()]) if (frame - entry.frame >= 120) dropGen(entry); }
      stats.missing = missing; stats.capped = capped;
      if (!lost && !missing && !capped) hold = false;
    },
  };
}
