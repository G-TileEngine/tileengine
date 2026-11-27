#!/usr/bin/env python3
"""F2a1 plants (r1): each edit alone must make tests/tools/f2a1-carries.test.ts fail. Run from the repo root on a clean F2a1 tree."""
import subprocess, sys
P = [
 ("P1 the On option keeps the bare label (the F1 form)", "tools/maker/widgets.ts", '${opt("On", on, `${label}: On`)}', '${opt("On", on, label)}'),
 ("P2 the On option says Off", "tools/maker/widgets.ts", '${opt("On", on, `${label}: On`)}', '${opt("On", on, `${label}: Off`)}'),
 ("P3 a smoke line still reads the old label", "handoff/steps/tests/s6c-checkpoint/smoke.mjs", '      await page.locator(\'[aria-label="On your team: On"]\').scrollIntoViewIfNeeded(); await shot("04-hero");', '      await page.locator(\'[aria-label="On your team"]\').scrollIntoViewIfNeeded(); await shot("04-hero");'),
 ("P4 the dead .card.new selector back", "tools/maker/app.css", '.choice[aria-pressed="true"] {', '.card.new, .choice[aria-pressed="true"] {'),
 ("P5 the Budgets row without its icon", "tools/maker/budgets.ts", '${icon("budgets")}${summary}</button>', '${summary}</button>'),
 ("P6 the Budgets icon after the words", "tools/maker/budgets.ts", '${icon("budgets")}${summary}</button>', '${summary}${icon("budgets")}</button>'),
 ("P7 a different budgets drawing", "tools/maker/icons.ts", '<ellipse cx="12" cy="6" rx="7" ry="3"/>', '<ellipse cx="12" cy="6" rx="8" ry="3"/>'),
 ("P8 the budgets icon filled", "tools/maker/icons.ts", '7-3v-6"/>`,', '7-3v-6" fill="currentColor"/>`,'),
 ("P9 the stage error state's Back without the icon", "tools/maker/stage.ts", 'data-act="s:back">${icon("back")}Back</button><h1>Stage</h1>', 'data-act="s:back">Back</button><h1>Stage</h1>'),
 ("P10 the rename button without the edit icon", "tools/maker/units.ts", 'data-act="u:rename">${icon("edit")}${esc(name)}</button>', 'data-act="u:rename">${esc(name)}</button>'),
 ("P11 the read-only levels card without its thumb", "tools/maker/levels.ts", '"newer") return `${head}<div class="card">${thumb("levels")}<p>', '"newer") return `${head}<div class="card"><p>'),
 ("P12 the picked choice rule loses its ring border", "tools/maker/app.css", '.choice[aria-pressed="true"] { background: var(--accent-soft); border: 2px solid var(--accent); }', '.choice[aria-pressed="true"] { background: var(--accent-soft); }'),
]
caught = 0
for name, path, old, new in P:
    src = open(path).read()
    assert src.count(old) == 1, (name, src.count(old))
    open(path, "w").write(src.replace(old, new))
    try:
        r = subprocess.run(["node", "--test", "tests/tools/f2a1-carries.test.ts"], capture_output=True, text=True)
    finally:
        open(path, "w").write(src)
    hit = r.returncode != 0
    caught += hit
    print(("CAUGHT " if hit else "MISSED ") + name)
print(f"{caught}/{len(P)} caught")
sys.exit(0 if caught == len(P) else 1)
