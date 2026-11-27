"""bake every pose at both tiers once and freeze the pixels to knight5_grids.py (exact text grids, like the hand stamps)"""
import knight5 as K
out = ['"""B r5b knight pixels, frozen from knight5.py by freeze.py. Digits are steps of the 8-step steel ramp; letters:',
       'x y Y Z gold, a b c d red (crest, sash), l L m M leather, A-E team colour (shield field). Foot point = bottom-centre."""', "GRIDS = {"]
for t in (48, 32):
    for p in "ABCD":
        g = K.bake_grid(p, t); out.append(f"    ({p!r}, {t}): [")
        out += [f"        {r!r}," for r in g]; out.append("    ],")
out.append("}")
open("knight5_grids.py", "w").write("\n".join(out) + "\n"); print("ok")
