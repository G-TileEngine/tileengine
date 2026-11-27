"""B r5b = B r5 with the knight rebuilt structure first (CEO 07:40): skeleton5.py poses, IK limbs, balance check.
B r5 (CEO 07:38 feedback on r3b/r4): round full oak crowns like the concept (the flame tip stays on roofs and the
crest only), a new knight with polished-steel shading and a concept-like pose, and light shafts kept to the ground and
trees (never on units, houses or props). Everything else is B r4 (Ember Dusk palette, forest floor, far-tree haze).
Usage: python3 style_b5.py [48|32]    (48 is the main bake; 48 also writes the pose study and the knight close-up)"""
import sys, os, numpy as np
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path[:0] = [os.path.join(HERE, ".."), os.path.join(HERE, "../b-r2"), os.path.join(HERE, "../b-r3"), os.path.join(HERE, "../b-r3b"),
                os.path.join(HERE, "../b-r4"), HERE]
import style_b4 as b4, style_b3b as b3b, style_b3 as b3
from common import *
import engine, recipes, stamps as ST
import knight5_grids as KG
from engine import bake
put, R, light_shift = b3.put, b3.R, b3.light_shift

KNIGHT_POSE = "D"            # the pick from the pose study
R["steel8"] = ramp_of(["#18161f", "#2c2c3a", "#454857", "#646876", "#878b97", "#acb0b9", "#d7d9dd", "#fbf8f0"])   # near-neutral silver with a real glint step

# ---- knight: frozen pixels from the model bake --------------------------------------------------------------------------
LEG = {}
for m, s in (("gold", "xyYZ"), ("plume", "abcd"), ("leather", "lLmM")):
    for i, ch in enumerate(s): LEG[ch] = (m, i)
def knight5(k, S, team="blue", pose=None):
    T = b3.TIER; g = KG.GRIDS[(pose or KNIGHT_POSE, T)]; h, w = len(g), len(g[0])
    rows = [y for y, r in enumerate(g) if r.strip(".")]; footy = rows[-1] + 1; footx = 27 if T == 48 else 19
    s = Spr(w / k, (footy + 1) / k, footx / k, footy / k, k)
    leg = dict(LEG); leg.update({ch: ("team_" + team, i) for i, ch in enumerate("ABCDE")})
    put(s, 0, 0, g[:footy + 1], mat="steel8", legend=leg)
    return s, [("e", 0.6, -0.4, 8.6, 2.6)]

# ---- round oaks: full round crown, lobed edge, no flame tip --------------------------------------------------------------
def tree5(k, S, seed=1, sc=1.0):
    T = b3.TIER
    s = Spr(40 * sc + 6, 58 * sc + 6, 0, 0, k); ox, oy = s.W / k / 2, s.H / k - 3
    s.ax, s.ay = ox, oy; F = lambda x, y: (x + ox, y + oy); rs = np.random.default_rng(seed)
    bark = lambda X, Y, nx, ny: 0.8 - nx * 0.6 + 0.1 * (vnoise(X * 3, Y * 0.6, 1, seed) - 0.5)
    tw = 2.7 * sc
    x0, y0 = F(-tw, -14 * sc); x1, y1 = F(tw, 0.5); s.rect(x0, y0, x1, y1, "bark", bark)
    for sd in (-1, 1):
        a, b = F(sd * tw - (1.8 if sd < 0 else 0) * sc, -2.4 * sc); c, d = F(sd * tw + (1.8 if sd > 0 else 0) * sc, 0.5)
        s.rect(a, b, c, d, "bark", 0.38 if sd > 0 else 0.62)
    rx, ry = 16.0 * sc, 17.5 * sc; cx, cy = F(0, -(10.5 * sc + ry))
    ang = np.arctan2(s.Y - cy, s.X - cx); lob = 1 + 0.07 * np.cos(ang * 5 + seed) + 0.03 * np.cos(ang * 9 + seed * 2)
    gy = (s.Y - cy) / ry; gx = (s.X - cx) / rx; body = (gx * gx + gy * gy) <= lob * lob     # round crown, soft oak lobes
    g = sphere(np.clip(gx, -1, 1), np.clip(gy, -1, 1) * 0.9)
    s._put(body, "leaf", 0.04 + 0.3 * g - 0.12 * sstep(0.2, 1.0, gy))
    pts = []; gap = (6.2 if T == 32 else 5.6) * sc
    for j, yy in enumerate(np.arange(-ry * 0.86, ry * 0.92, gap * 0.8)):
        off = (j % 2) * gap * 0.5
        for xx in np.arange(-rx - off, rx + 0.01, gap):
            x = xx + (rs.random() - 0.5) * 1.4; y = yy + (rs.random() - 0.5) * 1.2
            if (x / (rx * 0.86)) ** 2 + (y / (ry * 0.88)) ** 2 <= 1.0: pts.append((x, y))
    pts.sort(key=lambda p: p[1]); L = ST.LEAF[T]
    for x, y in pts:
        b3.put_c(s, cx + x, cy + y, L[rs.integers(len(L))], mat="leaf", flip=bool(rs.random() < 0.5), shift=light_shift(x, y, rx, ry))
    Tt = ST.TUFT[T]
    for th in np.linspace(np.pi * 1.06, np.pi * 1.94, 9):
        yy = ry * np.sin(th); xx = rx * np.cos(th); t = Tt[rs.integers(len(Tt))]
        put(s, int(round((cx + xx) * s.k - len(t[0]) / 2)), int(round((cy + yy) * s.k)) - len(t) + 1, t, mat="leaf",
            flip=bool(rs.random() < 0.5), shift=light_shift(xx, yy, rx, ry))
    return s, [("e", 11 * sc, -3.5 * sc, 16.5 * sc, 8 * sc)]

