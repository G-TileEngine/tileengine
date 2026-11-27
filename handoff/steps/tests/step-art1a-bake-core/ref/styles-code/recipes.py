"""Object recipes shared by B/C/D. Each returns (Spr, shadow_shapes). Geometry in base px (32/tile), foot at (0,0).
Style switches (dict S): tree 'round'|'tiered'|'pine', boxes, foundation, planks, lily, etc."""
import numpy as np
from common import Spr, sphere, hash2, vnoise, clamp, sstep, LIGHT

def leaf_clumps(X, Y, cell, seed, amp):
    """per-cell little spheres: the leaf-cluster texture (>=2 px clusters at 32 px)"""
    ox = hash2(np.floor(Y / cell), 7, seed) * cell
    gx = np.floor((X + ox) / cell); gy = np.floor(Y / cell)
    fx = (X + ox) / cell - gx; fy = Y / cell - gy
    j = hash2(gx, gy, seed + 1)
    return amp * (sphere((fx - 0.5) * 1.8, (fy - 0.45) * 1.8) - 0.55) + (j - 0.5) * amp * 0.5

def tree(k, S, seed=1, sc=1.0):
    kind = S["tree"]; rs = np.random.default_rng(seed)
    s = Spr(44 * sc + 8, 60 * sc + 6, 0, 0, k); ox, oy = s.W / k / 2, s.H / k - 3   # foot inside canvas
    s.ax, s.ay = ox, oy; F = lambda x, y: (x + ox, y + oy)
    bark = lambda X, Y, nx, ny: 0.78 - nx * 0.55 + 0.08 * (vnoise(X * 3, Y * 0.6, 1, seed) - 0.5)
    tw = 2.6 * sc if kind != "pine" else 2.2 * sc
    x0, y0 = F(-tw, -12 * sc); x1, y1 = F(tw, 0.5); s.rect(x0, y0, x1, y1, "bark", bark)
    for sd in (-1, 1):  # root flare
        a, b = F(sd * tw - (1.6 if sd < 0 else 0) * sc, -2.2 * sc); c, d = F(sd * tw + (1.6 if sd > 0 else 0) * sc, 0.5)
        s.rect(a, b, c, d, "bark", 0.35 if sd > 0 else 0.6)
    gx, gy = F(0, -31 * sc)
    J = lambda: (rs.random() - 0.5) * 2.0 * sc
    if kind == "round":
        blobs = [(0, -42, 7, 6), (-6, -38, 7.5, 6.5), (6, -38, 7.5, 6.5), (-10, -30, 7.5, 7), (10, -30, 7.5, 7), (0, -32, 10, 9), (-9, -22, 7.5, 6.5), (9, -22, 7.5, 6.5), (0, -22, 9, 7), (-4, -16, 6.5, 5), (5, -16, 6.5, 5)]
        GR = (17 * sc, 22 * sc)
        for i, (bx, by, rx, ry) in enumerate(sorted(blobs, key=lambda b: b[1])):
            cx, cy = F(bx * sc + J(), by * sc + J())
            def f(X, Y, nx, ny, i=i):
                g = sphere(clamp((X - gx) / GR[0], -1, 1), clamp((Y - gy) / GR[1], -1, 1))
                return 0.08 + 0.55 * g + 0.42 * sphere(nx, ny) + leaf_clumps(X, Y, 4.0, seed + i, 0.30) - 0.12 * sstep(0.2, 1.0, (Y - gy) / GR[1])
            s.ellipse(cx, cy, rx * sc, ry * sc, "leaf", f)
    elif kind == "tiered":
        tiers = [(-17, 14.5, 8.5, 5), (-26, 12, 7.5, 4), (-34, 9.5, 6.5, 3), (-41, 6, 4.5, 1)]
        for t, (ty, rx, ry, nb) in enumerate(tiers):
            for b in range(nb + 1):  # scalloped bumps along the tier
                fx = -1 + 2 * b / max(nb, 1) if nb else 0
                bx = fx * rx * 0.62; by = ty + abs(fx) * -1.5
                cx, cy = F(bx * sc + J() * 0.5, by * sc); r = (rx * 0.55 if nb else rx) * sc
                def f(X, Y, nx, ny, t=t, b=b):
                    g = sphere(clamp((X - gx) / (15 * sc), -1, 1), clamp((Y - F(0, ty * sc)[1]) / (9 * sc), -1, 1))
                    return 0.12 + 0.5 * g + 0.36 * sphere(nx, ny) + 0.06 * t + leaf_clumps(X, Y, 4.0, seed + t * 7 + b, 0.18)
                s.ellipse(cx, cy, r, ry * sc, "leaf", f)
    else:  # pine: stacked jagged tiers, back to front = top to bottom drawn last-first so lower tiers overlap? top tier drawn last
        tiers = [(-6, 17.5, 11), (-13, 16, 11), (-20, 14, 11), (-27, 11.5, 10), (-33, 9, 9), (-39, 6, 8), (-44, 3.5, 6)]
        for t, (base, hw, h) in enumerate(tiers):
            n = 9; pts = [F(0, (base - h) * sc)]
            for q in range(n + 1):
                fx = 1 - 2 * q / n; tooth = (q % 2) * 2.4 + rs.random() * 1.0
                pts.append(F(fx * hw * sc * (0.92 + 0.12 * rs.random()), (base + 2.0 - tooth - abs(fx) * 2.5) * sc))
            topy = F(0, (base - h) * sc)[1]; boty = F(0, base * sc)[1]
            def f(X, Y, nx, ny, t=t, topy=topy, boty=boty, hw=hw):
                vy = clamp((Y - topy) / (boty - topy)); hx = (X - ox) / (hw * sc)
                needles = vnoise(X * 1.0 + Y * 0.45, Y * 2.2, 1.5, seed + t) - 0.5
                return 0.5 - 0.42 * hx + 0.16 * (1 - vy) - 0.28 * sstep(0.65, 1.0, vy) + 0.34 * needles + 0.03 * t
            s.poly(pts, "leaf", f)
    W = 17 * sc
    shad = [("e", 9 * sc, -4 * sc, W * (1.1 if kind == "round" else 0.9), 8 * sc)]
    return s, shad

