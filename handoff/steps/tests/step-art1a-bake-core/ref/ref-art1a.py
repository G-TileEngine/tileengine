#!/usr/bin/env python3
"""ART1a reference: bakes the B r6b crate and barrel with the frozen Python recipes in styles-code/ (b-r6/style_b6.py
crate6 and barrel6, colourised by the r6b chain, without the scene's far-depth haze) and prints the RGBA pixel sha256,
size and foot point. Needs Python 3, numpy and Pillow. Usage: PYTHONDONTWRITEBYTECODE=1 python3 ref-art1a.py [png-dir]"""
import sys, os, json, hashlib, numpy as np
from PIL import Image
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, "styles-code", "b-r6b")]
import style_b6b
from style_b6b import S, b3, engine
import recipes
out_dir = sys.argv[1] if len(sys.argv) > 1 else None
if out_dir: os.makedirs(out_dir, exist_ok=True)
rows = []
for kind in ("crate", "barrel"):
    for T in (32, 48):
        b3.TIER = T
        spr, shad = recipes.BUILD[kind](T / 32 * S["scale"][kind], S)
        rgb, a = engine.colourise(S, spr)
        rgba = np.dstack([np.clip(rgb, 0, 255), np.clip(a * 255, 0, 255)]).astype(np.uint8)
        if out_dir: Image.fromarray(rgba, "RGBA").save(os.path.join(out_dir, f"{kind}-{T}.png"))
        foot = [int(np.floor(spr.ax * spr.k + 0.5)), int(np.floor(spr.ay * spr.k + 0.5))]
        rows.append(dict(name=kind, tile=T, w=int(rgba.shape[1]), h=int(rgba.shape[0]), foot=foot, sha256=hashlib.sha256(rgba.tobytes()).hexdigest()))
print(json.dumps(rows, indent=1))
