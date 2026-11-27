"""B r2: refinement of B. Cluster-built trees and bushes, re-tuned grass, sky, water, rocks and steel, and per-screen-pixel grain so a 48 px tile gets real extra detail.
Usage: python3 style_b2.py [P=32]  (run for 32 and 48)
B r1 notes follow.
B: modern HD pixel (Sea of Stars / Eastward / Chained Echoes direction). Banded ramps, sel-out outlines, dense grass grain,
crisp cast shadows, deep water with ripple dashes, warm sunset grade and vignette. Usage: python3 style_b.py [P=32]"""
import sys, os, numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from common import *
import engine, recipes
from engine import bake

R = {k: ramp_of(v) for k, v in dict(
    grass=["#26321a", "#33441c", "#42561e", "#526a22", "#647c26", "#7a8e2c", "#96a234", "#bab442"],
    leaf=["#0e1c0e", "#152c14", "#1d3e18", "#28521c", "#366620", "#4a7a24", "#64902a", "#8aa632", "#b8c040"],
    bark=["#22140a", "#3a2414", "#55361e", "#73502e", "#8f6a40"],
    dirt=["#4a3018", "#6e4b28", "#906338", "#ad7d48", "#c2925a", "#d6ad78"],
    bank=["#20160e", "#3a2716", "#5a3d22", "#7a5532", "#94704a"],
    water=["#0c2234", "#0f3048", "#14405c", "#18506e", "#226482", "#3a7e9a", "#76b0c4"],
    roof_red=["#3e180f", "#5e2416", "#83321c", "#a44426", "#c05632", "#d97044", "#ec9660"],
    roof_slate=["#1c1f2a", "#2a2e3c", "#3a3e4e", "#4c5062", "#5f6477", "#767c90", "#9aa0b2"],
    roof_wood=["#2c1a0e", "#432a17", "#5c3b22", "#764e2e", "#8f633c", "#a97b4f", "#c49a6a"],
    wall=["#4a3a28", "#7c6648", "#a89070", "#cdb894", "#e4d3ae", "#f2e6c6"],
    timber=["#1e130a", "#352214", "#4e331e", "#6a4a2c", "#86633c"],
    glass=["#141a24", "#1f2a3a", "#2e4258", "#5a7a96", "#a4c2d8"],
    door=["#261609", "#3e2512", "#5a381c", "#764d29", "#8e6336"],
    stone=["#26262a", "#3c3c42", "#56565c", "#717176", "#8e8e92", "#adadb0"],
    crate=["#2e1c0e", "#4e3219", "#6e4924", "#8e6232", "#ab7c44", "#c69a60"],
    barrel=["#2a180c", "#46291a", "#664024", "#86582f", "#a5713e", "#bf8e58"],
    fence=["#24160c", "#3e2716", "#5c3c21", "#7a532f", "#97693c", "#b4844e"],
    iron=["#121318", "#24262e", "#3a3c46", "#585a66"], glow=["#c88a2a", "#f2c45a", "#fff2b0"],
    steel=["#1c2030", "#30364a", "#4a5268", "#6a7488", "#8e98aa", "#b6bec8", "#dde2e8"],
    leather=["#2c1a0e", "#4a2e18", "#6c4626", "#8a5e34"], plume=["#5a0e0e", "#8e1a16", "#c42c22", "#ee5a3e"],
    team_blue=["#0e1e4e", "#18327a", "#2448a6", "#3a66c8", "#5e8ae0"], team_red=["#4a0c10", "#7a1418", "#a82422", "#d03a2e", "#ec6248"],
    gold=["#7a5410", "#b8861e", "#e6b832", "#fae070"], shirt_green=["#14301a", "#1e4a24", "#2c6630", "#3e8240", "#5aa052"],
    shirt_red=["#3a140c", "#5e2214", "#86341e", "#a8482a", "#c4663c"], pants=["#1e140c", "#33231a", "#4a3626", "#614a36"],
    skin=["#5a3220", "#8a5236", "#b8784e", "#dca070", "#f2c294"], hair=["#1a0e08", "#3a2212", "#5a3820", "#7a522e"],
    straw=["#6a4e1e", "#9a7632", "#c6a04c", "#e2c26e", "#f4e0a0"],
    fl_pink=["#e86a9a"], fl_purple=["#9a6ad8"], fl_white=["#f2eef0"]).items()}

