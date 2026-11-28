#!/usr/bin/env python3
"""F2a2b plants (r2): all 27. P1-P16 are F2a2a's plants and must still be caught on the full tree; P17-P27 are this slice's (P23-P27 added in r2). Each edit alone must make tests/tools/f2a2-menu-kit.test.ts or tests/tools/f2a2-land-on-map.test.ts fail. Run from the repo root on a clean F2a2b tree; it must print 27/27 caught."""
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
 ("P17 the stage bar keeps a Back button", "tools/maker/stage.ts", 'data-act="m:menu" aria-label="Game menu">${icon("menu")}</button>', 'data-act="s:back">${icon("back")}Back</button>'),
 ("P18 the stage name without the down icon", "tools/maker/stage.ts", '<span>${esc(name)}</span>${dot}${icon("down")}</button></h1>', '<span>${esc(name)}</span>${dot}</button></h1>'),
 ("P19 Back from Test goes home, not to the stage", "tools/maker/test-launch.ts", 'from === "home" || from === "trash" ? from : "stage";', 'from === "trash" ? from : "home";'),
 ("P20 Budgets not mounted in the game menu", "tools/maker/home.ts", "budgets: budgetsRow(state.files), build: buildButton(building)", 'budgets: "", build: buildButton(building)'),
 ("P21 opening a game doesn't land on a stage", "tools/maker/home.ts", "if (!landOn(id, text, null)) return;", "if (text === null) return;"),
 ("P22 the menu drawn over the build sheet", "tools/maker/home.ts", 'const menu = built === null && edit === "" ? menuSheet(state.stageId) : "";', 'const menu = edit === "" ? menuSheet(state.stageId) : "";'),

 ("P23 a travel error is dropped (Law 12)", "tools/maker/home.ts", "if (got.docs === null) { out(); state.banner = got.error; paint(); return; }", "if (got.docs === null) { out(); state.problems = [got.error]; paint(); return; }"),
 ("P24 the no-stages screen loses its reason", "tools/maker/home.ts", 'state.banner = "This game has no stages, so it can\'t open.";', 'state.banner = "Can\'t open this project";'),
 ("P25 deleting the current stage does not move to the first", "tools/maker/home.ts", "const next = hit.stageId ?? (gone ? stageRows(state.files)[0]?.id ?? null : null);", "const next = hit.stageId;"),
 ("P26 Continue from the game menu leaves the menu open", "tools/maker/home.ts", 'if (menuView() === "menu") {\n    menuSet("none");\n  }', 'if (menuView() === "menu") {\n    return;\n  }'),
 ("P27 the menu counts files, not the lists the sheets draw", "tools/maker/home.ts", "units: unitCount(state.files), effects: effectCount(state.files)", "units: 0, effects: 0"),
]
TESTS = ["tests/tools/f2a2-menu-kit.test.ts", "tests/tools/f2a2-land-on-map.test.ts"]
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
