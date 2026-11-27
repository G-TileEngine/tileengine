"""Stick pose guides (the structure-first step): skeleton5 joints projected with the same camera as the knight bake,
drawn at 8x. Bones (screen-left limbs teal, screen-right limbs orange), head circle, sword and shield, the support base
on the ground (green when the centre of mass is over it), the plumb line from the centre of mass, and the line of action."""
import numpy as np
from PIL import Image, ImageDraw
import skeleton5 as SK, knight5 as K

def proj(J, yaw, fx, fy, z, scale=1.0):
    Y = K.rotY(yaw); V = K.rotX(K.PITCH)
    def f(p):
        v = V @ (Y @ np.asarray(p, float)); return (fx * z + v[0] * K.BUILD_XY[0] * scale * z, fy * z - v[1] * K.BUILD_XY[1] * scale * z)
    return f

def draw_guide(name, size=576, fx=36, fy=66, z=8, bg=(24, 26, 34), font=None, label=True):
    G = SK.GUIDES[name]; J = SK.skeleton(name); P = proj(J, G["yaw"], fx, fy, z)
    im = Image.new("RGB", (size, size), bg); d = ImageDraw.Draw(im)
    for gx in range(0, size, z * 8): d.line([(gx, 0), (gx, size)], fill=(32, 35, 45))
    for gy in range(0, size, z * 8): d.line([(0, gy), (size, gy)], fill=(32, 35, 45))
    m = SK.com(J); bal = SK.balance(J); ok = bal > 0
    hull = SK.support(J); d.polygon([P((x, 0, zz)) for x, zz in hull], fill=(30, 70, 46) if ok else (90, 30, 30), outline=(90, 220, 130) if ok else (240, 90, 90))
    for s in "LR":
        a = J["ankle" + s]; d.ellipse([*(np.array(P((a[0], 0, a[2]))) - 5), *(np.array(P((a[0], 0, a[2]))) + 5)], outline=(140, 150, 170))
    TEAL, ORNG, WHITE, YEL = (90, 210, 230), (255, 160, 70), (236, 236, 240), (250, 220, 90)
    L = lambda a, b, c, w=7: d.line([P(J[a]), P(J[b])], fill=c, width=w)
    # line of action: head -> chest -> pelvis -> the ankle carrying most weight (nearer the centre of mass on the ground)
    wa = min("LR", key=lambda s: np.hypot(J["ankle" + s][0] - m[0], J["ankle" + s][2] - m[2]))
    pts = [J["head"], J["chest"], J["pelvis"], J["ankle" + wa]]; ts = np.linspace(0, 1, 40)
    curve = [P(sum(c * w for c, w in zip(pts, [(1 - t) ** 3, 3 * t * (1 - t) ** 2, 3 * t * t * (1 - t), t ** 3]))) for t in ts]
    d.line(curve, fill=(170, 120, 230), width=4)
    # body
    for s, c in (("L", TEAL), ("R", ORNG)):
        L("hip" + s, "knee" + s, c); L("knee" + s, "ankle" + s, c); L("sh" + s, "elbow" + s, c, 6); L("elbow" + s, "hand" + s, c, 6)
    L("hipL", "hipR", WHITE, 5); L("shL", "shR", WHITE, 5); L("pelvis", "chest", WHITE, 7); L("chest", "neck", WHITE, 7); L("neck", "head", WHITE, 5)
    hc = np.array(P(J["head"])); r = 8.4 * K.BUILD_XY[0] * z; d.ellipse([*(hc - r), *(hc + r)], outline=WHITE, width=4)
    # sword and shield
    hd = J["handR"]; dv = SK.nrm(G["sword"]); d.line([P(hd - dv * 2.8), P(hd + dv * 24.5)], fill=(200, 205, 215), width=4)
    gu = np.cross(dv, [0, 0, 1.0]); gu = gu / (np.linalg.norm(gu) + 1e-9); d.line([P(hd + dv * 2.4 - gu * 3.8), P(hd + dv * 2.4 + gu * 3.8)], fill=(230, 190, 70), width=4)
    sc = J["shield"]; sn = SK.nrm([-0.15, 0.08, 1] if name != "A" else [0, 0, 1]); up = SK.nrm(np.array([0, 1.0, 0]) - sn[1] * sn); rt = np.cross(up, sn)
    d.line([P(sc + 8.8 * (np.cos(a) * rt + np.sin(a) * up)) for a in np.linspace(0, 2 * np.pi, 33)], fill=(120, 150, 255), width=4)
    for k in J:
        if k.startswith("_") or k == "shield": continue
        c = np.array(P(J[k])); d.ellipse([*(c - 6), *(c + 6)], fill=YEL if k in ("pelvis", "kneeL", "kneeR", "elbowL", "elbowR") else WHITE)
    # centre of mass and its plumb line to the ground
    cm, cg = np.array(P(m)), np.array(P((m[0], 0, m[2])))
    d.line([tuple(cm), tuple(cg)], fill=(90, 220, 130) if ok else (240, 90, 90), width=3)
    d.ellipse([*(cm - 9), *(cm + 9)], outline=(250, 250, 250), width=3); d.ellipse([*(cg - 7), *(cg + 7)], fill=(90, 220, 130) if ok else (240, 90, 90))
    if label and font is not None:
        if ok: msg, col = "balanced, margin %.1f px" % bal, (90, 220, 130)
        elif G.get("dynamic"): msg, col = "tips %.1f px forward into the next step" % -bal, (250, 220, 90)
        else: msg, col = "off balance by %.1f px" % -bal, (240, 90, 90)
        d.text((14, 12), msg, fill=col, font=font)
        d.text((14, 42), "hip height %.1f px" % J["pelvis"][1], fill=(200, 200, 210), font=font)
    return im
