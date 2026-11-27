"""B r6b (CEO 07:55 add, via CoS 08:05): the roof chimneys rebuilt to match the concept. Everything else is B r6.
A proper stone stack at the concept's size and spot on the slope: a light stone cap and rim seen from above with a dark
flue, a lip and a shadow under the cap, coursed stone lit on the left and shaded on the right, dark edges where it stands
on the shingles, and a short shadow cast on the roof to the lower right (top-left sun).
Usage: python3 style_b6b.py [48|32]   (48 also writes the chimney close-up sheet)"""
import sys, os, numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, "../b-r6")]
import style_b6 as b6
from style_b6 import S, R, b3, b4, recipes, engine, bake
from common import *

# ---- chimneys (CEO 07:55): a proper stone stack at the concept's size and spot, cap and flue seen from above ----------
# The r2 chimney was a 7 px post mostly hidden behind the ridge row. The concept's stack is wider and taller and stands
# with about half of it above the roof's top edge: a light stone cap seen from above (rim lit top-left, dark flue), a
# lip, a shadow under the cap, then coursed stone with a lit left edge and a shaded right side, and a short shadow cast
# on the roof to the lower right.
R["chimney"] = np.array([[38, 35, 42], [61, 57, 63], [88, 84, 89], [115, 112, 115], [143, 139, 140], [172, 167, 164],
                         [205, 199, 190], [230, 224, 211]], float)
import inspect, textwrap
_src = textwrap.dedent(inspect.getsource(recipes.house)).replace("def house(", "def house_nochim(")
_src = "\n".join(l for l in _src.split("\n") if "chx" not in l)                       # drop the old chimney rects
exec(_src, recipes.__dict__); b3._house = recipes.house_nochim

def chimney_grid(T):
    """step grid, top row first: 12 x 20 at 48 px tiles, 8 x 13 at 32."""
    if T == 48: W, cap, lip, body, rim = 12, 8, 1, 11, 2
    else:       W, cap, lip, body, rim = 8, 6, 1, 6, 1
    H = cap + lip + body; St = np.full((H, W), 3, int)
    for y in range(cap):                                              # cap top face: rim ring around a dark flue
        for x in range(W):
            ring = y < rim or x < rim or x >= W - rim or y >= cap - rim
            if ring: St[y, x] = 7 if (y < rim or x < rim) and x < W - rim else 6 if x < W - rim else 5
            else: St[y, x] = 1 if y == rim or x == rim else 0                   # far rim shades the flue's top-left
    St[cap, :] = 5; St[cap, -1] = 4                                   # lip: the cap's front face
    for j in range(body):
        y = cap + lip + j; row = j // 3; joint = (j % 3) == 2
        for x in range(W):
            st = 3
            if joint: st = 2                                          # mortar course
            elif (x + 3 * (row % 2)) % 6 == 5: st = 2                 # staggered head joints
            if x == 0: st = 5 if not joint else 4                     # lit left edge
            elif x >= W - 2: st = 1 if x == W - 1 else max(st - 1, 1)  # shaded right side
            if j == 0: st = 1 if x < W - 1 else 0                     # shadow under the cap
            if j == body - 1: st = max(st - 1, 0)                     # contact with the roof
            St[y, x] = st
    return St, cap + lip

