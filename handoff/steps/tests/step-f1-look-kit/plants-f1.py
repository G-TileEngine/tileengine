#!/usr/bin/env python3
"""F1 plants (r3): each edit alone must make tests/tools/f1-look-kit.test.ts fail. Run from the repo root on a clean F1 tree."""
import subprocess, sys
P = [
 ("P1 a second primary on the stage top bar", "tools/maker/stage.ts", 'class="btn ghost" data-act="s:view"', 'class="btn primary" data-act="s:view"'),
 ("P2 a second primary in a sheet", "tools/maker/stage-sheets.ts", 'class="btn ghost" data-act="s:place:', 'class="btn primary" data-act="s:place:'),
 ("P3 a bare btn", "tools/maker/rooms.ts", 'class="btn ghost" data-act="r:new"', 'class="btn" data-act="r:new"'),
 ("P4 a picker that is not a chip", "tools/maker/widgets.ts", 'class="pick" data-act="k:pick:${id}:${esc(o.value)}"', 'class="btn ghost" data-act="k:pick:${id}:${esc(o.value)}"'),
 ("P5 a picked chip without the ring", "tools/maker/app.css", "background: var(--accent-soft); box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--accent); }", "background: var(--accent-soft); }"),
 ("P6 the current terrain not picked", "tools/maker/stage.ts", 'tileId(got.map, cell.c, cell.r) === row.id ? "true" : "false"', 'tileId(got.map, cell.c, cell.r) === row.id ? "false" : "false"'),
 ("P7 the colour chip drops its swatch", "tools/maker/widgets.ts", '<span class="sw" style="background:var(${token})"></span>', ""),
 ("P8 Delete not red", "tools/maker/stage-sheets.ts", 'class="btn danger" data-act="s:delete"', 'class="btn ghost" data-act="s:delete"'),
 ("P9 Start new not red", "tools/maker/stage.ts", 'class="btn danger" data-act="s:fresh"', 'class="btn ghost" data-act="s:fresh"'),
 ("P10 Test without the play icon", "tools/maker/project.ts", '${icon("play")}Test</button>', "Test</button>"),
 ("P11 a filled line icon", "tools/maker/icons.ts", '<path d="M4 20h4L19 9l-4-4L4 16z"/>', '<path d="M4 20h4L19 9l-4-4L4 16z" fill="currentColor"/>'),
 ("P12 the ⋯ character back", "tools/maker/home.ts", 'aria-label="Project menu">${icon("more")}</button>', 'aria-label="Project menu">⋯</button>'),
 ("P13 a card without its thumb", "tools/maker/units.ts", '<div class="card">${thumb("units")}', '<div class="card">'),
 ("P14 the Undo chip with nothing to undo", "tools/maker/stage.ts", ' || !canUndo(sess.stack) ? ""', ' ? ""'),
 ("P15 the Undo chip over an open sheet", "tools/maker/stage.ts", 'host.readOnly || over !== "" ||', "host.readOnly ||"),
 ("P16 the Undo chip loses its 48 px hit area (QA's plant)", "tools/maker/app.css", '.seg-opt[aria-pressed="true"] > span { background: var(--accent); color: var(--accent-ink); }\n', '.seg-opt[aria-pressed="true"] > span { background: var(--accent); color: var(--accent-ink); }\n.undo-chip { min-height: 0; padding: 0; }\n'),
 ("P17 the Undo chip's button shrunk in place", "tools/maker/app.css", "min-height: 48px; padding: 4px; border: 0; background: transparent; }", "min-height: 40px; padding: 0; border: 0; background: transparent; }"),
 ("P18 a chip with its label left-aligned", "tools/maker/app.css", ".pick { display: inline-flex; align-items: center; justify-content: center; gap: 8px;", ".pick { display: inline-flex; align-items: center; gap: 8px;"),
 ("P19 a chip without a swatch padded 8 px on the left", "tools/maker/app.css", "min-height: 48px; padding: 0 14px; border-radius: 999px;", "min-height: 48px; padding: 0 14px 0 8px; border-radius: 999px;"),
 ("P20 a toggle with one option (On only)", "tools/maker/widgets.ts", '${opt("Off", !on, `${label}: Off`)}${opt("On", on, label)}', '${opt("On", on, label)}'),
 ("P21 both options pressed", "tools/maker/widgets.ts", 'aria-pressed="${set ? "true" : "false"}"', 'aria-pressed="true"'),
 ("P22 the label inside the frame", "tools/maker/widgets.ts", '<span class="seg-label">${label}</span><span class="seg" role="group" data-seg="${act}">', '<span class="seg" role="group" data-seg="${act}"><span class="seg-label">${label}</span>'),
 ("P23 + Add stage back in the selected look", "tools/maker/rooms.ts", '`<button type="button" class="btn ghost stage-row" data-act="r:add">${icon("plus")}Add stage</button>`', '`<button type="button" class="card new" data-act="r:add"><span class="grow"><span class="name">+ Add stage</span></span></button>`'),
 ("P24 Off never pressed (the Off state shows no set option)", "tools/maker/widgets.ts", '${opt("Off", !on, `${label}: Off`)}', '${opt("Off", false, `${label}: Off`)}'),
 ("P25 the set option still carries the act", "tools/maker/widgets.ts", '${set ? "" : ` data-act="${act}"`}', ' data-act="${act}"'),
 ("P26 the framed pill's set option not filled", "tools/maker/app.css", '.seg-opt[aria-pressed="true"] > span { background: var(--accent); color: var(--accent-ink); }', '.seg-opt[aria-pressed="true"] > span { color: var(--accent); }'),
 ("P27 New project back in the selected look", "tools/maker/home.ts", '`<button type="button" class="btn ghost stage-row" data-act="new">${icon("plus")}New project</button>', '`<button type="button" class="card new" data-act="new"><span class="grow"><span class="name">New project</span></span></button>'),
 ("P28 + Add unit back in the selected look", "tools/maker/units.ts", '`<button type="button" class="btn ghost stage-row" data-act="u:add">${icon("plus")}Add unit</button>`', '`<button type="button" class="card new" data-act="u:add"><span class="grow"><span class="name">+ Add unit</span></span></button>`'),
 ("P29 + New effect without the plus icon", "tools/maker/effects.ts", 'data-act="e:new">${icon("plus")}New effect</button>', 'data-act="e:new">+ New effect</button>'),
]
caught = 0
for name, path, old, new in P:
    src = open(path).read()
    assert src.count(old) == 1, (name, src.count(old))
    open(path, "w").write(src.replace(old, new))
    try:
        r = subprocess.run(["node", "--test", "tests/tools/f1-look-kit.test.ts"], capture_output=True, text=True)
    finally:
        open(path, "w").write(src)
    hit = r.returncode != 0
    caught += hit
    print(("CAUGHT " if hit else "MISSED ") + name)
print(f"{caught}/{len(P)} caught")
sys.exit(0 if caught == len(P) else 1)
