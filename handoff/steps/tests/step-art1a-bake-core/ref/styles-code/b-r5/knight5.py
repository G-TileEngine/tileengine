"""B r5 knight: a small 3D model built from simple shapes (spheres, capsules, discs, boxes), baked straight to pixels at
48 px (and 32 px), then cleaned. Each pixel ends as one ramp step of one material, exactly like the hand stamps, and the
result is frozen to text grids (knight5_grids.py) so the art is exact pixels, not a live filter.
Why a model: a turned body, a shield brought across the chest and a raised sword need consistent perspective and metal
light on every plate, which a flat front-on stamp can't give. Metal uses a chrome rule: sky-lit top halves, a dark
horizon band, a ground bounce below and a hard specular glint, so the armour reads as polished steel, not grey cloth.
Offline research tool (numpy only); nothing here ships to the phone."""
import numpy as np

# ---------------------------------------------------------------- maths
def rotY(a):
    c, s = np.cos(a), np.sin(a); return np.array([[c, 0, s], [0, 1, 0], [-s, 0, c]])
def rotX(a):
    c, s = np.cos(a), np.sin(a); return np.array([[1, 0, 0], [0, c, -s], [0, s, c]])
def rotZ(a):
    c, s = np.cos(a), np.sin(a); return np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])
def nrm(v): v = np.asarray(v, float); return v / np.linalg.norm(v)

# primitives: each returns signed distance for points p (N,3) in character space (x right, y up, z toward viewer, px)
def sd_ell(p, c, r, M=np.eye(3)):
    q = (p - c) @ M; q = q / r; k0 = np.linalg.norm(q, axis=1); k1 = np.linalg.norm(q / r, axis=1)
    return k0 * (k0 - 1) / np.maximum(k1, 1e-6)
def sd_cap(p, a, b, ra, rb=None):
    rb = ra if rb is None else rb; a = np.asarray(a, float); b = np.asarray(b, float); ba = b - a
    h = np.clip(((p - a) @ ba) / (ba @ ba), 0, 1); return np.linalg.norm(p - a - h[:, None] * ba, axis=1) - (ra + (rb - ra) * h)
def sd_box(p, c, half, M=np.eye(3), rr=0.0):
    q = np.abs((p - c) @ M) - (np.asarray(half) - rr)
    return np.linalg.norm(np.maximum(q, 0), axis=1) + np.minimum(q.max(axis=1), 0) - rr
def sd_disc(p, c, n, r, th):
    n = nrm(n); d = p - c; h = d @ n; rad = np.linalg.norm(d - h[:, None] * n, axis=1)
    q = np.stack([rad - r, np.abs(h) - th], 1); return np.linalg.norm(np.maximum(q, 0), axis=1) + np.minimum(q.max(axis=1), 0)

class Part:
    def __init__(self, f, mat, kind="metal", tag=None, bias=0.0):
        self.f, self.mat, self.kind, self.tag, self.bias = f, mat, kind, tag, bias