def bush(k, S, seed=1):
    s = Spr(24, 18, 12, 15, k); rs = np.random.default_rng(seed)
    for i, (bx, by, rx, ry) in enumerate(sorted([(0, -9, 5.5, 4.5), (-4.5, -5.5, 5, 4.5), (4.5, -5.5, 5, 4.5), (0, -4.5, 6, 4.5)], key=lambda b: b[1])):
        cx, cy = 12 + bx + (rs.random() - .5), 15 + by
        s.ellipse(cx, cy, rx, ry, "leaf", lambda X, Y, nx, ny, i=i: 0.12 + 0.45 * sphere((X - 12) / 9, (Y - 9) / 8) + 0.35 * sphere(nx, ny) + leaf_clumps(X, Y, 3.5, seed + i, 0.25))
    return s, [("e", 4, -1.5, 9, 3.5)]

def rock(k, S, seed=1, big=False):
    s = Spr(22, 16, 10, 13, k); g = 1.35 if big else 1.0
    def f(X, Y, nx, ny):
        facet = hash2(np.floor(X / 2.5), np.floor(Y / 2.5), seed) - 0.5
        return 0.15 + 0.75 * sphere(nx * 0.9, ny * 1.1) + 0.12 * facet
    s.ellipse(10, 13 - 3.5 * g, 5.2 * g, 3.8 * g, "stone", f)
    s.ellipse(10 + 4.6 * g, 13 - 1.8 * g, 3.0 * g, 2.2 * g, "stone", f)
    return s, [("e", 3 * g, -0.8, 7 * g, 2.6 * g)]

def crate(k, S):
    s = Spr(18, 22, 9, 20, k)
    def front(X, Y, nx, ny):
        fr = (nx < 0.12) | (nx > 0.88) | (ny < 0.1) | (ny > 0.9) | (np.abs(nx - ny) < 0.09)
        plank = ((Y - 7) % 4.3) < 0.9
        return np.where(fr, 0.42, 0.62 - 0.18 * plank + 0.06 * (vnoise(X * 2, Y * 0.5, 1, 4) - 0.5))
    s.rect(2, 7, 16, 20, "crate", front)
    s.rect(2, 3, 16, 7, "crate", lambda X, Y, nx, ny: np.where((nx < 0.1) | (nx > 0.9), 0.62, 0.86 - 0.15 * (((X - 2) % 4.7) < 0.9)))
    return s, [("e", 5, -1, 8, 3)]

