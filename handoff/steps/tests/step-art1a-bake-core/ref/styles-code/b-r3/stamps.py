"""B r3 hand-authored pixel stamps. Each stamp is an exact pixel grid. '.' means leave the pixel alone. A digit is a ramp
step (relative or absolute, depending on how the stamp is used); letters map through a legend to (material, ramp step).
Two tiers: T32 is authored for 32 px tiles, T48 is authored separately for 48 px tiles (not an upscale of T32)."""

def G(block):
    rows = [r for r in block.strip("\n").split("\n")]
    w = max(len(r) for r in rows); return [r.ljust(w, ".") for r in rows]

# ---- leaf clusters: digits 0..4 are relative light levels (4 = lit cap, 0 = dark crescent underneath) ----
LEAF = {32: [G("""
..4433..
.444332.
34443321
23332211
.122110.
..0000..
"""), G("""
..443..
.44432.
3443321
2332211
.12110.
..000..
"""), G("""
..44433..
.4444332.
344433221
.2222111.
..00000..
"""), G("""
..43..
.4432.
344321
233211
.2110.
..00..
""")], 48: [G("""
....4.4.....
..4444433...
.444444332..
34444443321.
344443333221
233333222211
.2222221111.
..11110000..
....000.....
"""), G("""
...4.44....
..444443...
.44444332..
3444443321.
3444333221.
2333322211.
.22221110..
...1000....
"""), G("""
.....4.44.....
...44444433...
.444444443322.
34444443333221
23333332222211
.222222211110.
...11100000...
"""), G("""
...44.....
..44443...
.4444432..
344444321.
344433321.
233332211.
.2222111..
..11000...
...00.....
""")]}

# ---- crown-edge tufts: leaf tips that sit on the smooth crown outline (relative levels) ----
TUFT = {32: [G("""
.43.
4433
"""), G("""
..4..
.443.
44332
"""), G("""
4.4
443
""")], 48: [G("""
..4.4.
.44443
444433
"""), G("""
...4...
..443..
.44433.
4443322
"""), G("""
.4..4.
44.443
444433
""")]}

# ---- bush clumps (relative levels) ----
BUSH = {32: [G("""
.443.
44432
33321
.110.
"""), G("""
..44..
.4443.
444332
.3221.
""")], 48: [G("""
..4.43..
.444432.
44444332
34443321
.2222111
..1100..
"""), G("""
...44...
..44443.
.4444432
44443332
.3332221
..1110..
""")]}

# ---- knight details. Legend: v visor black, h/s/m/d steel 6/4/3/1, r rivet steel 5, b/B leather 1/2, g/G gold 3/1 ----
KN_LEG = dict(v=("iron", 0), h=("steel", 6), s=("steel", 4), m=("steel", 3), d=("steel", 1), r=("steel", 5),
              b=("leather", 1), B=("leather", 2), g=("gold", 3), G=("gold", 1))
VISOR = {32: G("""
mdddddddm
dvvvdvvvd
.dmvmvmd.
"""), 48: G("""
.mdddddddddm.
mdvvvvdvvvvdm
mdvvvvdvvvvdm
.mmdvmvmvdmm.
...mmmmmmm...
""")}
BELT = {32: G("""
bbbbbGgGbbbbb
BBBBBGgGBBBBB
"""), 48: G("""
bbbbbbbbGGGGbbbbbbbbb
BBBBBBBBGggGBBBBBBBBB
bbbbbbbbGGGGbbbbbbbbb
""")}
PAULDRON = {32: G("""
.hss.
hsssm
smmmd
.ddd.
"""), 48: G("""
..hhs...
.hhsssm.
hssssmmd
smmmmmdd
.dmrmrd.
..dddd..
""")}

# ---- NPC face and straw hat. Legend: K/k/n/m skin 4/3/2/1, e hair 0 (eyes), E white eye glint; hat digits = straw steps, b leather 1 ----
FACE_LEG = dict(K=("skin", 4), k=("skin", 3), n=("skin", 2), m=("skin", 1), e=("hair", 0), E=("fl_white", 0))
FACE = {32: G("""
KKkkkkk
Kekkkek
kkknkkk
.kkmkk.
"""), 48: G("""
.KKKkkkkkk.
KKKkkkkkkkk
KkeEkkkeEkk
kkeekkkeekk
kkkkknkkkkk
.kkkmmmkkk.
..kkkkkkk..
""")}
HAT = {32: G("""
......4443332......
.....444333322.....
.....bbbbbbbbb.....
..443333333332221..
4433333333322222110
.11222222221111100.
...000000000000....
"""), 48: G("""
...........444433...........
.........44443333322........
........4443333333222.......
........4433333333222.......
........bbbbbbbbbbbbb.......
....4444333333333333222211..
.44443232323232323232222111.
443333333333333333322222111.
.1122222222222222222211110..
...11111111111111111110000..
......00000000000000000.....
""")}

