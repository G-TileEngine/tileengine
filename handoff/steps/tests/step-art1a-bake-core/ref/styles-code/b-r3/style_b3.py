"""B r3: hand-authored pixel stamps on top of B r2. The bake places, recolours (through the palette ramps) and seeds exact
pixel grids from stamps.py: leaf clusters, crown-edge tufts, bush clumps, knight visor/belt/pauldrons, NPC face and
straw hat, ground flower tufts, roof shingle variants and ridge, window sills and flower boxes. It adds a golden light
wash across the ground. T32 stamps are used at 32 px tiles, and T48 stamps (authored separately) at 48 px.
Usage: python3 style_b3.py [32|48]"""
import sys, os, numpy as np
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..")); sys.path.insert(0, os.path.join(HERE, "../b-r2")); sys.path.insert(0, HERE)
import style_b2 as b2          # brings the r2 tree/bush recipes and outline colours
from common import *
import engine, recipes, stamps as ST
from engine import bake

R = b2.R
R["grass"] = ramp_of(["#26321a", "#33441c", "#42561e", "#526a22", "#647c26", "#7c8c2c", "#9c9c34", "#c2ac48"])   # warmer top steps: gold, not lime
R["petal_pink"] = ramp_of(["#b0406a", "#e86a9a", "#f6b0c8"]); R["petal_purple"] = ramp_of(["#6a46a8", "#9a6ad8", "#c8aef2"])
TIER = 32

# ---------------------------------------------------------------- stamp writer
def put(s, x0, y0, grid, mat=None, legend=None, flip=False, shift=0, keep_mat=None):
    """Write an exact pixel grid into sprite s with its top-left at sprite pixel (x0, y0). A digit is a ramp step of mat
    plus shift. A letter maps through the legend to (material, step), and shift applies to it too. keep_mat stops the
    stamp from drawing outside pixels that already hold that material."""
    if not hasattr(s, "step"): s.step = np.full(s.mat.shape, -1, np.int16)
    keep = s.mid(keep_mat) if keep_mat else None
    for j, row in enumerate(grid):
        if flip: row = row[::-1]
        y = y0 + j
        if not 0 <= y < s.H: continue
        for i, ch in enumerate(row):
            x = x0 + i
            if ch == "." or not 0 <= x < s.W: continue
            if keep is not None and s.mat[y, x] != keep: continue
            m, st = (mat, int(ch)) if ch.isdigit() else legend[ch]
            n = len(R[m]); st = int(np.clip(st + shift, 0, n - 1))
            s.mat[y, x] = s.mid(m); s.sh[y, x] = st / max(n - 1, 1); s.step[y, x] = st; s.nolin[y, x] = False

def put_c(s, bx, by, grid, **kw):   # centred on base-px point (bx, by)
    h, w = len(grid), len(grid[0]); put(s, int(round(bx * s.k - w / 2)), int(round(by * s.k - h / 2)), grid, **kw)

_col2 = engine.colourise
def colourise3(S, spr):
    rgb, a = _col2(S, spr)
    if hasattr(spr, "step"):
        lk = spr.step >= 0
        for i, name in enumerate(spr.names):
            m = lk & (spr.mat == i)
            if m.any(): rgb[m] = R[name][spr.step[m]]
    return rgb, a
engine.colourise = colourise3

def light_shift(px, py, rx, ry):
    """crown lighting at a point (base px from the crown centre): 0 = shadow side, 4 = sun side"""
    g = float(sphere(np.clip(px / rx, -1, 1), np.clip(py / ry, -1, 1) * 0.9)) - 0.12 * float(sstep(0.1, 0.9, px / rx))
    return int(np.clip(round(-0.3 + g * 4.4 - 1.6 * float(sstep(0.15, 1.0, py / ry))), 0, 4))