recipes.BUILD.update(tree=tree5, knight=knight5)

# ---- light shafts only on ground and trees -------------------------------------------------------------------------------
_build4 = engine.build_items
LAST = {}
def build_items5(S, k):
    out = _build4(S, k); LAST["items"] = out; return out
engine.build_items = build_items5

def shaft_ok(P, H, W):
    """True where the top-most thing is ground or a tree (draw order as in engine.bake)"""
    ok = np.ones((H, W), bool)
    for kind, uu, vv, spr, sh in sorted(LAST["items"], key=lambda t: (t[2], t[1])):
        a = spr.mat >= 0; a = a | np.roll(a, 1, 0) | np.roll(a, -1, 0) | np.roll(a, 1, 1) | np.roll(a, -1, 1)   # with outline
        fx, fy = place_xy(uu, vv, P); x0 = int(round(fx - spr.ax * spr.k)); y0 = int(round(fy - spr.ay * spr.k))
        hh, ww = a.shape; X0, Y0 = max(x0, 0), max(y0, 0); X1, Y1 = min(x0 + ww, W), min(y0 + hh, H)
        if X1 <= X0 or Y1 <= Y0: continue
        sub = a[Y0 - y0:Y1 - y0, X0 - x0:X1 - x0]; ok[Y0:Y1, X0:X1][sub] = kind == "tree"
    return ok

def grade5(img, u, v, P):
    img = b3b.S["grade"](img, u, v, P)
    H, W = u.shape; yy, xx = np.indices((H, W))
    on = ((b4.BAYER[yy % 4, xx % 4] < b4.shafts(u, v)) & shaft_ok(P, H, W))[..., None]
    return np.where(on, img * 1.05 + np.array([30, 22, 4]), img)

S = dict(b4.S); S.update(grade=grade5)

# ---- sheets ---------------------------------------------------------------------------------------------------------------
FNT = lambda n: ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", n)
def sprite_rgba(spr):
    rgb, a = engine.colourise(S, spr); out = np.zeros(a.shape + (4,), np.uint8)
    out[..., :3] = np.clip(np.rint(rgb), 0, 255); out[..., 3] = (a > 0.5) * 255; return Image.fromarray(out, "RGBA")

