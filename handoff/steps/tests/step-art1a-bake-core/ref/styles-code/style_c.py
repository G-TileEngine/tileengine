"""C: cozy soft-lit pixel (Stardew Valley / Fae Farm / Sun Haven direction). Same kit as B with a bright warm palette,
tiered round trees, soft coloured outlines, lighter warm shadows, dense seeded flowers, turquoise pond with lily pads
and a golden-hour grade. Usage: python3 style_c.py [P=32]"""
import sys, numpy as np
from common import *
from engine import bake
import style_b

R = dict(style_b.R)
R.update({k: ramp_of(v) for k, v in dict(
    grass=["#345a16", "#46701a", "#5a861e", "#709c24", "#88b02a", "#a2c232", "#bed040", "#dade5e"],
    leaf=["#12300e", "#1c4414", "#285c1a", "#387620", "#4c9026", "#68aa2e", "#90c63a", "#c4de56"],
    bark=["#3a2010", "#5a3418", "#7a4c24", "#986634", "#b48048"],
    dirt=["#9a6a34", "#b98244", "#d29a54", "#e2b066", "#eec47e", "#f6d89c"],
    bank=["#5a3a1c", "#7a5028", "#966634", "#ae7e44", "#c49858"],
    water=["#16607a", "#1c7690", "#248ca4", "#30a2b6", "#46b6c6", "#72cad6", "#b2e6ea"],
    lily=["#2e6a24", "#43882c", "#5ea436", "#80c046", "#a6d862"],
    roof_red=["#6a2410", "#923216", "#b8441e", "#d45828", "#e66e34", "#f28a4a", "#f8aa6c"],
    roof_slate=["#3a3a44", "#4c4c58", "#5e5e6c", "#727282", "#888898", "#a0a0ae", "#bcbcc8"],
    roof_wood=["#4e2a12", "#6c3c1a", "#8a5024", "#a46430", "#bc7a3e", "#d09456", "#e2b074"],
    wall=["#7a5e3c", "#a4845c", "#c8a87a", "#e0c494", "#eed8ae", "#f8ead0"],
    stone=["#5a5a62", "#74747c", "#8e8e96", "#a8a8b0", "#c2c2c8", "#dcdce0"],
    steel=["#3a4256", "#56607a", "#76829a", "#98a4b8", "#bcc6d4", "#dce2ea", "#f6f8fa"],
    fl_white=["#fbf8f0"], fl_pink=["#f088aa"], fl_purple=["#a88ae0"]).items()})

FLOWERS = [hexc(h) for h in ("#fbf8f0", "#f592b0", "#f6d24a", "#9ab4f2", "#f49a52", "#c896e8")]