def barrel(k, S):
    s = Spr(14, 18, 7, 16, k)
    def body(X, Y, nx, ny):
        cyl = 0.5 + 0.45 * np.cos((nx - 0.32) * np.pi * 0.95)
        hoop = (np.abs(ny - 0.2) < 0.08) | (np.abs(ny - 0.78) < 0.08)
        stave = ((X - 2) % 3.0) < 0.6
        return np.where(hoop, cyl * 0.55, cyl * 0.85 - 0.1 * stave)
    s.rect(2, 4.5, 12, 16, "barrel", body)
    s.ellipse(7, 4.5, 5, 2, "barrel", lambda X, Y, nx, ny: np.where(nx * nx + ny * ny > 0.5, 0.45, 0.9))
    return s, [("e", 4, -0.5, 6, 2.5)]

def lantern(k, S):
    s = Spr(10, 26, 5, 24, k)
    s.rect(4, 7, 6, 24, "iron", lambda X, Y, nx, ny: 0.7 - 0.5 * nx)
    s.rect(3, 22.5, 7, 24, "iron", 0.4)
    s.rect(2.2, 2.5, 7.8, 8.5, "iron", 0.35)
    s.rect(3, 3.5, 7, 8, "glow", lambda X, Y, nx, ny: 1 - 0.5 * ny, nol=True)
    s.rect(1.8, 1.2, 8.2, 2.8, "iron", 0.6)
    return s, [("e", 3, -0.5, 4, 1.5)]

