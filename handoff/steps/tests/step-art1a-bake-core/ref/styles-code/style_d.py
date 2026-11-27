"""D: hand-painted (Octopath HD-2D textures / painterly SRPG direction). Rendered smooth at 128 px per tile with continuous
ramps, brush-stroke noise, light shafts, soft shadows and a heavy vignette, then box-filtered down to 32 px (and 64 px).
Usage: python3 style_d.py   -> writes the 32 px and 64 px sets"""
import sys, numpy as np
from PIL import Image, ImageFilter
from common import *
from engine import bake
import style_b

R = dict(style_b.R)
R.update({k: ramp_of(v) for k, v in dict(
    grass=["#18221a", "#24341e", "#344a1e", "#486220", "#607a22", "#7e8e24", "#a49c2a", "#d0b034", "#f4cc4c"],
    leaf=["#0a160c", "#122818", "#1a3c1a", "#26541e", "#366c22", "#4c8426", "#6c9c2c", "#9cb436", "#d4cc44"],
    bark=["#160e08", "#2a1a0e", "#422a16", "#5e3e20", "#7a542c"],
    dirt=["#4a3420", "#6e4e2e", "#92693c", "#b0824c", "#c69a5e", "#d8b274", "#e8c890"],
    bank=["#1c140c", "#30241a", "#4a3a2a", "#6a5844", "#8c7a64", "#aa9a84"],
    water=["#021622", "#04263a", "#063652", "#0a4a6a", "#126284", "#22809e", "#4ea2b8", "#9ad0dc"],
    wall=["#3a2814", "#5c4224", "#80603a", "#a07e52", "#bc9a6c", "#d4b68a"],
    roof_red=["#3a1206", "#62200a", "#8e3210", "#b44416", "#cc561c", "#de6c2c", "#ee8c48"],
    roof_slate=["#18181e", "#26262e", "#36363f", "#474752", "#5a5a66", "#70707c", "#8e8e98"],
    stone=["#26221e", "#3e3832", "#58504a", "#746c64", "#928a80", "#b0a89e"]).items()})

def oriented(X, Y, ang, sx, sy, sc, seed):
    c, s = np.cos(ang), np.sin(ang); xr = X * c + Y * s; yr = -X * s + Y * c
    return vnoise(xr / sx, yr / sy, sc, seed)

def beams(u, v):
    """light shafts from the top-left: soft bands across the diagonal, fading with distance from the corner"""
    s = (-(u) * 0.62 + (v + 1) * 0.78); along = (u * 0.78 + (v + 1) * 0.62)
    b = 0.5 + 0.5 * np.sin(s * 2.4 + 0.8 * np.sin(along * 0.9)); b = b ** 4
    return 0.25 * np.exp(-along / 4.0) + b * np.exp(-along / 6.0)

