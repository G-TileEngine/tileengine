"""B r6b-rain (CEO 08:26 via CoS: "how would the map look with rain and a gloomy vibe?"). Demo only.
Sprites are untouched: the r6b sprites and ground are composed exactly as in r6b, and the weather and light are engine
layers on top, following the csoda lighting reference (refs/csoda/): grade, soft shadows, contact darkening, glows.
Layers, in order:
  1. soft overcast shadows: the cast-shadow mask is blurred and weakened before the ground uses it (no hard sun).
  2. overcast grade instead of the sunset grade and sun shafts: cooler, lower saturation, darker, flatter; the sky band
     becomes low grey cloud.
  3. contact darkening: a soft occlusion band around the foot of every standing sprite (wet ground is darker there).
  4. wet surfaces: ground and road darker; roofs, stone, chimneys and the fence get a cool specular sheen on their lit
     edges; puddles on the road and in low ground reflect the sky.
  5. water: deeper and darker, with rain rings.
  6. warm accents: lit windows and the lantern glow, with a soft halo and spill on the wet ground.
  7. light fog, thicker toward the top (farther away).
  8. rain: slanted streaks, plus splash rings on the road, ground and puddles (they change every frame).
Usage: python3 style_rain.py   (48 px; writes 1x, 4x, vs-r6b and a 4-frame GIF)"""
import sys, os, numpy as np
from PIL import Image, ImageFilter
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, "../b-r6b")]
import style_b6b as r6b
from style_b6b import S, R, b3, b4, engine
from common import *
import common

P = 48; b3.TIER = 48

def blur(a, r):
    a = np.asarray(a, float); lo, hi = a.min(), a.max()
    if hi - lo < 1e-9: return a
    im = Image.fromarray(np.uint8(np.clip((a - lo) / (hi - lo) * 255, 0, 255))).filter(ImageFilter.GaussianBlur(r))
    return np.asarray(im, float) / 255 * (hi - lo) + lo

# ---- 1. compose r6b's sprites with soft shadows, and keep an id pass (which material is on top at each pixel) -------
def compose(S, P):
    k = P / 32; u, v, xs, ys = grid(P); H, W = u.shape
    items = engine.build_items(S, k)
    shadow = engine.shadow_mask(items, P, k, H, W)
    soft = np.clip(blur(shadow, 0.16 * P), 0, 1) * 0.62                       # diffuse overcast shadow
    img = S["ground"](u, v, xs, ys, P, soft, items)
    ids = np.full((H, W), "", object); foot = np.zeros((H, W)); items.sort(key=lambda t: (t[2], t[1]))
    for kind, uu, vv, spr, shad in items:
        rgb, a = engine.colourise(S, spr)
        if "sprite_post" in S: rgb = S["sprite_post"](kind, spr, rgb)
        fx, fy = place_xy(uu, vv, P); x0 = int(round(fx - spr.ax * spr.k)); y0 = int(round(fy - spr.ay * spr.k))
        hh, ww = a.shape; X0, Y0 = max(x0, 0), max(y0, 0); X1, Y1 = min(x0 + ww, W), min(y0 + hh, H)
        if X1 <= X0 or Y1 <= Y0: continue
        sa = a[Y0 - y0:Y1 - y0, X0 - x0:X1 - x0]; sr = rgb[Y0 - y0:Y1 - y0, X0 - x0:X1 - x0]
        img[Y0:Y1, X0:X1] = img[Y0:Y1, X0:X1] * (1 - sa[..., None]) + sr * sa[..., None]
        names = np.array([""] + list(spr.names), object)[spr.mat[Y0 - y0:Y1 - y0, X0 - x0:X1 - x0] + 1]
        names = np.where(sa > 0, np.where(names == "", "outline", names), ids[Y0:Y1, X0:X1]); ids[Y0:Y1, X0:X1] = names
        if kind != "fence":                                                    # foot point for contact darkening
            r = (0.42 if kind == "house" else 0.16) * P * spr.k / k
            foot += np.exp(-(((xs - fx) / (r * (2.4 if kind == "house" else 1.0))) ** 2 + ((ys - fy) / (0.32 * r + 2)) ** 2))
    return img, ids, u, v, xs, ys, foot