# ---- ground flower tufts (RGB legend in style_b3: g/G/d grass, p/P pink, w white, y yellow, u/U purple) ----
FLOWER = {32: [G("""
.p.p.
pyPyp
.gpg.
dg.gd
"""), G("""
.w.
wyw
.G.
dgd
"""), G("""
u.u..
UuUu.
.g.u.
dgdg.
""")], 48: [G("""
..p.p..
.pPyPp.
..pPp.p
.g.g.pP
dgG.Gg.
.d.d...
"""), G("""
...w...
..wyw..
.w.w.w.
.wyGwyw
..gGg..
.dg.gd.
"""), G("""
.u...u.
uUu.uUu
.u.g.u.
..gGg..
.dg.gd.
""")]}

# ---- roof shingle bits, in tile-cell coordinates (column 0 is the joint). Digits are steps relative to the
#      cell's own mid step (4 = the cell's normal colour); M/m are moss (leaf 5/3). Keys: (tile size, roof kind) ----
SHINGLE = {(32, "tile"): [G("""
1666665
1555554
1555554
1444443
0111111
"""), G("""
1444443
1433343
1333333
1322232
0111111
"""), G("""
155MM54
14MmMm4
144mm44
1333333
0111111
""")], (32, "slate"): [G("""
166665
155554
144443
011111
"""), G("""
144443
133333
132223
011111
"""), G("""
15MM54
1MmMm4
133m33
011111
""")], (48, "tile"): [G("""
16666666665
15555555554
15555555554
15555555554
14444444443
14444444443
01111111111
00000000000
"""), G("""
14444444443
14443344443
14433334443
13333333333
13333333333
13222222232
01111111111
00000000000
"""), G("""
1555MM55554
144MmMMm444
14MmmmMm444
144mmmm4444
14444m44443
13333333333
01111111111
00000000000
""")], (48, "slate"): [G("""
166666665
155555554
155555554
144444443
011111111
000000000
"""), G("""
144444443
144333443
133333333
132222223
011111111
000000000
"""), G("""
155MM5554
14MmMm444
144mm4444
13333m333
011111111
000000000
""")]}
RIDGE = {32: G("""
566653
444442
211110
"""), 48: G("""
.56666553
556666554
444444443
222222221
111111110
""")}

# ---- window sill (stone steps) and flower box. Box legend: g/G/d leaf 3/5/1, p/P petal pink, w white, u/U purple, y gold, c/C/x/X crate 4/3/1/0 ----
SILL = {32: G("""
555555555554
211111111110
"""), 48: G("""
.5555555555555555.
455555555555555554
211111111111111110
""")}
BOX_LEG = dict(g=("leaf", 3), G=("leaf", 5), d=("leaf", 1), p=("petal_pink", 1), P=("petal_pink", 2), w=("fl_white", 0),
               u=("petal_purple", 1), U=("petal_purple", 2), y=("gold", 3), c=("crate", 4), C=("crate", 3), x=("crate", 1), X=("crate", 0))
BOX = {32: G("""
.p.w..u.p..w..
pyp.wywupypwyw
GpGgGwGuGpGgwG
dgGgdgGgdGgdgd
cccccccccccccc
CCxCCCCxCCCCxC
XXXXXXXXXXXXXX
"""), 48: G("""
..p...w....u...p..w..
.pPp.wyw..uUu.pPp.wyw
..pyp.w.u.uyu..p.wyw.
.GpG.GwgG.GuG.GpGgGwG
dGgGgdGgGdgGgGdGgGgGd
dgdgdgdgdgdgdgdgdgdgd
ccccccccccccccccccccc
CCCxCCCCCCxCCCCCCxCCC
CCCxCCCCCCxCCCCCCxCCC
XXXXXXXXXXXXXXXXXXXXX
""")}

def count(tier):
    n = len(LEAF[tier]) + len(TUFT[tier]) + len(BUSH[tier]) + len(FLOWER[tier]) + 3 + 2 + 1 + 1   # + visor/belt/pauldron, face/hat, ridge, sill
    n += len(SHINGLE[(tier, "tile")]) + len(SHINGLE[(tier, "slate")]) + 1                          # + flower box
    return n
