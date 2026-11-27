"""Shared stage + painter kit for the B/C/D code recreations (UX, 27 Nov 2026).
Offline research bake: Python 3 + numpy + Pillow on the bake machine only; nothing here ships to the phone.
Stage = EA's M2-stage layout (12x10 tiles + 1 overlap row on top), so all three styles share one village.
All geometry is written in base pixels (32 px per tile) and scaled by k = P/32, so one recipe renders at 32 or 64 px."""
import numpy as np
from PIL import Image, ImageDraw, ImageFont

COLS, ROWS, TOP_T = 12, 10, 1          # TOP_T: overlap row above the map (sky band in these mocks)
LIGHT = np.array([-0.55, -0.62, 0.56]); LIGHT = LIGHT / np.linalg.norm(LIGHT)   # sun from the top-left

# ---- layout (copied numbers from ea/M2-stage/bake-m2-stage.mjs, tile units, v=0 is the map's top edge)
PATHS = [
    (0.36, [(3.4, 10.3), (3.9, 9.0), (4.8, 8.0), (5.4, 7.3), (5.6, 6.0), (5.2, 4.8), (5.0, 3.9), (5.0, 3.0)]),
    (0.30, [(5.45, 7.25), (6.3, 7.3), (7.0, 7.0)]),
    (0.30, [(5.2, 4.6), (6.4, 4.25), (7.6, 3.6), (8.6, 2.9), (9.0, 2.0)]),
]
POND = [(9.7, 7.4, 1.5), (10.9, 8.6, 1.0), (8.6, 8.4, 0.85), (11.6, 7.0, 0.7)]
FOREST = [(0.45, 0.65), (1.35, 0.95), (0.15, 1.85), (1.05, 2.3), (1.95, 1.75), (0.5, 3.45), (1.5, 3.95), (0.25, 5.1), (1.15, 5.75), (0.55, 7.0)]
ITEMS = ([("tree", u, v, dict(seed=100 + i * 17, sc=0.9 + ((i * 7) % 5) * 0.035)) for i, (u, v) in enumerate(FOREST)] + [
    ("tree", 11.3, 0.7, dict(seed=400, sc=1.0)), ("tree", 2.25, 8.6, dict(seed=417, sc=0.92)),
    ("house", 5.0, 2.88, dict(roof="roof_red", boxes=True, seed=1)), ("house", 9.0, 1.88, dict(roof="roof_slate", boxes=True, seed=2)),
    ("house", 7.0, 6.88, dict(roof="roof_wood", boxes=True, seed=3)),
    ("fence", 8.0, 5.45, dict(n=4)), ("rock", 11.45, 6.3, dict(seed=3, big=True)), ("rock", 2.7, 9.35, dict(seed=9)),
    ("rock", 7.25, 9.3, dict(seed=14)), ("rock", 3.7, 6.6, dict(seed=21)),
    ("bush", 3.3, 3.35, dict(seed=1)), ("bush", 10.6, 2.85, dict(seed=4)), ("bush", 6.55, 9.45, dict(seed=7)),
    ("crate", 6.35, 2.4, {}), ("barrel", 6.75, 2.85, {}), ("lantern", 4.55, 5.05, {}),
    ("knight", 5.55, 5.6, dict(team="blue")), ("knight", 2.75, 7.55, dict(team="red")),
    ("boy", 6.15, 7.85, {}), ("farmer", 8.0, 2.6, {}),
])

def clamp(x, a=0.0, b=1.0): return np.clip(x, a, b)
def sstep(a, b, x): t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t)

def hash2(i, j, s=0):
    i = np.asarray(i, dtype=np.int64); j = np.asarray(j, dtype=np.int64)
    h = (i * 374761393 + j * 668265263 + s * 1442695041) & 0xFFFFFFFF
    h = ((h ^ (h >> 13)) * 1274126177) & 0xFFFFFFFF
    return ((h ^ (h >> 16)) & 0xFFFFFFFF) / 4294967296.0

