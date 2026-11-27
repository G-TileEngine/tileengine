"""B r3b stamps: the identity pass. These are exact pixel grids. Digits are ramp steps of the stamp's material, and letters
go through a legend. Knight bodies are hand-authored as a left half plus the centre column. mirror() builds the right side
one ramp step darker, because the sun is top-left, so the silhouette stays clean and symmetric."""
def G(b):
    rows = [r for r in b.strip("\n").split("\n")]; w = max(map(len, rows)); return [r.ljust(w, ".") for r in rows]

DARKER = dict(d="c", c="b", b="a", a="a", M="m", m="L", L="l", l="l", J="j", j="I", I="i", i="i", Z="Y", Y="y", y="x", x="x")
def mirror(half):
    out = []
    for r in half:
        right = "".join(str(max(0, int(c) - 1)) if c.isdigit() else DARKER.get(c, c) for c in r[:-1][::-1])
        out.append(r + right)
    return out

# legend: steel digits; a-d plume/sash red (dark to light); l L m M leather; i I j J iron; x y Y Z gold
KN = dict(a=("plume", 0), b=("plume", 1), c=("plume", 2), d=("plume", 3), l=("leather", 0), L=("leather", 1), m=("leather", 2),
          M=("leather", 3), i=("iron", 0), I=("iron", 1), j=("iron", 2), J=("iron", 3), x=("gold", 0), y=("gold", 1), Y=("gold", 2), Z=("gold", 3))

KNIGHT_HALF = {48: G("""
.................
.................
.................
.................
.................
.................
.................
.................
..........2344444
........234556666
.......2456666666
......24566666666
......34566666665
......34566666555
......34555555554
......22222222222
......45666666666
......31000000003
......31000000003
......34555555555
..234534551555155
.2345662344444444
23456665233333333
34566665312222222
34566655313455555
22222222134566666
34555553234566666
23444442234566665
12222221234566655
.1111112345666555
...23432345655554
...23432345665545
...23432345555545
...23432344555545
...13321234445545
...13321233444434
...12221223333333
...1221bccccccyYZ
...1221abbbbbbyxY
...1111aaaaaaayyy
......lMMMlMMMlMM
......lMmmlMmmlMm
......lmmmlmmmlmm
......lmLLlmLLlmL
......lLLLlLLLlLL
.......llL.lLL.lL
........1345521..
........2466632..
........1355521..
........1244421..
........1234321..
........1234321..
........1233321..
.......iIjjjjIi..
......iIjJJJjIi..
......iiiiiiiii..
"""), 32: G("""
...........
...........
...........
...........
...........
.......2344
.....234566
....2456666
....3456665
....3455554
....2222222
....4566666
....3100003
....3455555
.2342345155
23456623333
34566531222
22222213455
34555523456
12222223456
..232234554
..232234454
..131233343
..121bcccyZ
..111aaaaay
....lMMlMMl
....lmmlmmL
....lLLlLLl
.....13451.
.....24663.
.....13451.
.....12341.
.....12331.
....iIjjIi.
....iiiiii.
""")}
KNIGHT = {t: mirror(h) for t, h in KNIGHT_HALF.items()}

PLUME = {48: G("""
....d..
...dc..
...dcb.
..dccb.
..dccba
.dccbba
.dcccba
.dccbba
..dcbba
..dcbba
...cba.
...ba..
"""), 32: G("""
..d..
.dc..
.dcb.
dccb.
dcbba
.dcba
.cba.
""")}

SWORD = {48: G("""
..6..
.565.
.564.
.564.
.564.
.564.
.564.
.564.
.564.
.564.
.564.
.564.
.564.
.564.
.564.
.564.
.453.
ZYYyx
.yYx.
..M..
..m..
..L..
.yZy.
"""), 32: G("""
.6.
564
564
564
564
564
564
564
564
564
453
ZYx
.m.
.L.
.Y.
""")}
GAUNTLET = {48: G("""
.355.
24553
23442
.122.
"""), 32: G("""
355
233
""")}

def _shield(w, h):
    """round shield: gold rim lit top-left, blue field (digits) shaded top-left to bottom-right, gold cross. Drawn by rule
    once, then used as a fixed grid."""
    rows = []; cx, cy = (w - 1) / 2, (h - 1) / 2
    for y in range(h):
        r = ""
        for x in range(w):
            nx, ny = (x - cx) / (w / 2), (y - cy) / (h / 2); d = (nx * nx + ny * ny) ** 0.5
            lit = -(nx + ny) * 0.5
            if d > 1.0: r += "."; continue
            if d > 1.0 - 1.25 / (w / 2):   # rim, about 1 px
                r += "Z" if lit > 0.35 else "Y" if lit > 0.0 else "y" if lit > -0.4 else "x"; continue
            if abs(x - cx) < 1.0 or abs(y - cy) < (1.0 if h % 2 else 0.6):
                r += "Z" if lit > 0.15 else "Y" if lit > -0.25 else "y"; continue
            v = 2.4 + lit * 2.6 + (0.9 if (nx < -0.2 and ny < -0.2 and d < 0.55) else 0)
            r += str(int(max(0, min(4, round(v)))))
        rows.append(r)
    return rows
SHIELD = {48: _shield(15, 17), 32: _shield(11, 12)}

# shape language "flame tip": the apex sprig on every crown, ridge finials, eave kicks (digits are material steps)
TIP = {48: G("""
..4..
..54.
.564.
.6543
65432
"""), 32: G("""
.4.
.54
6543
""")}
FINIAL = {48: G("""
..5..
..5..
.654.
.654.
6543.
.642.
.532.
..3..
"""), 32: G("""
.5.
.54
654
.43
.3.
""")}
EAVE_KICK = {48: G("""
6.......
65......
554.....
4443....
.433322.
..222222
"""), 32: G("""
5....
54...
4432.
.2222
""")}

def count(t):
    return sum(1 for d in (KNIGHT, PLUME, SWORD, GAUNTLET, SHIELD, TIP, FINIAL, EAVE_KICK) if t in d)

if __name__ == "__main__":
    for t in (48, 32):
        for r in KNIGHT[t]: print(r)
        print()
        for r in SHIELD[t]: print(r)