import guides5
def pose_sheet(bg, path):
    """structure first: each pose's stick guide (skeleton, balance, line of action) above its filled pixels at 8x, then
    1x and 2x; the concept knight and the r5 hand-set pick (before) for reference"""
    k = 48 / 32 * S["scale"]["knight"]; fx, fy = 36, 66
    poses = [("A", "A: r3b pose kept (shading only)"), ("B", "B: 3/4 turn, contrapposto"),
             ("C", "C: guard (vom Tag), knees bent"), ("D", "D: pick, contrapposto, sword up")]
    tiles = []
    for p, _ in poses:
        spr, _s = knight5(k, S, "blue", p); im = sprite_rgba(spr); t = bg.copy()
        t.alpha_composite(im, (int(round(fx - spr.ax * spr.k)), int(round(fy - spr.ay * spr.k)))); tiles.append(t.convert("RGB"))
    cc = Image.open(os.path.join(HERE, "../../styles/b-hd-pixel.jpg")).convert("RGB").crop((400, 470, 532, 610))
    cc = cc.resize((int(cc.width * 0.5625 * 8), int(cc.height * 0.5156 * 8)), Image.NEAREST)   # concept px -> stage px -> 8x
    r5 = Image.open(os.path.join(HERE, "../b-r5/b-r5-knight-poses.png")).convert("RGB")       # r5 sheet: D is the 6th column
    pad, bar = 24, 60; cw = 72 * 8
    r5d = r5.crop((pad + (cw + pad) * 5, bar, pad + (cw + pad) * 5 + cw, bar + cw))
    W = pad + (cw + pad) * 6; H = bar + cw + 50 + cw + 40 + 72 * 2 + pad + 40
    sh = Image.new("RGB", (W, H), (18, 20, 26)); d = ImageDraw.Draw(sh); f = FNT(24); fs = FNT(20)
    x = pad
    for im, l in [(cc, "Concept knight (reference)"), (r5d, "B r5 pick D (before: hand-set)")]:
        sh.paste(im.crop((0, 0, cw, cw)) if im.width >= cw else im, (x, bar + cw + 50)); d.text((x, bar + cw + 18), l, fill=(228, 228, 236), font=f); x += cw + pad
    d.text((pad, 18), "Step 1, structure: stick guide per pose (fixed bone lengths, IK knees and elbows, centre of mass over the feet)", fill=(228, 228, 236), font=f)
    d.text((pad, bar + 10), "Teal = screen-left limbs, orange = screen-right, purple = line of action,", fill=(170, 175, 190), font=fs)
    d.text((pad, bar + 36), "green base + plumb line = weight over the feet.", fill=(170, 175, 190), font=fs)
    x = pad + (cw + pad) * 2
    for (p, l), t in zip(poses, tiles):
        sh.paste(guides5.draw_guide(p, cw, fx, fy, 8, font=fs), (x, bar))
        d.text((x, bar + cw + 18), l, fill=(228, 228, 236), font=f); sh.paste(t.resize((cw, cw), Image.NEAREST), (x, bar + cw + 50)); x += cw + pad
    y = bar + cw + 50 + cw + 40; d.text((pad, y - 30), "Step 2, pixels filled on the guide. Actual size at 48 px tiles (1x) and 2x, same order:", fill=(200, 200, 210), font=f)
    x = pad
    small = [Image.open(os.path.join(HERE, "../../styles/b-hd-pixel.jpg")).convert("RGB").crop((400, 470, 532, 610)).resize((74, 72), Image.LANCZOS),
             r5d.resize((72, 72), Image.BOX)] + tiles
    for im in small:
        sh.paste(im, (x, y)); sh.paste(im.resize((im.width * 2, im.height * 2), Image.NEAREST), (x + 84, y)); x += cw + pad
    sh.save(path, optimize=True)

