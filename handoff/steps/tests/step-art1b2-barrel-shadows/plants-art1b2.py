#!/usr/bin/env python3
"""ART1b2 plants: each edit alone must make tests/tools/art1b2-barrel-shadows.test.ts fail. Run from the repo root on a clean ART1b2 tree."""
import subprocess, sys
P = [
 ("Q1 the barrel's rim ring narrower at 32", "tools/art-bake/recipes/barrel.ts", "(tile === 48 ? 0.66 : 0.6)", "(tile === 48 ? 0.66 : 0.7)"),
 ("Q2 no lid planks at 48", "tools/art-bake/recipes/barrel.ts", "  return plank ? st - 1 : st;\n", "  return st;\n"),
 ("Q3 every hoop pixel lit as the hoop's top row", "tools/art-bake/recipes/barrel.ts", "onHoop = hit ? py - (yc - d.hoopw / 2) < 1.0 : onHoop;", "onHoop = hit ? true : onHoop;"),
 ("Q4 the body doesn't bulge", "tools/art-bake/recipes/barrel.ts", "  const bulge = d.w / 2 - 1 - d.rxt;\n", "  const bulge = 0;\n"),
 ("Q5 stave seams evenly spaced, not by angle", "tools/art-bake/recipes/barrel.ts", "Math.sin(deg * (Math.PI / 180))", "deg / 90"),
 ("Q6 no shade at the barrel's base", "tools/art-bake/recipes/barrel.ts", " - (base ? 1 : 0);\n", ";\n"),
 ("Q7 the 32 px hoops moved", "tools/art-bake/recipes/barrel.ts", "[0.16, 0.78]", "[0.2, 0.78]"),
 ("Q8 the 48 px lid narrower", "tools/art-bake/recipes/barrel.ts", "rxt: 8.6,", "rxt: 8.4,"),
 ("Q9 the barrel's wood drawn as crate", "tools/art-bake/recipes/barrel.ts", 'put(g, x, y, "barrel", st);', 'put(g, x, y, "crate", st);'),
 ("Q10 the hoops drawn in wood", "tools/art-bake/recipes/barrel.ts", 'put(g, x, y, "steel8", clamp(', 'put(g, x, y, "barrel", clamp('),
 ("Q11 the rim lip shadow thinner", "tools/art-bake/recipes/barrel.ts", "(py - ytop < 1.0 ? 1 : 0)", "(py - ytop < 0.5 ? 1 : 0)"),
 ("Q12 the barrel's shadow polygon moved", "tools/art-bake/recipes/barrel.ts", "[w + 2.0, -0.6]", "[w + 2.0, -0.4]"),
 ("Q13 the crate's shadow ellipse taller", "tools/art-bake/recipes/crate.ts", '["e", 1.6, -0.3, w + 1.6, 2.4]', '["e", 1.6, -0.3, w + 1.6, 2.5]'),
 ("Q14 the crate's scale changed", "tools/art-bake/recipes/crate.ts", "const SCALE = 1.3;", "const SCALE = 1.25;"),
 ("Q15 the big rock's shadow not scaled", "tools/art-bake/recipes/rock.ts", '["e", 3 * g, -0.8, 7 * g, 2.6 * g]', '["e", 3, -0.8, 7 * g, 2.6 * g]'),
 ("Q16 the lantern's scale changed", "tools/art-bake/recipes/lantern.ts", "const SCALE = 1.25;", "const SCALE = 1.3;"),
 ("Q17 the manifest drops the shadow", "tools/art-bake/bake.ts", "foot: sprite.foot, k, shadow, sha256 });", "foot: sprite.foot, k, sha256 });"),
 ("Q18 RECIPES order changed", "tools/art-bake/bake.ts", "{ crate: crate6, barrel: barrel6, rock, lantern }", "{ barrel: barrel6, crate: crate6, rock, lantern }"),
]
caught = 0
for name, path, old, new in P:
    src = open(path).read()
    assert src.count(old) == 1, (name, src.count(old))
    open(path, "w").write(src.replace(old, new))
    try:
        r = subprocess.run(["node", "--test", "tests/tools/art1b2-barrel-shadows.test.ts"], capture_output=True, text=True)
    finally:
        open(path, "w").write(src)
    hit = r.returncode != 0
    caught += hit
    print(("CAUGHT " if hit else "MISSED ") + name)
print(f"{caught}/{len(P)} caught")
sys.exit(0 if caught == len(P) else 1)
