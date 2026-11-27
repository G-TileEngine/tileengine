"""B r6 (CEO 07:54 on r5): trees stay as r5, the knight is parked (the cozy game's player will be an alchemist), and the
crate and barrel beside the house are redrawn so they stand up as solid objects in the three-quarter top-down view.
Prop rules, from the usual top-down pixel prop conventions (A Link to the Past / Minish Cap pots and crates, Stardew
Valley and RPG Maker crates and barrels): a visible top face (crate lid, barrel's elliptical top with its rim), a darker
front face, side shading from the top-left sun (lit left edge, darker right side), a dark seam under the lid lip,
ambient occlusion at the base and a grounded contact shadow cast to the lower right. The barrel gets curved staves
(seams spaced by angle, so they bunch toward the edges) and iron hoops that sag into arcs and stand proud of the outline.
Everything else is B r5. Usage: python3 style_b6.py [48|32]   (48 also writes the prop close-up sheet)"""
import sys, os, numpy as np
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, ".."), os.path.join(HERE, "../b-r2"), os.path.join(HERE, "../b-r3"), os.path.join(HERE, "../b-r3b"),
                os.path.join(HERE, "../b-r4"), os.path.join(HERE, "../b-r5")]
import style_b5 as b5, style_b4 as b4, style_b3 as b3
from common import *
import engine, recipes
from engine import bake
S, R = b5.S, b3.R

def _spr(Mg, St, k, footx=None):
    """grid of (material, step) -> sprite with its foot at bottom-centre; steps are locked exact by colourise3"""
    H, W = St.shape; footx = W / 2 if footx is None else footx            # 1 px margin all round so the outline fits
    s = Spr((W + 2) / k, (H + 2) / k, (footx + 1) / k, (H + 1) / k, k); s.step = np.full(s.mat.shape, -1, np.int16)
    for y in range(H):
        for x in range(W):
            m = Mg[y][x]
            if not m: continue
            n = len(R[m]); st = int(np.clip(St[y, x], 0, n - 1))
            s.mat[y + 1, x + 1] = s.mid(m); s.sh[y + 1, x + 1] = st / (n - 1); s.step[y + 1, x + 1] = st
    return s

# ---- crate: lid (top face) with a raised frame and a diagonal brace, front face with an X brace -----------------------
def crate_grid(T):
    f = T / 48; W, Ht, Hf = (25, 17, 21) if T == 48 else (17, 11, 14); b = 2 if T == 48 else 1
    H = Ht + Hf; M = [["crate"] * W for _ in range(H)]; St = np.zeros((H, W), int)
    # top face: brightest. Frame lit on its top and left, a step lower on the right; the front lip catches the light.
    for y in range(Ht):
        for x in range(W):
            frame = y < b or x < b or x >= W - b or y >= Ht - b
            if frame: st = 5 if (y < b or x < b or y >= Ht - b) else 4
            else:
                st = 3
                if y == b or x == b: st = 2                                          # the raised frame shades the panel's top-left
                ix, iy = x - b, y - b; iw, ih = W - 2 * b, Ht - 2 * b               # diagonal brace, lit top, shadow under
                dd = iy - ix * (ih / iw)
                if -1.0 * (b) <= dd < 0.4: st = 4
                elif 0.4 <= dd < 1.4: st = 2
                elif (iy % (4 if T == 48 else 3)) == 3 and st == 3: st = 2          # plank seams
            St[y, x] = st
    # seam under the lip, then the front face: a step or two darker, frame lit on the left, dark on the right, AO at the base
    for y in range(Ht, H):
        fy = y - Ht
        for x in range(W):
            if fy == 0: St[y, x] = 0; continue
            frame = fy <= b or x < b or x >= W - b or fy >= Hf - b
            if frame: st = 4 if x < b else 2 if x >= W - b else 1 if fy >= Hf - b else 3
            else:
                ix, iy = (x - b) / (W - 2 * b - 1), (fy - b - 1) / (Hf - 2 * b - 2)
                st = 1
                if (fy - b) % (5 if T == 48 else 4) == 0: st = 0                        # plank seams
                for d in (ix - iy, ix - (1 - iy)):                                    # X brace: lit plank with its shadow
                    w = (2.2 if T == 48 else 1.6) / (W - 2 * b)
                    if abs(d) < w * 0.75: st = 3
                    elif w * 0.75 <= d < w * 1.5 and st != 3: st = 0
            if x >= W - 3 * b - (1 if T == 48 else 0) and not (x >= W - b): st -= 1          # side falling out of the sun
            St[y, x] = st
    # steel nails at the front frame corners and the lid corners (48 only)
    if T == 48:
        for (y, x) in ((Ht + 2, 1), (Ht + 2, W - 2), (H - 2, 1), (H - 2, W - 2), (1, 1), (1, W - 2)):
            M[y][x] = "steel8"; St[y, x] = 5 if x < W / 2 else 3
    return M, St