def ground(u, v, xs, ys, P, shadow, items):
    k = P / 32; X = xs / k; Y = ys / k   # base-px coords (so detail sizes match 32 px)
    Xi = np.floor(X); Yi = np.floor(Y); Xs = xs.astype(float); Ys = ys.astype(float)
    macro = fbm(X, Y, 70, 3, 3) - 0.5
    sun = np.exp(-np.hypot(u - 0.2, v + 0.6) / 4.5); vig = sstep(0.45, 1.05, np.hypot((u - 6) / 6.6, (v - 4.6) / 6.0))
    grain = hash2(Xs, Ys, 5) - 0.5
    tick = hash2(Xs, np.floor(Ys / 2), 6) > 0.84; tick_dn = np.roll(tick, -1, 0) & ~tick
    speck = (hash2(Xs, Ys, 8) > 0.985) & (hash2(np.floor(X / 6), np.floor(Y / 6), 81) > 0.45)
    L = 0.54 + 0.2 * macro + 0.3 * sun - 0.14 * vig + 0.14 * grain + 0.12 * tick - 0.08 * np.roll(tick, 1, 0) + 0.22 * speck
    sh_core = shadow > 0.5
    pen = (shadow > 0.15) & ~sh_core
    L = L - 0.42 * sh_core - 0.16 * pen
    img = ramp_q(R["grass"], L)
    fl = hash2(Xs, Ys, 77); fc = hash2(Xs, Ys, 78)
    flm = ((fl > 0.9985) | ((np.roll(fl, 1, 1) > 0.9985) & (fc > 0.5))) & ~sh_core
    fc = np.where(np.roll(fl, 1, 1) > 0.9985, np.roll(fc, 1, 1), fc)
    img[flm & (fc < 0.4)] = hexc("#e48aa8"); img[flm & (fc >= 0.4) & (fc < 0.7)] = hexc("#e8e2d8"); img[flm & (fc >= 0.7)] = hexc("#a88ad8")
    # path: ragged edge, dark rim, clustered pebbles
    jit = (hash2(Xi, Yi, 9) - 0.5) * 0.06
    pd = path_d(u, v) + jit
    inside = pd < 0
    pL = 0.62 + 0.14 * (fbm(X, Y, 9, 11, 2) - 0.5) + 0.12 * sun - 0.15 * vig - 0.25 * sh_core
    peb = (hash2(np.floor(X / 2), np.floor(Y / 2), 12) > 0.86) & (hash2(Xi, Yi, 13) > 0.35)
    pL = pL + 0.22 * peb - 0.18 * np.roll(peb, 1, 0) * ~peb
    pL = np.where(pd > -0.07, pL - 0.3, pL)
    img[inside] = ramp_q(R["dirt"], pL)[inside]
    # pond
    d = pond_d(u, v) + (hash2(Xi, Yi, 21) - 0.5) * 0.03
    water = d < 0; bank = (d >= 0) & (d < 0.22)
    depth = clamp(-d / 1.1)
    wL = 0.6 - 0.32 * sstep(0, 1, depth) + 0.05 * (fbm(X, Y, 30, 31, 2) - 0.5) + 0.1 * (hash2(Xi, Yi, 35) - 0.5)
    rip = np.sin(Y * 0.9 + 2.2 * np.sin(X * 0.11) + 1.5 * fbm(X, Y, 16, 33, 2) * 6)
    dash = ((rip > 0.94) & (hash2(np.floor(X / 3), Yi, 34) > 0.62)) | (hash2(np.floor(X / 2), Yi, 36) > 0.985)
    wL = wL + 0.3 * dash + np.where(d > -0.05, 0.22, 0) + 0.12 * sstep(-0.35, -0.05, d)
    lee = pond_d(u - 0.14, v - 0.18) > 0   # the bank's own shadow on the water, sun top-left
    wL = wL - 0.22 * (lee & (d > -0.3)) - 0.2 * sh_core
    img[water] = ramp_q(R["water"], wL)[water]
    bL = 0.62 - 0.45 * sstep(0.12, 0.0, d) + 0.18 * (hash2(np.floor(X / 2), np.floor(Y / 2), 40) - 0.5) - 0.2 * sh_core
    img[bank] = ramp_q(R["bank"], bL)[bank]
    # sky band in the overlap row (concept dressing only)
    hz = -0.36
    sky = v < hz; lip = (v >= hz) & (v < hz + 1.0 / P)
    t = clamp(X / (12 * 32)); top = clamp((hz - v) / (hz + 1))
    base = np.array([196, 150, 170]) * (1 - t)[..., None] + np.array([120, 110, 160]) * t[..., None]
    sk = base * (1 - 0.35 * top)[..., None] + np.array([22, 14, 40]) * top[..., None]
    glow = np.exp(-np.hypot(X / 32, (v + 1) * 1.4) / 1.6)[..., None]
    sk = sk * (1 - 0.5 * glow) + np.array([250, 214, 128]) * 0.5 * glow
    cl = fbm(X * 0.6, Y * 2.2, 40, 51, 3)
    sk = np.where((cl > 0.58)[..., None], sk * 0.45 + np.array([240, 176, 170]) * 0.55, sk)
    sk = np.where(((cl > 0.52) & (cl <= 0.58))[..., None], sk * 0.75 + np.array([240, 176, 170]) * 0.25, sk)
    sk = np.floor(sk / 8) * 8
    img[lip] = img[lip] * 0.6 + np.array([214, 190, 110]) * 0.4
    img[sky] = sk[sky]
    return img