# ---------------------------------------------------------------- the knight model
HEAD_YAW, HEAD_C = [0.0], [None]
def knight_parts(pose, team="blue"):
    P = dict(POSES[pose]); yaw = P["yaw"]; Y = rotY(yaw)
    T = lambda v: np.asarray(v, float) @ Y.T                     # body-space point -> character space (turned)
    parts = []; add = lambda f, m, k="metal", tag=None, bias=0.0: parts.append(Part(f, m, k, tag, bias))
    lf, rf = P["feet"]                                            # (x, z) of left (screen-left) and right foot
    hip = np.array([0.0, 17.5, 0.0])
    # legs: greaves with knee cops and sabatons
    for (fx, fz), side in ((lf, -1), (rf, 1)):
        a = T([side * 4.4, 16.5, 0]); b = T([fx, 3.2, fz]); knee = (a + b) / 2 + T([0, 0, 1.2])
        add(lambda p, a=a, b=b: sd_cap(p, a, b, 3.9, 3.3), "steel", tag="leg")
        add(lambda p, c=knee: sd_ell(p, c, np.array([2.9, 2.4, 2.4])), "steel", tag="knee", bias=0.06)
        add(lambda p, c=b + T([0, -1.6, 1.4]): sd_ell(p, c, np.array([3.3, 2.0, 4.6]), Y), "steel", tag="foot")
    # tassets (leather skirt with steel faulds) and sash with gold buckle
    up = np.array([0, 1.0, 0])
    add(lambda p: sd_disc(p, T([0, 18.0, 0.3]), up, 7.8, 2.9) - 0.6, "leather", "cloth", tag="skirt", bias=0.12)
    add(lambda p: sd_disc(p, T([0, 21.4, 0.3]), up, 7.9, 0.75) - 0.3, "plume", "cloth", tag="sash")
    add(lambda p: sd_box(p, T([0, 21.5, 8.5]), [1.5, 1.2, 0.8], Y), "gold", "metal", tag="buckle")
    add(lambda p: sd_ell(p, T([0, 29.6, 5.6]), np.array([1.2, 6.0, 1.6]), Y), "steel", tag="ridge", bias=0.04)
    # torso: breastplate (ridged), gorget
    add(lambda p: sd_ell(p, T([0, 28.6, 0.4]), np.array([8.8, 9.2, 6.8]), Y), "steel", tag="chest")
    parts[-1].envw = 0.25
    add(lambda p: sd_disc(p, T([0, 36.0, 0]), up, 5.2, 1.4) - 0.4, "steel", tag="gorget", bias=-0.1)
    # arms: shoulder -> elbow -> hand, from the pose
    for side, key in ((-1, "larm"), (1, "rarm")):
        sh = T([side * 10.2, 33.0, 0]); el = T(P[key][0]); hd = T(P[key][1])
        add(lambda p, a=sh, b=el: sd_cap(p, a, b, 3.0, 2.8), "steel", tag="arm")
        add(lambda p, a=el, b=hd: sd_cap(p, a, b, 2.8, 2.6), "steel", tag="arm")
        add(lambda p, c=el: sd_ell(p, c, np.array([2.7, 2.7, 2.7])), "steel", tag="elbow", bias=0.05)
        add(lambda p, c=hd: sd_ell(p, c, np.array([2.8, 2.6, 2.8])), "steel", tag="hand")
        # pauldron: two lames (big dome + lower lip)
        pc = T([side * 10.6, 34.6, 0]); M = rotZ(side * -0.35) @ Y.T
        add(lambda p, c=pc, M=M: sd_ell(p, c, np.array([6.6, 4.6, 6.0]), M.T), "steel", tag="pauldron", bias=0.05)
        add(lambda p, c=pc + T([side * 1.2, -3.6, 0]), M=M: sd_ell(p, c, np.array([5.8, 2.6, 5.4]), M.T), "steel", tag="lame")
    # great helm: bucket with a rounded top, brow band, visor slit, crest
    hy = yaw + P.get("head", 0.0); HY = rotY(hy); TH = lambda v: np.asarray(v, float) @ HY.T + T([0, 0, 0])
    hc = np.array([0.0, 45.6, 0.6]); HEAD_YAW[0] = hy; HEAD_C[0] = hc
    add(lambda p: sd_cap(p, hc + TH([0, -5.0, 0]), hc + TH([0, 2.4, 0]), 8.4, 8.6), "steel", tag="helm", bias=0.12)
    add(lambda p: sd_ell(p, hc + TH([0, 2.6, 0]), np.array([8.6, 5.6, 8.6])), "steel", tag="helmtop")
    add(lambda p: sd_box(p, hc + TH([0, -6.8, 0]), [8.2, 0.7, 8.2], HY.T), "steel", tag="rim", bias=-0.15)
    add(lambda p: sd_box(p, hc + TH([0, 5.6, 0]), [0.9, 2.6, 6.0], HY.T, 0.4), "steel", tag="comb")
    # crest (red plume) sweeping back
    for i in range(7):
        t = i / 6; c = hc + TH([0, 8.4 + 9.6 * np.sin(t * 1.9), 1.2 - 6.0 * t])
        add(lambda p, c=c, r=2.7 - 1.0 * t: sd_ell(p, c, np.array([r * 0.8, r * 1.3, r * 1.2])), "plume", "cloth", tag="crest")
    # shield: round, gold rim and cross, team field
    sc, sn = T(P["shield"][0]), nrm(T(P["shield"][1]))
    add(lambda p: sd_disc(p, sc, sn, 8.8, 0.9), "team_" + team, "shield", tag=("shield", sc, sn))
    # sword: blade, crossguard, grip, pommel
    hd = T(P["rarm"][1]); d = nrm(T(P["sword"])); side_v = nrm(np.cross(d, T([0, 0, 1])) + 1e-6)
    add(lambda p: sd_box(p, hd + d * 13.5, [0.9, 11.0, 0.45], _frame(d, T([0, 0, 1])), 0.2), "steel", "blade", tag="blade")
    add(lambda p: sd_cap(p, hd + d * 2.4 - side_v * 3.8, hd + d * 2.4 + side_v * 3.8, 0.9), "gold", tag="guard")
    add(lambda p: sd_cap(p, hd - d * 1.8, hd + d * 1.8, 0.9), "leather", "cloth", tag="grip")
    add(lambda p: sd_ell(p, hd - d * 2.8, np.array([1.3, 1.3, 1.3])), "gold", tag="pommel")
    return parts

