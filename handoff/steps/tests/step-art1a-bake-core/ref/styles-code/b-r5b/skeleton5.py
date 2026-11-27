"""B r5 structure first (CEO 07:40). Every knight pose starts as a stick skeleton with fixed bone lengths, and the armour
is then hung on its joints. Knees and elbows come from two-bone IK, so limbs never stretch or shrink between poses. A
balance check keeps the centre of mass over the feet. Sources: the classic animation guides, Richard Williams' The
Animator's Survival Kit (walk keys contact, down, passing, up; weight shift) and Preston Blair's Cartoon Animation (line
of action, balance, contrapposto). The guard is a standard sword-and-shield ready stance (weight low and centred, lead
foot forward, sword chambered at the shoulder, like the longsword 'vom Tag' guard).
Units are model px at 48 px tiles (y up, x screen right, z toward the viewer)."""
import numpy as np

THIGH, SHIN = 6.9, 6.9            # hip -> knee -> ankle (straight leg 13.8 vs a standing hip height of 13.3: soft knees)
UPPER, FORE = 6.8, 6.6            # shoulder -> elbow -> hand
HIP_W, SH_W = 4.4, 10.2
ANKLE_Y = 3.2

def nrm(v): v = np.asarray(v, float); return v / np.linalg.norm(v)
def rotZ(a):
    c, s = np.cos(a), np.sin(a); return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])

def ik2(a, t, l1, l2, pole):
    """two-bone IK: joint between root a and target t with fixed bone lengths, bent toward pole. Returns (joint, end, reached)"""
    a, t = np.asarray(a, float), np.asarray(t, float); d = np.linalg.norm(t - a); reach = l1 + l2 - 1e-3
    ok = d <= reach
    if not ok: t = a + (t - a) / d * reach; d = reach
    u = (t - a) / d; x = (l1 * l1 - l2 * l2 + d * d) / (2 * d); h = np.sqrt(max(l1 * l1 - x * x, 0.0))
    p = np.asarray(pole, float); w = p - (p @ u) * u
    w = nrm(w) if np.linalg.norm(w) > 1e-6 else nrm(np.cross(u, [1.0, 0, 0]))
    return a + u * x + w * h, t, ok

# pose guides (body space, before the body turn): pelvis, pelvis roll, shoulder roll (counter), chest lean, feet, hands
GUIDES = {
    "A": dict(src="r3b pose kept on purpose (symmetric, square stance) to isolate the shading question",
              yaw=0.0, pelvis=(0, 17.5, 0), proll=0.0, sroll=0.0, lean=(0, 0), head=0.0,
              feet=((-4.6, 0.5), (4.6, 0.5)), hands=((-13.2, 21.0, 2.0), (13.4, 20.5, 2.5)),
              shield=(-2.2, 2.0, 1.4), sword=(0, 1, 0.05)),
    "B": dict(src="contrapposto relaxed stance (Blair: weight on one leg, hips and shoulders tilt opposite ways)",
              yaw=-0.55, pelvis=(1.1, 17.2, 0.2), proll=0.07, sroll=-0.05, lean=(0, 0.6), head=0.0,
              feet=((-5.4, 3.0), (4.4, -1.6)), hands=((-6.4, 24.6, 9.2), (13.2, 19.8, 3.0)),
              shield=(1.4, 0.2, 2.2), sword=(0.75, -1, 0.35)),
    "C": dict(src="sword-and-shield guard ('vom Tag' chamber): weight low and centred, lead foot forward, knees bent",
              yaw=-0.45, pelvis=(0.2, 15.4, 0.3), proll=0.0, sroll=0.03, lean=(0.4, 1.4), head=0.0,
              feet=((-7.0, 4.6), (6.6, -3.8)), hands=((-6.4, 24.2, 10.6), (11.8, 35.0, 4.6)),
              shield=(1.4, 0.4, 2.2), sword=(0.45, 1, -0.3)),
    "D": dict(src="contrapposto ready stance (Blair), sword grounded upright like the concept knight",
              yaw=-0.5, pelvis=(1.0, 17.2, 0.1), proll=0.07, sroll=-0.05, lean=(0, 0.5), head=0.12,
              feet=((-5.6, 3.0), (5.2, -2.0)), hands=((-6.6, 24.6, 9.2), (15.0, 21.6, 5.0)),
              shield=(1.4, 0.0, 2.2), sword=(0.1, 1, 0.12)),
}