def ground(u, v, xs, ys, P, shadow, items):
    k = P / 32; X = xs / k; Y = ys / k; Xi = np.floor(X); Yi = np.floor(Y)
    macro = fbm(X, Y, 60, 3, 3) - 0.5
    sun = np.exp(-np.hypot(u - 3, v + 1.5) / 7.0)
    grain = hash2(np.floor(X / 2), np.floor(Y / 2), 5) - 0.5          # 2 px clusters: softer than B
    tick = hash2(Xi, np.floor(Yi / 2), 6) > 0.8
    sh_core = shadow > 0.5; pen = (shadow > 0.15) & ~sh_core
    L = 0.5 + 0.2 * macro + 0.16 * sun + 0.12 * grain + 0.1 * tick - 0.06 * np.roll(tick, 1, 0) - 0.3 * sh_core - 0.12 * pen
    img = ramp_q(R["grass"], L)
    # flowers: 5-pixel plus shapes (centre + 4 petals), seeded on a jittered 7 px grid
    cell = 7; gx = np.floor(X / cell); gy = np.floor(Y / cell)
    keep = hash2(gx, gy, 81) > 0.66
    fx = gx * cell + 1 + np.floor(hash2(gx, gy, 82) * 4); fy = gy * cell + 1 + np.floor(hash2(gx, gy, 83) * 4)
    dx = Xi - fx; dy = Yi - fy; col = np.floor(hash2(gx, gy, 84) * len(FLOWERS)).astype(int)
    petal = keep & (np.abs(dx) + np.abs(dy) == 1); centre = keep & (dx == 0) & (dy == 0)
    away = (path_d(u, v) > 0.08) & (pond_d(u, v) > 0.3)
    for ci, c in enumerate(FLOWERS):
        m = petal & (col == ci) & away; img[m] = c * np.where(sh_core[m], 0.8, 1.0)[:, None]
    img[centre & away] = hexc("#f2b632")
    stem = keep & (dx == 0) & (dy == 2) & away; img[stem] = R["grass"][1]
    # path
    jit = (hash2(Xi, Yi, 9) - 0.5) * 0.05; pd = path_d(u, v) + jit; inside = pd < 0
    pL = 0.66 + 0.1 * (fbm(X, Y, 9, 11, 2) - 0.5) + 0.1 * sun - 0.2 * sh_core
    peb = (hash2(np.floor(X / 2), np.floor(Y / 2), 12) > 0.9) & (hash2(Xi, Yi, 13) > 0.4)
    pL = pL - 0.14 * peb
    pL = np.where(pd > -0.06, pL - 0.22, pL)
    img[inside] = ramp_q(R["dirt"], pL)[inside]
    # pond: turquoise, lily pads, shore highlight
    d = pond_d(u, v) + (hash2(Xi, Yi, 21) - 0.5) * 0.02
    water = d < 0; bank = (d >= 0) & (d < 0.14)
    depth = clamp(-d / 1.2)
    wL = 0.54 - 0.18 * sstep(0, 1, depth) + 0.03 * (fbm(X, Y, 40, 31, 2) - 0.5)
    rip = np.sin(Y * 0.8 + 2.0 * np.sin(X * 0.1) + 6 * fbm(X, Y, 18, 33, 2))
    wL = wL + 0.22 * ((rip > 0.94) & (hash2(np.floor(X / 3), Yi, 34) > 0.5)) + np.where(d > -0.045, 0.3, 0)
    lee = pond_d(u - 0.12, v - 0.16) > 0
    wL = wL - 0.16 * (lee & (d > -0.25))
    wimg = ramp_q(R["water"], wL)
    # lily pads: seeded discs with a wedge notch, 2-tone + highlight
    pads = np.zeros(u.shape, bool); padL = np.zeros(u.shape)
    rs = np.random.default_rng(5)
    for _ in range(26):
        pu, pv = 8 + rs.random() * 4, 6 + rs.random() * 4
        if pond_d(np.array(pu), np.array(pv)) > -0.3: continue
        r = 4.5 + rs.random() * 2.8; ang = rs.random() * 6.28
        if np.any(np.hypot(X[pads] - pu * 32, Y[pads] - (pv + 1) * 32) < r + 3): continue
        dxp = X - pu * 32; dyp = Y - (pv + 1) * 32; dist = np.hypot(dxp, dyp * 1.25)
        a = np.arctan2(dyp, dxp); notch = np.abs(((a - ang + np.pi) % (2 * np.pi)) - np.pi) < 0.35
        m = (dist < r) & ~notch & ~pads
        pads |= m; padL = np.where(m, 0.55 + 0.35 * ((dxp + dyp) < -r * 0.3) - 0.3 * (dist > r - 1.0), padL)
    wimg[pads] = ramp_q(R["lily"], padL)[pads]
    img[water] = wimg[water]
    bL = 0.6 - 0.4 * sstep(0.08, 0.0, d) + 0.14 * (hash2(np.floor(X / 2), np.floor(Y / 2), 40) - 0.5)
    img[bank] = ramp_q(R["bank"], bL)[bank]
    # sky band: pale golden with soft clouds
    hz = -1 + 0.62 + 0.05 * (hash2(Xi, 0, 3) - 0.5) + 0.03 * np.sin(X * 0.7); sky = v < hz
    top = clamp((v + 1) / 0.62)
    sk = np.array([252, 214, 128]) * (1 - top)[..., None] * 0.15 + np.array([250, 222, 140]) * 0.85 + np.array([6, 2, -20]) * top[..., None]
    cl = fbm(X * 0.6, Y * 2.2, 30, 51, 3) > 0.58
    sk = np.where(cl[..., None], np.array([255, 246, 220]), sk); sk = np.floor(sk / 8) * 8
    img[sky] = sk[sky]
    return img

def grade(img, u, v, P):
    sun = np.exp(-np.hypot(u - 2, v + 1.2) / 6.0)[..., None]
    img = img * (1 + 0.06 * sun) + np.array([22, 12, -10]) * sun
    vig = sstep(0.7, 1.3, np.hypot((u - 6) / 6.5, (v - 4.5) / 6.0))[..., None]
    return img * (1 - 0.12 * vig)

S = dict(style_b.S); S.update(ramps=R, ground=ground, grade=grade, tree="round", boxes=False,
         outline=lambda Rm: Rm[0] * 0.92, rim=0.14, bias=dict(steel=-0.15))

if __name__ == "__main__":
    P = int(sys.argv[1]) if len(sys.argv) > 1 else 32
    img = bake(S, P)
    print(save_set(img, f"c-cozy-{P}px", ".", P, "../styles/c-cozy.jpg", f"C cozy soft-lit: code bake at {P} px/tile"))