def _frame(up, fwd):
    """columns: x, y (= blade axis), z, so a box's local y runs along the blade"""
    y = nrm(up); z = nrm(fwd - (fwd @ y) * y); x = np.cross(y, z); return np.stack([x, y, z], 1)

# poses: elbow/hand in body space (before yaw), shield centre + facing normal, sword direction, feet (x, z), yaw, head
POSES = {
    # A: the r3b paper-doll pose, only the shading changes
    "A": dict(yaw=0.0, feet=((-4.6, 0.5), (4.6, 0.5)),
              larm=([-12.6, 26.5, 0.5], [-13.2, 21.0, 2.0]), rarm=([12.6, 26.5, 0.5], [13.4, 20.5, 2.5]),
              shield=([-15.4, 23.0, 3.4], [0, 0, 1]), sword=[0, 1, 0.05]),
    # B: three-quarter turn to screen left, shield brought forward across the body, sword lowered and angled out
    "B": dict(yaw=-0.55, feet=((-5.0, 2.8), (4.6, -1.8)),
              larm=([-11.0, 26.0, 5.0], [-6.0, 24.0, 10.0]), rarm=([12.6, 26.0, 0.0], [13.0, 19.6, 3.0]),
              shield=([-4.6, 24.2, 12.2], [-0.15, 0.08, 1]), sword=[0.75, -1, 0.35]),
    # C: guard stance: wide feet, shield forward, sword raised on the diagonal over the shoulder
    "C": dict(yaw=-0.45, feet=((-6.6, 4.0), (6.2, -3.4)),
              larm=([-11.0, 26.5, 5.0], [-6.4, 24.6, 10.2]), rarm=([14.0, 29.5, 2.0], [11.0, 34.5, 6.5]),
              shield=([-5.0, 24.6, 12.4], [-0.15, 0.08, 1]), sword=[0.55, 1, -0.15]),
    # D: the pick: B's turn and shield, sword held point-down and forward in a ready stance (concept-like, calm, readable)
    "D": dict(yaw=-0.5, feet=((-5.6, 3.0), (5.2, -2.0)), head=0.12,
              larm=([-11.0, 26.0, 5.0], [-6.2, 24.0, 10.0]), rarm=([14.2, 26.6, 2.0], [15.2, 21.4, 5.0]),
              shield=([-4.8, 24.0, 12.2], [-0.15, 0.08, 1]), sword=[0.1, 1, 0.12]),
}

# ---------------------------------------------------------------- render
BUILD_XY = (1.1, 0.93)                  # on-screen build matched to the concept knight (about 44 x 58 px at 48 px tiles)
LV = nrm([-0.55, 0.62, 0.56])          # light in view space: top-left, from above and in front
PITCH = 0.24                            # camera looks down about 24 degrees (top-down RPG view)