def skeleton(name):
    G = GUIDES[name]; J = {}; pel = np.array(G["pelvis"], float); J["pelvis"] = pel
    R = rotZ(G["proll"]); J["hipL"] = pel + R @ [-HIP_W, -1.0, 0]; J["hipR"] = pel + R @ [HIP_W, -1.0, 0]
    reached = {}
    for s, ft in (("L", G["feet"][0]), ("R", G["feet"][1])):
        fx, fz = ft[0], ft[1]; fy = ft[2] if len(ft) > 2 else ANKLE_Y          # optional lift (walk keys)
        hip = J["hip" + s]; ank = np.array([fx, fy, fz]); pole = [(-1 if s == "L" else 1) * 0.25, 0, 1.0]
        J["knee" + s], J["ankle" + s], reached["leg" + s] = ik2(hip, ank, THIGH, SHIN, pole)
    lx, lz = G["lean"]; chest = pel + np.array([lx, 11.1, lz]); J["chest"] = chest
    Rs = rotZ(G["sroll"]); J["neck"] = chest + Rs @ [0, 7.4, -0.4]
    J["shL"] = chest + Rs @ [-SH_W, 4.4, -0.4]; J["shR"] = chest + Rs @ [SH_W, 4.4, -0.4]
    J["head"] = J["neck"] + np.array([0, 9.6, 1.0])
    for s, h in (("L", G["hands"][0]), ("R", G["hands"][1])):
        pole = [(-1 if s == "L" else 1) * 1.0, -0.4, -0.5]
        J["elbow" + s], J["hand" + s], reached["arm" + s] = ik2(J["sh" + s], h, UPPER, FORE, pole)
    J["shield"] = J["handL"] + np.array(G["shield"]); J["_reached"] = reached
    return J

def com(J):
    """centre of mass from rough segment weights (head and helm, torso, limbs, shield and sword)"""
    W = [("head", .13), ("chest", .30), ("pelvis", .12), ("shield", .05), ("handR", .03)]
    pts = [J[k] * w for k, w in W]; tot = sum(w for _, w in W)
    for s in "LR":
        for a, b, w in (("sh", "elbow", .025), ("elbow", "hand", .025), ("hip", "knee", .09), ("knee", "ankle", .05)):
            pts.append((J[a + s] + J[b + s]) / 2 * w); tot += w
    return sum(pts) / tot

def support(J):
    """ground-plane (x, z) corners of both feet (sabaton about 5 wide, heel -2, toe +5), and their convex hull"""
    c = []
    for s in "LR":
        ax, ay, az = J["ankle" + s]
        if ay > 4.8: continue                                  # a lifted foot carries no weight
        c += [(ax - 2.5, az - 2.0), (ax + 2.5, az - 2.0), (ax + 2.5, az + 5.0), (ax - 2.5, az + 5.0)]
    pts = sorted(set(c))
    def cross(o, a, b): return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    lo, hi = [], []
    for p in pts:
        while len(lo) >= 2 and cross(lo[-2], lo[-1], p) <= 0: lo.pop()
        lo.append(p)
    for p in reversed(pts):
        while len(hi) >= 2 and cross(hi[-2], hi[-1], p) <= 0: hi.pop()
        hi.append(p)
    return lo[:-1] + hi[:-1]

def balance(J):
    """signed distance (model px) from the centre of mass, dropped to the ground, to the edge of the support base. > 0 is stable"""
    m = com(J); p = np.array([m[0], m[2]]); hull = [np.array(h) for h in support(J)]; d = 1e9; inside = True
    for i in range(len(hull)):
        a, b = hull[i], hull[(i + 1) % len(hull)]; e = b - a; n = np.array([e[1], -e[0]]) / np.linalg.norm(e)
        s = (p - a) @ n; inside &= s <= 0; d = min(d, abs(s))
    return d if inside else -d

# walk keys (Williams, The Animator's Survival Kit): contact, down, passing, up; body space, walking toward +z.
# Hip height bobs: down is lowest (weight lands on the bent front leg), up is highest (push off the back toe).
# The pelvis shifts sideways over the support foot on the single-support keys (weight shift). Arms swing against the legs; the shield arm stays carried, so only the sword arm swings. Seen in profile for the guide.
WALK = {
    "contact": dict(pelvis=(0, 16.9, 0.0), feet=((-2.2, 5.6, 3.6), (2.2, -5.4, 4.2)), hands=((-6.4, 24.6, 9.2), (12.6, 21.0, -4.0))),
    "down":    dict(pelvis=(-1.8, 15.9, 0.6), feet=((-2.2, 4.4), (2.2, -5.8, 4.6)), hands=((-6.4, 24.0, 9.2), (12.8, 21.0, -2.6))),
    "passing": dict(pelvis=(-2.0, 16.8, 0.6), feet=((-2.2, 0.8), (2.2, 0.2, 6.6)), hands=((-6.4, 24.4, 9.2), (13.2, 20.6, 1.0))),
    "up":      dict(pelvis=(-1.8, 17.6, 1.2), feet=((-2.2, -2.6, 4.0), (2.2, 6.2, 5.6)), hands=((-6.4, 25.0, 9.4), (12.8, 21.2, 4.4))),
}
for _k, _v in WALK.items():
    GUIDES["walk_" + _k] = dict(src="walk key '%s' (Williams)" % _k, yaw=-1.45, proll=0.0, sroll=0.0, lean=(0, 0.8), head=0.0,
                                shield=(1.4, 0.0, 2.2), sword=(0.1, -1, 0.5), dynamic=(_k == "up"), **_v)
# 'up' is meant to tip forward: the push-off throws the body into the next contact (a walk is a controlled fall)

if __name__ == "__main__":
    for k in GUIDES:
        J = skeleton(k); print(k, "balance margin %.2f px" % balance(J), J["_reached"])