def walk_sheet(path):
    """walk key poses (Williams: contact, down, passing, up), stick guides only, in profile"""
    keys = ["contact", "down", "passing", "up"]; pad, bar, cw = 24, 96, 576; fs = FNT(20); f = FNT(24)
    W = pad + (cw + pad) * 4; H = bar + cw + 60 + 220
    sh = Image.new("RGB", (W, H), (18, 20, 26)); d = ImageDraw.Draw(sh)
    d.text((pad, 14), "Walk key poses, structure only (The Animator's Survival Kit): contact, down, passing, up. Pixels come later, on these.", fill=(228, 228, 236), font=f)
    d.text((pad, 48), "Shown in profile. Hips bob: down lowest, up highest. Weight shifts over the support foot; 'up' tips forward into the next contact.", fill=(170, 175, 190), font=fs)
    hy = []
    for i, kk in enumerate(keys):
        x = pad + (cw + pad) * i; sh.paste(guides5.draw_guide("walk_" + kk, cw, 36, 66, 8, font=fs), (x, bar))
        d.text((x, bar + cw + 14), f"{i + 1}. {kk}", fill=(228, 228, 236), font=f); hy.append(guides5.SK.skeleton("walk_" + kk)["pelvis"][1])
    # hip height curve across the four keys and back to contact
    y0 = bar + cw + 60; gx = [pad + (cw + pad) * i + cw // 2 for i in range(4)] + [W - pad - 70]; vals = hy + [hy[0]]
    lo, hi = min(vals) - 0.5, max(vals) + 0.5; gy = [y0 + 180 - (v - lo) / (hi - lo) * 160 for v in vals]
    d.line(list(zip(gx, gy)), fill=(170, 120, 230), width=4)
    for X, Y_, v in zip(gx, gy, vals): d.ellipse([X - 7, Y_ - 7, X + 7, Y_ + 7], fill=(250, 220, 90)); d.text((X + 12, Y_ - 12), "%.1f" % v, fill=(220, 220, 230), font=fs)
    d.text((pad, y0 + 4), "hip height (model px)", fill=(170, 175, 190), font=fs)
    sh.save(path, optimize=True)

def closeup(path, name):
    box = (248, 248, 322, 322); f = FNT(26)
    cc = Image.open(os.path.join(HERE, "../../styles/b-hd-pixel.jpg")).convert("RGB").crop((418, 470, 548, 600)).resize((592, 592), Image.NEAREST)
    a = Image.open(os.path.join(HERE, "../b-r3b/b-r3b-48px-1x.png")).convert("RGB").crop(box).resize((592, 592), Image.NEAREST)
    b = Image.open(os.path.join(HERE, f"{name}-1x.png")).convert("RGB").crop(box).resize((592, 592), Image.NEAREST)
    b4.label_sheet([cc, a, b], ["AI concept knight (reference)", "B r3b, 48 px at 8x", "B r5b, 48 px at 8x"], path, 26)

if __name__ == "__main__":
    P = int(sys.argv[1]) if len(sys.argv) > 1 else 48
    b3.TIER = 48 if P >= 48 else 32
    img = bake(S, P); name = f"b-r5b-{P}px"
    files = save_set(img, name, HERE, P, os.path.join(HERE, "../../styles/b-hd-pixel.jpg"),
                     f"B r5b: code bake at {P} px/tile", scale_to=4 * img.shape[1])
    b3.side_by_side(os.path.join(HERE, f"../b-r4/b-r4-{P}px-4x.png"), os.path.join(HERE, f"{name}-4x.png"), f"B r4 at {P} px",
                    f"B r5b at {P} px (structure-first knight)", os.path.join(HERE, f"{name}-vs-r4.png"))
    files.append(f"{name}-vs-r4.png")
    if P == 48:
        closeup(os.path.join(HERE, "b-r5b-knight-closeup.png"), name); files.append("b-r5b-knight-closeup.png")
        engine.ITEMS[:] = [it for it in engine.ITEMS if it[0] != "knight"]          # clean ground patch for the pose study
        clean = np.clip(np.rint(bake(S, P)), 0, 255).astype(np.uint8)
        fx, fy = place_xy(5.55, 5.6, P); bgp = Image.fromarray(clean, "RGB").crop((int(fx) - 36, int(fy) - 66, int(fx) + 36, int(fy) + 6)).convert("RGBA")
        pose_sheet(bgp, os.path.join(HERE, "b-r5b-knight-poses.png")); files.append("b-r5b-knight-poses.png")
        walk_sheet(os.path.join(HERE, "b-r5b-walk-keys.png")); files.append("b-r5b-walk-keys.png")
    print(files)