# ---- 2. overcast grade ---------------------------------------------------------------------------------------------
def grade_rain(img, u, v):
    L = img @ np.array([0.30, 0.59, 0.11])
    g = img * 0.56 + L[..., None] * 0.44                                       # a little under half the saturation
    g = g * 0.77 + np.array([4, 10, 22])                                       # darker, cool, black lift
    g = g * np.array([0.92, 0.98, 1.06])
    vig = sstep(0.55, 1.15, np.hypot((u - 6) / 6.6, (v - 4.6) / 6.0))[..., None]
    return g * (1 - 0.22 * vig)

def sky(img, ids, u, v, xs, ys):
    m = (v < -0.36) & (ids == "")
    n = fbm(u * 1.3 + 0.2 * v, v * 3.1, 3, 41, 3) if hasattr(common, "fbm") else vnoise(u * 1.3, v * 3.1, 1.0, 41)
    band = np.floor(np.clip(0.35 + 0.5 * (n - 0.5) + 0.25 * (v + 1), 0, 1) * 4) / 4   # banded low cloud
    col = np.array([58, 64, 76]) * (1 - band[..., None]) + np.array([96, 102, 114]) * band[..., None]
    img[m] = col[m]; return img

# ---- 4. puddles: low noise on the road and in dips, reflecting the grey sky ------------------------------------------
def puddle_mask(u, v):
    road = path_d(u, v) < -0.02
    n = vnoise(u * 2.2, v * 3.4, 1.0, 77) * 0.65 + vnoise(u * 5.1, v * 7.3, 1.0, 78) * 0.35
    dip = vnoise(u * 0.9, v * 1.4, 1.0, 79)
    return (road & (n > 0.66)) | ((~road) & (pond_d(u, v) > 0.25) & (v > 0) & (n > 0.75) & (dip > 0.62))

