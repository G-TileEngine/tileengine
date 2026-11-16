export const PATH = { kinds: ["straight", "swerve", "bounce", "orbit"], bend: 0.8, bendMax: 2.5, radius: 1.05, radiusMin: 0.45, radiusMax: 3, turns: 1, turnsMin: 0.25, turnsMax: 4, hops: 8, dots: 32, eases: ["linear", "out", "in-out"], headStep: 1 / 32, riders: ["particles", "stamp", "flash"] } as const;
export type PathKind = (typeof PATH.kinds)[number];
export type Hop = { readonly dc: number; readonly dr: number };
export type FxPath = { readonly kind: PathKind; readonly at: number; readonly ms: number; readonly bend: number; readonly ease: string; readonly hops?: readonly Hop[]; readonly radius?: number; readonly turns?: number };
export type PathBad = { readonly code: "outOfRange" | "invalidValue" | "overCap"; readonly field: string };
type P = { readonly x: number; readonly y: number }; export const isTravel = (kind: unknown): kind is PathKind => (PATH.kinds as readonly unknown[]).includes(kind);
const finite = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const ranged = (bad: PathBad[], field: string, raw: unknown, d: number, lo: number, hi: number): number => {
  if (raw === undefined) return d; const n = finite(raw);
  if (n === null || n < lo || n > hi) { bad.push({ code: "outOfRange", field }); return n === null ? d : Math.min(hi, Math.max(lo, n)); }
  return n;
};
export function readPath(s: Readonly<Record<string, unknown>>, at: number, ms: number): { path: FxPath | null; bad: PathBad[] } {
  const kind = s["kind"]; if (!isTravel(kind)) return { path: null, bad: [] };
  const bad: PathBad[] = [], bend = ranged(bad, "bend", s["bend"], PATH.bend, -PATH.bendMax, PATH.bendMax), easeRaw = s["look_ease"];
  const ease = typeof easeRaw === "string" && (PATH.eases as readonly string[]).includes(easeRaw) ? easeRaw : "linear";
  if (easeRaw !== undefined && ease === "linear" && easeRaw !== "linear") bad.push({ code: "outOfRange", field: "look_ease" });
  const path: FxPath = { kind, at, ms, bend, ease };
  if (kind === "orbit") return { path: { ...path, radius: ranged(bad, "orbit_radius", s["orbit_radius"], PATH.radius, PATH.radiusMin, PATH.radiusMax), turns: ranged(bad, "orbit_turns", s["orbit_turns"], PATH.turns, PATH.turnsMin, PATH.turnsMax) }, bad };
  if (kind !== "bounce" || !("bounce_points" in s)) return { path, bad };
  const raw = s["bounce_points"]; if (!Array.isArray(raw)) { bad.push({ code: "invalidValue", field: "bounce_points" }); return { path: { ...path, hops: [] }, bad }; }
  const hops: Hop[] = []; let over = false;
  for (const item of raw) {
    const o = item !== null && typeof item === "object" && !Array.isArray(item) ? item as Record<string, unknown> : null, dc = o?.["dc"], dr = o?.["dr"];
    if (typeof dc !== "number" || typeof dr !== "number" || !Number.isInteger(dc) || !Number.isInteger(dr)) { bad.push({ code: "invalidValue", field: "bounce_points" }); continue; }
    if (hops.length >= PATH.hops) { if (!over) { bad.push({ code: "overCap", field: "bounce_points" }); over = true; } continue; }
    hops.push({ dc, dr });
  }
  return { path: { ...path, hops }, bad };
}
const eased = (name: string, u: number): number => (name === "out" ? 1 - (1 - u) * (1 - u) : name === "in-out" ? (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u)) : u);
const atU = (path: FxPath, u: number, a: P, b: P, tileW: number, tileH: number): P => {
  const e = eased(path.ease, u), dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), nx = L === 0 ? 0 : dy / L, ny = L === 0 ? -1 : -dx / L;
  if (path.kind === "bounce") {
    const pts: P[] = [a, ...(path.hops ?? []).map((h) => ({ x: a.x + h.dc * tileW, y: a.y + h.dr * tileH })), b], lens: number[] = [];
    for (let i = 0; i < pts.length - 1; i += 1) { const p0 = pts[i], p1 = pts[i + 1]; lens.push(p0 === undefined || p1 === undefined ? 0 : Math.hypot(p1.x - p0.x, p1.y - p0.y)); }
    const sum = lens.reduce((s, n) => s + n, 0), equal = sum === 0, total = equal ? lens.length : sum; let left = e * total;
    for (let i = 0; i < lens.length; i += 1) {
      const share = equal ? 1 : lens[i] ?? 0; if (share === 0) continue;
      if (left <= share || i === lens.length - 1) { const v = Math.min(1, left / share), p0 = pts[i], p1 = pts[i + 1]; if (p0 === undefined || p1 === undefined) break; const hop = Math.abs(path.bend) * 2 * v * (1 - v) * tileW; return { x: p0.x + (p1.x - p0.x) * v, y: p0.y + (p1.y - p0.y) * v - hop }; }
      left -= share;
    }
  }
  if (path.kind === "orbit") { const rad = (path.radius ?? PATH.radius) * 4 * e * (1 - e) * tileW, ang = Math.atan2(dy, dx) + 2 * Math.PI * (path.turns ?? PATH.turns) * e; return { x: a.x + dx * e + Math.cos(ang) * rad, y: a.y + dy * e + Math.sin(ang) * rad }; }
  const bow = (path.kind === "swerve" ? Math.sin(2 * Math.PI * e) : 4 * e * (1 - e)) * path.bend * tileW;
  return { x: a.x + dx * e + nx * bow, y: a.y + dy * e + ny * bow };
};
export function pathAt(path: FxPath, t: number, a: P, b: P, tileW: number, tileH: number): { x: number; y: number; deg: number | null } {
  const u = t < path.at ? 0 : !(path.ms > 0) || t >= path.at + path.ms ? 1 : (t - path.at) / path.ms, p = atU(path, u, a, b, tileW, tileH);
  const u0 = u < PATH.headStep ? 0 : u - PATH.headStep, u1 = u < PATH.headStep ? PATH.headStep : u, p0 = atU(path, u0, a, b, tileW, tileH), p1 = atU(path, u1, a, b, tileW, tileH);
  const dx = p1.x - p0.x, dy = p1.y - p0.y;
  return { x: Math.round(p.x), y: Math.round(p.y), deg: dx === 0 && dy === 0 ? null : Math.atan2(dy, dx) * 180 / Math.PI };
}
export const pathDots = (path: FxPath, n: number, a: P, b: P, tileW: number, tileH: number): P[] => { const k = typeof n === "number" && Number.isFinite(n) ? Math.min(PATH.dots, Math.max(2, Math.round(n))) : 2, out: P[] = []; for (let i = 0; i < k; i += 1) { const s = pathAt(path, path.at + path.ms * i / (k - 1), a, b, tileW, tileH); out.push({ x: s.x, y: s.y }); } return out; };
