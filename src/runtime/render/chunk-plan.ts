import { toDevice } from "./camera.ts";
import { buildDrawList } from "./draw-list.ts";
import type { Cam, DrawCmd, DrawList, Fit, RenderScene, TileLayer } from "./types.ts";

export const CHUNK = 16;
export const chunkId = (above: boolean, layer: number, cx: number, cy: number): string => `chunk:${above ? "a" : "g"}${layer}:${cx},${cy}`;
export const isStatic = (layer: TileLayer, tile: number | null | undefined): tile is number => tile !== null && tile !== undefined && layer.anims?.[tile] === undefined;

export function chunkedList(scene: RenderScene, fit: Fit, cam: Cam, tMs: number, stepMs: number): DrawList {
  const cmds: DrawCmd[] = [];
  let dueMs = Infinity;
  const add = (list: DrawList): void => { for (const cmd of list.cmds) cmds.push(cmd); if (list.dueMs < dueMs) dueMs = list.dueMs; };
  const x0 = Math.floor(cam.devX / fit.s), y0 = Math.floor(cam.devY / fit.s), x1 = x0 + fit.artW + 1, y1 = y0 + fit.artH + 1;
  const one = (layer: TileLayer, above: boolean): DrawList => buildDrawList({ ...scene, ground: above ? [] : [layer], above: above ? [layer] : [], standing: [], overlays: [] }, fit, cam, tMs, stepMs);
  const paint = (rows: readonly TileLayer[], above: boolean): void => {
    for (let li = 0; li < rows.length; li += 1) {
      const layer = rows[li];
      if (layer === undefined) continue;
      if (layer.sheet.fw !== scene.tileW || layer.sheet.fh !== scene.tileH) { add(one(layer, above)); continue; }
      const anim = layer.tiles.map((tile) => (isStatic(layer, tile) ? null : tile ?? null));
      for (let cy = 0; cy * CHUNK < scene.rows; cy += 1) for (let cx = 0; cx * CHUNK < scene.cols; cx += 1) {
        const c0 = cx * CHUNK, r0 = cy * CHUNK, cw = Math.min(CHUNK, scene.cols - c0), ch = Math.min(CHUNK, scene.rows - r0);
        const sw = cw * scene.tileW, sh = ch * scene.tileH, ax = c0 * scene.tileW, ay = r0 * scene.tileH;
        if (ax + sw <= x0 || ax >= x1 || ay + sh <= y0 || ay >= y1) continue;
        let keep = false; for (let r = r0; r < r0 + ch && !keep; r += 1) for (let c = c0; c < c0 + cw && !keep; c += 1) keep = isStatic(layer, layer.tiles[r * scene.cols + c]);
        if (!keep) continue;
        const at = toDevice(ax, ay, cam, fit);
        cmds.push({ band: "base", sheet: chunkId(above, li, cx, cy), op: "normal", flipX: false, sx: 0, sy: 0, sw, sh, dx: at.x, dy: at.y, dw: sw * fit.s, dh: sh * fit.s });
      }
      add(one({ ...layer, tiles: anim }, above));
    }
  };
  paint(scene.ground, false);
  add(buildDrawList({ ...scene, ground: [], above: [], overlays: [] }, fit, cam, tMs, stepMs));
  paint(scene.above, true);
  add(buildDrawList({ ...scene, ground: [], above: [], standing: [] }, fit, cam, tMs, stepMs));
  return { cmds, dueMs };
}