def grade(img, u, v, P):
    sun = np.exp(-np.hypot(u - 0.0, v + 1.0) / 3.2)[..., None]
    vig = sstep(0.55, 1.15, np.hypot((u - 6.5) / 6.5, (v - 4.4) / 6.0))[..., None]
    img = img * (1 + 0.18 * sun) + np.array([60, 36, -10]) * sun * 0.8
    img = img * (1 - 0.2 * vig) + np.array([6, -3, 12]) * vig
    return img

S = dict(scale=dict(knight=1.4, boy=1.45, farmer=1.45, crate=1.3, barrel=1.3, rock=1.3, bush=1.2, tree=1.08, lantern=1.25), mode="pixel", ramps=R, ground=ground, grade=grade, tree="round", boxes=True,
         outline=lambda Rm: Rm[0] * 0.75, outline_by=dict(leaf=hexc("#142410")), rim=0.16, bias=dict(steel=-0.16, stone=-0.1))

# ---- cluster-built crowns: the r2 fix for "defined clumps" ----------------------------------------------
def crown(s, cx, cy, rx, ry, seed, cr=3.5, gap=4.3, bottom=0.62):
    """Fill an egg-shaped crown with overlapping leaf clusters, painted top to bottom so each lower cluster's lit top
    edge sits over the shaded underside of the one above. Geometry is in base px (32 per tile); pixels are at s.k."""
    rs = np.random.default_rng(seed); k = s.k
    Xp = np.floor(s.X * k); Yp = np.floor(s.Y * k)          # screen-pixel lattice for 1 px leaf speckle
    pts = []
    for j, yy in enumerate(np.arange(-ry, ry + 0.01, gap * 0.82)):
        off = (j % 2) * gap * 0.5
        for xx in np.arange(-rx - off, rx + 0.01, gap):
            x = xx + (rs.random() - 0.5) * 1.6; y = yy + (rs.random() - 0.5) * 1.4
            w = 0.86 + 0.16 * (y / ry)                       # rounded cone: dome top, widest low down
            if (x / (rx * w)) ** 2 + (y / ry) ** 2 <= 1.0: pts.append((x, y))
    pts.append((0.0, -ry + cr * 0.6))
    pts.sort(key=lambda p: p[1])
    for i, (x, y) in enumerate(pts):
        r = cr * (0.88 + 0.28 * rs.random()) * (0.9 if y < -ry * 0.6 else 1.0)
        def f(X, Y, nx, ny, i=i):
            gx = clamp((X - cx) / rx, -1, 1); gy = clamp((Y - cy) / ry, -1, 1)
            g = sphere(gx, gy * 0.9) - 0.12 * sstep(0.1, 0.9, gx)
            loc = sphere(nx, ny)
            under = sstep(0.35, 0.95, ny) * sstep(-0.2, 0.6, np.hypot(nx, ny))   # cluster's own shaded underside
            spk = hash2(Xp, Yp, seed * 31 + i) - 0.5
            hi = sstep(0.55, 0.85, loc) * 0.12   # small lit cap on each cluster
            return -0.2 + 0.52 * g + 0.6 * loc + hi - 0.3 * under - 0.22 * sstep(0.1, 1.0, gy) * bottom + 0.05 * spk
        s.ellipse(cx + x, cy + y, r, r * 0.92, "leaf", f)

