#!/usr/bin/env python3
"""ART1a plants (r2): each edit alone must make tests/tools/art1a-bake.test.ts fail. Run from the repo root on a clean ART1a tree."""
import subprocess, sys
P = [
 ("P1 the crate lid frame loses its lit step", "tools/art-bake/recipes/crate.ts", "return y < b || x < b || y >= ht - b ? 5 : 4;", "return y < b || x < b || y >= ht - b ? 4 : 4;"),
 ("P2 the lid brace shadow moved", "tools/art-bake/recipes/crate.ts", "if (0.4 <= dd && dd < 1.4) return 2;", "if (0.5 <= dd && dd < 1.4) return 2;"),
 ("P3 the front's right side no longer falls out of the sun", "tools/art-bake/recipes/crate.ts", "  if (x >= w - 3 * b - (tile === 48 ? 1 : 0) && !(x >= w - b)) st -= 1;\n", ""),
 ("P4 the nails drawn in crate wood", "tools/art-bake/recipes/crate.ts", 'put(g, x, y, "steel8", x < w / 2 ? 5 : 3);', 'put(g, x, y, "crate", x < w / 2 ? 5 : 3);'),
 ("P5 no 1 px margin for the outline", "tools/art-bake/sprite.ts", "const w = grid.w + 2;", "const w = grid.w + 1;"),
 ("P6 steps not clipped to the ramp", "tools/art-bake/sprite.ts", "Math.min(Math.max(grid.step[y * grid.w + x] ?? 0, 0), top)", "grid.step[y * grid.w + x] ?? 0"),
 ("P7 the foot rounds half down", "tools/art-bake/sprite.ts", "foot: [Math.floor(w / 2 + 0.5), h - 1]", "foot: [Math.floor(w / 2), h - 1]"),
 ("P8 the outline looks left before right", "tools/art-bake/sprite.ts", "[[1, 0], [-1, 0], [0, 1], [0, -1]]", "[[-1, 0], [1, 0], [0, 1], [0, -1]]"),
 ("P9 the outline also takes diagonals", "tools/art-bake/sprite.ts", "[[1, 0], [-1, 0], [0, 1], [0, -1]]", "[[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1]]"),
 ("P10 a black outline", "tools/art-bake/sprite.ts", "const mix = rgb(PALETTE.outline.colour);", 'const mix = rgb("#000000");'),
 ("P11 the outline mix rounds instead of truncating", "tools/art-bake/sprite.ts", "Math.trunc(c * PALETTE.outline.rampWeight", "Math.round(c * PALETTE.outline.rampWeight"),
 ("P12 a see-through outline", "tools/art-bake/sprite.ts", "rgba.set([c[0] ?? 0, c[1] ?? 0, c[2] ?? 0, 255], i * 4);", "rgba.set([c[0] ?? 0, c[1] ?? 0, c[2] ?? 0, m !== null ? 255 : 128], i * 4);"),
 ("P13 a colour written into a recipe", "tools/art-bake/recipes/crate.ts", "  const b = tile === 48 ? 2 : 1;\n", "  const b = tile === 48 ? 2 : 1;\n  const wood = \"#c69a60\";\n"),
 ("P14 a palette colour changed", "tools/art-bake/palette.json", '"crate": ["#2e1c0e", "#4e3219"', '"crate": ["#2e1c0e", "#4e3218"'),
 ("P15 pure white in the palette", "tools/art-bake/palette.json", '"fl_white": ["#f2eef0"]', '"fl_white": ["#ffffff"]'),
 ("P16 Math.random in the rig", "tools/art-bake/png.ts", "  const sig = Buffer.from(", "  const jitter = Math.random();\n  const sig = Buffer.from("),
 ("P17 the engine imports the rig", "src/sim/actions.ts", 'import { readAction, type Action } from "../core/log/index.ts";\n', 'import { readAction, type Action } from "../core/log/index.ts";\nimport "../../tools/art-bake/png.ts";\n'),
 ("P18 a library in the rig's package.json", "tools/art-bake/package.json", '"type": "module",', '"type": "module",\n  "dependencies": { "three": "0.170.0" },'),
 ("P19 a bake library in the root package.json", "package.json", '"devDependencies": {', '"dependencies": { "three": "0.170.0" },\n  "devDependencies": {'),
 ("P20 the default bake at 48 px", "tools/art-bake/bake.ts", "DEFAULT_TILES: readonly Tile[] = [32];", "DEFAULT_TILES: readonly Tile[] = [48];"),
 ("P21 out/ not ignored", ".gitignore", "tools/art-bake/out\n", ""),
 ("P22 PNG rows written over their filter byte", "tools/art-bake/png.ts", "y * (w * 4 + 1) + 1);", "y * (w * 4 + 1));"),
 ("P23 the manifest drops the pixel hash", "tools/art-bake/bake.ts", "foot: sprite.foot, sha256 });", "foot: sprite.foot });"),
 ("P24 an unsupported tile silently bakes 32 (QA M1)", "tools/art-bake/bake.ts", '    if (arg !== "32" && arg !== "48") throw new Error(`art-bake: tile must be 32 or 48 ("${arg}")`);\n', ""),
]
caught = 0
for name, path, old, new in P:
    src = open(path).read()
    assert src.count(old) == 1, (name, src.count(old))
    open(path, "w").write(src.replace(old, new))
    try:
        r = subprocess.run(["node", "--test", "tests/tools/art1a-bake.test.ts"], capture_output=True, text=True)
    finally:
        open(path, "w").write(src)
    hit = r.returncode != 0
    caught += hit
    print(("CAUGHT " if hit else "MISSED ") + name)
print(f"{caught}/{len(P)} caught")
sys.exit(0 if caught == len(P) else 1)