_house3b = recipes.BUILD["house"]
def house6(k, S, roof="roof_red", boxes=True, seed=1):
    s, shad = _house3b(k, S, roof, boxes, seed); cx, fy = 40, 58; ry0 = fy - 50; T = b3.TIER
    St, above = chimney_grid(T); H, W = St.shape
    x0 = int(round((cx + 15.5) * s.k - W / 2)); ey = int(round(ry0 * s.k)) - 1          # ey: the ridge row
    y0 = ey - above - (2 if T == 48 else 1)
    cid = s.mid("chimney"); rid = s.mid(roof); n = len(R[roof])
    for j in range(H):
        for i in range(W):
            y, x = y0 + j, x0 + i
            if 0 <= y < s.H and 0 <= x < s.W:
                s.mat[y, x] = cid; s.step[y, x] = St[j, i]; s.sh[y, x] = St[j, i] / 7; s.nolin[y, x] = False
    # where the stack stands on the roof: dark side edges and base (the auto outline only rings the silhouette),
    # then its shadow on the shingles to the lower right, away from the top-left sun
    for j in range(H):
        y = y0 + j
        for x in (x0 - 1, x0 + W):
            if 0 <= y < s.H and 0 <= x < s.W and s.mat[y, x] == rid: s.mat[y, x] = cid; s.step[y, x] = 0
    sw = 3 if T == 48 else 2
    for j in range(2, H + sw):
        y = y0 + j
        for x in range(x0 + W + 1, x0 + W + 1 + sw + (j - 2) // 4):
            if 0 <= y < s.H and 0 <= x < s.W and s.mat[y, x] == rid and s.step[y, x] >= 0:
                s.step[y, x] = max(int(s.step[y, x]) - 2, 0)
            elif 0 <= y < s.H and 0 <= x < s.W and s.mat[y, x] == rid:
                st = int(round(s.sh[y, x] * (n - 1))); s.step[y, x] = max(st - 2, 0)
    for x in range(x0 - 1, x0 + W + 1):
        y = y0 + H
        if 0 <= y < s.H and 0 <= x < s.W and s.mat[y, x] == rid:
            st = int(s.step[y, x]) if s.step[y, x] >= 0 else int(round(s.sh[y, x] * (n - 1))); s.step[y, x] = max(st - 2, 0)
    return s, shad
recipes.BUILD["house"] = house6

# chimney centres in stage px at 48 (red, slate, wood houses). The concept's houses sit a little differently on its map.
CHIM = dict(concept=[(260, 108), (459, 55), (361, 291)], r6=[(256, 104), (449, 56), (353, 296)], r6b=[(261, 107), (454, 59), (358, 299)])
def chimney_sheet(name, path):
    z, hw, hh = 8, 12, 14
    c = Image.open(os.path.join(HERE, "../../styles/b-hd-pixel.jpg")).convert("RGB")
    ims = dict(r6=Image.open(os.path.join(HERE, "../b-r6/b-r6-48px-1x.png")).convert("RGB"),
               r6b=Image.open(os.path.join(HERE, f"{name}-1x.png")).convert("RGB"))
    panels = []
    for key in ("concept", "r6", "r6b"):
        p = Image.new("RGB", (2 * hw * z, 3 * 2 * hh * z + 2 * 16), (18, 20, 26))
        for i, (x, y) in enumerate(CHIM[key]):
            box = (x - hw, y - hh, x + hw, y + hh)
            if key == "concept":
                t = c.crop((int(box[0] / 0.5625), int(box[1] / 0.5156), int(box[2] / 0.5625), int(box[3] / 0.5156))).resize((2 * hw * z, 2 * hh * z), Image.LANCZOS)
            else: t = ims[key].crop(box).resize((2 * hw * z, 2 * hh * z), Image.NEAREST)
            p.paste(t, (0, i * (2 * hh * z + 16)))
        panels.append(p)
    b4.label_sheet(panels, ["AI concept", "B r6 at 8x", "B r6b at 8x"], path, 26)

if __name__ == "__main__":
    P = int(sys.argv[1]) if len(sys.argv) > 1 else 48
    b3.TIER = 48 if P >= 48 else 32
    img = bake(S, P); name = f"b-r6b-{P}px"
    files = save_set(img, name, HERE, P, os.path.join(HERE, "../../styles/b-hd-pixel.jpg"), f"B r6b: code bake at {P} px/tile", scale_to=4 * img.shape[1])
    b3.side_by_side(os.path.join(HERE, f"../b-r6/b-r6-{P}px-4x.png"), os.path.join(HERE, f"{name}-4x.png"), f"B r6 at {P} px",
                    f"B r6b at {P} px (concept chimneys)", os.path.join(HERE, f"{name}-vs-r6.png"))
    files.append(f"{name}-vs-r6.png")
    if P == 48: chimney_sheet(name, os.path.join(HERE, "b-r6b-chimneys-closeup.png")); files.append("b-r6b-chimneys-closeup.png")
    print(files)
