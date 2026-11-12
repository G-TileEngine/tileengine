const RUN = (y: number, x: number, len: number, step: number): readonly [number, number, number, number] => [y, x, len, step];
export const SAMPLE = {
  kind: "sprite-recipe", formatVersion: 1, id: "sprite_01JD7Z5K3M8Q2W4E6R9T0Y1X2V", rev: 7, name: "Hero", raster: 1, size: { w: 32, h: 24 }, light: 135,
  palette: { slots: [{ id: "skin", ramp: ["#5a3a2a", "#8a5a40", "#c08a68"], base: 2 }, { id: "cloak", ramp: ["#0a1428", "#26384a"], base: 1, team: true }] },
  defaults: { outline: { on: true, px: 1, colour: "darker", sides: "outer" }, shade: { steps: 2, strength: 60, highlight: true, dither: "none" } },
  parts: [
    { id: "body", kind: "rect", slot: "skin", z: 0, joint: "root", mirror: "none", visible: true, locked: false, geom: { x: 1, y: 2, w: 8, h: 9, round: 50, rot: 90 },
      outline: { on: false, px: 2, colour: "cloak", sides: "all" }, shade: { angle: 45, steps: 3, strength: 10, highlight: false, dither: "bayer4" },
      runs: [RUN(0, 1, 2, -1), RUN(1, 0, 1, -2)], promotedFrom: { runs: [RUN(2, 2, 3, 1)] } },
    { id: "head", kind: "ellipse", slot: "skin", z: 1, joint: "neck", mirror: "x", visible: true, geom: { cx: 5, cy: 4, rx: 3, ry: 2 } },
    { id: "arm", kind: "capsule", slot: "skin", z: 2, joint: "root", mirror: "none", visible: true, geom: { x0: 0, y0: 0, x1: 4, y1: 6, r: 1 } },
    { id: "cape", kind: "blob", slot: "cloak", z: -1, joint: "neck", mirror: "none", visible: true, geom: { pts: [[0, 0], [6, 0], [6, 8], [0, 8]], round: 40 } },
    { id: "badge", kind: "polygon", slot: "cloak", z: 3, joint: "root", mirror: "none", visible: false, geom: { pts: [[1, 1], [3, 1], [2, 3]] } },
    { id: "spear", kind: "line", slot: "skin", z: 4, joint: "root", mirror: "none", visible: true, geom: { x0: 0, y0: 9, x1: 9, y1: 0, width: 2, cap: "round" } },
    { id: "belt", kind: "strokePath", slot: "cloak", z: 5, joint: "root", mirror: "none", visible: true, geom: { pts: [[0, 5], [8, 5]], width: 1, cap: "butt" } },
    { id: "eyes", kind: "pixelRun", slot: "skin", z: 6, joint: "neck", mirror: "none", visible: true, runs: [RUN(3, 4, 1, 0), RUN(3, 6, 1, 0), RUN(4, 0, 2, -1)] },
  ],
  skeleton: { joints: [{ id: "root", parent: null, at: { x: 16, y: 23 } }, { id: "neck", parent: "root", at: { x: 16, y: 8 } }] },
  anims: [{ name: "walk-down", loop: true, gen: { kind: "walk", style: "4", stride: 2, bob: 1, arm: 3 },
    frames: [{ ms: 120, pose: { root: { dx: 0, dy: -1, rot: 0 } }, parts: { head: { visible: true, slot: "cloak", geom: { cx: 6 } } }, runs: { eyes: [RUN(3, 4, 1, 1)] } }] }],
  facings: { down: { parts: { cape: { visible: false } } }, up: { parts: { head: { z: 9, geom: { ry: 3 } } }, pose: { neck: { dx: 1, dy: 0, rot: 90 } } }, side: { parts: {} }, sideMirror: "side" },
  variants: [{ id: "night", swap: { skin: ["#101010", "#202020"], cloak: "skin" } }],
  code: { lang: "js", src: "emit()", out: [{ op: "addPart" }], outHash: "0".repeat(64) },
  history: { cap: 2000, baseSeq: 0, ops: [{ seq: 1 }, { seq: 2 }] },
};
const bits = (path: string): string[] => path.split(/\.|\[|\]/).filter((s) => s !== "");
export const copy = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
export const getPath = (root: unknown, path: string): unknown => bits(path).reduce<unknown>((cur, k) => (cur !== null && typeof cur === "object" ? (cur as Record<string, unknown>)[k] : undefined), root);
export const setPath = (root: unknown, path: string, val: unknown): void => {
  const b = bits(path); let cur: unknown = root;
  for (let i = 0; i < b.length - 1; i += 1) cur = (cur as Record<string, unknown>)[b[i] ?? ""];
  (cur as Record<string, unknown>)[b[b.length - 1] ?? ""] = val;
};
const hold = (path: string, v: unknown): boolean => path === "history.ops" || path === "code.out" || ((path.startsWith("facings.") || path.includes(".frames[")) && path.endsWith(".geom")) || (Array.isArray(v) && typeof v[0] === "number");
export function fieldPaths(v: unknown, path = "", out: string[] = []): string[] {
  if (path === "") { for (const k of Object.keys(v as object)) if (k !== "kind" && k !== "formatVersion") fieldPaths((v as Record<string, unknown>)[k], k, out); return out; }
  out.push(path);
  if (hold(path, v) || v === null || typeof v !== "object") return out;
  if (Array.isArray(v)) v.forEach((c, i) => { fieldPaths(c, path + "[" + String(i) + "]", out); });
  else for (const k of Object.keys(v as object)) fieldPaths((v as Record<string, unknown>)[k], path + "." + k, out);
  return out;
}
