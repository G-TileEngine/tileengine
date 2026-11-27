"""B r3b: the identity pass on top of B r3, with 48 px as the main bake.
Identity choices:
 1. Signature palette "Ember Dusk": hue-shifted ramps, so shadows fall to teal-violet and lights rise to amber. Every
    silhouette gets a plum outline, and ground shadows are cool violet instead of brown-black.
 2. Shape language "flame tip": one upward-flame motif repeats on tree crowns (pointed crown and apex sprig), roofs
    (ridge finials and upturned eave kicks) and units (the knight's tall flame crest).
 3. Heroic unit build: the knight is a full hand-authored stamp with a tall great helm (about 1/3 of body height), broad
    two-lame pauldrons, a ridged breastplate, a red sash with a gold buckle, leather tassets, a gold-rimmed shield and an
    upright sword, so it reads on a phone at about 7.5 tiles across.
Usage: python3 style_b3b.py [48|32]"""
import sys, os, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, ".."), os.path.join(HERE, "../b-r2"), os.path.join(HERE, "../b-r3"), HERE]
import style_b3 as b3
from common import *
import engine, recipes, stamps as ST, stamps2 as ST2
from engine import bake
put, R, light_shift = b3.put, b3.R, b3.light_shift

# ---- 1. Ember Dusk palette -------------------------------------------------------------------------------------------
R["leaf"]  = ramp_of(["#0e1824", "#12282c", "#173a2e", "#204e26", "#30621f", "#477822", "#64902a", "#8ea832", "#c8c04a"])
R["grass"] = ramp_of(["#1f2c2c", "#283e2a", "#365226", "#486624", "#5e7a26", "#7a8a2c", "#9c9a34", "#c4aa4a"])
R["steel"] = ramp_of(["#1c1a2e", "#2e3048", "#454b68", "#5f6886", "#8089a2", "#a8b0c0", "#dcd8d0"])
R["bark"]  = ramp_of(["#2a1828", "#4a2a2a", "#6a3e2c", "#8a5634", "#a8703e"])
R["iron"]  = ramp_of(["#16141f", "#262638", "#3a3c52", "#56596e"])
R["plume"] = ramp_of(["#5a1420", "#962030", "#cc3a34", "#f06a44"])
PLUM = hexc("#2a1630")
S = dict(b3.S); S.update(outline=lambda Rm: Rm[0] * 0.45 + PLUM * 0.55, outline_by=dict(leaf=hexc("#1a1628")))

# ---- 2. flame-tip trees ----------------------------------------------------------------------------------------------
def tree3b(k, S, seed=1, sc=1.0):
    T = b3.TIER
    s = Spr(40 * sc + 6, 58 * sc + 6, 0, 0, k); ox, oy = s.W / k / 2, s.H / k - 3
    s.ax, s.ay = ox, oy; F = lambda x, y: (x + ox, y + oy); rs = np.random.default_rng(seed)
    bark = lambda X, Y, nx, ny: 0.8 - nx * 0.6 + 0.1 * (vnoise(X * 3, Y * 0.6, 1, seed) - 0.5)
    tw = 2.7 * sc
    x0, y0 = F(-tw, -14 * sc); x1, y1 = F(tw, 0.5); s.rect(x0, y0, x1, y1, "bark", bark)
    for sd in (-1, 1):
        a, b = F(sd * tw - (1.8 if sd < 0 else 0) * sc, -2.4 * sc); c, d = F(sd * tw + (1.8 if sd > 0 else 0) * sc, 0.5)
        s.rect(a, b, c, d, "bark", 0.38 if sd > 0 else 0.62)
    rx, ry = 15.5 * sc, 19.5 * sc; cx, cy = F(0, -(9.5 * sc + ry))
    W = lambda gy: (0.86 + 0.16 * gy) * (1 - 0.36 * sstep(0.4, 1.0, -gy))     # rounded body, flame-pointed top
    gy = (s.Y - cy) / ry; gx = (s.X - cx) / (rx * W(gy)); body = gx * gx + gy * gy <= 1.0
    g = sphere(np.clip(gx, -1, 1), np.clip(gy, -1, 1) * 0.9)
    s._put(body, "leaf", 0.04 + 0.3 * g - 0.12 * sstep(0.2, 1.0, gy))
    pts = []; gap = (6.2 if T == 32 else 5.6) * sc
    for j, yy in enumerate(np.arange(-ry * 0.86, ry * 0.92, gap * 0.8)):
        off = (j % 2) * gap * 0.5
        for xx in np.arange(-rx - off, rx + 0.01, gap):
            x = xx + (rs.random() - 0.5) * 1.4; y = yy + (rs.random() - 0.5) * 1.2
            if (x / (rx * W(y / ry) * 0.84)) ** 2 + (y / (ry * 0.88)) ** 2 <= 1.0: pts.append((x, y))
    pts.sort(key=lambda p: p[1]); L = ST.LEAF[T]
    for x, y in pts:
        b3.put_c(s, cx + x, cy + y, L[rs.integers(len(L))], mat="leaf", flip=bool(rs.random() < 0.5), shift=light_shift(x, y, rx, ry))
    Tt = ST.TUFT[T]
    for th in np.linspace(np.pi * 1.12, np.pi * 1.88, 8):
        yy = ry * np.sin(th); xx = rx * W(yy / ry) * np.cos(th); t = Tt[rs.integers(len(Tt))]
        put(s, int(round((cx + xx) * s.k - len(t[0]) / 2)), int(round((cy + yy) * s.k)) - len(t) + 1, t, mat="leaf",
            flip=bool(rs.random() < 0.5), shift=light_shift(xx, yy, rx, ry))
    tip = ST2.TIP[T]; put(s, int(round(cx * s.k - len(tip[0]) / 2)), int(round((cy - ry) * s.k)) - len(tip) + 2, tip, mat="leaf",
                          flip=bool(rs.random() < 0.5), shift=1)
    return s, [("e", 11 * sc, -3.5 * sc, 16.5 * sc, 8 * sc)]