def ground(u, v, xs, ys, P, shadow, items):
    k = P / 32; X = xs / k; Y = ys / k
    sh = np.asarray(Image.fromarray((shadow * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.2 * k)), float) / 255
    bm = beams(u, v); vig = sstep(0.5, 1.15, np.hypot((u - 6.3) / 6.4, (v - 4.4) / 5.8))
    strokes = oriented(X, Y, -0.5, 1.0, 0.28, 3.0, 7) - 0.5; fine = oriented(X, Y, 1.35, 1.0, 0.25, 1.1, 8) - 0.5
    macro = fbm(X, Y, 80, 3, 3) - 0.5
    L = 0.5 + 0.18 * macro + 0.16 * strokes + 0.1 * fine + 0.38 * bm - 0.2 * vig - 0.28 * sh
    img = ramp_lerp(R["grass"], L)
    tuft = (oriented(X, Y, 1.5, 1, 0.2, 1.4, 19) > 0.83); img[tuft] = img[tuft] * 1.18 + np.array([10, 8, 0])
    # path: soft edge, rim, strokes
    pd = path_d(u, v) + 0.03 * (oriented(X, Y, 0.3, 1, 0.4, 2.0, 9) - 0.5)
    pL = 0.52 + 0.2 * (oriented(X, Y, -0.6, 1, 0.3, 2.5, 11) - 0.5) + 0.1 * (hash2(np.floor(X / 1.5), np.floor(Y / 1.5), 12) - 0.5) + 0.24 * bm - 0.18 * vig - 0.28 * sh
    pL = pL - 0.28 * sstep(-0.12, -0.01, pd)
    a = sstep(0.0, -0.035, pd)[..., None]
    img = img * (1 - a) + ramp_lerp(R["dirt"], pL) * a
    # pond: depth, caustic web, bank shadow; cobble rim
    d = pond_d(u, v)
    depth = clamp(-d / 1.2)
    n1 = vnoise(X, Y, 7, 31); n2 = vnoise(X + 40, Y * 1.1, 5, 32)
    web = (1 - np.abs(2 * n1 - 1)) ** 7 + 0.6 * (1 - np.abs(2 * n2 - 1)) ** 9
    lee = sstep(-0.02, 0.1, pond_d(u - 0.16, v - 0.2))
    wL = 0.68 - 0.26 * sstep(0, 1, depth) + 0.22 * web * (1 - 0.5 * depth) + 0.12 * bm - 0.22 * lee - 0.15 * vig
    wa = sstep(0.0, -0.02, d)[..., None]
    img = img * (1 - wa) + ramp_lerp(R["water"], wL) * wa
    # cobbles on the rim: jittered cells, each a lit dome
    cs = 5.0; gx = np.floor(X / cs); gy = np.floor(Y / cs); best = np.full(u.shape, 9.0); bx = np.zeros(u.shape); by = np.zeros(u.shape); bid = np.zeros(u.shape)
    for oy in (-1, 0, 1):
        for ox in (-1, 0, 1):
            cx = (gx + ox + 0.2 + 0.6 * hash2(gx + ox, gy + oy, 61)) * cs; cy = (gy + oy + 0.2 + 0.6 * hash2(gx + ox, gy + oy, 62)) * cs
            dd = np.hypot(X - cx, Y - cy); m = dd < best; best = np.where(m, dd, best); bx = np.where(m, X - cx, bx); by = np.where(m, Y - cy, by); bid = np.where(m, hash2(gx + ox, gy + oy, 63), bid)
    rimz = (d > -0.04) & (d < 0.2)
    r = 2.9; inside = best < r
    cob = 0.15 + 0.75 * sphere(clamp(bx / r, -1, 1), clamp(by / r, -1, 1)) + 0.2 * (bid - 0.5) + 0.2 * bm - 0.2 * vig
    cm = rimz & inside
    gap = rimz & ~inside
    img[gap] = ramp_lerp(R["bank"], 0.1 + 0 * cob)[gap]
    img[cm] = ramp_lerp(R["bank"], cob)[cm]
    # sky band: dusky gradient with a sun burst at the top-left
    hz = -1 + 0.62 + 0.06 * (oriented(X, Y, 1.5, 1, 0.2, 1.5, 3) - 0.5); sky = v < hz
    burst = np.exp(-np.hypot(u, v + 1) / 5.0)
    sk = np.array([70, 48, 52]) * (1 - burst)[..., None] + np.array([236, 170, 80]) * burst[..., None]
    sk = sk + 25 * (oriented(X, Y, 0.0, 1, 0.2, 6, 4) - 0.5)[..., None]
    img[sky] = sk[sky]
    return img

def grade(img, u, v, P):
    bm = beams(u, v)[..., None]
    img = img + np.array([86, 60, 4]) * bm
    vig = sstep(0.55, 1.2, np.hypot((u - 6.3) / 6.4, (v - 4.4) / 5.8))[..., None]
    img = img * (1 - 0.45 * vig) + np.array([14, 2, 10]) * vig
    m = img.mean(-1, keepdims=True); img = m + (img - m) * 1.08
    return img

S = dict(style_b.S); S.update(scale=dict(style_b.S['scale'], tree=1.3), mode="painted", ramps=R, ground=ground, grade=grade, tree="pine", boxes=False, outline=None,
         stroke=0.16, soft_edge=0.35, foundation=True, planks=True, rim=0.1, bias=dict(steel=-0.25, leaf=0.06))

def down(img, f):
    h, w, _ = img.shape; return img.reshape(h // f, f, w // f, f, 3).mean((1, 3))

if __name__ == "__main__":
    hi = bake(S, 128)
    out = []
    out += save_set(down(hi, 4), "d-painted-32px", ".", 32, "../styles/d-painted.jpg", "D hand-painted: code bake at 32 px/tile")
    out += save_set(down(hi, 2), "d-painted-64px", ".", 64, "../styles/d-painted.jpg", "D hand-painted: code bake at 64 px/tile")
    print(out)
