"""B: modern HD pixel (Sea of Stars / Eastward / Chained Echoes direction). Banded ramps, sel-out outlines, dense grass grain,
crisp cast shadows, deep water with ripple dashes, warm sunset grade and vignette. Usage: python3 style_b.py [P=32]"""
import sys, numpy as np
from common import *
from engine import bake

R = {k: ramp_of(v) for k, v in dict(
    grass=["#222c14", "#2f3c17", "#3d4c1b", "#4e5e20", "#617027", "#77822e", "#949537", "#b8aa44"],
    leaf=["#0c180b", "#142a14", "#1c3c1a", "#27521f", "#356a24", "#4b852a", "#6ea232", "#a2c23e"],
    bark=["#22140a", "#3a2414", "#55361e", "#73502e", "#8f6a40"],
    dirt=["#4a3018", "#6e4b28", "#906338", "#ad7d48", "#c2925a", "#d6ad78"],
    bank=["#20160e", "#3a2716", "#5a3d22", "#7a5532", "#94704a"],
    water=["#0a2238", "#0e3050", "#123e64", "#184e78", "#22628e", "#3a80aa", "#7ab4d2"],
    roof_red=["#3e180f", "#5e2416", "#83321c", "#a44426", "#c05632", "#d97044", "#ec9660"],
    roof_slate=["#1c1f2a", "#2a2e3c", "#3a3e4e", "#4c5062", "#5f6477", "#767c90", "#9aa0b2"],
    roof_wood=["#2c1a0e", "#432a17", "#5c3b22", "#764e2e", "#8f633c", "#a97b4f", "#c49a6a"],
    wall=["#4a3a28", "#7c6648", "#a89070", "#cdb894", "#e4d3ae", "#f2e6c6"],
    timber=["#1e130a", "#352214", "#4e331e", "#6a4a2c", "#86633c"],
    glass=["#141a24", "#1f2a3a", "#2e4258", "#5a7a96", "#a4c2d8"],
    door=["#261609", "#3e2512", "#5a381c", "#764d29", "#8e6336"],
    stone=["#2a2a30", "#45454e", "#62626c", "#80808a", "#a2a2aa", "#c6c6cc"],
    crate=["#2e1c0e", "#4e3219", "#6e4924", "#8e6232", "#ab7c44", "#c69a60"],
    barrel=["#2a180c", "#46291a", "#664024", "#86582f", "#a5713e", "#bf8e58"],
    fence=["#24160c", "#3e2716", "#5c3c21", "#7a532f", "#97693c", "#b4844e"],
    iron=["#121318", "#24262e", "#3a3c46", "#585a66"], glow=["#c88a2a", "#f2c45a", "#fff2b0"],
    steel=["#1c2030", "#343a4c", "#545c70", "#7c8698", "#a8b2c0", "#d4dae2", "#f6f8fa"],
    leather=["#2c1a0e", "#4a2e18", "#6c4626", "#8a5e34"], plume=["#5a0e0e", "#8e1a16", "#c42c22", "#ee5a3e"],
    team_blue=["#0e1e4e", "#18327a", "#2448a6", "#3a66c8", "#5e8ae0"], team_red=["#4a0c10", "#7a1418", "#a82422", "#d03a2e", "#ec6248"],
    gold=["#7a5410", "#b8861e", "#e6b832", "#fae070"], shirt_green=["#14301a", "#1e4a24", "#2c6630", "#3e8240", "#5aa052"],
    shirt_red=["#3a140c", "#5e2214", "#86341e", "#a8482a", "#c4663c"], pants=["#1e140c", "#33231a", "#4a3626", "#614a36"],
    skin=["#5a3220", "#8a5236", "#b8784e", "#dca070", "#f2c294"], hair=["#1a0e08", "#3a2212", "#5a3820", "#7a522e"],
    straw=["#6a4e1e", "#9a7632", "#c6a04c", "#e2c26e", "#f4e0a0"],
    fl_pink=["#e86a9a"], fl_purple=["#9a6ad8"], fl_white=["#f2eef0"]).items()}