# ---------------------------------------------------------------- trees: smooth crown + cluster stamps + edge tufts
def tree3(k, S, seed=1, sc=1.0):
    s = Spr(40 * sc + 6, 58 * sc + 4, 0, 0, k); ox, oy = s.W / k / 2, s.H / k - 3
    s.ax, s.ay = ox, oy; F = lambda x, y: (x + ox, y + oy); rs = np.random.default_rng(seed)
    bark = lambda X, Y, nx, ny: 0.8 - nx * 0.6 + 0.1 * (vnoise(X * 3, Y * 0.6, 1, seed) - 0.5)
    tw = 2.7 * sc
    x0, y0 = F(-tw, -14 * sc); x1, y1 = F(tw, 0.5); s.rect(x0, y0, x1, y1, "bark", bark)
    for sd in (-1, 1):
        a, b = F(sd * tw - (1.8 if sd < 0 else 0) * sc, -2.4 * sc); c, d = F(sd * tw + (1.8 if sd > 0 else 0) * sc, 0.5)
        s.rect(a, b, c, d, "bark", 0.38 if sd > 0 else 0.62)
    rx, ry = 15.5 * sc, 19.5 * sc; cx, cy = F(0, -(9.5 * sc + ry))
    W = lambda gy: 0.86 + 0.16 * gy
    gy = (s.Y - cy) / ry; gx = (s.X - cx) / (rx * W(gy)); body = gx * gx + gy * gy <= 1.0
    g = sphere(np.clip(gx, -1, 1), np.clip(gy, -1, 1) * 0.9)
    s._put(body, "leaf", 0.06 + 0.3 * g - 0.12 * sstep(0.2, 1.0, gy))          # smooth dark crown body
    pts = []; gap = (6.2 if TIER == 32 else 5.6) * sc
    for j, yy in enumerate(np.arange(-ry * 0.9, ry * 0.92, gap * 0.8)):
        off = (j % 2) * gap * 0.5
        for xx in np.arange(-rx - off, rx + 0.01, gap):
            x = xx + (rs.random() - 0.5) * 1.4; y = yy + (rs.random() - 0.5) * 1.2
            if (x / (rx * W(y / ry) * 0.86)) ** 2 + (y / (ry * 0.88)) ** 2 <= 1.0: pts.append((x, y))
    pts.sort(key=lambda p: p[1])
    L = ST.LEAF[TIER]
    for x, y in pts:
        put_c(s, cx + x, cy + y, L[rs.integers(len(L))], mat="leaf", flip=bool(rs.random() < 0.5), shift=light_shift(x, y, rx, ry))
    T = ST.TUFT[TIER]   # leaf tips along the upper outline: a fuller, smooth-but-alive edge
    for th in np.linspace(np.pi * 1.08, np.pi * 1.92, 9):
        yy = ry * np.sin(th); xx = rx * W(yy / ry) * np.cos(th); t = T[rs.integers(len(T))]
        put(s, int(round((cx + xx) * s.k - len(t[0]) / 2)), int(round((cy + yy) * s.k)) - len(t) + 1, t, mat="leaf",
            flip=bool(rs.random() < 0.5), shift=light_shift(xx, yy, rx, ry))
    return s, [("e", 11 * sc, -3.5 * sc, 16.5 * sc, 8 * sc)]

def bush3(k, S, seed=1):
    s = Spr(26, 20, 13, 17, k); rs = np.random.default_rng(seed + 900)
    cx, cy, rx, ry = 13, 11, 9.0, 5.8
    gx = (s.X - cx) / rx; gy = (s.Y - cy) / ry; body = gx * gx + gy * gy <= 1.0
    s._put(body, "leaf", 0.1 + 0.3 * sphere(np.clip(gx, -1, 1), np.clip(gy, -1, 1)))
    B = ST.BUSH[TIER]
    for y in (-3.2, -0.6, 2.0):
        for x in np.arange(-6.5 + (1.6 if y > -1 else 0), 6.6, 3.6 if TIER == 32 else 3.9):
            if (x / rx) ** 2 + (y / ry) ** 2 > 0.85: continue
            put_c(s, cx + x + (rs.random() - .5), cy + y, B[rs.integers(len(B))], mat="leaf", flip=bool(rs.random() < .5), shift=light_shift(x, y, rx, ry))
    return s, [("e", 4, -1.5, 10, 3.8)]

