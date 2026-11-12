import type { Notice } from "../../core/notice.ts"; import type { SpriteRecipeLimits } from "./limits.ts"; import type { Anim, Facing, Frame, Json, Outline, PartKind, Pose, RecipePart, Run, Shade, Slot, SpriteRecipe } from "./types.ts";
type Rec = Record<string, unknown>; type Ns = Notice[]; type Geom = NonNullable<RecipePart["geom"]>; const ID = /^[a-z0-9_-]{1,24}$/; const ULID = /^sprite_[0-9A-HJKMNP-TV-Z]{26}$/; const HEX = /^#[0-9a-fA-F]{6}$/;
const HASH = /^[0-9a-f]{64}$/; const KINDS = ["pixelRun", "rect", "ellipse", "capsule", "blob", "polygon", "line", "strokePath"] as const; const isObj = (v: unknown): v is Rec => typeof v === "object" && v !== null && !Array.isArray(v);
const bad = (ns: Ns, key: string): void => { ns.push({ code: "badField", message: "badField " + key }); }; const over = (ns: Ns, key: string): void => { ns.push({ code: "overCap", message: "overCap " + key }); };
const isKind = (v: unknown): v is PartKind => typeof v === "string" && (KINDS as readonly string[]).includes(v); function num(v: unknown, key: string, ns: Ns, dflt: number, min?: number, max?: number): number {
if (typeof v !== "number" || !Number.isFinite(v)) { bad(ns, key); return dflt; } let n = v; if (!Number.isInteger(v)) { ns.push({ code: "floatParam", message: "floatParam " + key }); n = Math.floor(v); }
if ((min !== undefined && n < min) || (max !== undefined && n > max)) { bad(ns, key); return dflt; } return n; } function cell(v: unknown, key: string, ns: Ns, min?: number, max?: number): number | null {
const n0 = ns.length; const n = num(v, key, ns, 0, min, max); for (let i = n0; i < ns.length; i += 1) if (ns[i]?.code === "badField") return null; return n; }
const bool = (v: unknown, key: string, ns: Ns, dflt: boolean): boolean => (typeof v === "boolean" ? v : (bad(ns, key), dflt));
const str = (v: unknown, key: string, ns: Ns, dflt: string, re?: RegExp): string => (typeof v === "string" && (re === undefined || re.test(v)) ? v : (bad(ns, key), dflt));
function enm<T extends string>(v: unknown, key: string, ns: Ns, ok: readonly T[], dflt: T): T { return typeof v === "string" && (ok as readonly string[]).includes(v) ? v as T : (bad(ns, key), dflt); }
function ident(v: unknown, key: string, ns: Ns, ids: Set<string>): string { if (typeof v !== "string" || !ID.test(v)) { bad(ns, key); return ""; }
if (ids.has(v)) ns.push({ code: "duplicateId", message: "duplicateId " + key }); else ids.add(v); return v; } const ref = (v: unknown, key: string, ns: Ns): string => (typeof v === "string" && ID.test(v) ? v : (bad(ns, key), ""));
function take(v: unknown, key: string, ns: Ns, cap: number | null, min: number): unknown[] | null { if (!Array.isArray(v)) { bad(ns, key); return null; }
if (cap !== null && v.length > cap) over(ns, key); else if (v.length < min) bad(ns, key); return v.slice(0, cap === null ? v.length : Math.min(v.length, cap)); }
function pts(v: unknown, key: string, ns: Ns, cap: number, min: number): readonly (readonly [number, number])[] { const a = take(v, key, ns, cap, min); if (a === null) return []; const out: (readonly [number, number])[] = [];
for (let i = 0; i < a.length; i += 1) { const item = a[i]; const ik = key + "[" + String(i) + "]"; if (!Array.isArray(item) || item.length !== 2) { bad(ns, ik); continue; }
const x = cell(item[0], ik + "[0]", ns); const y = cell(item[1], ik + "[1]", ns); if (x !== null && y !== null) out.push([x, y]); } return out; } function runsOf(v: unknown, key: string, ns: Ns, cap: number): Run[] {
const a = take(v, key, ns, cap, 0); if (a === null) return []; const out: Run[] = []; let prev: readonly [number, number] | null = null; for (let i = 0; i < a.length; i += 1) { const item = a[i]; const ik = key + "[" + String(i) + "]";
if (!Array.isArray(item) || item.length !== 4) { bad(ns, ik); continue; } const y = cell(item[0], ik + "[0]", ns); const x = cell(item[1], ik + "[1]", ns);
const len = cell(item[2], ik + "[2]", ns, 1); const step = cell(item[3], ik + "[3]", ns, -2); if (y === null || x === null || len === null || step === null) continue;
if (prev !== null && (y < prev[0] || (y === prev[0] && x < prev[1]))) { bad(ns, ik); continue; } prev = [y, x]; out.push([y, x, len, step]); } return out; }
const hex = (v: unknown, key: string, ns: Ns): string => str(v, key, ns, "#000000", HEX); function ramp(v: unknown, key: string, ns: Ns): string[] { const a = take(v, key, ns, null, 2); if (a === null) return [];
if (a.length > 8 || (Array.isArray(v) && v.length > 8)) bad(ns, key); const n = Math.min(a.length, 8); const out: string[] = []; for (let i = 0; i < n; i += 1) out.push(hex(a[i], key + "[" + String(i) + "]", ns)); return out; }
function outline(v: unknown, key: string, ns: Ns): Outline { if (!isObj(v)) { bad(ns, key); return { on: false, px: 1, colour: "darker", sides: "outer" }; }
return { on: bool(v.on, key + ".on", ns, false), px: num(v.px, key + ".px", ns, 1, 0, 2), colour: v.colour === "darker" || (typeof v.colour === "string" && ID.test(v.colour)) ? v.colour : (bad(ns, key + ".colour"), "darker"), sides: enm(v.sides, key + ".sides", ns, ["outer", "all"], "outer") }; } function shade(v: unknown, key: string, ns: Ns): Shade {
if (!isObj(v)) { bad(ns, key); return { steps: 2, strength: 60, highlight: false, dither: "none" }; } const angle = v.angle === undefined ? undefined : num(v.angle, key + ".angle", ns, 0);
const base: Shade = { steps: num(v.steps, key + ".steps", ns, 2, 1, 4), strength: num(v.strength, key + ".strength", ns, 60, 0, 100), highlight: bool(v.highlight, key + ".highlight", ns, false), dither: enm(v.dither, key + ".dither", ns, ["none", "checker", "bayer4"], "none") };
return angle === undefined ? base : { angle, ...base }; } function withRot(g: Rec, key: string, ns: Ns, base: Geom): Geom {
return g.rot === undefined ? base : { ...base, rot: num(g.rot, key + ".rot", ns, 0) }; } function geomOf(kind: PartKind, v: unknown, key: string, ns: Ns, cap: number, kindBad: boolean): Geom | undefined {
if (kind === "pixelRun") { if (!kindBad && v !== undefined) bad(ns, key); return undefined; } if (!isObj(v)) { bad(ns, key); if (kind === "rect") return { x: 0, y: 0, w: 0, h: 0, round: 0 };
if (kind === "ellipse") return { cx: 0, cy: 0, rx: 0, ry: 0 }; if (kind === "capsule") return { x0: 0, y0: 0, x1: 0, y1: 0, r: 0 }; if (kind === "blob") return { pts: [], round: 0 }; if (kind === "polygon") return { pts: [] };
if (kind === "line") return { x0: 0, y0: 0, x1: 0, y1: 0, width: 1, cap: "butt" }; return { pts: [], width: 1, cap: "butt" }; }
if (kind === "rect") return withRot(v, key, ns, { x: num(v.x, key + ".x", ns, 0), y: num(v.y, key + ".y", ns, 0), w: num(v.w, key + ".w", ns, 0, 0), h: num(v.h, key + ".h", ns, 0, 0), round: num(v.round, key + ".round", ns, 0, 0, 100) });
if (kind === "ellipse") return withRot(v, key, ns, { cx: num(v.cx, key + ".cx", ns, 0), cy: num(v.cy, key + ".cy", ns, 0), rx: num(v.rx, key + ".rx", ns, 0, 0), ry: num(v.ry, key + ".ry", ns, 0, 0) });
if (kind === "capsule") return withRot(v, key, ns, { x0: num(v.x0, key + ".x0", ns, 0), y0: num(v.y0, key + ".y0", ns, 0), x1: num(v.x1, key + ".x1", ns, 0), y1: num(v.y1, key + ".y1", ns, 0), r: num(v.r, key + ".r", ns, 0, 0) });
if (kind === "blob") return withRot(v, key, ns, { pts: pts(v.pts, key + ".pts", ns, cap, 3), round: num(v.round, key + ".round", ns, 0, 0, 100) });
if (kind === "polygon") return withRot(v, key, ns, { pts: pts(v.pts, key + ".pts", ns, cap, 3) });
if (kind === "line") return withRot(v, key, ns, { x0: num(v.x0, key + ".x0", ns, 0), y0: num(v.y0, key + ".y0", ns, 0), x1: num(v.x1, key + ".x1", ns, 0), y1: num(v.y1, key + ".y1", ns, 0), width: num(v.width, key + ".width", ns, 1, 1, 3), cap: enm(v.cap, key + ".cap", ns, ["butt", "round"], "butt") });
return withRot(v, key, ns, { pts: pts(v.pts, key + ".pts", ns, cap, 2), width: num(v.width, key + ".width", ns, 1, 1, 3), cap: enm(v.cap, key + ".cap", ns, ["butt", "round"], "butt") }); }
function part(v: unknown, key: string, ns: Ns, lim: SpriteRecipeLimits, ids: Set<string>): RecipePart { if (!isObj(v)) return (bad(ns, key), { id: "", kind: "pixelRun", slot: "", z: 0, joint: "", mirror: "none", visible: false });
const id = ident(v.id, key + ".id", ns, ids); const kind: PartKind = isKind(v.kind) ? v.kind : (bad(ns, key + ".kind"), "pixelRun"); const kindBad = !isKind(v.kind);
const slotV = ref(v.slot, key + ".slot", ns); const z = num(v.z, key + ".z", ns, 0); const joint = ref(v.joint, key + ".joint", ns);
const mirror = enm(v.mirror, key + ".mirror", ns, ["none", "x"], "none"); const visible = bool(v.visible, key + ".visible", ns, false);
const locked = v.locked === undefined ? undefined : bool(v.locked, key + ".locked", ns, false); const ol = v.outline === undefined ? undefined : outline(v.outline, key + ".outline", ns);
const sh = v.shade === undefined ? undefined : shade(v.shade, key + ".shade", ns); const rn = v.runs === undefined ? undefined : runsOf(v.runs, key + ".runs", ns, lim.runs);
const pf = v.promotedFrom === undefined ? undefined : (isObj(v.promotedFrom) ? { runs: runsOf(v.promotedFrom.runs, key + ".promotedFrom.runs", ns, lim.runs) } : (bad(ns, key + ".promotedFrom"), { runs: [] as readonly Run[] }));
const geom = kindBad ? undefined : geomOf(kind, v.geom, key + ".geom", ns, lim.points, false); return {
id, kind, slot: slotV, z, joint, mirror, visible, ...(locked === undefined ? {} : { locked }), ...(ol === undefined ? {} : { outline: ol }), ...(sh === undefined ? {} : { shade: sh }),
...(rn === undefined ? {} : { runs: rn }), ...(pf === undefined ? {} : { promotedFrom: pf }), ...(geom === undefined ? {} : { geom }) }; } function slot(v: unknown, key: string, ns: Ns, ids: Set<string>): Slot {
if (!isObj(v)) return (bad(ns, key), { id: "", ramp: [], base: 0 }); const id = ident(v.id, key + ".id", ns, ids); const rampV = ramp(v.ramp, key + ".ramp", ns);
const baseN = num(v.base, key + ".base", ns, 0, 0, 7); const team = v.team === undefined ? undefined : bool(v.team, key + ".team", ns, false);
const base: Slot = { id, ramp: rampV, base: baseN }; return team === undefined ? base : { ...base, team }; }
function poseOf(v: unknown, key: string, ns: Ns): Pose { if (!isObj(v)) return (bad(ns, key), {}); const out: Record<string, { dx: number; dy: number; rot: number }> = {}; for (const k of Object.keys(v)) {
const ik = key + "." + k; if (!ID.test(k)) { bad(ns, ik); continue; } const item = v[k];
out[k] = isObj(item) ? { dx: num(item.dx, ik + ".dx", ns, 0), dy: num(item.dy, ik + ".dy", ns, 0), rot: num(item.rot, ik + ".rot", ns, 0) } : (bad(ns, ik), { dx: 0, dy: 0, rot: 0 }); } return out; }
function layer(v: unknown, key: string, ns: Ns, face: boolean): Record<string, { visible?: boolean; slot?: string; z?: number; geom?: Json }> { if (!isObj(v)) return (bad(ns, key), {});
const out: Record<string, { visible?: boolean; slot?: string; z?: number; geom?: Json }> = {}; for (const k of Object.keys(v)) { const ik = key + "." + k; if (!ID.test(k)) { bad(ns, ik); continue; } const item = v[k];
if (!isObj(item)) { bad(ns, ik); out[k] = {}; continue; } const e: { visible?: boolean; slot?: string; z?: number; geom?: Json } = {}; if (item.visible !== undefined) e.visible = bool(item.visible, ik + ".visible", ns, false);
if (!face && item.slot !== undefined) e.slot = ref(item.slot, ik + ".slot", ns); if (face && item.z !== undefined) e.z = num(item.z, ik + ".z", ns, 0);
if (item.geom !== undefined) { if (isObj(item.geom)) e.geom = item.geom; else bad(ns, ik + ".geom"); } out[k] = e; } return out; } function runMap(v: unknown, key: string, ns: Ns, cap: number): Record<string, readonly Run[]> {
if (!isObj(v)) return (bad(ns, key), {}); const out: Record<string, readonly Run[]> = {}; for (const k of Object.keys(v)) { const ik = key + "." + k; if (!ID.test(k)) { bad(ns, ik); continue; } out[k] = runsOf(v[k], ik, ns, cap); }
return out; } function frame(v: unknown, key: string, ns: Ns, lim: SpriteRecipeLimits): Frame { if (!isObj(v)) return (bad(ns, key), { ms: 100, pose: {} });
const ms = num(v.ms, key + ".ms", ns, 100, 1); const pose = poseOf(v.pose, key + ".pose", ns);
const parts = v.parts === undefined ? undefined : layer(v.parts, key + ".parts", ns, false); const runs = v.runs === undefined ? undefined : runMap(v.runs, key + ".runs", ns, lim.runs);
return { ms, pose, ...(parts === undefined ? {} : { parts }), ...(runs === undefined ? {} : { runs }) }; }
function anim(v: unknown, key: string, ns: Ns, lim: SpriteRecipeLimits): Anim { if (!isObj(v)) return (bad(ns, key), { name: "", loop: false, frames: [] });
const name = str(v.name, key + ".name", ns, ""); const loop = bool(v.loop, key + ".loop", ns, false); const gen = v.gen === undefined ? undefined : genOf(v.gen, key + ".gen", ns);
const frames = take(v.frames, key + ".frames", ns, lim.frames, 0);
return { name, loop, ...(gen === undefined ? {} : { gen }), frames: frames === null ? [] : frames.map((item, i) => frame(item, key + ".frames[" + String(i) + "]", ns, lim)) };
} function genOf(v: unknown, key: string, ns: Ns): NonNullable<Anim["gen"]> { if (!isObj(v)) return (bad(ns, key), { kind: "walk", style: "4", stride: 0, bob: 0, arm: 0 }); if (v.kind !== "walk") bad(ns, key + ".kind");
return { kind: "walk", style: enm(v.style, key + ".style", ns, ["4", "6", "bob"], "4"), stride: num(v.stride, key + ".stride", ns, 0, 0, 4), bob: num(v.bob, key + ".bob", ns, 0, 0, 2), arm: num(v.arm, key + ".arm", ns, 0, 0, 4) }; }
function facing(v: unknown, key: string, ns: Ns): Facing { if (!isObj(v)) return (bad(ns, key), { parts: {} });
const parts = layer(v.parts, key + ".parts", ns, true); const pose = v.pose === undefined ? undefined : poseOf(v.pose, key + ".pose", ns);
return { parts, ...(pose === undefined ? {} : { pose }) }; } function facings(v: unknown, ns: Ns): NonNullable<SpriteRecipe["facings"]> {
if (!isObj(v)) return (bad(ns, "facings"), { down: { parts: {} }, up: { parts: {} }, side: { parts: {} }, sideMirror: null });
const down = facing(v.down, "facings.down", ns); const up = facing(v.up, "facings.up", ns); const side = facing(v.side, "facings.side", ns);
const sideMirror = v.sideMirror === null || v.sideMirror === "side" ? v.sideMirror : (bad(ns, "facings.sideMirror"), null); return { down, up, side, sideMirror }; } function swapOf(v: unknown, key: string, ns: Ns): Record<string, readonly string[] | string> {
if (!isObj(v)) return (bad(ns, key), {}); const out: Record<string, readonly string[] | string> = {};
for (const k of Object.keys(v)) { const ik = key + "." + k; if (!ID.test(k)) { bad(ns, ik); continue; } out[k] = Array.isArray(v[k]) ? ramp(v[k], ik, ns) : ref(v[k], ik, ns); } return out; }
function dim(v: unknown, key: string, ns: Ns, side: number): number { if (typeof v !== "number" || !Number.isFinite(v)) return (bad(ns, key), Math.min(32, side)); let n = v;
if (!Number.isInteger(v)) { ns.push({ code: "floatParam", message: "floatParam " + key }); n = Math.floor(v); } if (n < 1) { bad(ns, key); n = 32; } if (n > side) return (over(ns, key), side); return n; }
const list = <T>(v: unknown, key: string, ns: Ns, cap: number | null, one: (item: unknown, key: string) => T): T[] => { const a = take(v, key, ns, cap, 0); return a === null ? [] : a.map((item, i) => one(item, key + "[" + String(i) + "]"));
}; export function readDoc(src: Rec, fv: number, lim: SpriteRecipeLimits, ns: Ns): SpriteRecipe { const ids = new Set<string>();
const doc: SpriteRecipe = { kind: "sprite-recipe", formatVersion: fv, id: str(src.id, "id", ns, "", ULID),
...(src.rev === undefined ? {} : { rev: num(src.rev, "rev", ns, 0, 0) }), ...(src.name === undefined ? {} : { name: str(src.name, "name", ns, "") }), raster: num(src.raster, "raster", ns, 1, 1),
size: isObj(src.size) ? { w: dim(src.size.w, "size.w", ns, lim.side), h: dim(src.size.h, "size.h", ns, lim.side) } : (bad(ns, "size"), { w: Math.min(32, lim.side), h: Math.min(32, lim.side) }), light: num(src.light, "light", ns, 0),
palette: isObj(src.palette) ? { slots: list(src.palette.slots, "palette.slots", ns, null, (item, key) => slot(item, key, ns, ids)) } : (bad(ns, "palette"), { slots: [] }),
defaults: isObj(src.defaults) ? { outline: outline(src.defaults.outline, "defaults.outline", ns), shade: shade(src.defaults.shade, "defaults.shade", ns) } : (bad(ns, "defaults"), { outline: outline({}, "defaults.outline", []), shade: shade({}, "defaults.shade", []) }),
parts: list(src.parts, "parts", ns, lim.parts, (item, key) => part(item, key, ns, lim, ids)),
skeleton: isObj(src.skeleton) ? { joints: list(src.skeleton.joints, "skeleton.joints", ns, lim.joints, (item, key) => joint(item, key, ns, ids)) } : (bad(ns, "skeleton"), { joints: [] }),
anims: list(src.anims, "anims", ns, lim.anims, (item, key) => anim(item, key, ns, lim)), ...(src.facings === undefined ? {} : { facings: facings(src.facings, ns) }),
variants: list(src.variants, "variants", ns, lim.variants, (item, key) => variant(item, key, ns, ids)), code: codeOf(src.code, ns),
...(src.history === undefined ? {} : { history: historyOf(src.history, ns, lim) }) }; if (src.history !== undefined && new TextEncoder().encode(JSON.stringify(src.history)).length > lim.historyBytes) over(ns, "history"); return doc; }
function joint(v: unknown, key: string, ns: Ns, ids: Set<string>): SpriteRecipe["skeleton"]["joints"][number] { if (!isObj(v)) return (bad(ns, key), { id: "", parent: null, at: { x: 0, y: 0 } });
const id = ident(v.id, key + ".id", ns, ids); const parent = typeof v.parent === "string" && ID.test(v.parent) ? v.parent : v.parent === null ? null : (bad(ns, key + ".parent"), null);
const at = isObj(v.at) ? { x: num(v.at.x, key + ".at.x", ns, 0), y: num(v.at.y, key + ".at.y", ns, 0) } : (bad(ns, key + ".at"), { x: 0, y: 0 }); return { id, parent, at }; } function variant(v: unknown, key: string, ns: Ns, ids: Set<string>): SpriteRecipe["variants"][number] { if (!isObj(v)) return (bad(ns, key), { id: "", swap: {} });
return { id: ident(v.id, key + ".id", ns, ids), swap: swapOf(v.swap, key + ".swap", ns) }; } function historyOf(v: unknown, ns: Ns, lim: SpriteRecipeLimits): NonNullable<SpriteRecipe["history"]> {
if (!isObj(v)) return (bad(ns, "history"), { cap: 2000, baseSeq: 0, ops: [] }); const cap = num(v.cap, "history.cap", ns, 2000, 1); const baseSeq = num(v.baseSeq, "history.baseSeq", ns, 0, 0);
const ops = take(v.ops, "history.ops", ns, lim.historyBatches, 0); return { cap, baseSeq, ops: ops ?? [] }; } function codeOf(v: unknown, ns: Ns): SpriteRecipe["code"] { if (v === null) return null;
if (!isObj(v)) return (bad(ns, "code"), null); if (v.lang !== "js") bad(ns, "code.lang"); const src = v.src === undefined ? undefined : str(v.src, "code.src", ns, "");
const out = v.out === undefined ? undefined : (Array.isArray(v.out) ? v.out.slice() : (bad(ns, "code.out"), [] as readonly unknown[])); const outHash = v.outHash === undefined ? undefined : str(v.outHash, "code.outHash", ns, "", HASH);
return { lang: "js", ...(src === undefined ? {} : { src }), ...(out === undefined ? {} : { out }), ...(outHash === undefined ? {} : { outHash }) }; }