def render(pose, scale=1.0, team="blue", ss=3, W=52, H=72, foot=(26, 68)):
    parts = knight_parts(pose, team)
    V = rotX(PITCH)                                               # character -> view
    xs = (np.arange(W * ss) + 0.5) / ss - foot[0]; ys = foot[1] - (np.arange(H * ss) + 0.5) / ss
    gx, gy = np.meshgrid(xs, ys); N = gx.size
    o = np.stack([gx.ravel() / BUILD_XY[0], gy.ravel() / BUILD_XY[1], np.full(N, 120.0)], 1) / scale   # view space -> model units
    dv = np.array([0, 0, -1.0]); Vi = V                                       # view->char: p_char = V^T p_view ; rows
    def sdf(pv, want=False):
        pc = pv @ Vi                                                          # (p_view) @ V == V^T applied to rows
        D = np.stack([pt.f(pc) for pt in parts], 1); i = D.argmin(1); return (D[np.arange(len(D)), i], i) if want else D.min(1)
    t = np.zeros(N); alive = np.ones(N, bool); hit = np.zeros(N, bool)
    for _ in range(160):
        idx = np.where(alive)[0]
        if not len(idx): break
        d = sdf(o[idx] + t[idx, None] * dv)
        t[idx] += np.maximum(d, 0.02)
        h = d < 0.03; hit[idx[h]] = True; alive[idx[h]] = False; alive[idx[t[idx] > 260]] = False
    pos = o + t[:, None] * dv; hi = np.where(hit)[0]
    mat_i = np.full(N, -1); shade = np.zeros(N); depth = np.full(N, -1e9)
    if len(hi):
        p = pos[hi]; _, pid = sdf(p, True); e = 0.05
        n = np.stack([sdf(p + np.eye(3)[a] * e) - sdf(p - np.eye(3)[a] * e) for a in range(3)], 1)
        n = n / np.maximum(np.linalg.norm(n, axis=1, keepdims=True), 1e-6)
        mat_i[hi] = pid; depth[hi] = p[:, 2]
        lam = np.clip(n @ LV, 0, 1); rv = 2 * n[:, 2:3] * n - np.array([0, 0, 1.0])
        spec = np.clip(rv @ LV, 0, 1) ** 24
        out = np.zeros(len(hi))
        for j, pt in enumerate(parts):
            m = pid == j
            if not m.any(): continue
            if pt.kind == "metal" or pt.kind == "blade":
                ry = rv[m, 1]                                                     # chrome: what the plate reflects
                env = np.where(ry > -0.02, 0.64 + 0.36 * ry, np.where(ry > -0.32, 0.26, 0.5 + 0.1 * (-ry)))
                ew = getattr(pt, "envw", 0.56); v = 0.06 + (0.94 - ew) * lam[m] + ew * env + pt.bias
                v = np.where(spec[m] > 0.5, 1.2, v)                                # hard glint
                if pt.kind == "blade": v = 0.35 + 0.55 * lam[m] + 0.25 * (n[m, 0] < 0)
            elif pt.kind == "shield":
                v = 0.15 + 0.85 * lam[m]
            else:
                v = 0.1 + 0.85 * lam[m] + pt.bias
            out[m] = v
        shade[hi] = out
        # shield decoration: rim and cross in gold, in the disc's own frame
        for j, pt in enumerate(parts):
            if not (isinstance(pt.tag, tuple) and pt.tag[0] == "shield"): continue
            m = np.where(pid == j)[0]; c, sn = pt.tag[1], pt.tag[2]
            pc = p[m] @ Vi - c; up = nrm(np.array([0, 1.0, 0]) - sn[1] * sn); rt = np.cross(up, sn)
            lx, ly = pc @ rt, pc @ up; r = np.hypot(lx, ly)
            gold = (r > 8.8 - 1.5) | (np.abs(lx) < 1.0) | (np.abs(ly) < 1.0)
            G = len(parts); parts_gold = G                                         # pseudo part id for gold trim
            mat_i[hi[m[gold]]] = -2
            boss = r < 1.9; mat_i[hi[m[boss]]] = -3
        # great-helm face: two-row visor slit split by a centre bar, breath holes on the sun side, in the head's frame
        hp = [j for j, pt in enumerate(parts) if pt.tag in ("helm", "brow")]
        m = np.where(np.isin(pid, hp))[0]
        if len(m):
            HYm = rotY(HEAD_YAW[0]); pc = (p[m] @ Vi - HEAD_C[0]) @ HYm                      # head-local coords
            lx, ly, lz = pc[:, 0], pc[:, 1], pc[:, 2]; front = lz > 3.0
            slit = front & (np.abs(lx) < 6.4) & (ly > -0.9) & (ly < 1.5) & (np.abs(lx) > 0.8)
            holes = front & (ly > -4.4) & (ly < -3.0) & (lx > 1.8) & (lx < 5.4) & ((np.floor(lx * 0.75) % 2) == 0)
            bar = front & (np.abs(lx) < 0.75) & (ly > -5.2) & (ly < 2.2)
            mat_i[hi[m[slit | holes]]] = -4; mat_i[hi[m[bar & ~slit]]] = -5
    return dict(W=W, H=H, ss=ss, mat=mat_i.reshape(H * ss, W * ss), shade=shade.reshape(H * ss, W * ss),
                depth=depth.reshape(H * ss, W * ss), parts=parts, team=team)

