"""Compose one stage for a style dict S at P px per tile."""
import numpy as np
from PIL import Image, ImageDraw
from common import ITEMS, grid, place_xy, outline_masks, ramp_q, ramp_lerp, vnoise, clamp
from recipes import BUILD

def build_items(S, k):
    out = []
    for kind, u, v, kw in ITEMS:
        kw = dict(kw)
        if kind == "house": kw["boxes"] = kw["boxes"] and S.get("boxes", True)
        kk = k * S.get("scale", {}).get(kind, 1.0)
        spr, shad = BUILD[kind](kk, S, **kw); out.append((kind, u, v, spr, shad))
    return out

def shadow_mask(items, P, k, H, W):
    im = Image.new("L", (W, H), 0); d = ImageDraw.Draw(im)
    for kind, u, v, spr, shad in items:
        fx, fy = place_xy(u, v, P); k = spr.k
        for sh in shad:
            if sh[0] == "e":
                _, cx, cy, rx, ry = sh; d.ellipse([fx + (cx - rx) * k, fy + (cy - ry) * k, fx + (cx + rx) * k, fy + (cy + ry) * k], fill=255)
            else: d.polygon([(fx + x * k, fy + y * k) for x, y in sh[1]], fill=255)
    return np.asarray(im, float) / 255.0

def colourise(S, spr):
    rgb = np.zeros(spr.mat.shape + (3,)); paint = S["mode"] == "painted"
    occ = spr.mat >= 0; rim = np.zeros_like(occ)
    if S.get("rim"):   # warm rim: opaque pixels whose upper or left neighbour is empty (sun top-left)
        up = np.zeros_like(occ); up[1:] = occ[:-1]; lf = np.zeros_like(occ); lf[:, 1:] = occ[:, :-1]
        rim = occ & (~up | ~lf) & ~spr.nolin
    for i, name in enumerate(spr.names):
        m = spr.mat == i
        if not m.any(): continue
        R = S["ramps"][name]; t = spr.sh[m] + S.get("bias", {}).get(name, 0.0) + S.get("rim", 0.0) * rim[m]
        if paint:
            X, Y = spr.X[m], spr.Y[m]
            t = t + S.get("stroke", 0.0) * (vnoise(X * 2.2 + Y * 0.8, Y * 0.7 - X * 0.3, 1.3, i * 13 + 5) - 0.5)
            rgb[m] = ramp_lerp(R, t)
        else: rgb[m] = ramp_q(R, t)
    alpha = (spr.mat >= 0).astype(float)
    if S.get("outline"):
        edge, nb = outline_masks(spr)
        for i, name in enumerate(spr.names):
            m = edge & (nb == i)
            if m.any(): rgb[m] = S["outline"](S["ramps"][name])
        alpha = np.maximum(alpha, edge.astype(float))
    elif paint and S.get("soft_edge", 0) > 0:   # painted: darken a 1px rim inside the silhouette instead of an outline
        occ = spr.mat >= 0; inner = occ.copy()
        for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)): inner &= np.roll(np.roll(occ, dy, 0), dx, 1)
        rim = occ & ~inner; rgb[rim] *= 1 - S["soft_edge"]
    return rgb, alpha

def bake(S, P):
    k = P / 32; u, v, xs, ys = grid(P); H, W = u.shape
    items = build_items(S, k)
    shadow = shadow_mask(items, P, k, H, W)
    img = S["ground"](u, v, xs, ys, P, shadow, items)
    items.sort(key=lambda t: (t[2], t[1]))
    for kind, uu, vv, spr, shad in items:
        rgb, a = colourise(S, spr)
        if "sprite_post" in S: rgb = S["sprite_post"](kind, spr, rgb)
        fx, fy = place_xy(uu, vv, P); x0 = int(round(fx - spr.ax * spr.k)); y0 = int(round(fy - spr.ay * spr.k))
        hh, ww = a.shape; X0, Y0 = max(x0, 0), max(y0, 0); X1, Y1 = min(x0 + ww, W), min(y0 + hh, H)
        if X1 <= X0 or Y1 <= Y0: continue
        sa = a[Y0 - y0:Y1 - y0, X0 - x0:X1 - x0, None]; sr = rgb[Y0 - y0:Y1 - y0, X0 - x0:X1 - x0]
        img[Y0:Y1, X0:X1] = img[Y0:Y1, X0:X1] * (1 - sa) + sr * sa
    img = S["grade"](img, u, v, P)
    return np.clip(img, 0, 255)