def vnoise(x, y, sc, s=0):
    x = np.asarray(x, float) / sc; y = np.asarray(y, float) / sc
    i = np.floor(x).astype(np.int64); j = np.floor(y).astype(np.int64); fx = x - i; fy = y - j
    a, b, c, d = hash2(i, j, s), hash2(i + 1, j, s), hash2(i, j + 1, s), hash2(i + 1, j + 1, s)
    sx = fx * fx * (3 - 2 * fx); sy = fy * fy * (3 - 2 * fy)
    return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy

def fbm(x, y, sc, s=0, oct=4):
    t, amp, tot = 0, 1.0, 0
    for o in range(oct): t = t + amp * vnoise(x, y, sc / 2 ** o, s + o * 31); tot += amp; amp *= 0.5
    return t / tot

def seg_d(u, v, a, b):
    dx, dy = b[0] - a[0], b[1] - a[1]; t = clamp(((u - a[0]) * dx + (v - a[1]) * dy) / (dx * dx + dy * dy))
    return np.hypot(u - a[0] - dx * t, v - a[1] - dy * t)

def path_d(u, v):
    d = np.full(np.shape(u), 9.0)
    for w, p in PATHS:
        for i in range(1, len(p)): d = np.minimum(d, seg_d(u, v, p[i - 1], p[i]) - w)
    return d + 0.04 * np.sin(u * 9 + v * 4) * np.sin(v * 7 - u * 3)

def smin(a, b, k): h = clamp(0.5 + 0.5 * (b - a) / k); return b + (a - b) * h - k * h * (1 - h)

def pond_d(u, v):
    d = np.full(np.shape(u), 9.0)
    for x, y, r in POND: d = smin(d, np.hypot(u - x, v - y) - r, 0.5)
    return d + 0.05 * np.sin(u * 5.3 + 1) * np.sin(v * 4.1) + 0.025 * np.sin(u * 13 - v * 11)

def hexc(h): return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], float)
def ramp_of(lst): return np.array([hexc(h) for h in lst])

def ramp_lerp(R, t):
    """continuous lookup (painted style): t 0..1 -> RGB"""
    t = clamp(t) * (len(R) - 1); i = np.minimum(np.floor(t).astype(int), len(R) - 2); f = (t - i)[..., None]
    return R[i] * (1 - f) + R[i + 1] * f

def ramp_q(R, t):
    """banded lookup (pixel styles): t 0..1 -> one of the ramp's colours"""
    return R[np.clip(np.rint(clamp(t) * (len(R) - 1)).astype(int), 0, len(R) - 1)]

class Spr:
    """A sprite canvas. Each pixel holds a material name index and a shade 0..1. Geometry is in base px (32/tile)."""
    def __init__(self, w, h, ax, ay, k):
        self.k = k; self.W = int(round(w * k)); self.H = int(round(h * k)); self.ax = ax; self.ay = ay
        self.mat = np.full((self.H, self.W), -1, np.int16); self.sh = np.zeros((self.H, self.W), np.float32)
        self.nolin = np.zeros((self.H, self.W), bool)   # pixels that never get an outline (glows, flowers)
        ys, xs = np.mgrid[0:self.H, 0:self.W]; self.X = (xs + 0.5) / k; self.Y = (ys + 0.5) / k
        self.names = []
    def mid(self, m):
        if m not in self.names: self.names.append(m)
        return self.names.index(m)
    def _put(self, mask, m, sh, nol=False):
        if not mask.any(): return
        self.mat[mask] = self.mid(m); s = np.broadcast_to(np.asarray(sh, np.float32), mask.shape)
        self.sh[mask] = clamp(s[mask]); self.nolin[mask] = nol
    def ellipse(self, cx, cy, rx, ry, m, f, nol=False):
        nx = (self.X - cx) / rx; ny = (self.Y - cy) / ry; mask = nx * nx + ny * ny <= 1.0
        self._put(mask, m, f(self.X, self.Y, nx, ny) if callable(f) else f, nol); return mask
    def rect(self, x0, y0, x1, y1, m, f, nol=False):
        mask = (self.X >= x0) & (self.X < x1) & (self.Y >= y0) & (self.Y < y1)
        nx = (self.X - x0) / max(x1 - x0, 1e-6); ny = (self.Y - y0) / max(y1 - y0, 1e-6)
        self._put(mask, m, f(self.X, self.Y, nx, ny) if callable(f) else f, nol); return mask
    def poly(self, pts, m, f, nol=False):
        im = Image.new("L", (self.W, self.H), 0)
        ImageDraw.Draw(im).polygon([(x * self.k, y * self.k) for x, y in pts], fill=255)
        mask = np.asarray(im) > 127
        self._put(mask, m, f(self.X, self.Y, None, None) if callable(f) else f, nol); return mask