# ---------------------------------------------------------------- units: knight details, NPC face and hat
_unit = recipes.unit
def unit3(k, S, kind="knight", team="blue"):
    s, shad = _unit(k, S, kind, team); cx, fy = 11, 29
    if kind == "knight":
        put_c(s, cx + 5.4, fy - 15.6, ST.PAULDRON[TIER], legend=ST.KN_LEG, flip=True, shift=-1)
        put_c(s, cx - 4.6, fy - 16.6, ST.PAULDRON[TIER], legend=ST.KN_LEG)
        put_c(s, cx, fy - 8.4, ST.BELT[TIER], legend=ST.KN_LEG)
        put_c(s, cx, fy - 20.0, ST.VISOR[TIER], legend=ST.KN_LEG)
    else:
        put_c(s, cx, fy - 15.4, ST.FACE[TIER], legend=ST.FACE_LEG, keep_mat="skin")
        if kind == "farmer":
            for m in ("straw", "leather"):
                if m in s.names: s.mat[s.mat == s.names.index(m)] = -1
            h = ST.HAT[TIER]; put(s, int(round(cx * s.k - len(h[0]) / 2)), int(round((fy - 15.6) * s.k)) - len(h), h, mat="straw",
                                  legend=dict(b=("leather", 1)))
    return s, shad

# ---------------------------------------------------------------- houses: shingle variants, ridge, sills, flower boxes
_house = recipes.house
def house3(k, S, roof="roof_red", boxes=True, seed=1):
    s, shad = _house(k, S, roof, boxes, seed); cx, fy = 40, 58; rs = np.random.default_rng(seed + 300)
    rx0, rx1, ry0, ry1 = cx - 35, cx + 35, fy - 50, fy - 14; wy0, wy1 = fy - 15, fy + 2
    slate = roof == "roof_slate"; rowh, tw = (4.0, 6.0) if slate else (5.0, 7.0)
    n = len(R[roof]); rid = s.mid(roof); onroof = s.mat == rid
    yr = s.Y - ry0; r = np.floor(yr / rowh); ryy = yr - r * rowh
    xs = s.X - rx0 + (r % 2) * tw / 2; col = np.floor(xs / tw); cxx = xs - col * tw
    lx = np.floor(cxx * s.k).astype(int); ly = np.floor(ryy * s.k).astype(int)
    V = ST.SHINGLE[(TIER, "slate" if slate else "tile")]
    if not hasattr(s, "step"): s.step = np.full(s.mat.shape, -1, np.int16)
    nrows = int(36 / rowh)
    for rr in range(1, nrows - 1):
        for cc in range(-1, int(70 / tw) + 2):
            if rs.random() > 0.11: continue
            cell = onroof & (r == rr) & (col == cc)
            if cell.sum() < 6: continue
            grid = V[int(rs.choice(len(V), p=[0.45, 0.4, 0.15]))]; mid = int(np.median(np.rint(s.sh[cell] * (n - 1))))
            for y, x in zip(*np.nonzero(cell)):
                if ly[y, x] >= len(grid) or lx[y, x] >= len(grid[0]): continue
                ch = grid[ly[y, x]][lx[y, x]]
                if ch == ".": continue
                if ch in "Mm": m, st = "leaf", (5 if ch == "M" else 3)
                else: m, st = roof, int(np.clip(int(ch) + mid - 4, 0, n - 1))
                s.mat[y, x] = s.mid(m); s.step[y, x] = st; s.sh[y, x] = st / (len(R[m]) - 1)
    rg = ST.RIDGE[TIER]; w = len(rg[0]); y0 = int(round(ry0 * s.k)) - 1
    for x0 in range(int(round(rx0 * s.k)), int(round(rx1 * s.k)) - w + 1, w): put(s, x0, y0, rg, mat=roof)
    if boxes:
        for wxc in (cx - 20, cx + 20):
            sl = ST.SILL[TIER]; put(s, int(round(wxc * s.k - len(sl[0]) / 2)), int(round((wy0 + 11.5) * s.k)), sl, mat="stone")
            bx = ST.BOX[TIER]; put(s, int(round((wxc - 7) * s.k)), int(round((wy1 + 1.5) * s.k)) - len(bx), bx, legend=ST.BOX_LEG)
    return s, shad

recipes.BUILD.update(tree=tree3, bush=bush3, house=house3, knight=lambda k, S, team: unit3(k, S, "knight", team),
                     boy=lambda k, S: unit3(k, S, "boy"), farmer=lambda k, S: unit3(k, S, "farmer"))