NSTEP = dict(steel=8, gold=4, plume=4, leather=4, team_blue=5, team_red=5)

def to_pixels(rr):
    """supersampled render -> one (material, step) per pixel: coverage >= half, majority material, mean shade"""
    W, H, ss = rr["W"], rr["H"], rr["ss"]; parts = rr["parts"]
    names = [pt.mat for pt in parts]; team = "team_" + rr["team"]
    def mname(i): return "gold" if i in (-2, -3) else "steel" if i in (-4, -5) else names[i]
    mat = rr["mat"].reshape(H, ss, W, ss).transpose(0, 2, 1, 3).reshape(H, W, ss * ss)
    sh = rr["shade"].reshape(H, ss, W, ss).transpose(0, 2, 1, 3).reshape(H, W, ss * ss)
    dp = rr["depth"].reshape(H, ss, W, ss).transpose(0, 2, 1, 3).reshape(H, W, ss * ss)
    M = np.full((H, W), "", object); S = np.zeros((H, W), int); D = np.full((H, W), -1e9); PID = np.full((H, W), -9)
    for y in range(H):
        for x in range(W):
            m = mat[y, x]; cov = (m != -1)
            if cov.sum() * 2 < ss * ss: continue
            vals, cnt = np.unique(m[cov], return_counts=True); best = vals[cnt.argmax()]; sel = m == best
            nm = mname(best); n = NSTEP[nm]; v = sh[y, x][sel].mean()
            if best == -3: v = 0.95
            if best == -4: v = -1.0
            if best == -5: v = 0.62
            if nm == "steel":
                st = 0 if v < 0 else 7 if v > 1.05 else int(np.clip(np.rint(v * 6.2), 1, 6))
            else:
                st = int(np.clip(np.rint(v * (n - 1)), 0, n - 1))
            M[y, x] = nm; S[y, x] = st; D[y, x] = dp[y, x][sel].mean(); PID[y, x] = best
    # inner lines: a pixel just behind a nearer, different part becomes that material's darkest step (crisp plates)
    for y in range(H):
        for x in range(W):
            if not M[y, x]: continue
            for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)):
                yy, xx = y + dy, x + dx
                if 0 <= yy < H and 0 <= xx < W and M[yy, xx] and PID[yy, xx] != PID[y, x] and D[yy, xx] - D[y, x] > 2.2:
                    S[y, x] = 1 if M[y, x] == "steel" else 0; break
    # sun-side rim: steel pixels with open space above or to the left catch one more step of light
    for y in range(H):
        for x in range(W):
            if M[y, x] == "steel" and 1 <= S[y, x] < 6 and ((y == 0 or not M[y - 1, x]) or (x == 0 or not M[y, x - 1])):
                S[y, x] += 1
    # cleanup: drop opaque pixels with fewer than 2 opaque 4-neighbours (stray corners)
    occ = M != ""
    for y in range(H):
        for x in range(W):
            if occ[y, x]:
                k = sum(1 for dy, dx in ((0, 1), (0, -1), (1, 0), (-1, 0)) if 0 <= y + dy < H and 0 <= x + dx < W and occ[y + dy, x + dx])
                if k < 2: M[y, x] = ""
    return M, S

LETTER = {"gold": "xyYZ", "plume": "abcd", "leather": "lLmM", "team": "ABCDE"}
def to_grid(M, S):
    """freeze to a text grid: steel digits 0-7, letters for the rest (team field = A-E, swapped per team at draw time)"""
    rows = []
    for y in range(M.shape[0]):
        r = ""
        for x in range(M.shape[1]):
            m = M[y, x]
            r += "." if not m else str(S[y, x]) if m == "steel" else LETTER["team" if m.startswith("team_") else m][S[y, x]]
        rows.append(r)
    while rows and set(rows[0]) == {"."}: rows.pop(0)
    return rows

def bake_grid(pose, tier=48):
    sc = 1.0 if tier == 48 else 2 / 3
    W, H, foot = (54, 72, (27, 68)) if tier == 48 else (38, 50, (19, 47))
    return to_grid(*to_pixels(render(pose, sc, W=W, H=H, foot=foot)))

if __name__ == "__main__":
    import sys
    for r in bake_grid(sys.argv[1] if len(sys.argv) > 1 else "A"): print(r)