def sphere(nx, ny, L=LIGHT):
    z = np.sqrt(clamp(1 - nx * nx - ny * ny)); return 0.5 + 0.5 * (nx * L[0] + ny * L[1] + z * L[2])

def outline_masks(spr):
    """sel-out: transparent pixels touching opaque ones (4-neighbour). Returns (mask, material index of the neighbour)."""
    occ = spr.mat >= 0; H, W = occ.shape; edge = np.zeros_like(occ); nb = np.full(occ.shape, -1, np.int16)
    for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
        sh = np.zeros_like(occ); m2 = np.full(occ.shape, -1, np.int16)
        ys = slice(max(dy, 0), H + min(dy, 0)); yd = slice(max(-dy, 0), H + min(-dy, 0))
        xs = slice(max(dx, 0), W + min(dx, 0)); xd = slice(max(-dx, 0), W + min(-dx, 0))
        sh[yd, xd] = occ[ys, xs] & ~spr.nolin[ys, xs]; m2[yd, xd] = spr.mat[ys, xs]
        new = sh & ~occ & ~edge; nb[new] = m2[new]; edge |= new
    return edge, nb

def place_xy(u, v, P):
    """foot point of an item in canvas pixels (canvas has TOP_T overlap rows above the map)"""
    return u * P, (v + TOP_T) * P

def grid(P):
    H = (ROWS + TOP_T) * P; W = COLS * P
    ys, xs = np.mgrid[0:H, 0:W]; u = (xs + 0.5) / P; v = (ys + 0.5) / P - TOP_T
    return u, v, xs, ys

def save_set(img, name, out, P, concept, label, scale_to=1536):
    """img: HxWx3 float/uint8 at 1x. Writes 1x, a nearest-neighbour upscale to scale_to wide, and a side-by-side with the concept."""
    a = np.clip(np.rint(img), 0, 255).astype(np.uint8); im = Image.fromarray(a, "RGB")
    f = scale_to // im.width
    im.save(f"{out}/{name}-1x.png", optimize=True)
    big = im.resize((im.width * f, im.height * f), Image.NEAREST); big.save(f"{out}/{name}-{f}x.png", optimize=True)
    c = Image.open(concept).convert("RGB").resize(big.size, Image.LANCZOS)
    pad, bar = 24, 64; sbs = Image.new("RGB", (big.width * 2 + pad * 3, big.height + bar + pad), (18, 20, 26))
    sbs.paste(c, (pad, bar)); sbs.paste(big, (big.width + pad * 2, bar))
    d = ImageDraw.Draw(sbs); fnt = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    d.text((pad, 16), "AI concept (reference only, resized to the stage)", fill=(200, 200, 210), font=fnt)
    d.text((big.width + pad * 2, 16), label, fill=(235, 235, 240), font=fnt)
    sbs.save(f"{out}/{name}-vs-concept.png", optimize=True)
    return [f"{name}-1x.png", f"{name}-{f}x.png", f"{name}-vs-concept.png"]