def fence(k, S, n=4):
    L = n * 32 - 4; s = Spr(L + 4, 18, 2, 15, k)
    grain = lambda X, Y: 0.07 * (vnoise(X * 0.5, Y * 3, 1, 9) - 0.5)
    for y0 in (4.5, 9.0):
        s.rect(2, y0, L + 2, y0 + 2.4, "fence", lambda X, Y, nx, ny: 0.78 - 0.4 * ny + grain(X, Y))
    for i in range(int(L // 18) + 1):
        x = 3 + i * min(18, (L - 4) / max(1, int(L // 18)))
        s.rect(x - 1.8, 3, x + 1.8, 16, "fence", lambda X, Y, nx, ny: 0.8 - 0.55 * nx + grain(X, Y) - 0.2 * (ny > 0.9))
        s.ellipse(x, 3, 1.8, 1.2, "fence", 0.92)
    return s, [("p", [(0, 0), (L, 0), (L + 4, 3), (4, 3)])]

def unit(k, S, kind="knight", team="blue"):
    s = Spr(22, 32, 11, 29, k); cx, fy = 11, 29
    P = lambda x, y: (cx + x, fy + y)
    if kind == "knight":
        st = "steel"
        for sd in (-1, 1):
            a, b = P(sd * 2.4 - 1.5, -7); c, d = P(sd * 2.4 + 1.5, 0)
            s.rect(a, b, c, d, st, lambda X, Y, nx, ny: np.where(ny > 0.72, 0.25, 0.75 - 0.5 * nx))
        x, y = P(0, -12.5); s.ellipse(x, y, 5.6, 5.4, st, lambda X, Y, nx, ny: 0.15 + 0.85 * sphere(nx, ny))
        a, b = P(-5, -9.2); c, d = P(5, -7.6); s.rect(a, b, c, d, "leather", lambda X, Y, nx, ny: 0.6 - 0.3 * nx)
        x, y = P(6.2, -12); s.ellipse(x, y, 2.1, 3.6, st, lambda X, Y, nx, ny: 0.2 + 0.8 * sphere(nx, ny))
        a, b = P(7.2, -18); c, d = P(8.4, -8); s.rect(a, b, c, d, st, lambda X, Y, nx, ny: 0.95 - 0.4 * nx)
        a, b = P(6, -9); c, d = P(9.6, -7.8); s.rect(a, b, c, d, "leather", 0.5)
        x, y = P(0, -20.5); s.ellipse(x, y, 5.0, 5.0, st, lambda X, Y, nx, ny: 0.15 + 0.85 * sphere(nx, ny))
        a, b = P(-3.2, -20.4); c, d = P(3.2, -19.2); s.rect(a, b, c, d, st, 0.0)
        x, y = P(0, -25.5); s.ellipse(x, y, 1.4, 2.6, "plume", lambda X, Y, nx, ny: 0.3 + 0.7 * sphere(nx, ny))
        tm = "team_" + team; x, y = P(-6, -11.2)
        s.ellipse(x, y, 4.8, 5.2, st, lambda X, Y, nx, ny: 0.3 + 0.6 * sphere(nx, ny))
        s.ellipse(x, y, 3.8, 4.2, tm, lambda X, Y, nx, ny: 0.2 + 0.8 * sphere(nx, ny))
        s.rect(x - 0.6, y - 4.2, x + 0.6, y + 4.2, "gold", 0.8); s.rect(x - 3.8, y - 0.8, x + 3.8, y + 0.4, "gold", 0.8)
    else:
        shirt = "shirt_green" if kind == "boy" else "shirt_red"
        for sd in (-1, 1):
            a, b = P(sd * 2 - 1.3, -6); c, d = P(sd * 2 + 1.3, 0)
            s.rect(a, b, c, d, "pants", lambda X, Y, nx, ny: np.where(ny > 0.75, 0.15, 0.65 - 0.4 * nx))
        x, y = P(0, -10); s.ellipse(x, y, 4.8, 4.8, shirt, lambda X, Y, nx, ny: 0.15 + 0.85 * sphere(nx, ny))
        for sd in (-1, 1):
            x, y = P(sd * 4.8, -9.5); s.ellipse(x, y, 1.5, 3, shirt, lambda X, Y, nx, ny: 0.1 + 0.8 * sphere(nx, ny))
        x, y = P(0, -16); s.ellipse(x, y, 3.6, 3.6, "skin", lambda X, Y, nx, ny: 0.25 + 0.75 * sphere(nx, ny))
        for sd in (-1, 1): a, b = P(sd * 1.4 - 0.5, -16); s.rect(a, b, a + 1, b + 1, "hair", 0.05)
        if kind == "boy":
            x, y = P(0, -18); s.ellipse(x, y, 3.9, 2.6, "hair", lambda X, Y, nx, ny: 0.2 + 0.8 * sphere(nx, ny))
        else:
            x, y = P(0, -18.2); s.ellipse(x, y, 7.2, 2.6, "straw", lambda X, Y, nx, ny: 0.25 + 0.7 * sphere(nx, ny * 0.6))
            x, y = P(0, -20); s.ellipse(x, y, 4.0, 2.8, "straw", lambda X, Y, nx, ny: 0.35 + 0.65 * sphere(nx, ny))
            a, b = P(-3.9, -19.2); c, d = P(3.9, -18.4); s.rect(a, b, c, d, "leather", 0.4)
    return s, [("e", 1.5, -0.3, 6.5, 2.4)]

def house(k, S, roof="roof_red", boxes=True, seed=1):
    s = Spr(80, 66, 40, 58, k); cx, fy = 40, 58
    rx0, rx1, ry0, ry1 = cx - 35, cx + 35, fy - 50, fy - 14
    wx0, wx1, wy0, wy1 = cx - 32, cx + 32, fy - 15, fy + 2
    rowh, tw = (4.0, 6.0) if roof == "roof_slate" else (5.0, 7.0)
    planks = S.get("planks", False)
    def wall(X, Y, nx, ny):
        base = 0.66 + 0.05 * (vnoise(X, Y, 3, seed) - 0.5)
        if planks: base = base - 0.16 * (((Y - wy0) % 3.0) < 0.8) + 0.05 * (hash2(np.floor((X + 7 * np.floor((Y - wy0) / 3)) / 12), np.floor((Y - wy0) / 3), seed) - .5)
        return np.where(Y < wy0 + 3.2, base - 0.42, base)
    s.rect(wx0, wy0, wx1, wy1, "wall", wall)
    tim = lambda X, Y, nx, ny: 0.62 - 0.35 * nx
    for a in (wx0, wx1 - 2, cx - 9, cx + 7): s.rect(a, wy0 + 1, a + 2, wy1, "timber", tim)
    s.rect(wx0, wy1 - 2, wx1, wy1, "timber", lambda X, Y, nx, ny: 0.45 - 0.2 * ny)
    for wxc in (cx - 20, cx + 20):
        s.rect(wxc - 5, wy0 + 4.5, wxc + 5, wy0 + 11.5, "timber", 0.3)
        s.rect(wxc - 4, wy0 + 5.5, wxc + 4, wy0 + 10.5, "glass", lambda X, Y, nx, ny: np.where((nx < 0.3) & (ny < 0.35), 0.85, 0.25 - 0.15 * ny))
        s.rect(wxc - 0.5, wy0 + 5.5, wxc + 0.5, wy0 + 10.5, "timber", 0.55); s.rect(wxc - 4, wy0 + 7.6, wxc + 4, wy0 + 8.4, "timber", 0.55)
        s.rect(wxc - 5.5, wy0 + 11.5, wxc + 5.5, wy0 + 12.6, "timber", 0.75)
    s.rect(cx - 5, wy0 + 3.5, cx + 5, wy1, "timber", 0.25)
    s.rect(cx - 4, wy0 + 4.5, cx + 4, wy1, "door", lambda X, Y, nx, ny: 0.62 - 0.25 * (((X - cx + 4) % 2.7) < 0.7) - 0.12 * ny)
    s.rect(cx + 2, wy0 + 10, cx + 3, wy0 + 11, "gold", 0.9)
    if S.get("foundation"):
        def cob(X, Y, nx, ny):
            r = np.floor((Y - (wy1 - 2.5)) / 2.6); gx = np.floor((X + (r % 2) * 1.8) / 3.6)
            fx = (X + (r % 2) * 1.8) / 3.6 - gx; fyy = (Y - (wy1 - 2.5)) / 2.6 - r
            return 0.15 + 0.7 * sphere((fx - .5) * 1.9, (fyy - .5) * 1.9) + 0.1 * (hash2(gx, r, seed) - .5)
        s.rect(wx0 - 2, wy1 - 2.5, wx1 + 2, wy1 + 2.6, "stone", cob)
    s.rect(cx - 6, wy1 - 0.5, cx + 6, wy1 + 2.8, "stone", lambda X, Y, nx, ny: np.where(ny < 0.35, 0.85, 0.45))
    if boxes:
        rs = np.random.default_rng(seed + 50)
        for bx in (cx - 20, cx + 20):
            s.rect(bx - 7, wy1 - 2.5, bx + 7, wy1 + 1.5, "crate", lambda X, Y, nx, ny: 0.5 - 0.25 * ny)
            s.rect(bx - 7, wy1 - 5.5, bx + 7, wy1 - 2.5, "leaf", lambda X, Y, nx, ny: 0.35 + 0.35 * (hash2(np.floor(X), np.floor(Y), seed) > 0.5), nol=True)
            for q in range(10):
                fx = bx - 6.2 + rs.random() * 12.4; fyy = wy1 - 5.6 + rs.random() * 2.6
                col = ["fl_pink", "fl_purple", "fl_white", "fl_pink"][q % 4]
                s.rect(fx, fyy, fx + 1, fyy + 1, col, 0.8, nol=True)
    def tiles(X, Y, nx, ny):
        yr = Y - ry0; r = np.floor(yr / rowh); ry = yr - r * rowh
        xs = X - rx0 + (r % 2) * tw / 2; col = np.floor(xs / tw); cxx = xs - col * tw
        b = 0.6 + 0.16 * (hash2(col, r, seed) - 0.5) + 0.12 * (1 - nx) - 0.1 * ny
        b = b + np.where(ry < 1.0, 0.2, 0) - np.where(ry > rowh - 1.15, 0.32, 0) - np.where(cxx < 0.95, 0.22, 0)
        b = b - np.where(yr > 36 - 2.2, 0.15, 0) + np.where(yr < 1.2, 0.15, 0)
        return b
    s.rect(rx0, ry0, rx1, ry1, roof, tiles)
    chx = cx + 9
    s.rect(chx, ry0 - 6, chx + 6, ry0 + 5, "stone", lambda X, Y, nx, ny: 0.75 - 0.4 * nx - 0.15 * (((Y - ry0) % 3) < 0.7))
    s.rect(chx - 0.6, ry0 - 7, chx + 6.6, ry0 - 5, "stone", lambda X, Y, nx, ny: np.where(ny < 0.5, 0.95, 0.5))
    s.rect(chx + 1.2, ry0 - 6.4, chx + 4.8, ry0 - 5.6, "stone", 0.0)
    shad = [("p", [(35, -46), (41, -42), (41, 4), (-26, 4), (-30, 2), (35, 2)])]
    return s, shad

BUILD = dict(tree=lambda k, S, seed, sc: tree(k, S, seed, sc), bush=bush, rock=rock, crate=crate, barrel=barrel, lantern=lantern, fence=fence,
             house=house, knight=lambda k, S, team: unit(k, S, "knight", team), boy=lambda k, S: unit(k, S, "boy"), farmer=lambda k, S: unit(k, S, "farmer"))