# ---------------------------------------------------------------- ground: golden wash + flower tufts
def wash_of(u, v):
    corner = np.exp(-np.hypot(u * 0.8, (v + 1.0) * 1.05) / 3.6)
    shaft = np.exp(-(((u * 0.8 - (v + 1.0) * 0.6) - 0.6) / 1.5) ** 2) * np.exp(-(u * 0.6 + (v + 1.0) * 0.8) / 6.5)
    return clamp(0.9 * corner + 0.5 * shaft)

FLC = dict(g=R["grass"][5], G=R["grass"][6], d=R["grass"][2], p=R["petal_pink"][1], P=R["petal_pink"][2], w=hexc("#f2eef0"),
           y=hexc("#f2d050"), u=R["petal_purple"][1], U=R["petal_purple"][2])
def ground3(u, v, xs, ys, P, shadow, items):
    img = b2.ground(u, v, xs, ys, P, shadow, items)
    land = v >= -0.36
    wsh = wash_of(u, v); lit = wsh * np.where(shadow > 0.5, 0.35, 1.0)
    img = np.where(land[..., None], img * (1 + 0.08 * lit[..., None]) + np.array([34, 16, -12]) * lit[..., None], img)
    rs = np.random.default_rng(2611); feet = [(uu, vv, kind) for kind, uu, vv, spr, sh in items]
    placed = 0; F = ST.FLOWER[TIER]
    for _ in range(900):
        if placed >= 40: break
        uu, vv = rs.uniform(0.2, 11.8), rs.uniform(0.2, 9.8)
        if path_d(uu, vv) < 0.12 or pond_d(uu, vv) < 0.35: continue
        if any(abs(uu - a) < (0.9 if kd == "house" else 0.55) and -1.2 < vv - b < 0.35 for a, b, kd in feet): continue
        g = F[rs.integers(len(F))]; x0 = int(uu * P); y0 = int((vv + 1) * P)
        for j, row in enumerate(g):
            for i, ch in enumerate(row):
                if ch == ".": continue
                y, x = y0 + j, x0 + i
                if y < img.shape[0] and x < img.shape[1]: img[y, x] = FLC[ch] * (0.62 if shadow[y, x] > 0.5 else 1.0)
        placed += 1
    return img

def grade3(img, u, v, P):
    img = b2.grade(img, u, v, P); w = wash_of(u, v)[..., None]
    return img * (1 + 0.06 * w) + np.array([14, 8, -6]) * w

S = dict(b2.S); S.update(ground=ground3, grade=grade3)

def side_by_side(a_path, b_path, la, lb, out):
    a = Image.open(a_path).convert("RGB"); b = Image.open(b_path).convert("RGB")
    pad, bar = 24, 64; sbs = Image.new("RGB", (a.width + b.width + pad * 3, a.height + bar + pad), (18, 20, 26))
    sbs.paste(a, (pad, bar)); sbs.paste(b, (a.width + pad * 2, bar)); d = ImageDraw.Draw(sbs)
    fnt = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    d.text((pad, 16), la, fill=(200, 200, 210), font=fnt); d.text((a.width + pad * 2, 16), lb, fill=(235, 235, 240), font=fnt)
    sbs.save(out, optimize=True)

if __name__ == "__main__":
    P = int(sys.argv[1]) if len(sys.argv) > 1 else 32
    TIER = 48 if P >= 48 else 32
    img = bake(S, P)
    name = f"b-r3-{P}px"
    files = save_set(img, name, HERE, P, os.path.join(HERE, "../../styles/b-hd-pixel.jpg"), f"B r3 (pixel stamps): code bake at {P} px/tile", scale_to=4 * img.shape[1])
    side_by_side(os.path.join(HERE, f"../b-r2/b-r2-{P}px-4x.png"), os.path.join(HERE, f"{name}-4x.png"), f"B r2 at {P} px (cluster discs)",
                 f"B r3 at {P} px (hand-authored stamps)", os.path.join(HERE, f"{name}-vs-r2.png"))
    print(files + [f"{name}-vs-r2.png"])