def tree2(k, S, seed=1, sc=1.0):
    s = Spr(40 * sc + 6, 58 * sc + 4, 0, 0, k); ox, oy = s.W / k / 2, s.H / k - 3
    s.ax, s.ay = ox, oy; F = lambda x, y: (x + ox, y + oy)
    bark = lambda X, Y, nx, ny: 0.8 - nx * 0.6 + 0.1 * (vnoise(X * 3, Y * 0.6, 1, seed) - 0.5)
    tw = 2.7 * sc
    x0, y0 = F(-tw, -14 * sc); x1, y1 = F(tw, 0.5); s.rect(x0, y0, x1, y1, "bark", bark)
    for sd in (-1, 1):
        a, b = F(sd * tw - (1.8 if sd < 0 else 0) * sc, -2.4 * sc); c, d = F(sd * tw + (1.8 if sd > 0 else 0) * sc, 0.5)
        s.rect(a, b, c, d, "bark", 0.38 if sd > 0 else 0.62)
    rx, ry = 15.5 * sc, 19.5 * sc; cx, cy = F(0, -(9.5 * sc + ry))
    crown(s, cx, cy, rx, ry, seed)
    return s, [("e", 11 * sc, -3.5 * sc, 16.5 * sc, 8 * sc)]

def bush2(k, S, seed=1):
    s = Spr(26, 20, 13, 17, k)
    crown(s, 13, 10.5, 9.0, 5.8, seed + 900, cr=3.2, gap=3.8, bottom=0.5)
    return s, [("e", 4, -1.5, 10, 3.8)]

recipes.BUILD["tree"] = tree2; recipes.BUILD["bush"] = bush2

# per-material outline colour (leaf outlines are deep green, not near-black), wrapped around the shared colourise
_col = engine.colourise
def colourise2(S, spr):
    rgb, a = _col(S, spr)
    ob = S.get("outline_by")
    if ob and S.get("outline"):
        edge, nb = outline_masks(spr)
        for i, name in enumerate(spr.names):
            if name in ob:
                m = edge & (nb == i); rgb[m] = ob[name]
    return rgb, a
engine.colourise = colourise2

if __name__ == "__main__":
    P = int(sys.argv[1]) if len(sys.argv) > 1 else 32
    img = bake(S, P)
    here = os.path.dirname(os.path.abspath(__file__))
    files = save_set(img, f"b-r2-{P}px", here, P, os.path.join(here, "../../styles/b-hd-pixel.jpg"), f"B r2 modern HD pixel: code bake at {P} px/tile", scale_to=4 * img.shape[1])
    print(files)