def crate6(k, S):
    M, St = crate_grid(b3.TIER); s = _spr(M, St, k); w = St.shape[1] / k / 2
    return s, [("e", 1.6, -0.3, w + 1.6, 2.4), ("p", [(w - 0.4, 0.4), (w + 2.6, -0.2), (w + 2.6, -5.0), (w - 0.4, -6.4)])]

# ---- barrel: elliptical top (rim ring + recessed lid), bulged body with curved staves, iron hoops ------------------------
def barrel_grid(T):
    if T == 48: W, H, rxt, ryt, ryb, hoopw = 21, 29, 8.6, 4.4, 3.4, 2
    else: W, H, rxt, ryt, ryb, hoopw = 15, 20, 6.1, 3.1, 2.4, 1
    cx = W / 2; bulge = (W / 2 - 1) - rxt; yt = ryt + 0.1; yb = H - ryb - 0.1
    wy = lambda py: rxt + bulge * np.sin(np.pi * np.clip((py - yt) / (yb - yt), 0, 1))
    M = [[None] * W for _ in range(H)]; St = np.zeros((H, W), int)
    seams = np.sin(np.radians([-60, -30, 0, 30, 60]))
    hoops = [(yt + (yb - yt) * t) for t in ((0.16, 0.78) if T == 32 else (0.14, 0.5, 0.82))]
    for y in range(H):
        for x in range(W):
            px, py = x + 0.5, y + 0.5
            et = ((px - cx) / rxt) ** 2 + ((py - yt) / ryt) ** 2
            if et <= 1.0:                                                            # top face
                r = np.sqrt(et); ang = np.arctan2(py - yt, px - cx)
                if r > (0.66 if T == 48 else 0.6):                                  # rim ring: near lip brightest, right side darker
                    st = 5 if (py > yt and px < cx + rxt * 0.5) else 4 if px < cx + rxt * 0.45 else 3
                else:
                    st = 3
                    if (py - yt) < -ryt * 0.28 or (px - cx) < -rxt * 0.4: st = 2     # far rim shades the recessed lid
                    if T == 48 and abs(px - cx) % 4.0 < 0.9 and abs(px - cx) > 0.5: st -= 1   # lid planks
                M[y][x] = "barrel"; St[y, x] = st; continue
            w = wy(py); ryh = ryt * w / rxt; nx = (px - cx) / w
            inbody = (py > yt and py <= yb and abs(nx) <= 1.0) or (py > yb and ((px - cx) / w) ** 2 + ((py - yb) / ryb) ** 2 <= 1.0)
            onhoop = None
            for hy in hoops:                                                          # hoops sag into arcs: front of a horizontal ring
                nn = np.clip((px - cx) / (w + 0.6), -1, 1); yc = hy + ryh * np.sqrt(1 - nn * nn)
                if yc - hoopw / 2 <= py < yc + hoopw / 2 and abs(px - cx) <= w + 0.6: onhoop = (py - (yc - hoopw / 2)) < 1.0
            if not inbody and onhoop is None: continue
            nx = np.clip(nx, -1, 1); s = 0.5 + 0.5 * (-0.6 * nx + 0.8 * np.sqrt(1 - nx * nx))
            if onhoop is not None:
                M[y][x] = "steel8"; St[y, x] = int(np.clip(round(0.4 + s * 3.2), 1, 4)) + (1 if onhoop else 0); continue
            st = int(np.clip(round(s * 4.6 - 0.4), 1, 5))
            if np.min(np.abs(nx - seams)) < 0.55 / w: st -= 1                          # stave seams, bunched toward the edges
            ytop = yt + ryt * np.sqrt(max(0, 1 - ((px - cx) / rxt) ** 2))
            if py - ytop < 1.0: st -= 1                                              # shadow under the rim lip
            if py > yb + ryb * np.sqrt(max(0, 1 - nx * nx)) - 1.6: st -= 1            # ambient occlusion at the base
            M[y][x] = "barrel"; St[y, x] = st
    return M, St