# ---- 3. heroic knight: one full hand-authored stamp ------------------------------------------------------------------
def knight3b(k, S, team="blue"):
    T = b3.TIER; s = Spr(22, 32, 11, 29, k)
    body = ST2.KNIGHT[T]; w, h = len(body[0]), len(body)
    x0 = int(round(11 * s.k)) - w // 2; y0 = int(round(29 * s.k)) - h
    if T == 48: sw, swc, swr, ga, sh, shc, pl = (33, 17, 37), None, None, (31, 37), (3, 33), None, (16, 9)
    else:       sw, swc, swr, ga, sh, shc, pl = (22, 11, 23), None, None, (21, 23), (2, 20), None, (10, 5)
    put(s, x0, y0, body, mat="steel", legend=ST2.KN)
    SW = ST2.SWORD[T]; put(s, x0 + sw[0] - len(SW[0]) // 2, y0 + sw[2] - sw[1], SW, mat="steel", legend=ST2.KN)
    GA = ST2.GAUNTLET[T]; put(s, x0 + ga[0] - 1, y0 + ga[1], GA, mat="steel")
    SH = ST2.SHIELD[T]; put(s, x0 + sh[0] - len(SH[0]) // 2, y0 + sh[1] - len(SH) // 2, SH, mat="team_" + team, legend=ST2.KN)
    PL = ST2.PLUME[T]; put(s, x0 + pl[0] - len(PL[0]) // 2, y0 + pl[1] - len(PL) + 1, PL, legend=ST2.KN)
    return s, [("e", 1.5, -0.3, 7.0, 2.4)]

# ---- 2b. flame-tip roofs: ridge finials and upturned eave kicks ------------------------------------------------------
def house3b(k, S, roof="roof_red", boxes=True, seed=1):
    s, shad = b3.house3(k, S, roof, boxes, seed); T = b3.TIER; cx, fy = 40, 58
    rx0, rx1, ry0, ry1 = cx - 35, cx + 35, fy - 50, fy - 14
    fi = ST2.FINIAL[T]; fw, fh = len(fi[0]), len(fi)
    for xb, fl in ((rx0 + 3, False), (rx1 - 3, True)):
        put(s, int(round(xb * s.k - fw / 2)), int(round(ry0 * s.k)) - fh + 1, fi, mat=roof, flip=fl)
    ek = ST2.EAVE_KICK[T]; ew, eh = len(ek[0]), len(ek)
    put(s, int(round(rx0 * s.k)) - 2, int(round(ry1 * s.k)) - eh + 1, ek, mat=roof)
    put(s, int(round(rx1 * s.k)) - ew + 2, int(round(ry1 * s.k)) - eh + 1, ek, mat=roof, flip=True, shift=-1)
    return s, shad

recipes.BUILD.update(tree=tree3b, house=house3b, knight=knight3b)

# ---- 1b. cool violet shadows on the ground ---------------------------------------------------------------------------
def ground3b(u, v, xs, ys, P, shadow, items):
    img = b3.ground3(u, v, xs, ys, P, shadow, items); land = (v >= -0.36)[..., None]
    t = (np.clip((shadow - 0.15) / 0.5, 0, 1) * land[..., 0])[..., None]
    return img * (1 - t * np.array([0.14, 0.1, -0.08])) + t * np.array([4, 0, 12])
S.update(ground=ground3b)

if __name__ == "__main__":
    P = int(sys.argv[1]) if len(sys.argv) > 1 else 48
    b3.TIER = 48 if P >= 48 else 32
    img = bake(S, P); name = f"b-r3b-{P}px"
    files = save_set(img, name, HERE, P, os.path.join(HERE, "../../styles/b-hd-pixel.jpg"),
                     f"B r3b (identity pass): code bake at {P} px/tile", scale_to=4 * img.shape[1])
    b3.side_by_side(os.path.join(HERE, f"../b-r3/b-r3-{P}px-4x.png"), os.path.join(HERE, f"{name}-4x.png"), f"B r3 at {P} px",
                    f"B r3b at {P} px (Ember Dusk, flame tip, heroic knight)", os.path.join(HERE, f"{name}-vs-r3.png"))
    print(files + [f"{name}-vs-r3.png"])
