"""B r4: the r3b identity pass (Ember Dusk palette, flame-tip shapes, heroic hand-authored knight) plus the three r3
gaps: forest-floor shade, far-tree depth and dithered light shafts. 48 px is the main bake.
Usage: python3 style_b4.py [48|32]"""
import sys, os, numpy as np
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, ".."), os.path.join(HERE, "../b-r2"), os.path.join(HERE, "../b-r3"), os.path.join(HERE, "../b-r3b"), HERE]
import style_b3b as b3b, style_b3 as b3
from common import *
import engine
from engine import bake

# tag every sprite with its map position so the colour pass can add depth
_build = engine.build_items
def build_items4(S, k):
    out = _build(S, k)
    for kind, u, v, spr, sh in out: spr.uv = (u, v)
    return out
engine.build_items = build_items4

HAZE = hexc("#c9ae8e")
def sprite_post(kind, spr, rgb):
    """far-tree depth: items toward the back pick up warm haze and lose a little contrast"""
    u, v = getattr(spr, "uv", (0, 9)); d = float(clamp((4.6 - v) / 4.6)) * (1.0 if kind == "tree" else 0.5)
    if d <= 0: return rgb
    m = rgb.mean(axis=(0, 1), keepdims=True)
    rgb = rgb * (1 - 0.12 * d) + m * 0.12 * d
    return rgb * (1 - 0.24 * d) + HAZE * 0.24 * d

def forest_density(u, v, items):
    dn = np.zeros_like(u)
    for kind, uu, vv, spr, sh in items:
        if kind == "tree": dn += np.exp(-((u - uu) ** 2 + ((v - vv + 0.35) * 1.15) ** 2) / 0.95 ** 2)
    return dn

def ground4(u, v, xs, ys, P, shadow, items):
    img = b3b.ground3b(u, v, xs, ys, P, shadow, items)
    land = v >= -0.36
    f = np.clip((forest_density(u, v, items) - 0.35) / 0.65, 0, 1) * land       # forest floor: deeper, cooler shade
    f = f * (1 - 0.35 * b3.wash_of(u, v))                                     # but the sunlit corner stays lit
    fx = np.floor(f * 4 + BAYER[ys.astype(int) % 4, xs.astype(int) % 4] * 0.999) / 4  # banded with an ordered dither
    return img * (1 - fx[..., None] * np.array([0.5, 0.44, 0.3])) + fx[..., None] * np.array([2, 0, 10])

BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0
def shafts(u, v):
    p = u * 0.8 - (v + 1.0) * 0.6; t = u * 0.6 + (v + 1.0) * 0.8
    I = sum(a * np.exp(-((p - c) / w) ** 2) for c, w, a in ((0.7, 0.32, 0.5), (2.6, 0.42, 0.42), (4.3, 0.26, 0.3)))
    return I * np.exp(-t / 4.2) * (v >= -0.36)

def grade4(img, u, v, P):
    img = b3b.S["grade"](img, u, v, P)
    H, W = u.shape; yy, xx = np.indices((H, W))
    on = (BAYER[yy % 4, xx % 4] < shafts(u, v))[..., None]                   # dithered light shafts, top-left sun
    return np.where(on, img * 1.05 + np.array([30, 22, 4]), img)

S = dict(b3b.S); S.update(ground=ground4, grade=grade4, sprite_post=sprite_post)

def label_sheet(panels, labels, out, fnt_size=28):
    pad, bar = 20, 56; W = sum(p.width for p in panels) + pad * (len(panels) + 1); H = max(p.height for p in panels) + bar + pad
    sh = Image.new("RGB", (W, H), (18, 20, 26)); d = ImageDraw.Draw(sh)
    fnt = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", fnt_size); x = pad
    for p, l in zip(panels, labels): sh.paste(p, (x, bar)); d.text((x, 14), l, fill=(225, 225, 232), font=fnt); x += p.width + pad
    sh.save(out, optimize=True)

if __name__ == "__main__":
    P = int(sys.argv[1]) if len(sys.argv) > 1 else 48
    b3.TIER = 48 if P >= 48 else 32
    img = bake(S, P); name = f"b-r4-{P}px"
    files = save_set(img, name, HERE, P, os.path.join(HERE, "../../styles/b-hd-pixel.jpg"),
                     f"B r4: code bake at {P} px/tile", scale_to=4 * img.shape[1])
    b3.side_by_side(os.path.join(HERE, f"../b-r3/b-r3-{P}px-4x.png"), os.path.join(HERE, f"{name}-4x.png"), f"B r3 at {P} px",
                    f"B r4 at {P} px", os.path.join(HERE, f"{name}-vs-r3.png"))
    files.append(f"{name}-vs-r3.png")
    if P == 48:   # knight close-up: the concept knight, r3 and r4 at 8x (the knight on the path; same 1x crop for r3 and r4)
        box = (248, 248, 322, 322)
        r3 = Image.open(os.path.join(HERE, "../b-r3/b-r3-48px-1x.png")).convert("RGB").crop(box).resize((592, 592), Image.NEAREST)
        r4 = Image.open(os.path.join(HERE, f"{name}-1x.png")).convert("RGB").crop(box).resize((592, 592), Image.NEAREST)
        cc = Image.open(os.path.join(HERE, "../../styles/b-hd-pixel.jpg")).convert("RGB").crop((418, 470, 548, 600)).resize((592, 592), Image.NEAREST)
        label_sheet([cc, r3, r4], ["AI concept knight (reference)", "B r3, 48 px at 8x", "B r4, 48 px at 8x"], os.path.join(HERE, "b-r4-knight-closeup.png"))
        files.append("b-r4-knight-closeup.png")
    print(files)
