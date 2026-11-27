#!/usr/bin/env python3
"""ART1a reference: checks tools/art-bake/palette.json against the frozen r6b ramps (b3.R after the whole r6b chain is
imported), the outline mix (b-r3b PLUM, 0.45 and 0.55) and outline_by. Run from the repo root: python3 <this file>"""
import sys, os, json, numpy as np
sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, "styles-code", "b-r6b")]
import style_b6b, style_b3b
from style_b6b import S, b3
hexes = lambda v: ["#%02x%02x%02x" % tuple(int(c) for c in row) for row in np.asarray(v)]
pal = json.load(open("tools/art-bake/palette.json"))
assert pal["ramps"] == {k: hexes(v) for k, v in b3.R.items()}, "ramps differ"
assert pal["outline"] == {"colour": hexes([style_b3b.PLUM])[0], "rampWeight": 0.45, "colourWeight": 0.55}, "outline differs"
assert list(S["outline"](np.zeros((1, 3)))) == list(style_b3b.PLUM * 0.55), "outline formula moved"
assert pal["outlineBy"] == {k: hexes([v])[0] for k, v in S["outline_by"].items()}, "outlineBy differs"
print("palette.json matches the r6b chain:", len(pal["ramps"]), "ramps")
