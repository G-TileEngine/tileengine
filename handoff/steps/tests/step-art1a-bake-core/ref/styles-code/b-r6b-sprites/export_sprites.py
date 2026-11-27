"""In-maker art test (CoS 27 Nov 09:45): export the frozen B r6b village props as separate transparent 48 px PNGs.
Reads ../b-r6b/style_b6b.py (frozen, imported only). Writes here: sprites/*.png, shadows/*.png, ground PNGs,
reference composites and manifest.json (foot point = the anchor the engine uses, in sprite px from the top-left).
No grade, no shafts, no light: those are lighting layers. Usage: PYTHONDONTWRITEBYTECODE=1 python3 export_sprites.py"""
import sys, os, json, numpy as np
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, "../b-r6b")]
import style_b6b as b6b
from style_b6b import S, b3, engine
from common import ITEMS, grid, place_xy, TOP_T
P = 48; b3.TIER = 48; k = P / 32
u, v, xs, ys = grid(P); H, W = u.shape
items = engine.build_items(S, k)
for d in ("sprites", "shadows", "extras"): os.makedirs(os.path.join(HERE, d), exist_ok=True)
names, count = [], {}
def name_of(kind, kw):
    if kind == "house": return "house-" + kw["roof"].split("_")[1]
    base = {"tree": "oak", "rock": "stone", "bush": "bush"}.get(kind, kind)
    if kind == "rock": base = "stone-big" if kw.get("big") else "stone"
    count[base] = count.get(base, 0) + 1
    return f"{base}-{count[base]:02d}" if kind in ("tree", "rock", "bush", "knight") else base
PROPS = {"tree", "house", "fence", "rock", "bush", "crate", "barrel", "lantern"}
man = {"tile": P, "stage": {"cols": 12, "rows": 10, "topRows": TOP_T, "w": W, "h": H}, "source": "b-r6b/style_b6b.py (frozen checkpoint)",
       "note": "foot = anchor in whole sprite px from the top-left (the point the prop stands on). placed = foot in whole stage px at 48 (stage includes 1 sky row on top). shadow.foot = the same point in the shadow PNG.", "sprites": []}
comp_ns = engine.colourise  # patched colourise from the r6b chain
ground0 = S["ground"](u, v, xs, ys, P, np.zeros((H, W)), items)
shadow = engine.shadow_mask(items, P, k, H, W)
ground_sh = S["ground"](u, v, xs, ys, P, shadow, items)
def save(arr, path): Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(path, optimize=True)
save(ground0, os.path.join(HERE, "ground-48px-noshadow.png")); save(ground_sh, os.path.join(HERE, "ground-48px-withshadows.png"))
rows = [None] * len(items)
order = sorted(range(len(items)), key=lambda i: (items[i][2], items[i][1]))
comp = {"noshadow": ground0.copy(), "shadows": ground_sh.copy()}
for i, (kind, uu, vv, spr, shad) in enumerate(items):
    kw = ITEMS[i][3]; nm = name_of(kind, kw)
    rgb, a = comp_ns(S, spr)
    if "sprite_post" in S: rgb = S["sprite_post"](kind, spr, rgb)
    rgba = np.dstack([np.clip(rgb, 0, 255), np.clip(a * 255, 0, 255)]).astype(np.uint8)
    sub = "sprites" if kind in PROPS else "extras"
    Image.fromarray(rgba, "RGBA").save(os.path.join(HERE, sub, f"{nm}.png"), optimize=True)
    fx, fy = place_xy(uu, vv, P)
    footx, footy = spr.ax * spr.k, spr.ay * spr.k
    # shadow on its own transparent layer, same foot (r6b ground darkens to x0.62 under shadow)
    xs_, ys_ = [], []
    for sh in shad:
        pts = [(sh[1] - sh[3], sh[2] - sh[4]), (sh[1] + sh[3], sh[2] + sh[4])] if sh[0] == "e" else sh[1]
        xs_ += [p[0] * spr.k for p in pts]; ys_ += [p[1] * spr.k for p in pts]
    # whole-pixel foot and placement, so any renderer lands the sprite on the same top-left pixel as the r6b bake
    fix, fiy = int(np.floor(footx + 0.5)), int(np.floor(footy + 0.5))
    px0, py0 = int(round(fx - footx)), int(round(fy - footy))
    row = {"name": nm, "kind": kind, "file": f"{sub}/{nm}.png", "w": int(a.shape[1]), "h": int(a.shape[0]),
           "foot": [fix, fiy], "placed": [px0 + fix, py0 + fiy], "uv": [uu, vv], "prop": kind in PROPS}
    if xs_:
        x0, y0 = int(np.floor(min(xs_))) - 1, int(np.floor(min(ys_))) - 1; sw, shh = int(np.ceil(max(xs_))) - x0 + 2, int(np.ceil(max(ys_))) - y0 + 2
        im = Image.new("L", (sw, shh), 0); dd = ImageDraw.Draw(im)
        for sh in shad:
            if sh[0] == "e": _, cx, cy, rx, ry = sh; dd.ellipse([(cx - rx) * spr.k - x0, (cy - ry) * spr.k - y0, (cx + rx) * spr.k - x0, (cy + ry) * spr.k - y0], fill=255)
            else: dd.polygon([(x * spr.k - x0, y * spr.k - y0) for x, y in sh[1]], fill=255)
        m = np.asarray(im, float) / 255
        sh_rgba = np.dstack([np.full_like(m, 20), np.full_like(m, 24), np.full_like(m, 34), m * 0.38 * 255]).astype(np.uint8)
        Image.fromarray(sh_rgba, "RGBA").save(os.path.join(HERE, "shadows", f"{nm}-shadow.png"), optimize=True)
        row["shadow"] = {"file": f"shadows/{nm}-shadow.png", "foot": [-x0, -y0], "w": sw, "h": shh}
    man["sprites"].append(row); names.append(nm)
    rows[i] = (kind, uu, vv, spr, shad, rgb, a, nm)
for i in order:
    kind, uu, vv, spr, shad, rgb, a, nm = rows[i]; fx, fy = place_xy(uu, vv, P)
    x0 = int(round(fx - spr.ax * spr.k)); y0 = int(round(fy - spr.ay * spr.k)); hh, ww = a.shape
    X0, Y0 = max(x0, 0), max(y0, 0); X1, Y1 = min(x0 + ww, W), min(y0 + hh, H)
    if X1 <= X0 or Y1 <= Y0: continue
    sa = a[Y0 - y0:Y1 - y0, X0 - x0:X1 - x0, None]; sr = rgb[Y0 - y0:Y1 - y0, X0 - x0:X1 - x0]
    for key in comp: comp[key][Y0:Y1, X0:X1] = comp[key][Y0:Y1, X0:X1] * (1 - sa) + sr * sa
save(comp["noshadow"], os.path.join(HERE, "ref-r6b-48px-nograde-noshadow.png"))
save(comp["shadows"], os.path.join(HERE, "ref-r6b-48px-nograde.png"))
json.dump(man, open(os.path.join(HERE, "manifest.json"), "w"), indent=1)
print(len(names), "sprites:", ", ".join(names))
