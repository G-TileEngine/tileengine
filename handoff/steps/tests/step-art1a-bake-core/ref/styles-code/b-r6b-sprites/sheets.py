"""Side-by-side sheets for the in-maker art test. Usage: PYTHONDONTWRITEBYTECODE=1 python3 sheets.py"""
import sys, os
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path[:0] = [os.path.join(HERE, "../b-r6b"), os.path.join(HERE, "../b-r6")]
import style_b6b
from style_b6b import b4
S = os.path.join(HERE, "shots")
def eng(name): return Image.open(os.path.join(S, f"engine-{name}-canvas-raw.png")).convert("RGB").crop((9, 0, 9 + 1152, 1056))
bake = Image.open(os.path.join(HERE, "../b-r6b/b-r6b-48px-1x.png")).convert("RGB").resize((1152, 1056), Image.NEAREST)
b4.label_sheet([bake, eng("village-noshadow")], ["B r6b bake (frozen checkpoint, with grade + light)", "In TileEngine renderer: same sprites + feet, no shadows, no light"],
               os.path.join(S, "side-by-side-r6b-vs-engine.png"), 26)
b4.label_sheet([eng("village-shadows"), eng("snapped-shadows"), eng("scrambled-shadows")],
               ["Engine + contact shadows (fxGround overlay)", "Engine, feet snapped to tile centres", "Engine, scrambled placement (seed 24301)"],
               os.path.join(S, "engine-placements-2x.png"), 26)
b4.label_sheet([Image.open(os.path.join(S, "maker-play-stage-390x844.png")).convert("RGB"), Image.open(os.path.join(S, "engine-village-noshadow-390x844.png")).convert("RGB")],
               ["Maker play-stage now (main b736cd97, local build)", "Same renderer with the r6b sprites (local test)"], os.path.join(S, "phone-390x844-now-vs-r6b.png"), 30)
print("ok")
