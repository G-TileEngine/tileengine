#!/usr/bin/env python3
"""F2a2a plants (r1): P1-P16; each edit alone must make tests/tools/f2a2-menu-kit.test.ts fail. Run from the repo root on a clean F2a2a tree; it must print 16/16 caught."""
import subprocess, sys
P = [
 ("P1 the menu icon drawn differently", "tools/maker/icons.ts", 'menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,', 'menu: `<path d="M4 6h16M4 12h16M4 18h16"/>`,'),
 ("P2 the check icon drawn differently", "tools/maker/icons.ts", 'check: `<path d="M5 12l5 5 9-10"/>`,', 'check: `<path d="M5 13l4 4 10-11"/>`,'),
 ("P3 a games square with rounder corners", "tools/maker/icons.ts", '<rect x="3" y="3" width="7" height="7" rx="1.5"/>', '<rect x="3" y="3" width="7" height="7" rx="2"/>'),
 ("P4 Effects before Units in the game menu", "tools/maker/game-menu.ts", 'row("m:units", "units", "Units", String(host.units)), row("m:effects", "effects", "Effects", String(host.effects))', 'row("m:effects", "effects", "Effects", String(host.effects)), row("m:units", "units", "Units", String(host.units))'),
 ("P5 an eyebrow in the game menu", "tools/maker/game-menu.ts", 'modal("game-menu", `${head(host.name)}${rows', 'modal("game-menu", `${head(host.name)}<p class="eyebrow">Game</p>${rows'),
 ("P6 the switcher without its eyebrow", "tools/maker/game-menu.ts", '${head("Stages")}<p class="eyebrow">Stages</p>', '${head("Stages")}'),
 ("P7 the eyebrow typed in capitals", "tools/maker/game-menu.ts", '<p class="eyebrow">Stages</p>', '<p class="eyebrow">STAGES</p>'),
 ("P8 the eyebrow's letter-spacing", "tools/maker/app.css", "letter-spacing: 0.04em; color: var(--muted); }", "letter-spacing: 0.05em; color: var(--muted); }"),
 ("P9 the eyebrow not uppercased by CSS", "tools/maker/app.css", "font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em;", "font-weight: 600; letter-spacing: 0.04em;"),
 ("P10 the picked stage without the check", "tools/maker/game-menu.ts", 'item.id === current ? icon("check") :', 'item.id === current ? icon("stages") :'),
 ("P11 the other stages get an icon, not a blank slot", "tools/maker/game-menu.ts", ': `<span class="slot"></span>`;', ': icon("stages");'),
 ("P12 menu rows without the chevron", "tools/maker/game-menu.ts", '<span class="grow">${esc(name)}</span>${tail}${icon("chevron")}</button>', '<span class="grow">${esc(name)}</span>${tail}</button>'),
 ("P13 sheets without the grabber", "tools/maker/game-menu.ts", 'role="dialog"><div class="grabber"></div>${inner}', 'role="dialog">${inner}'),
 ("P14 the grabber in the muted colour", "tools/maker/app.css", "border-radius: 999px; background: var(--line); align-self: center; }", "border-radius: 999px; background: var(--muted); align-self: center; }"),
 ("P15 an unknown menu view silently ignored (Law 12)", "tools/maker/game-menu.ts", "if (found === undefined) {\n    throw new Error(`maker: no menu view ${next}`);\n  }", "if (found === undefined) {\n    return;\n  }"),
 ("P16 the sheet close borderless", "tools/maker/game-menu.ts", 'class="btn icon" data-act="m:close"', 'class="btn icon bare" data-act="m:close"'),
]
TESTS = ["tests/tools/f2a2-menu-kit.test.ts"]
caught = 0
for name, path, old, new in P:
    src = open(path).read()
    assert src.count(old) == 1, (name, src.count(old))
    open(path, "w").write(src.replace(old, new))
    try:
        r = subprocess.run(["node", "--test", *TESTS], capture_output=True, text=True)
    finally:
        open(path, "w").write(src)
    hit = r.returncode != 0
    caught += hit
    print(("CAUGHT " if hit else "MISSED ") + name)
print(f"{caught}/{len(P)} caught")
sys.exit(0 if caught == len(P) else 1)
