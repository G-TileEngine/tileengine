import { px, toDevice } from "./camera.ts";
import { frameAt, hash32, instanceOffset } from "./frames.ts";
import { motionAt } from "./motion.ts";
import { BANDS, type Cam, type DrawCmd, type DrawList, type DrawOp, type Fit, type Overlay, type RenderScene, type Sheet, type Standing, type TileLayer } from "./types.ts";

const KIND = { object: 0, fxBehind: 1, unit: 2, fxFront: 3 } as const;
const rank = (st: Standing): number => (st.faceSwap === true && st.kind === "fxFront" ? KIND.fxBehind : KIND[st.kind]);

export const anchorPx = (sheet: Sheet): { x: number; y: number } => {
  const a = sheet.anchor;
  if (a === undefined || a === "auto") return { x: sheet.fw / 2, y: sheet.fh };
  return a.units === "norm" ? { x: a.x * sheet.fw, y: a.y * sheet.fh } : { x: a.x, y: a.y };
};

export function buildDrawList(scene: RenderScene, fit: Fit, cam: Cam, tMs: number, stepMs: number): DrawList {
  const cmds: DrawCmd[] = [];
  let dueMs = Infinity;
  const viewX0 = Math.floor(cam.devX / fit.s);
  const viewY0 = Math.floor(cam.devY / fit.s);
  const viewX1 = viewX0 + fit.artW + 1;
  const viewY1 = viewY0 + fit.artH + 1;
  const hit = (x: number, y: number, w: number, h: number): boolean => x + w > viewX0 && x < viewX1 && y + h > viewY0 && y < viewY1;
  const push = (band: DrawCmd["band"], sheet: Sheet, frameOf: () => { frame: number; nextMs: number }, x: number, y: number, op: DrawOp, flipX: boolean): void => {
    if (!hit(x, y, sheet.fw, sheet.fh)) return;
    const fr = frameOf();
    if (fr.nextMs < dueMs) dueMs = fr.nextMs;
    const cols = Math.max(1, sheet.columns);
    const at = toDevice(x, y, cam, fit);
    cmds.push({
      band, sheet: sheet.id, op, flipX,
      sx: (fr.frame % cols) * sheet.fw, sy: Math.floor(fr.frame / cols) * sheet.fh, sw: sheet.fw, sh: sheet.fh,
      dx: at.x, dy: at.y, dw: sheet.fw * fit.s, dh: sheet.fh * fit.s,
    });
  };
  const cells = (layers: readonly TileLayer[]): void => {
    for (const layer of layers) {
      const c0 = Math.max(0, Math.floor((viewX0 - layer.sheet.fw) / scene.tileW)), r0 = Math.max(0, Math.floor(viewY0 / scene.tileH));
      const c1 = Math.min(scene.cols, Math.ceil(viewX1 / scene.tileW)), r1 = Math.min(scene.rows, Math.ceil((viewY1 + layer.sheet.fh) / scene.tileH));
      for (let r = r0; r < r1; r += 1) for (let c = c0; c < c1; c += 1) {
        const tile = layer.tiles[r * scene.cols + c];
        if (tile === undefined || tile === null) continue;
        const clip = layer.anims?.[tile], mot = layer.motion?.[tile], sheet = mot === undefined ? layer.sheet : { ...layer.sheet, id: `${layer.sheet.id}~m${tile}~${mot.key}`, columns: mot.n };
        push("base", sheet, () => (mot !== undefined ? motionAt(mot.parts, tMs, 0, 0) : clip !== undefined ? frameAt(clip, tMs, stepMs) : { frame: tile, nextMs: Infinity }), c * scene.tileW, (r + 1) * scene.tileH - layer.sheet.fh, "normal", false);
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
      }, o.x, o.y, o.band === "glow" ? "add" : o.op ?? "normal", false);
    }
  };
  paint(scene.overlays.filter((o) => o.band === "fxGround"));
  const order = scene.standing.map((st, i) => ({ st, i })).sort((a, b) => (a.st.r + 1) * scene.tileH + (a.st.dy ?? 0) - ((b.st.r + 1) * scene.tileH + (b.st.dy ?? 0)) || a.st.c - b.st.c || rank(a.st) - rank(b.st) || (a.st.z ?? 0) - (b.st.z ?? 0) || a.i - b.i);
  for (const { st } of order) {
    const mark = anchorPx(st.sheet), mot = st.motion, sheet = mot === undefined ? st.sheet : { ...st.sheet, id: `${st.sheet.id}~m0~${mot.key}`, columns: mot.n };
    const off = instanceOffset(st.clip, stepMs, scene.mapSeed, st.key === undefined ? st.sheet.id : `${st.sheet.id}#${st.key}`, st.key === undefined ? st.c : 0, st.key === undefined ? st.r : 0);
    push("base", sheet, () => (mot !== undefined ? motionAt(mot.parts, tMs, st.c * scene.tileW + (st.dx ?? 0), hash32(scene.mapSeed, st.sheet.id, st.c, st.r)) : st.clip ? frameAt(st.clip, tMs, stepMs, off) : { frame: st.frame ?? 0, nextMs: Infinity }), st.c * scene.tileW + px(scene.tileW / 2) + (st.dx ?? 0) - mark.x + (st.ox ?? 0), (st.r + 1) * scene.tileH + (st.dy ?? 0) - mark.y + (st.oy ?? 0), "normal", st.flipX === true);
  }
  cells(scene.above);
  paint(scene.overlays.filter((o) => o.band !== "fxGround"));
  return { cmds, dueMs };
}