def barrel6(k, S):
    M, St = barrel_grid(b3.TIER); s = _spr(M, St, k); w = St.shape[1] / k / 2
    return s, [("e", 1.4, -0.5, w + 1.2, 2.2), ("p", [(w - 0.8, 0.2), (w + 2.0, -0.6), (w + 1.6, -5.0), (w - 1.2, -6.0)])]

recipes.BUILD.update(crate=crate6, barrel=barrel6)
# give the crate a little air from the house wall (it overlapped the wall in r5), as in the concept
engine.ITEMS[:] = [(kd, u + (0.12 if kd == "crate" else 0.0), v, kw) for kd, u, v, kw in engine.ITEMS]

CROP = (280, 116, 352, 194)     # stage px around the crate and barrel (72 x 78)
def prop_sheet(name, path):
    z = 8; cw, ch = (CROP[2] - CROP[0]) * z, (CROP[3] - CROP[1]) * z
    c = Image.open(os.path.join(HERE, "../../styles/b-hd-pixel.jpg")).convert("RGB")
    cc = c.crop((int(CROP[0] / 0.5625), int(CROP[1] / 0.5156), int(CROP[2] / 0.5625), int(CROP[3] / 0.5156))).resize((cw, ch), Image.LANCZOS)
    a = Image.open(os.path.join(HERE, "../b-r5/b-r5-48px-1x.png")).convert("RGB").crop(CROP).resize((cw, ch), Image.NEAREST)
    b = Image.open(os.path.join(HERE, f"{name}-1x.png")).convert("RGB").crop(CROP).resize((cw, ch), Image.NEAREST)
    b4.label_sheet([cc, a, b], ["AI concept (reference)", "B r5, 48 px at 8x (flat)", "B r6, 48 px at 8x"], path, 26)

if __name__ == "__main__":
    P = int(sys.argv[1]) if len(sys.argv) > 1 else 48
    b3.TIER = 48 if P >= 48 else 32
    img = bake(S, P); name = f"b-r6-{P}px"
    files = save_set(img, name, HERE, P, os.path.join(HERE, "../../styles/b-hd-pixel.jpg"), f"B r6: code bake at {P} px/tile", scale_to=4 * img.shape[1])
    b3.side_by_side(os.path.join(HERE, f"../b-r5/b-r5-{P}px-4x.png"), os.path.join(HERE, f"{name}-4x.png"), f"B r5 at {P} px",
                    f"B r6 at {P} px (standing crate and barrel)", os.path.join(HERE, f"{name}-vs-r5.png"))
    files.append(f"{name}-vs-r5.png")
    if P == 48: prop_sheet(name, os.path.join(HERE, "b-r6-props-closeup.png")); files.append("b-r6-props-closeup.png")
    print(files)
