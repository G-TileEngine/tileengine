#!/usr/bin/env python3
"""ART1b1 plants: each edit alone must make tests/tools/art1a-bake.test.ts or tests/tools/art1b1-shade-core.test.ts fail. Run from the repo root on a clean ART1b1 tree."""
import subprocess, sys
P = [
 ("P1 rgb takes any text", "tools/art-bake/palette.ts", "  if (!/^#[0-9a-f]{6}$/i.test(hex)) {\n", "  if (hex.length === 0) {\n"),
 ("P2 an empty or 10-step ramp passes", "tools/art-bake/palette.ts", "    if (hexes.length < 1 || hexes.length > 9) {\n", "    if (hexes.length < 0 || hexes.length > 99) {\n"),
 ("P3 ramp colours not checked at load", "tools/art-bake/palette.ts", "      const c = rgb(hex);\n", "      const c: Rgb = [18, 18, 18];\n"),
 ("P4 the outline colour not checked", "tools/art-bake/palette.ts", "  rgb(p.outline.colour);\n", "  p.outline.colour.trim();\n"),
 ("P5 bias names not checked", "tools/art-bake/palette.ts", '  named(p, Object.keys(p.bias), "bias");\n', '  named(p, [], "bias");\n'),
 ("P6 outlineBy names not checked", "tools/art-bake/palette.ts", '  named(p, Object.keys(p.outlineBy), "outlineBy");\n', '  named(p, [], "outlineBy");\n'),
 ("P7 a missing step falls back to black", "tools/art-bake/palette.ts", '    throw new Error(`art-bake: ramp "${name}" has no step ${step}`);\n', "    return [0, 0, 0];\n"),
 ("P8 the outline's black fallback is back", "tools/art-bake/sprite.ts", "  const dark = stepOf(name, 0);\n", "  const dark = ramp(name)[0] ?? [0, 0, 0];\n"),
 ("P9 a hash2 constant changed", "tools/art-bake/blocks.ts", "Math.imul(j, 668265263)", "Math.imul(j, 668265264)"),
 ("P10 hash2 shifts with sign", "tools/art-bake/blocks.ts", "h ^ (h >>> 13)", "h ^ (h >> 13)"),
 ("P11 vnoise without the smoothstep", "tools/art-bake/blocks.ts", "  const sx = fx * fx * (3 - 2 * fx);\n", "  const sx = fx;\n"),
 ("P12 fbm octave seeds moved", "tools/art-bake/blocks.ts", "s + o * 31", "s + o * 13"),
 ("P13 fbm octave weights changed", "tools/art-bake/blocks.ts", "    amp *= 0.5;\n", "    amp *= 0.6;\n"),
 ("P14 the light from another angle", "tools/art-bake/blocks.ts", "0.56 / NORM", "0.5 / NORM"),
 ("P15 rounding half up", "tools/art-bake/blocks.ts", "  return f % 2 === 0 ? f : f + 1;\n", "  return f + 1;\n"),
 ("P16 the band floors instead of rounding", "tools/art-bake/blocks.ts", "roundEven(clamp(t, 0, 1) * (n - 1))", "Math.floor(clamp(t, 0, 1) * (n - 1))"),
 ("P17 shade plus bias added in float64", "tools/art-bake/sprite.ts", "const t = Math.fround(at(s.sh, i) + Math.fround(PALETTE.bias[m] ?? 0)) + ", "const t = at(s.sh, i) + (PALETTE.bias[m] ?? 0) + "),
 ("P18 no bias", "tools/art-bake/sprite.ts", "Math.fround(PALETTE.bias[m] ?? 0)", "Math.fround(0)"),
 ("P19 no rim", "tools/art-bake/sprite.ts", "(rimAt(s, i) ? PALETTE.rim : 0)", "0"),
 ("P20 the rim on a glow", "tools/art-bake/sprite.ts", "  return s.nolin[i] !== true && (!up || !left);\n", "  return !up || !left;\n"),
 ("P21 the rim looks right, not left", "tools/art-bake/sprite.ts", "  const left = i % s.w > 0 && s.mat[i - 1] !== null;\n", "  const left = i % s.w > 0 && s.mat[i + 1] !== null;\n"),
 ("P22 a glow gets an outline", "tools/art-bake/sprite.ts", "        if (nb === null || s.nolin[ny * s.w + nx] === true) continue;\n", "        if (nb === null) continue;\n"),
 ("P23 the ellipse shrinks", "tools/art-bake/sprite.ts", "    if (nx * nx + ny * ny > 1.0) continue;\n", "    if (nx * nx + ny * ny > 0.9) continue;\n"),
 ("P24 rect nx divides by the height", "tools/art-bake/sprite.ts", "(x - x0) / Math.max(x1 - x0, 1e-6)", "(x - x0) / Math.max(y1 - y0, 1e-6)"),
 ("P25 the canvas size rounds half up", "tools/art-bake/sprite.ts", "  const cw = roundEven(w * k);\n", "  const cw = Math.round(w * k);\n"),
 ("P26 the canvas foot rounds down", "tools/art-bake/sprite.ts", "Math.floor(c.ay * c.k + 0.5)", "Math.floor(c.ay * c.k)"),
 ("P27 the rock ignores its seed", "tools/art-bake/recipes/rock.ts", "Math.floor(y / 2.5), seed)", "Math.floor(y / 2.5), 1)"),
 ("P28 the rock's second stone moved", "tools/art-bake/recipes/rock.ts", "10 + 4.6 * g", "10 + 4.0 * g"),
 ("P29 the lantern base lit differently", "tools/art-bake/recipes/lantern.ts", 'rect(c, 3, 22.5, 7, 24, "iron", 0.4);', 'rect(c, 3, 22.5, 7, 24, "iron", 0.6);'),
 ("P30 the manifest hashes the hex text", "tools/art-bake/bake.ts", "      hash.update(rgba);\n", "      hash.update(sha256);\n"),
 ("P31 the lantern dropped from RECIPES", "tools/art-bake/bake.ts", "rock, lantern };", "rock };"),
 ("P32 the stone bias changed", "tools/art-bake/palette.json", '"stone": -0.1 }', '"stone": -0.2 }'),
 ("P33 the rim weight changed", "tools/art-bake/palette.json", '"rim": 0.16,', '"rim": 0.2,'),
 ("P34 the outline mix rounds instead of truncating (ART1a P11)", "tools/art-bake/sprite.ts", "Math.trunc(dark[i] * PALETTE.outline.rampWeight", "Math.round(dark[i] * PALETTE.outline.rampWeight"),
 ("P35 a see-through outline (ART1a P12)", "tools/art-bake/sprite.ts", "rgba.set([c[0], c[1], c[2], 255], i * 4);", "rgba.set([c[0], c[1], c[2], m !== null ? 255 : 128], i * 4);"),
 ("P36 a ramp need not be strictly lighter", "tools/art-bake/palette.ts", "      if (prev !== undefined && y <= prev) {\n", "      if (prev !== undefined && y < -1) {\n"),
 ("P37 a ramp may repeat a colour", "tools/art-bake/palette.ts", "      if (seen.includes(key)) {\n", "      if (seen.includes(\"\")) {\n"),
 ("P38 pure black or white allowed", "tools/art-bake/palette.ts", "  if (n === \"#000000\" || n === \"#ffffff\") {\n", "  if (n === \"#notacolor\") {\n"),
]
caught = 0
for name, path, old, new in P:
    src = open(path).read()
    assert src.count(old) == 1, (name, src.count(old))
    open(path, "w").write(src.replace(old, new))
    try:
        r = subprocess.run(["node", "--test", "tests/tools/art1a-bake.test.ts", "tests/tools/art1b1-shade-core.test.ts"], capture_output=True, text=True)
    finally:
        open(path, "w").write(src)
    hit = r.returncode != 0
    caught += hit
    print(("CAUGHT " if hit else "MISSED ") + name)
print(f"{caught}/{len(P)} caught")
sys.exit(0 if caught == len(P) else 1)
