#!/usr/bin/env python3
"""ART1b2 reference: bakes the B r6b recipes in RECIPES order (crate, barrel, rock, lantern) at 32 and 48 px with the
frozen Python in ../../step-art1a-bake-core/ref/styles-code (b-r6/style_b6.py crate6 and barrel6, recipes.py rock and
lantern, colourised by the r6b chain without the scene's far-depth haze), plus the stage's big rock (seed 3). Prints
each sprite's RGBA pixel sha256, size, foot, scale k and contact-shadow shapes (base px from the foot, as the recipe
returns them), and the manifest hash for tiles [32] and [32, 48]: sha256 over the RGBA bytes in RECIPES order, then
tile order. Needs Python 3, numpy 2.x and Pillow. Usage: PYTHONDONTWRITEBYTECODE=1 python3 ref-art1b2.py [png-dir]"""
import sys, os, json, hashlib, numpy as np
from PIL import Image
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, "..", "..", "step-art1a-bake-core", "ref", "styles-code", "b-r6b")]
import style_b6b
from style_b6b import S, b3, engine
import recipes
out_dir = sys.argv[1] if len(sys.argv) > 1 else None
if out_dir: os.makedirs(out_dir, exist_ok=True)
def bake(kind, T, name, **kw):
    b3.TIER = T
    k = T / 32 * S["scale"][kind]
    spr, shad = recipes.BUILD[kind](k, S, **kw)
    rgb, a = engine.colourise(S, spr)
    rgba = np.dstack([np.clip(rgb, 0, 255), np.clip(a * 255, 0, 255)]).astype(np.uint8)
    if out_dir: Image.fromarray(rgba, "RGBA").save(os.path.join(out_dir, f"{name}-{T}.png"))
    foot = [int(np.floor(spr.ax * spr.k + 0.5)), int(np.floor(spr.ay * spr.k + 0.5))]
    shadow = [[s[0], *[float(v) for v in s[1:]]] if s[0] == "e" else ["p", [[float(x), float(y)] for x, y in s[1]]] for s in shad]
    row = dict(name=name, tile=T, w=int(rgba.shape[1]), h=int(rgba.shape[0]), foot=foot, k=float(k), shadow=shadow, sha256=hashlib.sha256(rgba.tobytes()).hexdigest())
    return row, rgba.tobytes()
ORDER = ("crate", "barrel", "rock", "lantern")
rows, px = [], {}
for kind in ORDER:
    for T in (32, 48):
        row, b = bake(kind, T, kind); rows.append(row); px[(kind, T)] = b
extra = [bake("rock", T, "rock-big", seed=3, big=True)[0] for T in (32, 48)]
def manifest_hash(tiles):
    h = hashlib.sha256()
    for kind in ORDER:
        for T in tiles: h.update(px[(kind, T)])
    return h.hexdigest()
print(json.dumps(dict(sprites=rows, extra=extra, hash32=manifest_hash((32,)), hash3248=manifest_hash((32, 48)), scale={k: S["scale"][k] for k in ORDER}), indent=1))
