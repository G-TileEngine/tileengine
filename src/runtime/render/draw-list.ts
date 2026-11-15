import { toDevice } from "./camera.ts";
import { footAt, frameAt, hash32, instanceOffset } from "./frames.ts";
import { FX_BUDGET } from "./fx-particles.ts";
import { lookBox, lookId, rgbOf } from "./fx-look.ts";
import { motionAt } from "./motion.ts";
import { BANDS, type Cam, type DrawCmd, type DrawList, type DrawOp, type Fit, type Overlay, type RenderScene, type SceneDot, type Sheet, type Standing, type TileLayer } from "./types.ts";

const KIND = { object: 0, fxBehind: 1, unit: 2, fxFront: 3 } as const;
const rank = (st: Standing): number => (st.faceSwap === true && st.kind === "fxFront" ? KIND.fxBehind : KIND[st.kind]);

export const anchorPx = (sheet: Sheet): { x: number; y: number } => {
  const a = sheet.anchor;
  if (a === undefined || a === "auto") return { x: sheet.fw / 2, y: sheet.fh };
  return a.units === "norm" ? { x: a.x * sheet.fw, y: a.y * sheet.fh } : { x: a.x, y: a.y };
};

export function buildDrawList(scene: RenderScene, fit: Fit, cam: Cam, tMs: number, stepMs: number): DrawList {
  const cmds: DrawCmd[] = [];
  let dueMs = scene.dueMs !== undefined && Number.isFinite(scene.dueMs) ? scene.dueMs : Infinity;
  const viewX0 = Math.floor(cam.devX / fit.s), viewY0 = Math.floor(cam.devY / fit.s), viewX1 = viewX0 + fit.artW + 1, viewY1 = viewY0 + fit.artH + 1;
  const hit = (x: number, y: number, w: number, h: number): boolean => x + w > viewX0 && x < viewX1 && y + h > viewY0 && y < viewY1;
  const push = (band: DrawCmd["band"], sheet: Sheet, frameOf: () => { frame: number; nextMs: number }, x: number, y: number, op: DrawOp, flipX: boolean, pass = false, look?: string, scale?: number): void => {
    const k = scale !== undefined && scale > 1 ? scale : 1, ax = anchorPx(sheet); let w = sheet.fw, h = sheet.fh, ox = 0, oy = 0;
    if (look !== undefined) { const box = lookBox(sheet.fw, sheet.fh, look); w = box.w; h = box.h; ox = box.ox; oy = box.oy; }
    const x0 = x + ax.x - (ax.x + ox) * k, y0 = y + ax.y - (ax.y + oy) * k, dw = w * k, dh = h * k; if (!hit(x0, y0, dw, dh)) return;
    const fr = frameOf(); if (fr.nextMs < dueMs) dueMs = fr.nextMs;
    const cols = Math.max(1, sheet.columns), at = toDevice(x0, y0, cam, fit);
    cmds.push({ band, sheet: look === undefined ? sheet.id : lookId(sheet.id, fr.frame, sheet.fw, sheet.fh, look), op, flipX, sx: look === undefined ? (fr.frame % cols) * sheet.fw : 0, sy: look === undefined ? Math.floor(fr.frame / cols) * sheet.fh : 0, sw: look === undefined ? sheet.fw : w, sh: look === undefined ? sheet.fh : h, dx: at.x, dy: at.y, dw: dw * fit.s, dh: dh * fit.s, ...(pass ? { selfLit: true } : {}) });
  };
  const rgba = (hex: string, a: number): string => { const c = rgbOf(hex); return c === null ? hex : `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
  const specks = (band: SceneDot["band"], lit: boolean): void => {
    const grp = new Map<string, number[]>();
    for (const d of scene.dots ?? []) if (d.band === band && hit(d.x, d.y, d.size, d.size)) { const key = d.alpha >= 1 ? d.colour : rgba(d.colour, d.alpha), at = toDevice(d.x, d.y, cam, fit), row = grp.get(key); if (row === undefined) grp.set(key, [at.x, at.y, d.size * fit.s, d.size * fit.s]); else row.push(at.x, at.y, d.size * fit.s, d.size * fit.s); }
    for (const [colour, rects] of grp) cmds.push({ band, sheet: "", op: "normal", flipX: false, sx: 0, sy: 0, sw: 0, sh: 0, dx: 0, dy: 0, dw: 0, dh: 0, colour, rects, ...(lit ? { selfLit: true } : {}) });
  };
  const cells = (layers: readonly TileLayer[]): void => {
    for (const layer of layers) {
      const c0 = Math.max(0, Math.floor((viewX0 - layer.sheet.fw) / scene.tileW)), r0 = Math.max(0, Math.floor(viewY0 / scene.tileH));
      const c1 = Math.min(scene.cols, Math.ceil(viewX1 / scene.tileW)), r1 = Math.min(scene.rows, Math.ceil((viewY1 + layer.sheet.fh) / scene.tileH));
      for (let r = r0; r < r1; r += 1) for (let c = c0; c < c1; c += 1) {
        const tile = layer.tiles[r * scene.cols + c];
        if (tile === undefined || tile === null) continue;
        const clip = layer.anims?.[tile], mot = layer.motion?.[tile], sheet = mot === undefined ? layer.sheet : { ...layer.sheet, id: `${layer.sheet.id}~m${tile}~${mot.key}`, columns: mot.n };
        push("base", sheet, () => (mot !== undefined ? motionAt(mot.parts, tMs, 0, 0) : clip !== undefined ? frameAt(clip, tMs, stepMs) : { frame: tile, nextMs: Infinity }), c * scene.tileW, footAt(c, r, scene.tileW, scene.tileH).y - layer.sheet.fh, "normal", false);
      }
    }
  };
  cells(scene.ground);
  const paint = (list: readonly Overlay[]): void => {
    for (const { o } of list.map((o, i) => ({ o, i })).sort((a, b) => BANDS.indexOf(a.o.band) - BANDS.indexOf(b.o.band) || a.i - b.i)) {
      const start = o.startMs ?? 0;
      if (tMs < start) { if (hit(o.x, o.y, o.sheet.fw, o.sheet.fh) && start < dueMs) dueMs = start; continue; }
      push(o.band, o.sheet, () => {
        const fr = o.clip ? frameAt(o.clip, tMs - start, stepMs) : { frame: o.frame ?? 0, nextMs: Infinity };
        return { frame: fr.frame, nextMs: o.clip !== undefined && fr.nextMs !== Infinity ? start + fr.nextMs : fr.nextMs };
      }, o.x, o.y, o.band === "glow" ? "add" : o.op ?? "normal", false, o.selfLit === true && (o.band === "fxAir" || o.band === "glow" || o.band === "flash"), o.look, o.scale);
    }
  };
  paint(scene.overlays.filter((o) => o.band === "fxGround"));
  specks("fxGround", false);
  const order = scene.standing.map((st, i) => ({ st, i, foot: footAt(st.c, st.r, scene.tileW, scene.tileH, st.dx ?? 0, st.dy ?? 0) })).sort((a, b) => a.foot.y - b.foot.y || a.st.c - b.st.c || rank(a.st) - rank(b.st) || (a.st.z ?? 0) - (b.st.z ?? 0) || a.i - b.i);
  const from = cmds.length;
  for (const { st, foot } of order) {
    const mot = st.motion, sq = st.squash === true && st.sheet.fh > 2, sheet = sq ? { ...st.sheet, id: `${st.sheet.id}~sq${st.frame ?? 0}~${st.sheet.fw}x${st.sheet.fh}`, fw: st.sheet.fw + 2, fh: st.sheet.fh - 2, columns: 1 } : mot === undefined ? st.sheet : { ...st.sheet, id: `${st.sheet.id}~m0~${mot.key}`, columns: mot.n };
    const mark = anchorPx(sheet);
    const off = instanceOffset(st.clip, stepMs, scene.mapSeed, st.key === undefined ? st.sheet.id : `${st.sheet.id}#${st.key}`, st.key === undefined ? st.c : 0, st.key === undefined ? st.r : 0) - (st.lagMs ?? 0);
    push("base", sheet, () => (mot !== undefined ? motionAt(mot.parts, tMs, st.c * scene.tileW + (st.dx ?? 0), hash32(scene.mapSeed, st.sheet.id, st.c, st.r)) : st.clip ? frameAt(st.clip, tMs, stepMs, off) : { frame: st.frame ?? 0, nextMs: Infinity }), foot.x - mark.x + (st.ox ?? 0), foot.y - mark.y + (st.oy ?? 0), "normal", st.flipX === true, st.kind === "fxFront" && st.faceSwap !== true && st.sceneLit !== true, sq || mot !== undefined ? undefined : st.look, st.scale);
  }
  for (let i = from; i < cmds.length; i += 1) {
    const a = cmds[i]; if (a?.selfLit !== true) continue;
    for (let j = i + 1; j < cmds.length; j += 1) {
      const b = cmds[j]; if (b === undefined || b.selfLit === true || a.dx >= b.dx + b.dw || b.dx >= a.dx + a.dw || a.dy >= b.dy + b.dh || b.dy >= a.dy + a.dh) continue;
      const { selfLit, ...rest } = a; cmds[i] = selfLit === true ? rest : a; break;
    }
  }
  cells(scene.above);
  for (const band of ["wash", "fxAir", "glow", "flash", "ui"] as const) { paint(scene.overlays.filter((o) => o.band === band)); if (band !== "ui") specks(band, true); }
  let draws = 0; for (const c of cmds) draws += c.rects === undefined ? 1 : c.rects.length / 4;
  for (let i = cmds.length - 1; i >= 0 && draws > FX_BUDGET.frame; i -= 1) { const c = cmds[i]; if (c?.rects === undefined) continue; const n = c.rects.length / 4, drop = Math.min(n, draws - FX_BUDGET.frame); draws -= drop; if (drop === n) cmds.splice(i, 1); else cmds[i] = { ...c, rects: c.rects.slice(0, (n - drop) * 4) }; }
  return { cmds, dueMs };
}
