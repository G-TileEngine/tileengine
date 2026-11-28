#!/usr/bin/env python3
"""ART1b1 reference: bakes the B r6b rock (recipes.py rock: seed 1, and the stage's big rock, seed 3) and lantern
(recipes.py lantern) at 32 and 48 px with the frozen Python in ../../step-art1a-bake-core/ref/styles-code, colourised
by the r6b chain (engine.colourise: banded ramps, warm rim 0.16, bias, sel-out outline, glow without an outline) and
without the scene's far-depth haze. Prints each sprite's RGBA pixel sha256, size and foot, samples of the shared
blocks (hash2, vnoise, fbm, sphere, LIGHT), and checks palette.json's rim and bias against the chain.
Needs Python 3, numpy 2.x and Pillow. Run from the repo root:
PYTHONDONTWRITEBYTECODE=1 python3 handoff/steps/tests/step-art1b1-shade-core/ref/ref-art1b1.py [png-dir]"""
import sys, os, json, hashlib, numpy as np
from PIL import Image
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, "..", "..", "step-art1a-bake-core", "ref", "styles-code", "b-r6b")]
import style_b6b
from style_b6b import S, b3, engine
import recipes, common
out_dir = sys.argv[1] if len(sys.argv) > 1 else None
if out_dir: os.makedirs(out_dir, exist_ok=True)
pal = json.load(open("tools/art-bake/palette.json"))
assert pal["rim"] == S["rim"] and pal["bias"] == S["bias"], "rim or bias differs from the r6b chain"
rows = []
for name, kind, kw in (("rock", "rock", {}), ("rock-big", "rock", dict(seed=3, big=True)), ("lantern", "lantern", {})):
    for T in (32, 48):
        b3.TIER = T
        spr, shad = recipes.BUILD[kind](T / 32 * S["scale"][kind], S, **kw)
        rgb, a = engine.colourise(S, spr)
        rgba = np.dstack([np.clip(rgb, 0, 255), np.clip(a * 255, 0, 255)]).astype(np.uint8)
        if out_dir: Image.fromarray(rgba, "RGBA").save(os.path.join(out_dir, f"{name}-{T}.png"))
        foot = [int(np.floor(spr.ax * spr.k + 0.5)), int(np.floor(spr.ay * spr.k + 0.5))]
        rows.append(dict(name=name, tile=T, w=int(rgba.shape[1]), h=int(rgba.shape[0]), foot=foot, sha256=hashlib.sha256(rgba.tobytes()).hexdigest()))
pts = [(0.5, 0.5), (3.25, -1.75), (17.0, 9.5), (-6.4, 12.9)]
blocks = dict(
    hash2=[float(common.hash2(i, j, s)) for i, j, s in ((0, 0, 0), (3, -2, 1), (-7, 11, 31), (123, 456, 9))],
    vnoise=[float(common.vnoise(x, y, 2.5, 4)) for x, y in pts],
    fbm=[float(common.fbm(x, y, 6.0, 9)) for x, y in pts],
    sphere=[float(common.sphere(nx, ny)) for nx, ny in ((0.0, 0.0), (-0.5, -0.4), (0.7, 0.6), (0.3, -0.9))],
    light=[float(v) for v in common.LIGHT])
print(json.dumps(dict(sprites=rows, blocks=blocks, rim=S["rim"], bias=S["bias"]), indent=1))