if __name__ == "__main__":
    img, ids, u, v, xs, ys, foot = compose(S, P); H, W = u.shape
    roofs = np.isin(ids, ["roof_red", "roof_slate", "roof_wood"]); hard = np.isin(ids, ["stone", "chimney", "fence", "iron", "steel8", "barrel", "crate"])
    groundm = ids == ""; water = groundm & (pond_d(u, v) < 0) ; road = groundm & (path_d(u, v) < 0)
    img = sky(img, ids, u, v, xs, ys)
    # 3. contact darkening where things stand, 4a. everything wet reads darker and a touch richer
    img = img * (1 - 0.30 * np.clip(foot, 0, 1)[..., None] * groundm[..., None])
    img[groundm & ~water] *= 0.86; img[road] *= 0.9
    img = grade_rain(img, u, v)
    # 4b. wet sheen: lit top edges of roof rows and hard surfaces catch the grey sky
    Lm = img @ np.array([0.30, 0.59, 0.11]); up = np.roll(Lm, 1, 0); ids_up = np.roll(ids, 1, 0)
    edge = (Lm > up + 6) & (roofs | hard) & (ids_up == ids)
    sheen = edge & (vnoise(xs * 0.35, ys * 0.9, 1.0, 5) > 0.42)
    img[sheen] = img[sheen] * 0.45 + np.array([170, 182, 198]) * 0.55
    img[roofs] = img[roofs] * 0.93 + np.array([6, 9, 14])
    # 4c. puddles (ground pixels only), sky reflection with a dark rim on the far side and a light near lip
    pm = puddle_mask(u, v) & groundm & ~water
    rim_far = pm & ~np.roll(pm, 1, 0); lip = pm & ~np.roll(pm, -1, 0)
    refl = np.array([78, 88, 104]) + 14 * (vnoise(xs * 0.2, ys * 0.6, 1.0, 9)[..., None] - 0.5)
    img[pm] = img[pm] * 0.25 + refl[pm] * 0.75; img[rim_far] *= 0.7; img[lip] = img[lip] * 0.4 + np.array([140, 150, 166]) * 0.6
    # 5. water: deeper and darker toward the middle
    depth = np.clip(-pond_d(u, v) / 1.3, 0, 1)[..., None] * water[..., None]
    img = img * (1 - 0.35 * depth) + np.array([6, 14, 26]) * 0.35 * depth
    # 6. warm accents: windows, the lantern; halo plus spill on wet ground
    lit = np.isin(ids, ["glass", "glow"])
    gl = img[lit] @ np.array([0.3, 0.59, 0.11])
    img[lit] = np.array([255, 196, 112]) * (0.62 + 0.5 * (gl[..., None] / 255))
    halo = blur(lit.astype(float), 0.13 * P); halo = halo / max(halo.max(), 1e-6)
    spill = blur(np.roll(lit, int(0.18 * P), 0).astype(float), 0.22 * P); spill = spill / max(spill.max(), 1e-6)
    img = img + np.array([120, 70, 22]) * (0.8 * halo + 0.45 * spill * groundm)[..., None]
    # 7. light fog, more in the distance
    fog = (0.10 + 0.14 * np.clip(1 - (v + 1) / 8, 0, 1)) * (0.7 + 0.6 * vnoise(u * 0.7, v * 1.1, 1.0, 31))
    img = img * (1 - fog[..., None]) + np.array([150, 158, 170]) * fog[..., None]
    base = np.clip(img, 0, 255)

    # 8. rain, per frame: streaks fall 1/4 of their spacing each frame; splash rings pop on ground, puddles and water
    rs = np.random.default_rng(2611); N = 900
    sx, sy = rs.uniform(0, W, N), rs.uniform(0, H, N); ln = rs.uniform(5, 10, N); al = rs.uniform(0.18, 0.42, N)
    ringable = (groundm & ~np.isin(ids, ["outline"]))
    pts = np.argwhere(ringable)
    RINGS = [(["#"], 0.5), ([".#.", "#.#", ".#."], 0.42), ([".###.", "#...#", ".###."], 0.36)]
    SPLASH = ["#.#", ".#."]
    def frame(f):
        im = base.copy(); add = np.zeros((H, W)); dy = f * H / 4 * 0.37
        for i in range(N):
            y0 = (sy[i] + dy) % H; x0 = (sx[i] - 0.3 * dy) % W
            for t in range(int(ln[i])):
                x, y = int(x0 - 0.3 * t), int(y0 + t)
                if 0 <= x < W and 0 <= y < H: add[y, x] = max(add[y, x], al[i] * (0.5 + 0.5 * t / ln[i]))
        frs = np.random.default_rng(100 + f)
        for idx in frs.choice(len(pts), 110, replace=False):
            y, x = pts[idx]
            if water[y, x] or pm[y, x] or road[y, x]:                         # pixel rings, at a random stage of growth
                st = int(frs.integers(0, 3)) if (water[y, x] or pm[y, x]) else int(frs.integers(0, 2))
                stamp, a = RINGS[st]
            else: stamp, a = SPLASH, 0.30                                       # grass: a tiny crown splash
            h, w = len(stamp), len(stamp[0])
            for j in range(h):
                for i2 in range(w):
                    if stamp[j][i2] != "#": continue
                    xx, yy = x - w // 2 + i2, y - h // 2 + j
                    if 0 <= xx < W and 0 <= yy < H: add[yy, xx] = max(add[yy, xx], a)
        return np.clip(im * (1 - add[..., None]) + np.array([196, 206, 222]) * add[..., None], 0, 255)
    frames = [np.uint8(frame(f)) for f in range(4)]
    name = "b-r6b-rain-48px"
    Image.fromarray(frames[0]).save(os.path.join(HERE, f"{name}-1x.png"), optimize=True)
    big = Image.fromarray(frames[0]).resize((W * 4, H * 4), Image.NEAREST); big.save(os.path.join(HERE, f"{name}-4x.png"), optimize=True)
    b3.side_by_side(os.path.join(HERE, "../b-r6b/b-r6b-48px-4x.png"), os.path.join(HERE, f"{name}-4x.png"), "B r6b, sunny (48 px)",
                    "B r6b-rain: overcast, rain, wet surfaces, lit windows", os.path.join(HERE, f"{name}-vs-r6b.png"))
    g = [Image.fromarray(fr).resize((W * 2, H * 2), Image.NEAREST).quantize(255, method=Image.MEDIANCUT) for fr in frames]
    g[0].save(os.path.join(HERE, f"{name}-2x.gif"), save_all=True, append_images=g[1:], duration=110, loop=0, optimize=True)
    print("ok")