def ground(u, v, xs, ys, P, shadow, items):
    k = P / 32; X = xs / k; Y = ys / k   # base-px coords (so detail sizes match 32 px)
    Xi = np.floor(X); Yi = np.floor(Y)
    macro = fbm(X, Y, 70, 3, 3) - 0.5
    sun = np.exp(-np.hypot(u - 0.2, v + 0.6) / 4.5); vig = sstep(0.45, 1.05, np.hypot((u - 6) / 6.6, (v - 4.6) / 6.0))
    grain = hash2(Xi, Yi, 5) - 0.5
    tick = hash2(Xi, np.floor(Yi / 2), 6) > 0.86; tick_dn = np.roll(tick, -1, 0) & ~tick
    L = 0.52 + 0.2 * macro + 0.3 * sun - 0.16 * vig + 0.16 * grain + 0.12 * tick - 0.08 * np.roll(tick, 1, 0)
    sh_core = shadow > 0.5
    pen = (shadow > 0.15) & ~sh_core
    L = L - 0.36 * sh_core - 0.14 * pen
    img = ramp_q(R["grass"], L)
    fl = hash2(Xi, Yi, 77); fc = hash2(Xi, Yi, 78)
    flm = ((fl > 0.9985) | ((np.roll(fl, 1, 1) > 0.9985) & (fc > 0.5))) & ~sh_core
    fc = np.where(np.roll(fl, 1, 1) > 0.9985, np.roll(fc, 1, 1), fc)
    img[flm & (fc < 0.4)] = hexc("#e48aa8"); img[flm & (fc >= 0.4) & (fc < 0.7)] = hexc("#e8e2d8"); img[flm & (fc >= 0.7)] = hexc("#a88ad8")
    # path: ragged edge, dark rim, clustered pebbles
    jit = (hash2(Xi, Yi, 9) - 0.5) * 0.06
    pd = path_d(u, v) + jit
    inside = pd < 0
    pL = 0.62 + 0.14 * (fbm(X, Y, 9, 11, 2) - 0.5) + 0.12 * sun - 0.15 * vig - 0.25 * sh_core
    peb = (hash2(np.floor(X / 2), np.floor(Y / 2), 12) > 0.86) & (hash2(Xi, Yi, 13) > 0.35)
    pL = pL + 0.22 * peb - 0.18 * np.roll(peb, 1, 0) * ~peb
    pL = np.where(pd > -0.07, pL - 0.3, pL)
    img[inside] = ramp_q(R["dirt"], pL)[inside]
    # pond
    d = pond_d(u, v) + (hash2(Xi, Yi, 21) - 0.5) * 0.03
    water = d < 0; bank = (d >= 0) & (d < 0.22)
    depth = clamp(-d / 1.1)
    wL = 0.56 - 0.32 * sstep(0, 1, depth) + 0.05 * (fbm(X, Y, 30, 31, 2) - 0.5) + 0.1 * (hash2(Xi, Yi, 35) - 0.5)
    rip = np.sin(Y * 0.9 + 2.2 * np.sin(X * 0.11) + 1.5 * fbm(X, Y, 16, 33, 2) * 6)
    dash = ((rip > 0.9) & (hash2(np.floor(X / 3), Yi, 34) > 0.4)) | (hash2(np.floor(X / 2), Yi, 36) > 0.975)
    wL = wL + 0.35 * dash + np.where(d > -0.05, 0.22, 0)
    lee = pond_d(u - 0.14, v - 0.18) > 0   # the bank's own shadow on the water, sun top-left
    wL = wL - 0.22 * (lee & (d > -0.3)) - 0.2 * sh_core
    img[water] = ramp_q(R["water"], wL)[water]
    bL = 0.62 - 0.45 * sstep(0.12, 0.0, d) + 0.18 * (hash2(np.floor(X / 2), np.floor(Y / 2), 40) - 0.5) - 0.2 * sh_core
    img[bank] = ramp_q(R["bank"], bL)[bank]
    # sky band in the overlap row (concept dressing only)
    hz = -1 + 0.68 + 0.05 * (hash2(Xi, 0, 3) - 0.5) + 0.03 * np.sin(X * 0.7)
    sky = v < hz
    t = clamp(X / (12 * 32)); top = clamp((v + 1) / 0.68)
    sk = (np.array([238, 178, 92]) * (1 - t)[..., None] + np.array([98, 92, 150]) * t[..., None]) * (1 - 0.25 * top)[..., None] + np.array([40, 10, 30]) * top[..., None]
    cl = (fbm(X, Y * 3, 40, 51, 3) > 0.6)
    sk = np.where(cl[..., None], sk * 0.6 + np.array([236, 150, 150]) * 0.4, sk)
    sk = np.floor(sk / 10) * 10
    img[sky] = sk[sky]
    return img

def grade(img, u, v, P):
    sun = np.exp(-np.hypot(u - 0.0, v + 1.0) / 3.2)[..., None]
    vig = sstep(0.55, 1.15, np.hypot((u - 6.5) / 6.5, (v - 4.4) / 6.0))[..., None]
    img = img * (1 + 0.18 * sun) + np.array([60, 36, -10]) * sun * 0.8
    img = img * (1 - 0.3 * vig) + np.array([8, -4, 16]) * vig
    return img

S = dict(scale=dict(knight=1.45, boy=1.45, farmer=1.45, crate=1.3, barrel=1.3, rock=1.3, bush=1.3, tree=1.12, lantern=1.25), mode="pixel", ramps=R, ground=ground, grade=grade, tree="round", boxes=True,
         outline=lambda Rm: Rm[0] * 0.75, rim=0.16, bias=dict(steel=-0.22))

if __name__ == "__main__":
    P = int(sys.argv[1]) if len(sys.argv) > 1 else 32
    img = bake(S, P)
    files = save_set(img, f"b-hd-pixel-{P}px", ".", P, "../styles/b-hd-pixel.jpg", f"B modern HD pixel: code bake at {P} px/tile")
    print(files)
